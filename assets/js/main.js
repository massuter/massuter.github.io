// assets/js/main.js

// Add any general site-wide JavaScript functionality here.
// For example, initializing components, handling global events, etc.

document.addEventListener('DOMContentLoaded', () => {
  console.log("Main JavaScript loaded.");

  // Example: Add target="_blank" to all external links automatically
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    if (link.hostname !== window.location.hostname && link.hostname !== '') {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer'); // Security best practice
      console.log(`Added target=_blank to: ${link.href}`);
    }
  });

  // Add specific logic for opening external links in new tabs as per requirement 2
  // This might be redundant if the above covers it, but ensures compliance
  const externalLinks = document.querySelectorAll('a[href^="http"]'); // Select links starting with http/https
    externalLinks.forEach(link => {
        // Check if the link's hostname is different from the current site's hostname
        if (link.hostname !== window.location.hostname) {
            link.target = '_blank';
            link.rel = 'noopener noreferrer'; // Good practice for security
        }
    });

    // Ensure internal links for seamless nav don't get target=_blank
    const internalLinks = document.querySelectorAll('a[href^="/"], a[href^="' + window.location.origin + '"]');
    internalLinks.forEach(link => {
        // Check if it's not explicitly set to open in new tab already
        if (link.target !== '_blank') {
            // Remove target if accidentally added by broader selectors
            // link.removeAttribute('target');
            // Note: Seamless nav script will handle these clicks
        }
    });

});
