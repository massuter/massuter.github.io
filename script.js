document.documentElement.classList.add('js-ready');

document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-link');
    const burger = document.querySelector('.burger');
    const sections = document.querySelectorAll('.section');
    const currentYearSpan = document.getElementById('current-year');

    // --- Mobile Navigation (Burger Menu) ---
    const syncNavAccessibilityState = () => {
        if (!navLinksContainer || !burger) return;
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        const isOpen = navLinksContainer.classList.contains('nav-active');
        burger.setAttribute('aria-expanded', String(isOpen));
        burger.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
        navLinksContainer.setAttribute('aria-hidden', String(isMobile && !isOpen));
        navLinks.forEach(link => {
            link.tabIndex = isMobile && !isOpen ? -1 : 0;
        });
    };

    const setMenuState = (isOpen) => {
        if (!navLinksContainer || !burger) return;
        navLinksContainer.classList.toggle('nav-active', isOpen);
        burger.classList.toggle('toggle', isOpen);
        syncNavAccessibilityState();
    };

    const navSlide = () => {
        if (!burger || !navLinksContainer) return;
        burger.addEventListener('click', () => {
            setMenuState(!navLinksContainer.classList.contains('nav-active'));
        });
    };

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinksContainer && navLinksContainer.classList.contains('nav-active')) {
                setMenuState(false);
            }
        });
    });

    document.addEventListener('keydown', (event) => {
        const menuIsOpen = navLinksContainer && navLinksContainer.classList.contains('nav-active');
        if (event.key === 'Escape' && menuIsOpen) {
            setMenuState(false);
            if (burger) {
                burger.focus();
            }
        }
    });

    window.addEventListener('resize', syncNavAccessibilityState);


    // --- Scroll Animations (Fade-in Sections) ---
    const sectionObserverOptions = {
        root: null, // relative to the viewport
        threshold: 0.15, // Trigger when 15% of the section is visible
        // rootMargin: "-100px 0px -100px 0px" // Adjust trigger point if needed
    };

    const primeVisibleSections = () => {
        const headerHeight = header ? header.offsetHeight : 0;
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const isInInitialViewport =
                rect.top <= window.innerHeight - headerHeight && rect.bottom > headerHeight;
            if (isInInitialViewport) {
                section.classList.add('visible');
            }
        });
    };

    sections.forEach(section => {
        section.classList.add('reveal-on-scroll');
    });

    if ('IntersectionObserver' in window) {
        primeVisibleSections();
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, sectionObserverOptions);

        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    } else {
        // Fallback for older browsers: keep all sections visible.
        sections.forEach(section => {
            section.classList.add('visible');
        });
    }


    // --- Navigation Highlighting on Scroll ---
    const highlightNav = () => {
        if (!header) return;
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
    if (themeToggle) {
        if (savedTheme) {
            applyTheme(savedTheme === 'dark');
        } else {
            applyTheme(prefersDark.matches);
        }

        // Listen for browser/OS theme changes (only if user hasn't set a preference)
        if (typeof prefersDark.addEventListener === 'function') {
            prefersDark.addEventListener('change', (e) => {
                if (!localStorage.getItem('theme')) {
                    applyTheme(e.matches);
                }
            });
        } else if (typeof prefersDark.addListener === 'function') {
            prefersDark.addListener((e) => {
                if (!localStorage.getItem('theme')) {
                    applyTheme(e.matches);
                }
            });
        }

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
    }

    syncNavAccessibilityState();

});
