import { getStories } from "../../data/api";
import { getToken } from "../../utils/auth";
import { showFormattedDate, animateElement } from "../../utils";

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
          <p><i class="fas fa-exclamation-circle"></i> You need to login to view the story map. <a href="#/login">Login here</a> or <a href="#/register">Register</a></p>
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
            <p><i class="fas fa-info-circle"></i> No stories with location data found. <a href="#/add">Create a story with location!</a></p>
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
            <p><i class="fas fa-info-circle"></i> No stories with location data found. <a href="#/add">Create a story with location!</a></p>
          </div>
        `;
        return;
      }

      mapContent.innerHTML = `
        <div class="map-container large">
          <div id="map"></div>
        </div>
        
        <div class="story-list-summary">
          <h3><i class="fas fa-map-marker-alt"></i> Stories with Location (${storiesWithLocation.length})</h3>
          <p>Explore stories from different places. You can switch between different map styles using the layer control in the top-right corner.</p>
        </div>
      `;

      this.initMap(storiesWithLocation);
    } catch (error) {
      console.error("Error loading story map:", error);
      mapContent.innerHTML = `
        <div class="alert alert-error">
          <p><i class="fas fa-exclamation-triangle"></i> Failed to load story map. Please try again later.</p>
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

      // Define multiple tile layers (map styles)
      const mapLayers = {
        OpenStreetMap: L.tileLayer(
          "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            maxZoom: 19,
            attribution:
              '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          }
        ),

        "Stamen Watercolor": L.tileLayer(
          "https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg",
          {
            attribution:
              'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>. Tiles hosted by <a href="https://stadiamaps.com/">Stadia Maps</a>',
            maxZoom: 16,
          }
        ),

        "Stamen Terrain": L.tileLayer(
          "https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.png",
          {
            attribution:
              'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>. Tiles hosted by <a href="https://stadiamaps.com/">Stadia Maps</a>',
            maxZoom: 18,
            subdomains: "abcd",
          }
        ),

        "ESRI World Imagery": L.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          {
            attribution:
              "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
            maxZoom: 18,
          }
        ),
      };

      // Add the default layer to the map
      mapLayers["OpenStreetMap"].addTo(map);

      // Create layer groups for organization
      const storyMarkers = L.layerGroup();

      // Create custom markers for stories
      stories.forEach((story) => {
        // Create custom icon for better visual appearance
        const customIcon = L.divIcon({
          className: "custom-map-marker",
          html: `<div class="marker-pin" style="background-color: var(--primary-color); position: relative; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px rgba(0,0,0,0.3);"><i class="fas fa-camera" style="color: white;"></i></div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 30],
          popupAnchor: [0, -30],
        });

        const marker = L.marker([story.lat, story.lon], {
          icon: customIcon,
        }).addTo(map);
        storyMarkers.addLayer(marker);

        // Create popup with story information
        const popupContent = `
          <div class="map-popup">
            <h4>${story.name}</h4>
            <p>${this.truncateText(story.description, 50)}</p>
            <img src="${story.photoUrl}" alt="Story by ${
          story.name
        }" style="width: 100%; max-height: 100px; object-fit: cover;">
            <p><i class="far fa-calendar-alt"></i> ${showFormattedDate(
              story.createdAt
            )}</p>
            <a href="#/detail/${
              story.id
            }" class="btn btn-outline">View Details</a>
          </div>
        `;

        marker.bindPopup(popupContent);
      });

      storyMarkers.addTo(map);

      // Set up layer controls
      const overlays = {
        "Story Locations": storyMarkers,
      };

      L.control
        .layers(mapLayers, overlays, {
          collapsed: false, // Expanded by default on desktop
          position: "topright",
        })
        .addTo(map);

      // Add a scale control
      L.control.scale().addTo(map);

      // Force map to update its size
      setTimeout(() => {
        map.invalidateSize();

        // Animate the map appearance
        const mapElement = document.querySelector(".map-container");
        animateElement(mapElement, "animate-fade-in", 800);
      }, 100);
    };
  }

  truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  }
}
