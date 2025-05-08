import { showFormattedDate } from "../../utils";
import HomePresenter from "./home-presenter";
import * as DicodingAPI from "../../data/api";

export default class HomePage {
  #presenter = null;

  async render() {
    return `
      <div class="home-hero" role="banner">
        <div class="home-hero-overlay" aria-hidden="true"></div>
        <div class="container">
          <div class="home-hero-content">
            <h1>Share Your Stories</h1>
            <p>Capture and share moments with the Dicoding community</p>
            <a href="#/add" class="btn home-hero-btn" aria-label="Create a new story">Create Story</a>
          </div>
        </div>
      </div>
      
      <section class="container home-content" aria-labelledby="recent-stories-heading">
        <div class="home-section-header">
          <h2 id="recent-stories-heading">Recent Stories</h2>
          <a href="#/map" class="btn-outline" aria-label="View stories on map">View Map</a>
        </div>
        
        <div id="stories-container" role="region" aria-live="polite">
          <div class="loader-container" role="status">
            <div class="loader"></div>
            <span class="sr-only">Loading stories...</span>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    // Add the sr-only class if it doesn't exist
    this.addAccessibilityStyles();

    this.#presenter = new HomePresenter({
      view: this,
      model: DicodingAPI,
    });

    await this.#presenter.loadStories();
  }

  // View methods called by the presenter
  showLoginRequired() {
    const storiesContainer = document.getElementById("stories-container");
    storiesContainer.innerHTML = `
      <div class="alert alert-error" role="alert">
        <p>You need to login to view stories. <a href="#/login">Login here</a> or <a href="#/register">Register</a></p>
      </div>
    `;
  }

  showEmptyStories() {
    const storiesContainer = document.getElementById("stories-container");
    storiesContainer.innerHTML = `
      <div class="alert" role="alert">
        <p>No stories found. Be the first to <a href="#/add">create a story!</a></p>
      </div>
    `;
  }

  showError(message) {
    const storiesContainer = document.getElementById("stories-container");
    storiesContainer.innerHTML = `
      <div class="alert alert-error" role="alert">
        <p>${message || "Failed to load stories. Please try again later."}</p>
      </div>
    `;
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

  displayStories(stories) {
    const storiesContainer = document.getElementById("stories-container");

    const storiesHtml = stories
      .map(
        (story) => `
      <article class="story-card" style="view-transition-name: story-${
        story.id
      }" aria-labelledby="story-title-${story.id}">
        <figure class="story-image-container">
          <img 
            src="${story.photoUrl}" 
            alt="Story image by ${story.name}" 
            class="story-image"
          />
        </figure>
        <div class="story-content">
          <h3 class="story-title" id="story-title-${story.id}">${
          story.name
        }</h3>
          <p class="story-description">${this.truncateText(
            story.description,
            100
          )}</p>
          <div class="story-meta">
            <time class="story-date" datetime="${new Date(
              story.createdAt
            ).toISOString()}">
              <span class="story-date-icon" aria-hidden="true">📅</span> ${showFormattedDate(
                story.createdAt
              )}
            </time>
            <a href="#/detail/${
              story.id
            }" class="btn btn-outline" aria-label="Read more about ${
          story.name
        }'s story">Read More</a>
          </div>
        </div>
      </article>
    `
      )
      .join("");

    storiesContainer.innerHTML = `
      <div class="story-list">
        ${storiesHtml}
      </div>
    `;
  }

  truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  }
}
