// Main JavaScript for Stainless Indah

document.addEventListener('DOMContentLoaded', () => {
    console.log("Stainless Indah Modern Script Loaded");

    // --- Mobile Menu Toggle ---
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');

            const icon = menuToggle.querySelector('i');
            if (nav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // --- Dynamic Fullscreen Image Popup Modal Setup ---
    let modal = document.getElementById('imageModal') || document.getElementById('imagePopup');
    let modalImg = document.getElementById('popupImg');
    let closeBtn = document.querySelector('.popup .close') || document.querySelector('.popup-close');

    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'imageModal';
        modal.className = 'popup';
        modal.style.cssText = 'display:none; position:fixed; z-index:100000; left:0; top:0; width:100vw; height:100vh; background:rgba(0,0,0,0.93); backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px); justify-content:center; align-items:center; flex-direction:column; padding:20px; box-sizing:border-box; cursor:pointer;';
        
        modal.innerHTML = `
            <span class="close" style="position:absolute; top:20px; right:30px; color:#ffffff; font-size:42px; font-weight:bold; cursor:pointer; z-index:100001; transition:transform 0.2s ease; line-height:1;">&times;</span>
            <img class="popup-content" id="popupImg" style="width:92vw; max-width:1300px; height:clamp(340px, 60vh, 580px); object-fit:cover; object-position:center center; border-radius:16px; box-shadow:0 20px 60px rgba(0,0,0,0.9); border:1px solid rgba(255,255,255,0.15); cursor:default; animation:popupZoom 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
            <div id="popupCaption" style="color:#e0e0e0; margin-top:14px; font-size:15px; font-weight:500; text-align:center; max-width:80%;"></div>
        `;
        document.body.appendChild(modal);
        modalImg = document.getElementById('popupImg');
        closeBtn = modal.querySelector('.close');
    }

    function openPopup(src, alt = '') {
        if (modal && modalImg) {
            modalImg.src = src;
            const caption = document.getElementById('popupCaption');
            if (caption) caption.textContent = alt || '';
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Lock background scroll
        }
    }

    function closePopup() {
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = ''; // Unlock background scroll
        }
    }

    // Export showPopup globally for legacy onclick attributes
    window.showPopup = function(imgElement) {
        if (typeof imgElement === 'string') {
            openPopup(imgElement);
        } else if (imgElement && imgElement.src) {
            openPopup(imgElement.src, imgElement.alt || '');
        }
    };
    window.hidePopup = closePopup;

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('close')) {
                closePopup();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closePopup();
    });

    // --- Hero Custom Vanilla JS Slideshow (With Swipe & Popup) ---
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    const prevBtn = document.querySelector('.hero-arrow.hero-prev');
    const nextBtn = document.querySelector('.hero-arrow.hero-next');
    const visualFrame = document.querySelector('.hero-visual-frame');

    if (slides.length > 0) {
        let currentSlide = 0;
        let slideInterval = null;

        function showSlide(index) {
            slides.forEach((slide, i) => {
                if (i === index) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });

            dots.forEach((dot, i) => {
                if (i === index) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });

            currentSlide = index;
        }

        function nextSlide() {
            let nextIndex = (currentSlide + 1) % slides.length;
            showSlide(nextIndex);
        }

        function prevSlide() {
            let prevIndex = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(prevIndex);
        }

        function startAutoSlide() {
            stopAutoSlide();
            slideInterval = setInterval(nextSlide, 3000);
        }

        function stopAutoSlide() {
            if (slideInterval) {
                clearInterval(slideInterval);
            }
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                nextSlide();
                startAutoSlide();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                prevSlide();
                startAutoSlide();
            });
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                showSlide(index);
                startAutoSlide();
            });
        });

        // Touch & Drag Gesture Handling for Slideshow
        if (visualFrame) {
            let startX = 0;
            let startY = 0;
            let distX = 0;
            let distY = 0;
            let isDragging = false;
            let hasSwiped = false;

            // Touch events
            visualFrame.addEventListener('touchstart', (e) => {
                const touch = e.touches[0];
                startX = touch.clientX;
                startY = touch.clientY;
                distX = 0;
                distY = 0;
                hasSwiped = false;
                stopAutoSlide();
            }, { passive: true });

            visualFrame.addEventListener('touchmove', (e) => {
                const touch = e.touches[0];
                distX = touch.clientX - startX;
                distY = touch.clientY - startY;
                if (Math.abs(distX) > 15 && Math.abs(distX) > Math.abs(distY)) {
                    hasSwiped = true;
                }
            }, { passive: true });

            visualFrame.addEventListener('touchend', () => {
                if (hasSwiped && Math.abs(distX) > 40) {
                    if (distX < 0) {
                        nextSlide();
                    } else {
                        prevSlide();
                    }
                }
                startAutoSlide();
            });

            // Mouse Drag events
            visualFrame.addEventListener('mousedown', (e) => {
                isDragging = true;
                hasSwiped = false;
                startX = e.clientX;
                startY = e.clientY;
                distX = 0;
                distY = 0;
                visualFrame.style.cursor = 'grabbing';
                stopAutoSlide();
            });

            window.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                distX = e.clientX - startX;
                distY = e.clientY - startY;
                if (Math.abs(distX) > 10) {
                    hasSwiped = true;
                }
            });

            window.addEventListener('mouseup', () => {
                if (!isDragging) return;
                isDragging = false;
                visualFrame.style.cursor = 'pointer';
                if (hasSwiped && Math.abs(distX) > 40) {
                    if (distX < 0) {
                        nextSlide();
                    } else {
                        prevSlide();
                    }
                }
                startAutoSlide();
            });

            // Pause auto-slide on mouse enter/leave
            visualFrame.addEventListener('mouseenter', stopAutoSlide);
            visualFrame.addEventListener('mouseleave', () => {
                isDragging = false;
                startAutoSlide();
            });
        }

        // Attach Click to Popup Fullscreen for Slide Images
        slides.forEach((slide) => {
            const img = slide.querySelector('img');
            if (img) {
                img.style.cursor = 'pointer';
                img.addEventListener('click', (e) => {
                    // Only trigger popup if user clicked rather than swiping/dragging
                    if (e.defaultPrevented) return;
                    openPopup(img.src, img.alt || '');
                });
            }
        });

        // Initialize first slide and start auto-play
        showSlide(0);
        startAutoSlide();
    }

    // Attach click-to-popup handlers for all image elements on page
    const galleryImages = document.querySelectorAll('.project-gallery img, .produk-swiper img, .swiper-slide img, .produk-item img');
    galleryImages.forEach(img => {
        img.style.cursor = 'pointer';
        if (!img.getAttribute('onclick')) {
            img.addEventListener('click', () => {
                openPopup(img.src, img.alt || '');
            });
        }
    });

    // Initialize Featured Project Mini Slideshow (Proyek Terbaru)
    function initFeaturedSlideshow() {
        const outer = document.querySelector('.featured-slideshow-outer');
        if (!outer) return;

        const slides = outer.querySelectorAll('.featured-slide');
        const dots = outer.querySelectorAll('.featured-dot');
        const prevBtn = outer.querySelector('.featured-prev');
        const nextBtn = outer.querySelector('.featured-next');

        if (!slides || slides.length === 0) return;

        let currentIndex = 0;
        let timer = null;

        function showFeaturedSlide(index) {
            slides.forEach((s, i) => {
                if (i === index) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
            dots.forEach((d, i) => {
                if (i === index) {
                    d.classList.add('active');
                } else {
                    d.classList.remove('active');
                }
            });
            currentIndex = index;
        }

        function next() {
            let nextIndex = (currentIndex + 1) % slides.length;
            showFeaturedSlide(nextIndex);
        }

        function prev() {
            let prevIndex = (currentIndex - 1 + slides.length) % slides.length;
            showFeaturedSlide(prevIndex);
        }

        function startAuto() {
            stopAuto();
            timer = setInterval(next, 3000);
        }

        function stopAuto() {
            if (timer) clearInterval(timer);
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                next();
                startAuto();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                prev();
                startAuto();
            });
        }

        dots.forEach((dot, idx) => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                showFeaturedSlide(idx);
                startAuto();
            });
        });

        // Pause on hover
        outer.addEventListener('mouseenter', stopAuto);
        outer.addEventListener('mouseleave', startAuto);

        // Click images to popup modal
        slides.forEach(slide => {
            const img = slide.querySelector('img');
            if (img) {
                img.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openPopup(img.src, img.alt || '');
                });
            }
        });

        // Touch Swipe
        let startX = 0;
        let endX = 0;
        outer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            stopAuto();
        }, { passive: true });

        outer.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            let diff = startX - endX;
            if (Math.abs(diff) > 40) {
                if (diff > 0) next();
                else prev();
            }
            startAuto();
        }, { passive: true });

        showFeaturedSlide(0);
        startAuto();
    }

    initFeaturedSlideshow();
});

