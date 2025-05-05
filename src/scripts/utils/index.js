/**
 * Format a date string to a more readable format
 * @param {string} date - Date string to format
 * @returns {string} Formatted date string (e.g., "January 1, 2023")
 */
export function showFormattedDate(date) {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(date).toLocaleDateString("en-US", options);
}

/**
 * Apply a page transition animation
 * @param {Function} updateCallback - Function to update the DOM
 * @param {string} animationType - The type of animation to apply ('fade', 'slide', 'zoom')
 */
export async function applyPageTransition(
  updateCallback,
  animationType = "fade"
) {
  // Check if the browser supports the View Transitions API
  if (document.startViewTransition) {
    try {
      // Apply the animation based on the requested type
      document.documentElement.dataset.transitionType = animationType;

      // Start the view transition
      const transition = document.startViewTransition(() => {
        updateCallback();
      });

      // Wait for the transition to complete
      await transition.finished;

      // Clean up
      delete document.documentElement.dataset.transitionType;
    } catch (error) {
      console.error("Error during view transition:", error);
      // Fallback if transition fails
      updateCallback();
    }
  } else {
    // Fallback for browsers that don't support View Transitions API
    updateCallback();
  }
}

/**
 * Add a CSS class to trigger animation on an element
 * @param {HTMLElement} element - The element to animate
 * @param {string} animationClass - The CSS class that defines the animation
 * @param {number} duration - Duration of the animation in milliseconds
 */
export function animateElement(element, animationClass, duration = 500) {
  if (!element) return;

  element.classList.add(animationClass);

  // Remove the class after the animation completes
  setTimeout(() => {
    element.classList.remove(animationClass);
  }, duration);
}

/**
 * Pause execution for a specified amount of time
 * @param {number} time - Time to sleep in milliseconds
 * @returns {Promise<void>} A promise that resolves after the specified time
 */
export function sleep(time = 1000) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
