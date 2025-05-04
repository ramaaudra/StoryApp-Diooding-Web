import { getStories } from "../../data/api";
import { showFormattedDate } from "../../utils";
import { getToken, isAuthenticated } from "../../utils/auth";

export default class HomePage {
  async render() {
    return `
      <div class="home-hero">
        <div class="home-hero-overlay"></div>
        <div class="container">
          <div class="home-hero-content">
            <h1>Share Your Stories</h1>
            <p>Capture and share moments with the Dicoding community</p>
            <a href="#/add" class="btn home-hero-btn">Create Story</a>
          </div>
        </div>
      </div>
      
      <section class="container home-content">
        <div class="home-section-header">
          <h2>Recent Stories</h2>
          <a href="#/map" class="btn-outline">View Map</a>
        </div>
        
        <div id="stories-container">
          <div class="loader-container">
            <div class="loader"></div>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const storiesContainer = document.getElementById("stories-container");

    try {
      let token = getToken();

      if (!token) {
        storiesContainer.innerHTML = `
          <div class="alert alert-error">
            <p>You need to login to view stories. <a href="#/login">Login here</a> or <a href="#/register">Register</a></p>
          </div>
        `;
        return;
      }

      const response = await getStories({ token });

      if (response.error) {
        throw new Error(response.message);
      }

      if (!response.listStory || response.listStory.length === 0) {
        storiesContainer.innerHTML = `
          <div class="alert">
            <p>No stories found. Be the first to <a href="#/add">create a story!</a></p>
          </div>
        `;
        return;
      }

      this.renderStories(response.listStory);
    } catch (error) {
      console.error("Error fetching stories:", error);
      storiesContainer.innerHTML = `
        <div class="alert alert-error">
          <p>Failed to load stories. Please try again later.</p>
        </div>
      `;
    }
  }

  renderStories(stories) {
    const storiesContainer = document.getElementById("stories-container");

    const storiesHtml = stories
      .map(
        (story) => `
      <article class="story-card" style="view-transition-name: story-${
        story.id
      }">
        <div class="story-image-container">
          <img 
            src="${story.photoUrl}" 
            alt="Story by ${story.name}" 
            class="story-image"
          />
        </div>
        <div class="story-content">
          <h3 class="story-title">${story.name}</h3>
          <p class="story-description">${this.truncateText(
            story.description,
            100
          )}</p>
          <div class="story-meta">
            <div class="story-date">
              <span class="story-date-icon">📅</span> ${showFormattedDate(
                story.createdAt
              )}
            </div>
            <a href="#/detail/${story.id}" class="btn btn-outline">Read More</a>
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
