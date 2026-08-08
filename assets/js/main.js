// Main JavaScript for Stainless Indah

document.addEventListener('DOMContentLoaded', () => {
    console.log("Stainless Indah Modern Script Loaded");

    // --- Mobile Menu Toggle ---
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');

            // Icon animation switch (optional)
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

    // --- Sticky Header on Scroll (Unified Dark Glassmorphism) ---
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            // Header maintains background consistently
        });
    }

    // --- Dropdown Mobile Click Handling ---
    // On mobile, clicking "Produk" should toggle the dropdown instead of navigating immediately if possible
    // or we assume hover works or distinct button.
    // For simplicity, we rely on the CSS hover/focus state or add click support:
    const dropdown = document.querySelector('.dropdown');
    if (window.innerWidth < 768 && dropdown) {
        dropdown.addEventListener('click', (e) => {
            // e.stopPropagation(); // maybe needed if we want click-to-open
        });
    }
    // --- Image Popup Logic ---
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('popupImg');
    const closeBtn = document.querySelector('.close');

    // Select all project gallery images
    const projectImages = document.querySelectorAll('.project-gallery img');

    if (modal && modalImg && projectImages.length > 0) {
        projectImages.forEach(img => {
            img.addEventListener('click', (e) => {
                // Prevent default behavior if needed
                e.preventDefault();
                modal.style.display = 'flex'; // Use flex to center with existing CSS
                modalImg.src = img.src;
                // Optional: set alt text as caption if you had a caption element
            });
        });

        // Close on 'x' click
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }

        // Close on clicking outside the image
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
});
