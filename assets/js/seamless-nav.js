// assets/js/seamless-nav.js

(function() {
  const contentSelector = '.page-content .wrapper'; // Selector for the main content area to replace
  const navLinkSelector = 'a.page-link'; // Selector for internal navigation links in the header
  const siteBaseUrl = document.location.origin; // Base URL of the site

  const fetchPage = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      const newContent = doc.querySelector(contentSelector);
      const newTitle = doc.querySelector('title')?.textContent || ''; // Get the title from the fetched page

      return { content: newContent?.innerHTML || '<p>Content not found.</p>', title: newTitle };
    } catch (error) {
      console.error('Fetch error:', error);
      // Potentially redirect to the target URL as a fallback
      // window.location.href = url;
      return null; // Indicate failure
    }
  };

  const updatePage = (content, title, url) => {
    const mainContentArea = document.querySelector(contentSelector);
    if (mainContentArea) {
      // Add transition classes (optional)
      document.body.classList.add('page-loading');

      // Simple fade out/in (can be replaced with more complex CSS animations)
      mainContentArea.style.opacity = '0';

      setTimeout(async () => {
        mainContentArea.innerHTML = content;
        document.title = title;
        window.history.pushState({ path: url }, title, url);

        // Re-run scripts or re-initialize components if necessary
        // e.g., re-attach event listeners, re-run theme toggle logic if needed

        // Scroll to top
        window.scrollTo(0, 0);

        // Fade in new content
        mainContentArea.style.opacity = '1';
        document.body.classList.remove('page-loading');

        // Re-attach navigation listeners to newly loaded content if needed
        attachNavListeners();

      }, 300); // Match transition duration

    } else {
      console.error("Main content area not found for replacement.");
      // Fallback: just navigate normally
      window.location.href = url;
    }
  };

  const handleNavClick = (event) => {
    const link = event.target.closest('a'); // Find the closest anchor tag

    // Check if it's an internal link, not opening in new tab, and not a special link (like mailto:)
    if (
      link &&
      link.href.startsWith(siteBaseUrl) && // Internal link
      link.target !== '_blank' &&          // Not opening in new tab
      !link.getAttribute('href').startsWith('#') && // Not an anchor link
      !link.getAttribute('href').startsWith('mailto:') && // Not mailto
      !link.getAttribute('data-no-seamless') // Optional attribute to disable seamless nav
    ) {
      event.preventDefault(); // Prevent default navigation
      const targetUrl = link.href;

      console.log(`Seamless navigation triggered for: ${targetUrl}`);

      fetchPage(targetUrl).then(result => {
        if (result) {
          updatePage(result.content, result.title, targetUrl);
        } else {
          // Fallback if fetch failed
          window.location.href = targetUrl;
        }
      });
    }
  };

  const attachNavListeners = () => {
    // Detach existing listeners first to avoid duplicates if re-attaching
    document.removeEventListener('click', handleNavClick);
    // Attach listener to the document body to catch clicks on existing and future links
    document.addEventListener('click', handleNavClick);
    console.log("Seamless navigation listeners attached.");
  };

  // Initial attachment
  document.addEventListener('DOMContentLoaded', attachNavListeners);

  // Handle back/forward button navigation
  window.addEventListener('popstate', (event) => {
    if (event.state && event.state.path) {
      console.log(`Popstate triggered for: ${event.state.path}`);
      fetchPage(event.state.path).then(result => {
        if (result) {
          // Update content without pushing state again
          const mainContentArea = document.querySelector(contentSelector);
          if (mainContentArea) {
            mainContentArea.innerHTML = result.content;
            document.title = result.title;
             // Re-run scripts or re-initialize components if necessary
            attachNavListeners(); // Re-attach listeners
          }
        } else {
          // Fallback if fetch failed
          window.location.reload();
        }
      });
    }
  });

  console.log("Seamless navigation script loaded.");

})(); // IIFE
