import { getToken } from "../../utils/auth";
import * as DicodingAPI from "../../data/api";

export default class MapPresenter {
  #view;
  #model;

  constructor({ view, model = DicodingAPI }) {
    this.#view = view;
    this.#model = model;
  }

  async loadStoriesWithLocation() {
    const token = getToken();

    if (!token) {
      this.#view.showLoginRequired();
      return;
    }

    try {
      // Request stories with location data
      const response = await this.#model.getStories({ token, location: 1 });

      if (response.error) {
        throw new Error(response.message);
      }

      const stories = response.listStory;

      if (!stories || stories.length === 0) {
        this.#view.showEmptyStories();
        return;
      }

      // Filter stories with location data
      const storiesWithLocation = stories.filter(
        (story) => story.lat && story.lon
      );

      if (storiesWithLocation.length === 0) {
        this.#view.showEmptyStoriesWithLocation();
        return;
      }

      this.#view.displayMap(storiesWithLocation);
    } catch (error) {
      console.error("loadStoriesWithLocation: error:", error);
      this.#view.showError(error.message);
    }
  }
}
