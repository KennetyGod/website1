// Main JavaScript for Stainless Indah

// --- Global Image Error Fallback Handler ---
document.addEventListener('error', function (e) {
    if (e.target && e.target.tagName === 'IMG') {
        const src = e.target.getAttribute('src') || '';
        if (src && !e.target.dataset.fallbackApplied) {
            e.target.dataset.fallbackApplied = 'true';
            const showcaseImages = [
                'assets/images/kanopi21.png',
                'assets/images/balkon21.jpg',
                'assets/images/teralis21.jpg',
                'assets/images/tangga21.png',
                'assets/images/pagar-cat.jpg',
                'assets/images/kaca21.jpg',
                'assets/images/tempa21.jpg',
                'assets/images/baja21.jpg',
                'assets/images/fasad21.jpg',
                'assets/images/pintu-cat.jpg',
                'assets/images/custom-cat.jpg',
                'assets/images/meja-cat.jpg'
            ];

            if (lower.includes('kanopi') || lower.includes('acp') || lower.includes('carport') || lower.includes('alderon')) {
                e.target.src = 'assets/images/kanopi21.png';
            } else if (lower.includes('balkon') || lower.includes('terras')) {
                e.target.src = 'assets/images/balkon21.jpg';
            } else if (lower.includes('teralis') || lower.includes('antimaling') || lower.includes('maling')) {
                e.target.src = 'assets/images/teralis21.jpg';
            } else if (lower.includes('tangga') || lower.includes('railing')) {
                e.target.src = 'assets/images/tangga21.png';
            } else if (lower.includes('tempa')) {
                e.target.src = 'assets/images/tempa21.jpg';
            } else if (lower.includes('baja') || lower.includes('konstruksi') || lower.includes('lest plang')) {
                e.target.src = 'assets/images/baja21.jpg';
            } else if (lower.includes('kaca') || lower.includes('partisi') || lower.includes('kusen') || lower.includes('etalase')) {
                e.target.src = 'assets/images/kaca21.jpg';
            } else if (lower.includes('fasad') || lower.includes('kisi')) {
                e.target.src = 'assets/images/fasad21.jpg';
            } else if (lower.includes('pintu') || lower.includes('folding') || lower.includes('garasi') || lower.includes('gate')) {
                e.target.src = 'assets/images/pintu-cat.jpg';
            } else if (lower.includes('lift') || lower.includes('meja') || lower.includes('custom') || lower.includes('rak')) {
                e.target.src = lower.includes('meja') ? 'assets/images/meja-cat.jpg' : 'assets/images/custom-cat.jpg';
            } else {
                let hash = 0;
                for (let i = 0; i < src.length; i++) {
                    hash = (hash << 5) - hash + src.charCodeAt(i);
                    hash |= 0;
                }
                const index = Math.abs(hash) % showcaseImages.length;
                e.target.src = showcaseImages[index];
            }
        }
    }
}, true);