// Global Function for Needs-based Solution Selection on produk.html
window.selectNeedsCategory = function(type, event) {
    if (event) {
        event.preventDefault();
    }

    const titleEl = document.getElementById('solutionTitle');
    const descEl = document.getElementById('solutionDesc');
    const tagEl = document.getElementById('solutionCategoryTag');
    const gridEl = document.getElementById('solutionGrid');
    const targetSection = document.getElementById('solusi-produk');

    if (!gridEl) return;

    // Update active tab buttons
    document.querySelectorAll('.needs-tab-btn').forEach(btn => btn.classList.remove('active'));

    const data = {
        hunian: {
            tag: 'Portofolio & Bukti Proyek',
            title: 'BUKTI HASIL KERJA PROYEK HUNIAN',
            desc: 'Dokumentasi foto asli proyek pengerjaan Stainless Indah yang telah terselesaikan di Pontianak. Klik foto untuk melihat ukuran penuh.',
            tabId: 'btnTabHunian',
            products: [
                {
                    title: 'Kanopi ACP Rumah Billy',
                    tag: 'Proyek Hunian · Carport',
                    desc: 'Dokumentasi pengerjaan kanopi rangka baja & ACP minimalis hunian.',
                    img: 'assets/images/kanopi-cat.jpg'
                },
                {
                    title: 'Pagar Dorong Rumah Billy',
                    tag: 'Proyek Hunian · Batas Rumah',
                    desc: 'Pagar lipat & dorong besi motif laser cutting presisi.',
                    img: 'assets/images/pagar-cat.jpg'
                },
                {
                    title: 'Railing Tangga Pak Nyap',
                    tag: 'Proyek Hunian · Tangga Utama',
                    desc: 'Pegangan tangga kombinasi tiang stainless, pipa, & kaca tempered.',
                    img: 'assets/images/tangga-cat.jpg'
                },
                {
                    title: 'Balkon Stainless Hakka',
                    tag: 'Proyek Hunian · Teras Atas',
                    desc: 'Pengaman balkon rumah tingkat desain minimalis tahan karat.',
                    img: 'assets/images/balkon-cat.jpg'
                },
                {
                    title: 'Teralis Jendela Urbania',
                    tag: 'Proyek Hunian · Pengaman Jendela',
                    desc: 'Proteksi jendela rumah dengan teralis besi motif modern.',
                    img: 'assets/images/teralis-cat.jpg'
                },
                {
                    title: 'Pintu Kaca Tabrani Ahmad',
                    tag: 'Proyek Hunian · Akses Utama',
                    desc: 'Pintu swing kaca tempered & frame aluminium hunian.',
                    img: 'assets/images/pintu-cat.jpg'
                }
            ]
        },
        komersial: {
            tag: 'Portofolio & Bukti Proyek',
            title: 'BUKTI HASIL KERJA PROYEK KOMERSIAL',
            desc: 'Dokumentasi pengerjaan proyek ruko, apotek, mall, toko, dan fasilitas bisnis di Pontianak. Klik foto untuk melihat ukuran penuh.',
            tabId: 'btnTabKomersial',
            products: [
                {
                    title: 'Jojo Juice Merdeka',
                    tag: 'Outlet & Commercial Store',
                    desc: 'Fabrikasi pintu, kaca, & interior stainless steel kustom untuk Jojo Juice Merdeka.',
                    img: 'assets/images/komersial-jojo.jpg'
                },
                {
                    title: 'Apotek Muklin',
                    tag: 'Fasilitas Kesehatan & Toko',
                    desc: 'Pemasangan partisi, kaca tempered, & kusen aluminium presisi Apotek Muklin.',
                    img: 'assets/images/komersial-apotek.jpg'
                },
                {
                    title: 'Gramedia Mega Mall',
                    tag: 'Retail & Storefront Mall',
                    desc: 'Pekerjaan railing, sekat kaca, & arsitektur logam komersial Gramedia Mega Mall.',
                    img: 'assets/images/komersial-gramedia.jpg'
                },
                {
                    title: 'Momoyo Ngabang',
                    tag: 'Outlet & Fasad Toko',
                    desc: 'Pengerjaan etalase, fasad ACP, & pintu kaca tempered outlet Momoyo Ngabang.',
                    img: 'assets/images/komersial-momoyo.jpg'
                },
                {
                    title: 'Gaia Mall Pontianak',
                    tag: 'Pusat Perbelanjaan & Public Space',
                    desc: 'Fabrikasi stainless steel, railing, & Ornamen arsitektural Gaia Mall Pontianak.',
                    img: 'assets/images/komersial-gaiamall.jpg'
                },
                {
                    title: 'Klinik Serdam',
                    tag: 'Klinik & Fasilitas Medis',
                    desc: 'Partisi sekat kaca, pintu swing tempered, & konstruksi higienis Klinik Serdam.',
                    img: 'assets/images/komersial-klinik.jpg'
                }
            ]
        },
        custom: {
            tag: 'Portofolio & Bukti Proyek',
            title: 'BUKTI HASIL KERJA PROYEK CUSTOM',
            desc: 'Dokumentasi pengerjaan khusus kustom, lift barang, dan konstruksi baja berat. Klik foto untuk melihat ukuran penuh.',
            tabId: 'btnTabCustom',
            products: [
                {
                    title: 'Lift Barang Gudang Lokale',
                    tag: 'Pekerjaan Khusus Industri',
                    desc: 'Konstruksi lift barang sederhana & aman untuk efisiensi operasional gudang.',
                    img: 'assets/images/custom-cat.jpg'
                },
                {
                    title: 'Konstruksi Baja Berat Perdana',
                    tag: 'Struktur Industri Heavy-Duty',
                    desc: 'Fabrikasi rangka baja bentang lebar, tiang pancang, & konstruksi gudang.',
                    img: 'assets/images/baja-cat.jpg'
                },
                {
                    title: 'Kerangka Meja Stainless MBG',
                    tag: 'Furniture & Kitchen Set',
                    desc: 'Kerangka meja stainless steel presisi untuk industri makanan & hunian.',
                    img: 'assets/images/meja-cat.jpg'
                }
            ]
        }
    };

    const activeInfo = data[type] || data.hunian;

    if (tagEl) tagEl.textContent = activeInfo.tag;
    if (titleEl) titleEl.textContent = activeInfo.title;
    if (descEl) descEl.textContent = activeInfo.desc;

    const activeTab = document.getElementById(activeInfo.tabId);
    if (activeTab) activeTab.classList.add('active');

    // Fade out grid, update content, fade in
    gridEl.style.opacity = '0';
    gridEl.style.transition = 'opacity 0.25s ease';

    setTimeout(() => {
        let html = '';
        activeInfo.products.forEach(p => {
            html += `
              <div class="sol-card" onclick="showPopup(this.querySelector('img'))" style="cursor: pointer;">
                <div class="sol-card-media">
                  <img src="${p.img}" alt="${p.title}">
                </div>
                <div class="sol-card-body">
                  <div>
                    <span class="sol-card-tag">${p.tag}</span>
                    <h4 class="sol-card-title">${p.title}</h4>
                    <p class="sol-card-desc">${p.desc}</p>
                  </div>
                  <span class="sol-card-link" style="color: #007bff; font-weight: 600; font-size: 13px; margin-top: 10px; display: block;"><i class="fas fa-search-plus"></i> Klik Gambar Untuk Perbesar</span>
                </div>
              </div>
            `;
        });
        gridEl.innerHTML = html;
        gridEl.style.opacity = '1';
    }, 250);

    if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};

