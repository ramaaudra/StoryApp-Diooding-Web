import { getStories } from "../../data/api";
import { getToken } from "../../utils/auth";
import { showFormattedDate } from "../../utils";

export default class MapPage {
  async render() {
    return `
      <section class="container">
        <h1>Story Map</h1>
        
        <div id="map-content">
          <div class="loader-container">
            <div class="loader"></div>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const mapContent = document.getElementById("map-content");
    const token = getToken();

    if (!token) {
      mapContent.innerHTML = `
        <div class="alert alert-error">
          <p>You need to login to view the story map. <a href="#/login">Login here</a> or <a href="#/register">Register</a></p>
        </div>
      `;
      return;
    }

    try {
      // Request stories with location data
      const response = await getStories({ token, location: 1 });

      if (response.error) {
        throw new Error(response.message);
      }

      const stories = response.listStory;

      if (!stories || stories.length === 0) {
        mapContent.innerHTML = `
          <div class="alert">
            <p>No stories with location data found. <a href="#/add">Create a story with location!</a></p>
          </div>
        `;
        return;
      }

      // Filter stories with location data
      const storiesWithLocation = stories.filter(
        (story) => story.lat && story.lon
      );

      if (storiesWithLocation.length === 0) {
        mapContent.innerHTML = `
          <div class="alert">
            <p>No stories with location data found. <a href="#/add">Create a story with location!</a></p>
          </div>
        `;
        return;
      }

      mapContent.innerHTML = `
        <div class="map-container large">
          <div id="map"></div>
        </div>
        
        <div class="story-list-summary">
          <h3>Stories with Location (${storiesWithLocation.length})</h3>
        </div>
      `;

      this.initMap(storiesWithLocation);
    } catch (error) {
      console.error("Error loading story map:", error);
      mapContent.innerHTML = `
        <div class="alert alert-error">
          <p>Failed to load story map. Please try again later.</p>
        </div>
      `;
    }
  }

  async initMap(stories) {
    // Dynamically load Leaflet JS
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
    script.crossOrigin = "";
    document.head.appendChild(script);

    script.onload = () => {
      // Find center point for map (average of all coordinates)
      const centerLat =
        stories.reduce((sum, story) => sum + story.lat, 0) / stories.length;
      const centerLon =
        stories.reduce((sum, story) => sum + story.lon, 0) / stories.length;

      // Create map instance
      const map = L.map("map").setView([centerLat, centerLon], 5);

      // Add tile layer
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      // Add markers for all stories
      stories.forEach((story) => {
        const marker = L.marker([story.lat, story.lon]).addTo(map);

        // Create popup with story information
        const popupContent = `
          <div class="map-popup">
            <h4>${story.name}</h4>
            <p>${this.truncateText(story.description, 50)}</p>
            <img src="${story.photoUrl}" alt="Story by ${
          story.name
        }" style="width: 100%; max-height: 100px; object-fit: cover;">
            <p>${showFormattedDate(story.createdAt)}</p>
            <a href="#/detail/${
              story.id
            }" class="btn btn-outline">View Details</a>
          </div>
        `;

        marker.bindPopup(popupContent);
      });

      // Force map to update its size
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    };
  }

  truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  }
}
