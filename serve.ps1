param(
    [int]$Port = 8080
)

$listener = New-Object System.Net.HttpListener

# Register localhost and 127.0.0.1 prefixes
$prefixes = @("http://localhost:$Port/", "http://127.0.0.1:$Port/")
$started = $false

foreach ($p in $prefixes) {
    try {
        $listener.Prefixes.Add($p)
    } catch {
        Write-Host "Warning: Could not add prefix $p : $_"
    }
}

try {
    $listener.Start()
    $started = $true
} catch {
    Write-Host "Could not start with both prefixes ($($_.Exception.Message)). Falling back to single prefix."
    $listener = New-Object System.Net.HttpListener
    try {
        $listener.Prefixes.Add("http://127.0.0.1:$Port/")
        $listener.Start()
        $started = $true
    } catch {
        $listener = New-Object System.Net.HttpListener
        $listener.Prefixes.Add("http://localhost:$Port/")
        $listener.Start()
        $started = $true
    }
}

Write-Host "=========================================="
Write-Host " Local Server Running at: http://localhost:$Port/ (and http://127.0.0.1:$Port/)"
Write-Host " Document Root: $PWD"
Write-Host " Press Ctrl+C to stop"
Write-Host "=========================================="

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".mjs"  = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".gif"  = "image/gif"
    ".webp" = "image/webp"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".woff" = "font/woff"
    ".woff2"= "font/woff2"
    ".ttf"  = "font/ttf"
    ".eot"  = "application/vnd.ms-fontobject"
    ".otf"  = "font/otf"
    ".mp4"  = "video/mp4"
    ".webm" = "video/webm"
    ".mp3"  = "audio/mpeg"
    ".wav"  = "audio/wav"
    ".pdf"  = "application/pdf"
    ".txt"  = "text/plain; charset=utf-8"
    ".xml"  = "application/xml"
}

$rootPath = (Get-Item -Path $PWD).FullName

try {
    while ($listener.IsListening) {
        $context = $null
        try {
            $context = $listener.GetContext()
        } catch {
            break
        }

        try {
            $request = $context.Request
            $response = $context.Response

            $rawUrl = $request.RawUrl.Split('?')[0]
            $decodedUrl = [System.Uri]::UnescapeDataString($rawUrl).TrimStart('/')

            if ([string]::IsNullOrWhiteSpace($decodedUrl)) {
                $decodedUrl = "index.html"
            }

            # Normalize slashes for Windows path
            $relPath = $decodedUrl.Replace('/', [System.IO.Path]::DirectorySeparatorChar)
            $filePath = [System.IO.Path]::Combine($rootPath, $relPath)

            if (Test-Path -LiteralPath $filePath -PathType Container) {
                $filePath = [System.IO.Path]::Combine($filePath, "index.html")
            }

            $fullPath = [System.IO.Path]::GetFullPath($filePath)

            if ($fullPath.StartsWith($rootPath, [System.StringComparison]::OrdinalIgnoreCase) -and (Test-Path -LiteralPath $fullPath -PathType Leaf)) {
                $ext = [System.IO.Path]::GetExtension($fullPath).ToLower()
                $mime = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }

                $bytes = [System.IO.File]::ReadAllBytes($fullPath)
                $response.ContentType = $mime
                $response.ContentLength64 = $bytes.Length
                $response.AddHeader("Access-Control-Allow-Origin", "*")
                $response.AddHeader("Cache-Control", "no-cache, no-store, must-revalidate")
                $response.StatusCode = 200

                if ($request.HttpMethod -ne 'HEAD') {
                    $response.OutputStream.Write($bytes, 0, $bytes.Length)
                }
                Write-Host "[200 OK] $rawUrl ($($bytes.Length) bytes)"
            } else {
                $response.StatusCode = 404
                $response.ContentType = "text/html; charset=utf-8"
                $html404 = @"
<!DOCTYPE html>
<html lang="id">
<head><meta charset="utf-8"><title>404 Not Found</title></head>
<body style="font-family: sans-serif; text-align: center; padding: 50px;">
  <h2>404 - Halaman Tidak Ditemukan</h2>
  <p>File <code>$rawUrl</code> tidak ditemukan.</p>
  <a href="/">Kembali ke Beranda</a>
</body>
</html>
"@
                $bytes = [System.Text.Encoding]::UTF8.GetBytes($html404)
                $response.ContentLength64 = $bytes.Length
                if ($request.HttpMethod -ne 'HEAD') {
                    $response.OutputStream.Write($bytes, 0, $bytes.Length)
                }
                Write-Host "[404 Not Found] $rawUrl"
            }
        } catch {
            Write-Host "[Error] $($_.Exception.Message)"
        } finally {
            if ($context -and $context.Response) {
                try {
                    $context.Response.OutputStream.Close()
                } catch {}
            }
        }
    }
} finally {
    try { $listener.Stop() } catch {}
    try { $listener.Close() } catch {}
}