document.addEventListener('DOMContentLoaded', () => {
    console.log("Stainless Indah Modern Script Loaded");

    // --- Mobile & iPad Menu Toggle (Width <= 1024px) ---
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            nav.classList.toggle('active');

            const icon = menuToggle.querySelector('i');
            if (icon) {
                if (nav.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }

    // --- Mobile & iPad Dropdown Tap Toggle (Width <= 1024px) ---
    const dropBtns = document.querySelectorAll('.dropdown > .dropbtn');
    dropBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (window.innerWidth <= 1024) {
                const dropdown = btn.closest('.dropdown');
                if (dropdown) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            }
        });
    });

    // Close Mobile / iPad Drawer & Dropdown When Clicking Outside
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024) {
            const isClickInsideNav = nav && nav.contains(e.target);
            const isClickOnToggle = menuToggle && menuToggle.contains(e.target);

            if (!isClickInsideNav && !isClickOnToggle) {
                if (nav && nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    const icon = menuToggle ? menuToggle.querySelector('i') : null;
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
                document.querySelectorAll('.dropdown.active').forEach(d => d.classList.remove('active'));
            }
        }
    });

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
            <span class="close" style="position:absolute; top:20px; right:30px; color:#ffffff; font-size:44px; font-weight:bold; cursor:pointer; z-index:100001; transition:transform 0.2s ease; line-height:1;">&times;</span>
            <img class="popup-content" id="popupImg" style="width:auto; height:auto; max-width:95vw; max-height:95vh; object-fit:contain; border-radius:12px; box-shadow:0 25px 80px rgba(0,0,0,0.95), 0 0 35px rgba(0,242,254,0.25); border:1px solid rgba(0,242,254,0.4); cursor:default; animation:popupZoom 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
        `;
        document.body.appendChild(modal);
        modalImg = document.getElementById('popupImg');
        closeBtn = modal.querySelector('.close');
    }

    function openPopup(src) {
        if (modal && modalImg) {
            modalImg.src = src;
            const caption = document.getElementById('popupCaption');
            if (caption) caption.style.display = 'none';
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

    // --- IntersectionObserver Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.section-header, .why-us-card, .category-card, .workflow-card, .testimonial-card, .stats-bar, .featured-project-container');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => {
            el.classList.add('reveal-on-scroll');
            revealObserver.observe(el);
        });
    } else {
        revealElements.forEach(el => el.classList.add('visible'));
    }
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
                    img: 'assets/images/kanopi21.png?v=20260820_photo2'
                },
                {
                    title: 'Pagar Dorong Automatic Laser Cut',
                    tag: 'Proyek Hunian · Batas Rumah',
                    desc: 'Pagar dorong motif laser cutting chevron dengan sistem pagar otomatis.',
                    img: 'assets/images/pagar-cat.jpg?v=20260820_photo3'
                },
                {
                    title: 'Railing Tangga Stainless Outdoor',
                    tag: 'Proyek Hunian · Tangga Utama',
                    desc: 'Pegangan tangga outdoor kombinasi tiang stainless & pipa besi tahan cuaca.',
                    img: 'assets/images/tangga21.png?v=20260820_photo3'
                },
                {
                    title: 'Balkon Stainless Hakka',
                    tag: 'Proyek Hunian · Teras Atas',
                    desc: 'Pengaman balkon rumah tingkat desain minimalis tahan karat.',
                    img: 'assets/images/balkon21.jpg?v=20260820_photo3'
                },
                {
                    title: 'Teralis Jendela Urbania',
                    tag: 'Proyek Hunian · Pengaman Jendela',
                    desc: 'Proteksi jendela rumah dengan teralis besi motif modern.',
                    img: 'assets/images/teralis21.jpg?v=20260820_photo3'
                },
                {
                    title: 'Arsitektur Kaca Tempered Curved',
                    tag: 'Proyek Hunian · Akses Utama',
                    desc: 'Partisi & sekat kaca tempered lengkung kualitas presisi.',
                    img: 'assets/images/kaca21.jpg?v=20260820_photo3'
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
                    img: 'assets/images/fasad21.jpg?v=20260820_photo1'
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
                    title: 'Ornamen Besi Tempa Mewah',
                    tag: 'Pekerjaan Khusus Klasik',
                    desc: 'Pagar & ornamen besi tempa desain klasik dengan ukiran tempa emas dan hitam.',
                    img: 'assets/images/tempa21.jpg?v=20260820_photo1'
                },
                {
                    title: 'Konstruksi Baja Berat Perdana',
                    tag: 'Struktur Industri Heavy-Duty',
                    desc: 'Fabrikasi rangka baja bentang lebar, tiang pancang, & konstruksi gudang.',
                    img: 'assets/images/baja21.jpg?v=20260820_photo1'
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
    if (!imgElement) return;
    const src = (typeof imgElement === 'string') ? imgElement : (imgElement.src || '');
    if (!src) return;

    // Use primary modal if present
    const modal = document.getElementById('imageModal') || document.getElementById('imagePopup');
    const modalImg = document.getElementById('popupImg');
    if (modal && modalImg) {
        modalImg.src = src;
        const caption = document.getElementById('popupCaption');
        if (caption) caption.style.display = 'none';
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        return;
    }

    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    overlay.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.95); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); display:flex; align-items:center; justify-content:center; z-index:999999; cursor:pointer; padding:15px; box-sizing:border-box;';

    const closeBtn = document.createElement('span');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = 'position:absolute; top:20px; right:30px; color:#ffffff; font-size:44px; font-weight:bold; cursor:pointer; z-index:1000000; line-height:1; opacity:0.85; transition:all 0.2s ease;';
    closeBtn.onmouseenter = () => closeBtn.style.color = '#00f2fe';
    closeBtn.onmouseleave = () => closeBtn.style.color = '#ffffff';

    const popupImg = document.createElement('img');
    popupImg.src = src;
    popupImg.style.cssText = 'width:auto; height:auto; max-width:95vw; max-height:95vh; object-fit:contain; border-radius:12px; box-shadow:0 25px 80px rgba(0,0,0,0.95), 0 0 35px rgba(0,242,254,0.25); border:1px solid rgba(0,242,254,0.4); animation:popupZoom 0.35s cubic-bezier(0.175,0.885,0.32,1.275); cursor:default;';

    overlay.appendChild(closeBtn);
    overlay.appendChild(popupImg);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    overlay.onclick = function(e) {
        if (e.target === overlay || e.target === closeBtn) {
            if (document.body.contains(overlay)) {
                document.body.removeChild(overlay);
            }
            document.body.style.overflow = '';
        }
    };
};

// ==========================================================================
// USER TESTIMONIAL SUBMISSION & LOCALSTORAGE DISPLAY HANDLER
// ==========================================================================
let currentSelectedRating = 5;

window.openReviewModal = function() {
    let modal = document.getElementById('userReviewModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'userReviewModal';
        modal.className = 'review-modal-overlay';
        modal.innerHTML = `
          <div class="review-modal-card">
            <span class="review-modal-close" onclick="closeReviewModal()">&times;</span>
            <div class="review-modal-title">Tulis Ulasan Anda</div>
            <div class="review-modal-subtitle">Berikan ulasan & pengalaman Anda menggunakan layanan Stainless Indah</div>
            <form onsubmit="submitUserReview(event)">
              <div class="review-form-group">
                <label>Nama Lengkap / Panggilan *</label>
                <input type="text" id="revNama" class="review-form-input" placeholder="Contoh: Bpk. Hendra / Ibu Siska" required>
              </div>
              <div class="review-form-group">
                <label>Status / Kategori Proyek *</label>
                <input type="text" id="revPeran" class="review-form-input" placeholder="Contoh: Pemilik Rumah — Pontianak" required>
              </div>
              <div class="review-form-group">
                <label>Penilaian Bintang *</label>
                <div class="star-rating-picker" id="starPicker">
                  <span data-val="1" class="active">★</span>
                  <span data-val="2" class="active">★</span>
                  <span data-val="3" class="active">★</span>
                  <span data-val="4" class="active">★</span>
                  <span data-val="5" class="active">★</span>
                </div>
              </div>
              <div class="review-form-group">
                <label>Ulasan Anda *</label>
                <textarea id="revKomentar" class="review-form-textarea" placeholder="Ceritakan pengalaman Anda mengenai kualitas pengerjaan, ketepatan waktu, dan pelayanan kami..." required></textarea>
              </div>
              <div class="review-modal-actions">
                <button type="submit" class="btn-submit-review">Kirim Ulasan</button>
                <button type="button" class="btn-wa-review" onclick="sendReviewViaWA()"><i class="fab fa-whatsapp"></i> Kirim ke WA</button>
              </div>
            </form>
          </div>
        `;
        document.body.appendChild(modal);

        // Bind star picker
        const stars = modal.querySelectorAll('#starPicker span');
        stars.forEach(star => {
            star.addEventListener('click', () => {
                const val = parseInt(star.dataset.val);
                currentSelectedRating = val;
                stars.forEach(s => {
                    if (parseInt(s.dataset.val) <= val) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });
            });
        });
    }

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
};

window.closeReviewModal = function() {
    const modal = document.getElementById('userReviewModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
};

window.sendReviewViaWA = function() {
    const nama = document.getElementById('revNama')?.value.trim() || '';
    const peran = document.getElementById('revPeran')?.value.trim() || '';
    const komentar = document.getElementById('revKomentar')?.value.trim() || '';
    if (!nama || !komentar) {
        alert('Mohon isi nama dan komentar ulasan Anda terlebih dahulu.');
        return;
    }
    const starsStr = '★'.repeat(currentSelectedRating);
    const text = `Halo Stainless Indah, saya ingin memberikan ulasan:\n\nNama: ${nama}\nProyek/Lokasi: ${peran}\nRating: ${starsStr}\n\nUlasan:\n"${komentar}"`;
    window.open(`https://wa.me/+62811569863?text=${encodeURIComponent(text)}`, '_blank');
};

