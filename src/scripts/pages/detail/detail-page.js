import { getStoryDetail } from "../../data/api";
import { showFormattedDate } from "../../utils";
import { getToken } from "../../utils/auth";
import CONFIG from "../../config";

export default class DetailPage {
  async render() {
    return `
      <section class="container">
        <div id="story-detail-container">
          <div class="loader-container">
            <div class="loader"></div>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender(params) {
    const storyDetailContainer = document.getElementById(
      "story-detail-container"
    );

    if (!params || !params.id) {
      storyDetailContainer.innerHTML = `
        <div class="alert alert-error">
          <p>Story ID is missing. <a href="#/">Go back to home</a></p>
        </div>
      `;
      return;
    }

    const token = getToken();

    if (!token) {
      storyDetailContainer.innerHTML = `
        <div class="alert alert-error">
          <p>You need to login to view story details. <a href="#/login">Login here</a> or <a href="#/register">Register</a></p>
        </div>
      `;
      return;
    }

    try {
      const response = await getStoryDetail({ id: params.id, token });

      if (response.error) {
        throw new Error(response.message);
      }

      const story = response.story;
      this.renderStoryDetail(story);

      // Initialize map if coordinates are available
      if (story.lat && story.lon) {
        this.initMap(story);
      }
    } catch (error) {
      console.error("Error fetching story detail:", error);
      storyDetailContainer.innerHTML = `
        <div class="alert alert-error">
          <p>Failed to load story details. Please try again later.</p>
        </div>
      `;
    }
  }

  renderStoryDetail(story) {
    const storyDetailContainer = document.getElementById(
      "story-detail-container"
    );

    storyDetailContainer.innerHTML = `
      <div class="detail-container" style="view-transition-name: story-${
        story.id
      }">
        <a href="#/" class="btn btn-outline">← Back to Stories</a>
        
        <div class="detail-content">
          <h1 class="detail-title">Story by ${story.name}</h1>
          
          <div class="detail-meta">
            <span>${showFormattedDate(story.createdAt)}</span>
          </div>
          
          <img 
            src="${story.photoUrl}" 
            alt="Story by ${story.name}" 
            class="detail-image"
          />
          
          <div class="detail-description">
            <p>${story.description}</p>
          </div>
          
          ${
            story.lat && story.lon
              ? `
            <div class="map-container" id="map-container">
              <h3>Story Location</h3>
              <div id="map"></div>
            </div>
          `
              : ""
          }
        </div>
      </div>
    `;
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
