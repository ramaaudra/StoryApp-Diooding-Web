import { showFormattedDate } from "../../utils";
import DetailPresenter from "./detail-presenter";
import * as DicodingAPI from "../../data/api";
import CONFIG from "../../config";

export default class DetailPage {
  #presenter = null;

  async render() {
    return `
      <section class="container" aria-labelledby="story-title">
        <div id="story-detail-container">
          <div class="loader-container" role="status" aria-live="polite">
            <div class="loader"></div>
            <span class="sr-only">Loading story details...</span>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender(params) {
    this.#presenter = new DetailPresenter({
      view: this,
      model: DicodingAPI,
    });

    await this.#presenter.loadStoryDetail(params?.id);
  }

  showMissingIdError() {
    const storyDetailContainer = document.getElementById(
      "story-detail-container"
    );
    storyDetailContainer.innerHTML = `
      <div class="alert alert-error" role="alert">
        <p>Story ID is missing. <a href="#/">Go back to home</a></p>
      </div>
    `;
  }

  showLoginRequired() {
    const storyDetailContainer = document.getElementById(
      "story-detail-container"
    );
    storyDetailContainer.innerHTML = `
      <div class="alert alert-error" role="alert">
        <p>You need to login to view story details. <a href="#/login">Login here</a> or <a href="#/register">Register</a></p>
      </div>
    `;
  }

  showError(message) {
    const storyDetailContainer = document.getElementById(
      "story-detail-container"
    );
    storyDetailContainer.innerHTML = `
      <div class="alert alert-error" role="alert">
        <p>${
          message || "Failed to load story details. Please try again later."
        }</p>
      </div>
    `;
  }

  displayStoryDetail(story) {
    const storyDetailContainer = document.getElementById(
      "story-detail-container"
    );

    storyDetailContainer.innerHTML = `
      <div class="detail-container" style="view-transition-name: story-${
        story.id
      }">
        <a href="#/" class="btn btn-outline" aria-label="Back to story list">← Back to Stories</a>
        
        <article class="detail-content">
          <h1 class="detail-title" id="story-title">Story by ${story.name}</h1>
          
          <div class="detail-meta">
            <time datetime="${new Date(
              story.createdAt
            ).toISOString()}">${showFormattedDate(story.createdAt)}</time>
          </div>
          
          <figure>
            <img 
              src="${story.photoUrl}" 
              alt="Photo shared by ${story.name} on ${showFormattedDate(
      story.createdAt
    )}" 
              class="detail-image"
            />
            <figcaption class="sr-only">Story photo shared by ${
              story.name
            }</figcaption>
          </figure>
          
          <div class="detail-description">
            <p>${story.description}</p>
          </div>
          
          ${
            story.lat && story.lon
              ? `
            <div class="map-container" id="map-container">
              <h3 id="map-heading">Story Location</h3>
              <div id="map" role="img" aria-labelledby="map-heading" aria-describedby="map-description"></div>
              <p id="map-description" class="sr-only">Map showing the location where this story was created at coordinates ${story.lat}, ${story.lon}</p>
            </div>
          `
              : ""
          }
        </article>
      </div>
    `;

    // Add the sr-only class if it doesn't exist
    this.addAccessibilityStyles();
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

  async initMap(story) {
    // Dynamically load Leaflet JS
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
    script.crossOrigin = "";
    document.head.appendChild(script);

    script.onload = () => {
      // Create map instance
      const map = L.map("map").setView([story.lat, story.lon], 13);

      // Add tile layer
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      // Add marker with popup
      const marker = L.marker([story.lat, story.lon]).addTo(map);
      marker
        .bindPopup(
          `<b>Story by ${story.name}</b><br>${story.description.substring(
            0,
            50
          )}...`
        )
        .openPopup();

      // Force map to update its size
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    };
  }
}
