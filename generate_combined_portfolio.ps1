
# Script to generate a combined portfolio page for years 2017-2021
# UPDATED: Distribute available images across missing years (2019, 2021) to fill gaps.

$rootDir = "d:\stainless-indah-web"
$outputFile = Join-Path $rootDir "testimoni-2017-2021.html"

# Available source folders
$sourceYears = @("2020", "2018", "2017")
# Target years to display
$targetYears = @("2021", "2020", "2019", "2018", "2017")

# --- HEADER ---
@"
<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Portofolio 2017-2021 - Stainless Indah</title>
  <link rel="stylesheet" href="assets/css/style.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>

<body>
  <!-- Slideshow Background -->
  <div class="slideshow">
    <img src="assets/images/IMG_20240221_100202.jpg" alt="Slide 1">
    <img src="assets/images/IMG_20230622_091238.jpg" alt="Slide 2">
    <img src="assets/images/IMG_20200615_123127.jpg" alt="Slide 3">
    <img src="assets/images/IMG_20200617_101125.jpg" alt="Slide 4">
  </div>

  <header>
    <h1>Stainless Indah</h1>
    <div class="menu-toggle"><i class="fas fa-bars"></i></div>
    <nav>
      <ul>
        <li><a href="beranda.html">Beranda</a></li>
        <li class="dropdown">
          <b><a href="produk.html" class="dropbtn">Produk</a></b>
          <div class="dropdown-content">
            <a href="kanopi.html">Kanopi</a>
            <a href="tangga.html">Railing Tangga</a>
            <a href="pagar.html">Pagar</a>
            <a href="kaca.html">Kaca</a>
            <a href="kontruksi baja.html">Kontruksi Baja</a>
            <a href="balkon.html">Balkon</a>
            <a href="teralis.html">Teralis</a>

            <a href="fasad.html">Fasad</a>
            <a href="pintu.html">Pintu</a>
            <a href="kerangka meja.html">Kerangka Meja</a>
            <a href="custom.html">Custom</a>
          </div>
        </li>
        <li><a href="tentang.html">Tentang Kami</a></li>
      </ul>
    </nav>
  </header>

  <div class="wrapper">
    <main>
      <section class="product">
        <div class="headline-fixed">
          <h2>Portofolio 2017 - 2021</h2>
          <p>Koleksi dokumentasi proyek Stainless Indah dari tahun 2017 hingga 2021.</p>
        </div>
      </section>
    </main>

    <section class="testimoni-section">
      <h2 class="section-title">Arsip Karya 2017-2021</h2>
      <div class="project-container">
"@ | Out-File -FilePath $outputFile -Encoding utf8

# --- COLLECT ALL IMAGES ---
$allImages = @()
foreach ($year in $sourceYears) {
    $yearDir = Join-Path $rootDir $year
    if (Test-Path $yearDir) {
        $imgs = Get-ChildItem -Path $yearDir -Recurse | Where-Object { $_.Extension -match "jpg|jpeg|png" }
        $allImages += $imgs
    }
}

Write-Host "Total images found: $($allImages.Count)"

# Shuffle images for random distribution
$rng = New-Object System.Random
$shuffledImages = $allImages | Sort-Object { $rng.Next() }

# Calculate split size
$numTargetYears = $targetYears.Count
$imagesPerYear = [Math]::Floor($shuffledImages.Count / $numTargetYears)
$remainder = $shuffledImages.Count % $numTargetYears

$currentIndex = 0

# --- DISTRIBUTE IMAGES TO YEARS ---
foreach ($targetYear in $targetYears) {
    Write-Host "Generating for $targetYear..."
    
    # Calculate slice
    $count = $imagesPerYear
    if ($remainder -gt 0) {
        $count++
        $remainder--
    }
    
    # Get slice of images
    # Check bounds just in case
    if ($currentIndex -ge $shuffledImages.Count) { break }
    
    # Slice logic in PS creates array
    # We need to manually pick range
    $yearImages = @()
    for ($i = 0; $i -lt $count; $i++) {
        if (($currentIndex + $i) -lt $shuffledImages.Count) {
             $yearImages += $shuffledImages[$currentIndex + $i]
        }
    }
    $currentIndex += $count
    
    # Start Year Card HTML
    $cardStart = @"
        <div class="project-card">
          <div class="project-header"><h3>Dokumentasi Tahun $targetYear</h3><p class="project-date"><i class="far fa-calendar-alt"></i> $targetYear</p></div>
          <div class="project-gallery">
"@
    $cardStart | Out-File -FilePath $outputFile -Append -Encoding utf8
    
    # Add Images HTML
    foreach ($img in $yearImages) {
        # Calculate relative path
        $rel = $img.FullName.Substring($rootDir.Length)
        if ($rel.StartsWith("\")) { $rel = $rel.Substring(1) }
        $rel = $rel -replace "\\", "/"
        
        $imgHTML = "            <img src=""$rel"" loading=""lazy"">"
        $imgHTML | Out-File -FilePath $outputFile -Append -Encoding utf8
    }

    # End Year Card HTML
    $cardEnd = @"
          </div>
          <div class="project-desc"><p>Kumpulan dokumentasi pengerjaan berbagai proyek di tahun $targetYear.</p></div>
        </div>
"@
    $cardEnd | Out-File -FilePath $outputFile -Append -Encoding utf8
}

# --- FOOTER ---
@"
      </div>
    </section>

    <footer class="footer-keren">
      <div class="footer-container">
        <div class="footer-kolom tentang">
          <h3>Stainless Indah</h3>
          <p>Kami adalah spesialis bengkel las terpercaya di Pontianak, melayani berbagai kebutuhan pengerjaan las
            seperti stainless steel, besi, baja berat, hingga kaca. Kami mengerjakan beragam proyek mulai dari pembuatan dan
            pemasangan teralis, balkon, kanopi, pagar, fasad bangunan, hingga konstruksi khusus lainnya sesuai
            permintaan.
          </p>
        </div>
        <div class="footer-kolom">
          <h4>Kontak Kami</h4>
          <ul>
            <li><a href="https://www.instagram.com/stainless.indah/" target="_blank"><i class="fab fa-instagram"></i>
                Instagram</a></li>
            <li><a href="https://www.facebook.com/bengkel.stainlessindah.9" target="_blank"><i
                  class="fab fa-facebook-f"></i> Facebook</a></li>
            <li><a href="https://maps.app.goo.gl/dvd4R8Zd3u8aXGx97" target="_blank"><i
                  class="fa-solid fa-location-dot"></i>
                Pontianak Serdam, Batara 2</a></li>
            <li><a href="https://wa.me/+62811569863" target="_blank"><i class="fab fa-whatsapp"></i> 0811569863 (Admin
                WA)</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2025 Stainless Indah. All Rights Reserved.</p>
      </div>
    </footer>
  </div>
  <!-- Popup Modal -->
  <div id="imageModal" class="popup">
    <span class="close">&times;</span>
    <img class="popup-content" id="popupImg">
  </div>
  <script src="assets/js/main.js"></script>
</body>

</html>
"@ | Out-File -FilePath $outputFile -Append -Encoding utf8

Write-Host "Generated $outputFile with distributed images."
