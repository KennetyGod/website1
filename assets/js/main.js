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

    // --- Hero Swiper Initialization ---
    if (document.querySelector('.heroSwiper') && typeof Swiper !== 'undefined') {
        new Swiper('.heroSwiper', {
            loop: true,
            autoplay: {
                delay: 3500,
                disableOnInteraction: false,
            },
            speed: 800,
            navigation: {
                nextEl: '.hero-next',
                prevEl: '.hero-prev',
            },
            pagination: {
                el: '.hero-pagination',
                clickable: true,
            },
        });
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
