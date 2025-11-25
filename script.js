document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-link');
    const burger = document.querySelector('.burger');
    const sections = document.querySelectorAll('.section');
    const currentYearSpan = document.getElementById('current-year');

    // --- Mobile Navigation (Burger Menu) ---
    const navSlide = () => {
        burger.addEventListener('click', () => {
            // Toggle Nav
            navLinksContainer.classList.toggle('nav-active');

            // Burger Animation
            burger.classList.toggle('toggle');
        });
    };

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinksContainer.classList.contains('nav-active')) {
                navLinksContainer.classList.remove('nav-active');
                burger.classList.remove('toggle');
            }
        });
    });


    // --- Scroll Animations (Fade-in Sections) ---
    const sectionObserverOptions = {
        root: null, // relative to the viewport
        threshold: 0.15, // Trigger when 15% of the section is visible
        // rootMargin: "-100px 0px -100px 0px" // Adjust trigger point if needed
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Unobserve after animation to save resources
                // observer.unobserve(entry.target);
            } else {
                 // Optional: Remove 'visible' class if you want the animation to repeat when scrolling back up
                 // entry.target.classList.remove('visible');
            }
        });
    }, sectionObserverOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });


    // --- Navigation Highlighting on Scroll ---
    const highlightNav = () => {
        let currentSectionId = 'home'; // Default to home
        const headerHeight = header.offsetHeight; // Get header height for offset

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 50; // Adjust offset as needed
            const sectionHeight = section.offsetHeight;

            // Check if scroll position is within the current section bounds
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        // Update active class on nav links
        navLinks.forEach(link => {
            link.classList.remove('active');
            // Check if the link's href matches the current section ID
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };

    // Add scroll listener (consider debouncing/throttling for performance if needed)
    window.addEventListener('scroll', highlightNav);
    // Initial call to set active link on page load
    highlightNav();


    // --- Dynamic Copyright Year ---
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Initialize Functions ---
    navSlide();

    // --- Theme Toggle (Dark Mode) ---
    const themeToggle = document.getElementById('checkbox');
    const body = document.body;
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    // Apply theme on load: saved preference > browser/OS preference
    const applyTheme = (isDark) => {
        if (isDark) {
            body.classList.add('dark-mode');
            themeToggle.checked = true;
        } else {
            body.classList.remove('dark-mode');
            themeToggle.checked = false;
        }
    };

    // Check saved preference first, otherwise follow browser/OS setting
    if (savedTheme) {
        applyTheme(savedTheme === 'dark');
    } else {
        applyTheme(prefersDark.matches);
    }

    // Listen for browser/OS theme changes (only if user hasn't set a preference)
    prefersDark.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches);
        }
    });

    // Toggle theme on checkbox change
    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark'); // Save preference
        } else {
            body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light'); // Save preference
        }
    });

});
