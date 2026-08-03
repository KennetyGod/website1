
param (
    [string]$Year
)

$rootDir = "d:\stainless-indah-web"
$yearDir = Join-Path $rootDir $Year
$outputFile = Join-Path $rootDir "testimoni-$Year.html"

if (-not (Test-Path $yearDir)) {
    Write-Error "Directory $yearDir does not exist."
    exit
}

# --- HEADER ---
@"
<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Portofolio $Year - Stainless Indah</title>
  <link rel="stylesheet" href="assets/css/style.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>

<body>
  <!-- Slideshow Background (Optional, using same images as main page) -->
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
          <h2>Portofolio $Year</h2>
          <p>Dokumentasi pengerjaan proyek-proyek unggulan Stainless Indah sepanjang tahun $Year.</p>
        </div>
      </section>
    </main>

    <section class="testimoni-section">
      <h2 class="section-title">Hasil Karya $Year</h2>
      <div class="project-container">
"@ | Out-File -FilePath $outputFile -Encoding utf8

# --- PROJECT CARDS ---
# Get all subdirectories (projects)
$projects = Get-ChildItem -Path $yearDir -Directory

foreach ($project in $projects) {
    $projectName = $project.Name
    
    # Get images (jpg, jpeg, png) - ensure recursion works
    $images = Get-ChildItem -Path $project.FullName -Recurse | Where-Object { $_.Extension -match "jpg|jpeg|png" }
    
    # FILTER: Skip projects with fewer than 4 images
    if ($images.Count -lt 4) {
        Write-Host "Skipping $($project.Name) (Count: $($images.Count)) - Minimum 4 images required."
        continue
    }

    # Start Project Card HTML
    $cardStart = @"
        <div class="project-card">
          <div class="project-header"><h3>$projectName</h3><p class="project-date"><i class="far fa-calendar-alt"></i> $Year</p></div>
          <div class="project-gallery">
"@
    $cardStart | Out-File -FilePath $outputFile -Append -Encoding utf8

    # Display ALL sorted images (no limit)
    foreach ($img in $images) {
        # Calculate relative path from root
        # Full path: D:\root\2025\proj\img.jpg
        # Root path: D:\root\
        # Relative: 2025\proj\img.jpg -> 2025/proj/img.jpg
        
        # Using string replacement
        $rel = $img.FullName.Substring($rootDir.Length)
        if ($rel.StartsWith("\")) { $rel = $rel.Substring(1) }
        $rel = $rel -replace "\\", "/"
        
        $imgHTML = "            <img src=""$rel"" loading=""lazy"">"
        $imgHTML | Out-File -FilePath $outputFile -Append -Encoding utf8
    }

    # End Project Card HTML
    $cardEnd = @"
          </div>
          <div class="project-desc"><p>Projek pengerjaan $projectName tahun $Year</p></div>
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

Write-Host "Generated $outputFile"
