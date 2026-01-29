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

    // --- Sticky Header on Scroll ---
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = "rgba(0, 0, 0, 0.9)";
            header.style.padding = "0 5%"; // Slightly shrink or keep consistent
        } else {
            header.style.background = "rgba(0, 0, 0, 0.2)";
        }
    });

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
});
