import { addStory } from "../../data/api";
import { getToken } from "../../utils/auth";

export default class AddStoryPage {
  #map = null;
  #marker = null;
  #selectedLocation = null;
  #mediaStream = null;
  #locationWatchId = null;

  async render() {
    return `
      <section class="container" aria-labelledby="add-story-heading">
        <div class="form-container">
          <h2 class="form-title" id="add-story-heading">Add New Story</h2>
          
          <div id="alert-container" role="alert" aria-live="assertive"></div>
          
          <form id="add-story-form" aria-describedby="form-description">
            <p id="form-description" class="sr-only">Fill in the form below to create a new story with a photo and optional location data.</p>
            
            <!-- Photo Input Options -->
            <div class="photo-options">
              <div class="option-tabs" role="tablist">
                <button 
                  type="button" 
                  class="option-tab active" 
                  data-tab="camera"
                  id="camera-tab-btn" 
                  role="tab"
                  aria-selected="true" 
                  aria-controls="camera-tab">Camera</button>
                <button 
                  type="button" 
                  class="option-tab" 
                  data-tab="gallery"
                  id="gallery-tab-btn" 
                  role="tab" 
                  aria-selected="false" 
                  aria-controls="gallery-tab">Gallery</button>
              </div>
              
              <!-- Camera Section -->
              <div class="form-group tab-content" id="camera-tab" role="tabpanel" aria-labelledby="camera-tab-btn">
                <label for="camera-stream">Take a Photo</label>
                <div class="camera-container">
                  <div class="camera-preview-wrapper">
                    <div class="camera-preview" id="camera-preview">
                      <video id="camera-stream" autoplay playsinline aria-label="Camera preview"></video>
                      <canvas id="camera-canvas" style="display: none;" aria-hidden="true"></canvas>
                      <img id="captured-image" class="captured-image" style="display: none;" alt="Your captured photo for the story" aria-live="polite">
                    </div>
                  </div>
                  <div class="camera-controls">
                    <button type="button" id="btn-start-camera" class="camera-btn">Open Camera</button>
                    <button type="button" id="btn-capture" class="camera-btn" disabled>Take Photo</button>
                    <button type="button" id="btn-retake" class="camera-btn" style="display: none;">Retake</button>
                  </div>
                </div>
              </div>
              
              <!-- File Upload Section -->
              <div class="form-group tab-content" id="gallery-tab" style="display: none;" role="tabpanel" aria-labelledby="gallery-tab-btn">
                <label for="file-upload">Upload Photo</label>
                <div class="file-upload-container">
                  <input type="file" id="file-upload" accept="image/*" class="file-input" aria-describedby="file-upload-help">
                  <label for="file-upload" class="file-upload-label">
                    <span class="file-upload-icon" aria-hidden="true">📁</span>
                    <span class="file-upload-text">Choose a file or drag it here</span>
                  </label>
                  <p id="file-upload-help" class="sr-only">Accepted file types: JPG, PNG, GIF. Maximum file size: 5 MB.</p>
                  <div class="file-preview-container" style="display: none;">
                    <img id="file-preview" class="file-preview-image" alt="Your uploaded photo for the story">
                    <button type="button" id="btn-remove-file" class="camera-btn">Remove</button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Location Section -->
            <div class="form-group">
              <label id="location-label">Location</label>
              <div class="location-actions">
                <button type="button" id="get-current-location" class="btn" aria-describedby="location-help">
                  <i class="fas fa-location-arrow" aria-hidden="true"></i> Use My Current Location
                </button>
                <p id="location-help" class="sr-only">Adds your current geographic coordinates to the story</p>
                <div id="location-status" role="status" aria-live="polite"></div>
              </div>
              <div class="map-container" id="location-map-container" aria-label="Interactive map to select location">
                <div id="map"></div>
              </div>
              <p id="selected-location-text" aria-live="polite">No location selected. Click on the map to select a location or use your current location.</p>
            </div>
            
            <!-- Description -->
            <div class="form-group">
              <label for="description">Story Description</label>
              <textarea
                id="description"
                name="description"
                rows="4"
                class="form-control"
                required
                placeholder="Write your story here..."
                aria-required="true"
              ></textarea>
            </div>
            
            <button type="submit" class="btn btn-full" id="submit-button">
              Create Story
            </button>
          </form>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const token = getToken();
    const alertContainer = document.getElementById("alert-container");

    if (!token) {
      alertContainer.innerHTML = `
        <div class="alert alert-error">
          <p>You need to login to add stories. <a href="#/login">Login here</a> or <a href="#/register">Register</a></p>
        </div>
      `;
      return;
    }

    // Add styles for screen reader only text
    this.addAccessibilityStyles();

    this.initCamera();
    this.initFileUpload();
    this.initTabSwitching();
    this.initMap();
    this.initLocationFeatures();
    this.setupForm();
  }

  // Add styles for screen reader only text
  addAccessibilityStyles() {
    // Add CSS for screen reader only elements if not already present
    if (!document.getElementById("sr-only-styles")) {
      const style = document.createElement("style");
      style.id = "sr-only-styles";
      style.innerHTML = `
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }
      `;
      document.head.appendChild(style);
    }
  }

  initTabSwitching() {
    const tabs = document.querySelectorAll(".option-tab");
    const tabContents = document.querySelectorAll(".tab-content");

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        // Remove active class from all tabs
        tabs.forEach((t) => {
          t.classList.remove("active");
          t.setAttribute("aria-selected", "false");
        });

        // Add active class to clicked tab
        tab.classList.add("active");
        tab.setAttribute("aria-selected", "true");

        // Hide all tab contents
        tabContents.forEach((content) => {
          content.style.display = "none";
          content.setAttribute("aria-hidden", "true");
        });

        // Show corresponding tab content
        const tabId = tab.getAttribute("data-tab");
        const activeTabContent = document.getElementById(`${tabId}-tab`);
        activeTabContent.style.display = "block";
        activeTabContent.setAttribute("aria-hidden", "false");

        // If switching to camera tab, reset camera
        if (tabId === "camera") {
          this.stopCameraStream();
          document.getElementById("btn-start-camera").disabled = false;
          document.getElementById("btn-capture").disabled = true;
        }
      });
    });
  }

  initCamera() {
    const startButton = document.getElementById("btn-start-camera");
    const captureButton = document.getElementById("btn-capture");
    const retakeButton = document.getElementById("btn-retake");
    const videoElement = document.getElementById("camera-stream");
    const canvasElement = document.getElementById("camera-canvas");
    const capturedImage = document.getElementById("captured-image");

    startButton.addEventListener("click", async () => {
      try {
        this.#mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment", // Use back camera if available
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        videoElement.srcObject = this.#mediaStream;
        videoElement.style.display = "block";
        capturedImage.style.display = "none";

        startButton.disabled = true;
        captureButton.disabled = false;
        retakeButton.style.display = "none";
      } catch (error) {
        console.error("Error accessing camera:", error);
        const alertContainer = document.getElementById("alert-container");
        alertContainer.innerHTML = `
          <div class="alert alert-error">
            <p>Failed to access camera. Please ensure you have granted camera permissions.</p>
          </div>
        `;
      }
    });

    captureButton.addEventListener("click", () => {
      const context = canvasElement.getContext("2d");

      // Set canvas dimensions to match video dimensions
      canvasElement.width = videoElement.videoWidth;
      canvasElement.height = videoElement.videoHeight;

      // Draw the current frame from video to canvas
      context.drawImage(
        videoElement,
        0,
        0,
        canvasElement.width,
        canvasElement.height
      );

      // Convert canvas to data URL and display in image element
      const imageDataUrl = canvasElement.toDataURL("image/jpeg");
      capturedImage.src = imageDataUrl;
      capturedImage.style.display = "block";
      videoElement.style.display = "none";

      // Stop camera stream
      this.stopCameraStream();

      // Update button states
      captureButton.disabled = true;
      retakeButton.style.display = "inline-block";
      startButton.disabled = false;
    });

    retakeButton.addEventListener("click", () => {
      // Reset the captured image
      capturedImage.src = "";
      capturedImage.style.display = "none";

      // Reset buttons
      retakeButton.style.display = "none";
      startButton.disabled = false;
      captureButton.disabled = true;
    });
  }

  initFileUpload() {
    const fileInput = document.getElementById("file-upload");
    const filePreview = document.getElementById("file-preview");
    const previewContainer = document.querySelector(".file-preview-container");
    const removeButton = document.getElementById("btn-remove-file");
    const fileUploadLabel = document.querySelector(".file-upload-label");

    fileInput.addEventListener("change", (event) => {
      const file = event.target.files[0];

      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();

        reader.onload = (e) => {
          filePreview.src = e.target.result;
          previewContainer.style.display = "block";
          fileUploadLabel.style.display = "none";
        };

        reader.readAsDataURL(file);
      }
    });

    // Enable drag and drop
    const dropArea = document.querySelector(".file-upload-container");

    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      dropArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    }

    ["dragenter", "dragover"].forEach((eventName) => {
      dropArea.addEventListener(
        eventName,
        () => {
          dropArea.classList.add("highlight");
        },
        false
      );
    });

    ["dragleave", "drop"].forEach((eventName) => {
      dropArea.addEventListener(
        eventName,
        () => {
          dropArea.classList.remove("highlight");
        },
        false
      );
    });

    dropArea.addEventListener(
      "drop",
      (e) => {
        const file = e.dataTransfer.files[0];

        if (file && file.type.startsWith("image/")) {
          fileInput.files = e.dataTransfer.files;

          const reader = new FileReader();
          reader.onload = (e) => {
            filePreview.src = e.target.result;
            previewContainer.style.display = "block";
            fileUploadLabel.style.display = "none";
          };

          reader.readAsDataURL(file);
        }
      },
      false
    );

    // Remove button functionality
    removeButton.addEventListener("click", () => {
      fileInput.value = "";
      filePreview.src = "";
      previewContainer.style.display = "none";
      fileUploadLabel.style.display = "flex";
    });
  }

  stopCameraStream() {
    if (this.#mediaStream) {
      this.#mediaStream.getTracks().forEach((track) => {
        track.stop();
      });
      this.#mediaStream = null;
    }
  }

  async initMap() {
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
    script.crossOrigin = "";
    document.head.appendChild(script);

    script.onload = () => {
      this.#map = L.map("map").setView([-0.7893, 113.9213], 5);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(this.#map);

      this.#map.on("click", (e) => {
        this.updateSelectedLocation(e.latlng.lat, e.latlng.lng);
      });

      setTimeout(() => {
        this.#map.invalidateSize();
      }, 100);
    };
  }

  initLocationFeatures() {
    const getCurrentLocationBtn = document.getElementById(
      "get-current-location"
    );
    const locationStatus = document.getElementById("location-status");

    getCurrentLocationBtn.addEventListener("click", () => {
      if (!navigator.geolocation) {
        locationStatus.innerHTML = `
          <div class="alert alert-error">
            <p><i class="fas fa-exclamation-triangle"></i> Geolocation is not supported by your browser</p>
          </div>
        `;
        return;
      }

      locationStatus.innerHTML = `
        <div class="location-loading">
          <span class="loader-small"></span> Getting your location...
        </div>
      `;
      getCurrentLocationBtn.disabled = true;

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // Update the selected location and map marker
          this.updateSelectedLocation(latitude, longitude);

          // Center and zoom the map to the user's location
          this.#map.setView([latitude, longitude], 15);

          locationStatus.innerHTML = `
            <div class="alert alert-success">
              <p><i class="fas fa-check-circle"></i> Location successfully obtained!</p>
            </div>
          `;
          getCurrentLocationBtn.disabled = false;

          // Clear the success message after a few seconds
          setTimeout(() => {
            locationStatus.innerHTML = "";
          }, 3000);
        },
        (error) => {
          let errorMessage;
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage =
                "Location permission denied. Please allow access to your location.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage = "Request to get location timed out.";
              break;
            default:
              errorMessage = "An unknown error occurred getting your location.";
          }

          locationStatus.innerHTML = `
            <div class="alert alert-error">
              <p><i class="fas fa-exclamation-triangle"></i> ${errorMessage}</p>
            </div>
          `;
          getCurrentLocationBtn.disabled = false;
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  }

  updateSelectedLocation(lat, lng) {
    this.#selectedLocation = {
      lat: lat,
      lon: lng,
    };

    document.getElementById("selected-location-text").innerHTML = `
      <span>Selected location: <strong>${lat.toFixed(6)}, ${lng.toFixed(
      6
    )}</strong></span>
      <button type="button" id="clear-location" class="btn-small">
        <i class="fas fa-times"></i> Clear
      </button>
    `;

    // Add event listener to the clear button
    document.getElementById("clear-location").addEventListener("click", (e) => {
      e.preventDefault();
      this.clearLocation();
    });

    if (this.#marker) {
      this.#marker.setLatLng([lat, lng]);
    } else {
      // Create a custom marker with a bouncing animation
      const customIcon = L.divIcon({
        className: "custom-map-marker",
        html: `<div class="marker-pin animate-bounce" style="background-color: var(--accent-color); position: relative; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px rgba(0,0,0,0.3);"><i class="fas fa-map-marker-alt" style="color: white;"></i></div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
      });
      this.#marker = L.marker([lat, lng], { icon: customIcon }).addTo(
        this.#map
      );
    }
  }

  clearLocation() {
    if (this.#marker) {
      this.#map.removeLayer(this.#marker);
      this.#marker = null;
    }
    this.#selectedLocation = null;
    document.getElementById("selected-location-text").textContent =
      "No location selected. Click on the map to select a location or use your current location.";
  }

  setupForm() {
    const form = document.getElementById("add-story-form");
    const submitButton = document.getElementById("submit-button");
    const alertContainer = document.getElementById("alert-container");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const description = document.getElementById("description").value;
      const capturedImage = document.getElementById("captured-image");
      const fileInput = document.getElementById("file-upload");

      const activeTab = document
        .querySelector(".option-tab.active")
        .getAttribute("data-tab");
      let imageFile = null;

      if (activeTab === "camera") {
        if (!capturedImage.src || capturedImage.style.display === "none") {
          alertContainer.innerHTML = `
            <div class="alert alert-error">
              <p>Please capture a photo using the camera.</p>
            </div>
          `;
          return;
        }

        const imageBlob = await fetch(capturedImage.src).then((r) => r.blob());
        imageFile = new File([imageBlob], "story-image.jpg", {
          type: "image/jpeg",
        });
      } else {
        if (!fileInput.files || fileInput.files.length === 0) {
          alertContainer.innerHTML = `
            <div class="alert alert-error">
              <p>Please select an image from your gallery.</p>
            </div>
          `;
          return;
        }

        imageFile = fileInput.files[0];
      }

      if (!description.trim()) {
        alertContainer.innerHTML = `
          <div class="alert alert-error">
            <p>Please enter a story description.</p>
          </div>
        `;
        return;
      }

      try {
        submitButton.disabled = true;
        submitButton.textContent = "Submitting...";

        const token = getToken();
        const response = await addStory({
          description,
          photo: imageFile,
          lat: this.#selectedLocation?.lat,
          lon: this.#selectedLocation?.lon,
          token,
        });

        if (response.error) {
          throw new Error(response.message);
        }

        alertContainer.innerHTML = `
          <div class="alert alert-success">
            <p>Story created successfully! Redirecting to home...</p>
          </div>
        `;

        this.stopCameraStream();

        setTimeout(() => {
          window.location.hash = "#/";
        }, 2000);
      } catch (error) {
        console.error("Error creating story:", error);
        alertContainer.innerHTML = `
          <div class="alert alert-error">
            <p>${
              error.message || "Failed to create story. Please try again."
            }</p>
          </div>
        `;
        submitButton.disabled = false;
        submitButton.textContent = "Create Story";
      }
    });
  }

  async destroy() {
    this.stopCameraStream();
    // Clear any active location watching
    if (this.#locationWatchId) {
      navigator.geolocation.clearWatch(this.#locationWatchId);
    }
  }
}
