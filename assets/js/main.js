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

    // --- Hero Custom Vanilla JS Slideshow ---
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    const prevBtn = document.querySelector('.hero-arrow.hero-prev');
    const nextBtn = document.querySelector('.hero-arrow.hero-next');

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
            slideInterval = setInterval(nextSlide, 3500);
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

        // Pause on hover
        const visualFrame = document.querySelector('.hero-slideshow-outer') || document.querySelector('.hero-visual-frame');
        if (visualFrame) {
            visualFrame.addEventListener('mouseenter', stopAutoSlide);
            visualFrame.addEventListener('mouseleave', startAutoSlide);
        }

        // Initialize first slide and start auto-play
        showSlide(0);
        startAutoSlide();
    }

    // --- Sticky Header on Scroll ---
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            // Header maintains background consistently
        });
    }

    // --- Image Popup Logic ---
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('popupImg');
    const closeBtn = document.querySelector('.close');
    const projectImages = document.querySelectorAll('.project-gallery img');

    if (modal && modalImg && projectImages.length > 0) {
        projectImages.forEach(img => {
            img.addEventListener('click', (e) => {
                e.preventDefault();
                modal.style.display = 'flex';
                modalImg.src = img.src;
            });
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
});