// Global Image Popup Lightbox Modal
window.showPopup = function(imgElement) {
    if (!imgElement || !imgElement.src) return;
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '999999';
    overlay.style.cursor = 'pointer';
    overlay.style.padding = '20px';
    overlay.style.boxSizing = 'border-box';

    const popupImg = document.createElement('img');
    popupImg.src = imgElement.src;
    popupImg.alt = imgElement.alt || 'Dokumentasi Proyek Stainless Indah';
    popupImg.style.maxWidth = '90%';
    popupImg.style.maxHeight = '80vh';
    popupImg.style.borderRadius = '10px';
    popupImg.style.objectFit = 'contain';
    popupImg.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.8)';

    const caption = document.createElement('div');
    caption.textContent = (imgElement.alt || 'Dokumentasi Proyek Stainless Indah') + ' (Klik di mana saja untuk menutup)';
    caption.style.color = '#ffffff';
    caption.style.marginTop = '15px';
    caption.style.fontSize = '15px';
    caption.style.fontFamily = 'sans-serif';
    caption.style.textAlign = 'center';

    const closeBtn = document.createElement('span');
    closeBtn.innerHTML = '&times; Tutup Gambar';
    closeBtn.style.color = '#007bff';
    closeBtn.style.background = '#ffffff';
    closeBtn.style.padding = '6px 16px';
    closeBtn.style.borderRadius = '20px';
    closeBtn.style.fontSize = '13px';
    closeBtn.style.fontWeight = 'bold';
    closeBtn.style.marginTop = '12px';

    overlay.appendChild(popupImg);
    overlay.appendChild(caption);
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);

    overlay.onclick = function() {
        if (document.body.contains(overlay)) {
            document.body.removeChild(overlay);
        }
    };
};

