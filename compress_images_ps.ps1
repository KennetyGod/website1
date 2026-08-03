
# Script to resize and compress images in multiple year folders
Add-Type -AssemblyName System.Drawing

$rootDir = "d:\stainless-indah-web"
# List of year folders to process
$years = @("2017", "2018", "2020", "2022", "2023", "2024") # 2025 is already processed

$extensions = "*.jpg", "*.jpeg", "*.png"
$maxWidth = 1024
$maxHeight = 1024
$quality = 70 # 0-100

function Resize-Image {
    param (
        [string]$imagePath,
        [int]$maxWidth,
        [int]$maxHeight,
        [long]$quality
    )

    try {
        $image = [System.Drawing.Image]::FromFile($imagePath)
    }
    catch {
        Write-Host "Error loading $($imagePath): $_"
        return
    }

    $newWidth = $image.Width
    $newHeight = $image.Height
    $needsResize = $false

    # Calculate new dimensions if resizing is needed
    if ($image.Width -gt $maxWidth -or $image.Height -gt $maxHeight) {
        $ratioX = $maxWidth / $image.Width
        $ratioY = $maxHeight / $image.Height
        $ratio = [Math]::Min($ratioX, $ratioY)
        
        $newWidth = [int]($image.Width * $ratio)
        $newHeight = [int]($image.Height * $ratio)
        $needsResize = $true
        
        Write-Host "Resizing $($imagePath) from ($($image.Width)x$($image.Height)) to ($($newWidth)x$($newHeight))"
    } else {
        # Force re-save for compression even if size is ok
        Write-Host "Compressing only: $($imagePath)"
    }

    $bitmap = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
    $graph = [System.Drawing.Graphics]::FromImage($bitmap)
    
    # High quality settings for resize
    $graph.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $graph.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

    $graph.DrawImage($image, 0, 0, $newWidth, $newHeight)
    $image.Dispose() # Release original file handle to overwrite

    # Save logic
    $encoder = [System.Drawing.Imaging.Encoder]::Quality
    $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter($encoder, $quality)
    
    # Find encoder for JPEG (convert all to JPEG effectively if we save as jpg, but let's keep extension logic simple)
    # Actually, saving back to original format is tricky if we change mime type. 
    # For simplicity, we use jpeg encoder for everything as most photos are jpg. 
    # If png, it might lose transparency but for photos it's fine.
    
    $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }

    try {
        # Save to temp file first then replace
        $tempPath = $imagePath + ".tmp"
        $bitmap.Save($tempPath, $codec, $encoderParams)
        $bitmap.Dispose()
        $graph.Dispose()
        
        Move-Item -Path $tempPath -Destination $imagePath -Force
        # Write-Host "Saved: $imagePath"
    }
    catch {
        Write-Host "Error saving $($imagePath): $_"
        if ($bitmap) { $bitmap.Dispose() }
        if ($graph) { $graph.Dispose() }
    }
}

foreach ($year in $years) {
    $targetDir = Join-Path $rootDir $year
    if (Test-Path $targetDir) {
        Write-Host "Processing folder: $year"
        Get-ChildItem -Path $targetDir -Recurse -Include $extensions | ForEach-Object {
            Resize-Image -imagePath $_.FullName -maxWidth $maxWidth -maxHeight $maxHeight -quality $quality
        }
    } else {
        Write-Warning "Folder $year not found!"
    }
}

Write-Host "All compression tasks complete!"
