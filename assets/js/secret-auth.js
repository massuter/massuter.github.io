// assets/js/secret-auth.js

(function() {
  // --- Configuration ---
  // IMPORTANT: Hardcoding the secret word here is NOT secure for production.
  // Consider fetching from a config or updating manually during the 3-month cycle.
  const CORRECT_SECRET_WORD = "vrcdaisuki"; // Replace with the actual secret word
  const COOKIE_NAME = "gallery_access_granted";
  const COOKIE_EXPIRATION_DAYS = 30; // Cookie valid for 1 month as per spec
  // --- End Configuration ---

  const promptElement = document.getElementById('secret-word-prompt');
  const inputElement = document.getElementById('secret-word-input');
  const submitButton = document.getElementById('secret-word-submit');
  const errorElement = document.getElementById('secret-word-error');
  const galleryContentElement = document.getElementById('image-gallery-content');

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const setCookie = (name, value, days) => {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    // Add SameSite=Lax for better security, path=/ to make it site-wide
    document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
     console.log(`Cookie set: ${name}=${value}; expires=${expires}`);
  };

  const showGallery = () => {
    if (promptElement) promptElement.style.display = 'none';
    if (galleryContentElement) galleryContentElement.style.display = 'grid'; // Use grid for layout
    console.log("Gallery access granted.");
    loadGalleryImages(); // Load images now
  };

  const showPrompt = () => {
    if (promptElement) promptElement.style.display = 'block';
    if (galleryContentElement) galleryContentElement.style.display = 'none';
    console.log("Showing secret word prompt.");
  };

  const handleAuthentication = () => {
    if (!inputElement || !errorElement) return;

    const enteredWord = inputElement.value;
    if (enteredWord === CORRECT_SECRET_WORD) {
      setCookie(COOKIE_NAME, 'true', COOKIE_EXPIRATION_DAYS);
      showGallery();
    } else {
      errorElement.style.display = 'block'; // Show error message
      inputElement.value = ''; // Clear input
      inputElement.focus();
      // Redirect to homepage after showing error (as per spec 5.1.3)
      // Add a small delay so the user can see the message
      setTimeout(() => {
         // Use localize_url if available globally or construct manually
         const homeUrl = document.documentElement.lang === 'en' ? '/en/' : '/';
         window.location.href = homeUrl;
         console.log("Incorrect secret word, redirecting home.");
      }, 1500); // 1.5 second delay
    }
  };

  // --- Gallery Loading and Modal Logic ---
  const modal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-image');
  const captionText = document.getElementById('modal-caption');
  const closeModalBtn = document.querySelector('.close-modal-btn');

  const openModal = (imgPath, imgName) => {
    if (!modal || !modalImg || !captionText) return;
    modal.style.display = "block";
    modalImg.src = imgPath;
    captionText.innerHTML = imgName;
    // Add class for animation after display is set to block
    setTimeout(() => modal.classList.add('visible'), 10);
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('visible');
    // Wait for animation to finish before hiding
    setTimeout(() => {
        modal.style.display = "none";
        modalImg.src = ""; // Clear image src
    }, 300); // Match CSS transition duration
  };

  const loadGalleryImages = () => {
    const imageDataScript = document.getElementById('gallery-image-data');
    const galleryContainer = document.getElementById('image-gallery-content');

    if (!imageDataScript || !galleryContainer) {
      console.error("Image data script or gallery container not found.");
      if(galleryContainer) galleryContainer.innerHTML = '<p>Error loading gallery data.</p>';
      return;
    }

    try {
      const images = JSON.parse(imageDataScript.textContent);
      galleryContainer.innerHTML = ''; // Clear loading message

      if (images.length === 0) {
        galleryContainer.innerHTML = '<p>No images found in the gallery yet.</p>';
        return;
      }

      // Intersection Observer for Lazy Loading
      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.getAttribute('data-src');
            img.setAttribute('src', src);
            img.removeAttribute('data-src'); // Remove data-src attribute
            img.classList.add('loaded'); // Add class for potential fade-in effect
            observer.unobserve(img); // Stop observing once loaded
          }
        });
      }, { rootMargin: "0px 0px 100px 0px" }); // Load images 100px before they enter viewport

      images.forEach(image => {
        const imgElement = document.createElement('img');
        imgElement.setAttribute('data-src', image.path); // Store real path in data-src
        imgElement.alt = image.name;
        imgElement.classList.add('gallery-thumbnail');
        // Set a placeholder src or leave empty for background/CSS handling
        // imgElement.src = 'placeholder.png';

        imgElement.addEventListener('click', () => openModal(image.path, image.name));

        galleryContainer.appendChild(imgElement);
        observer.observe(imgElement); // Observe the image for lazy loading
      });

    } catch (e) {
      console.error("Error parsing gallery image data:", e);
      galleryContainer.innerHTML = '<p>Error loading gallery data.</p>';
    }
  };

  // --- Initialization ---
  if (!promptElement || !galleryContentElement || !submitButton || !inputElement) {
    console.warn("Required elements for secret word auth not found on this page.");
    return; // Don't run if elements aren't present
  }

   // Add modal close listeners only if modal exists
   if (modal && closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
    // Close modal if clicking outside the image content
    modal.addEventListener('click', (event) => {
      if (event.target === modal) { // Check if the click is on the modal background itself
        closeModal();
      }
    });
    // Close modal on Escape key press
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
   }


  // Check if the access cookie exists and is valid
  const accessGranted = getCookie(COOKIE_NAME);

  if (accessGranted === 'true') {
    showGallery();
  } else {
    showPrompt();
    // Add event listener for the submit button
    submitButton.addEventListener('click', handleAuthentication);
    // Add event listener for Enter key in the input field
    inputElement.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault(); // Prevent form submission if it were in a form
        handleAuthentication();
      }
    });
  }

  console.log("Secret word auth script loaded.");

})(); // IIFE
