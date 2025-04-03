document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links a');
    const burger = document.querySelector('.burger');
    const sections = document.querySelectorAll('main section'); // Select all sections in main
    const currentYearSpan = document.getElementById('current-year');

    // --- Mobile Navigation ---
    const navSlide = () => {
        burger.addEventListener('click', () => {
            // Toggle Nav
            navLinksContainer.classList.toggle('nav-active');

            // Animate Links
            document.querySelectorAll('.nav-links li').forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = ''; // Reset animation
                } else {
                    // Delay each link fade-in
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });

            // Burger Animation
            burger.classList.toggle('toggle');
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navLinksContainer.classList.contains('nav-active')) {
                    navLinksContainer.classList.remove('nav-active');
                    burger.classList.remove('toggle');
                    document.querySelectorAll('.nav-links li').forEach(li => li.style.animation = '');
                }
            });
        });
    };

    // --- Header Style Change on Scroll ---
    const headerScroll = () => {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) { // Change style after scrolling 50px
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    };

    // --- Active Nav Link Highlighting on Scroll ---
    const activateNavLink = () => {
        let currentSectionId = '';
        const headerHeight = header.offsetHeight; // Get header height for offset

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 50; // Adjust offset as needed
            const sectionBottom = sectionTop + section.offsetHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                currentSectionId = section.getAttribute('id');
            }
        });

        // Special case for reaching the bottom (highlight Contact)
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
             currentSectionId = 'contact';
        }
        // Special case for top (highlight Home)
        else if (window.scrollY < sections[0].offsetTop - headerHeight - 50) {
             currentSectionId = 'home';
        }


        navLinks.forEach(link => {
            link.classList.remove('active');
            // Check if the link's href matches the current section ID
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };

    // --- Section Fade-in on Scroll using Intersection Observer ---
    const sectionFadeIn = () => {
        const observerOptions = {
            root: null, // Use the viewport as the root
            rootMargin: '0px',
            threshold: 0.15 // Trigger when 15% of the section is visible
        };

        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Optional: Unobserve after it becomes visible to improve performance
                    // observer.unobserve(entry.target);
                }
                // Optional: Remove 'visible' class if scrolling back up
                // else {
                //     entry.target.classList.remove('visible');
                // }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        // Observe each content section
        document.querySelectorAll('.content-section').forEach(section => {
            observer.observe(section);
        });
        // Observe hero section separately if needed (it's usually visible initially)
        // const heroSection = document.getElementById('home');
        // if (heroSection) observer.observe(heroSection);
    };


    // --- Dynamic Copyright Year ---
    const setCopyrightYear = () => {
        if (currentYearSpan) {
            currentYearSpan.textContent = new Date().getFullYear();
        }
    };

    // --- Initialize Functions ---
    navSlide();
    headerScroll();
    sectionFadeIn();
    setCopyrightYear();

    // Add scroll listener for active nav link highlighting
    window.addEventListener('scroll', activateNavLink);
    // Call once on load in case the page loads scrolled somewhere
    activateNavLink();

});