window.submitUserReview = function(e) {
    e.preventDefault();
    const nama = document.getElementById('revNama').value.trim();
    const peran = document.getElementById('revPeran').value.trim();
    const quote = document.getElementById('revKomentar').value.trim();

    if (!nama || !peran || !quote) return;

    const newReview = {
        id: Date.now(),
        author: nama,
        role: peran,
        quote: quote,
        rating: currentSelectedRating,
        date: new Date().toLocaleDateString('id-ID')
    };

    // Save to localStorage
    let saved = JSON.parse(localStorage.getItem('stainless_user_reviews') || '[]');
    saved.unshift(newReview);
    localStorage.setItem('stainless_user_reviews', JSON.stringify(saved));

    // Render into current grid
    renderSingleUserReview(newReview, true);

    window.closeReviewModal();

    // Notification toast
    showReviewToast('Terima kasih! Ulasan Anda berhasil diterbitkan.');
};

function renderSingleUserReview(rev, isNew = false) {
    const grid = document.querySelector('.testimonial-grid') || document.querySelector('.ab-testimonial-grid');
    if (!grid) return;

    const starsStr = '★'.repeat(rev.rating || 5);
    const card = document.createElement('div');
    const isAb = grid.className.includes('ab-');
    card.className = (isAb ? 'ab-testi-card' : 'testimonial-card') + ' user-review-card';
    card.innerHTML = `
      <div>
        <div class="${isAb ? 'ab-testi-card-header' : 'testimonial-card-header'}">
          <span class="user-badge"><i class="fas fa-check-circle"></i> verified review</span>
          <div class="rating-stars">${starsStr}</div>
        </div>
        <p class="${isAb ? 'ab-testi-quote' : 'testimonial-quote'}">"${rev.quote}"</p>
      </div>
      <div>
        <div class="${isAb ? 'ab-testi-author' : 'testimonial-author'}">${rev.author}</div>
        <div class="${isAb ? 'ab-testi-role' : 'testimonial-role'}">${rev.role}</div>
      </div>
    `;

    if (isNew) {
        grid.insertBefore(card, grid.firstChild);
    } else {
        grid.insertBefore(card, grid.firstChild);
    }
}

function loadUserReviews() {
    const saved = JSON.parse(localStorage.getItem('stainless_user_reviews') || '[]');
    if (saved && saved.length > 0) {
        saved.slice().reverse().forEach(rev => {
            renderSingleUserReview(rev, false);
        });
    }
}

function showReviewToast(msg) {
    const toast = document.createElement('div');
    toast.style.cssText = 'position:fixed; bottom:30px; left:50%; transform:translateX(-50%); background:#00f2fe; color:#000; font-weight:700; padding:14px 28px; border-radius:30px; box-shadow:0 10px 30px rgba(0,242,254,0.5); z-index:1000000; font-size:14px; animation:fadeInModal 0.3s ease;';
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(() => {
        if (document.body.contains(toast)) document.body.removeChild(toast);
    }, 3500);
}

// Load reviews on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    loadUserReviews();
});

