import { getToken } from "../../utils/auth";
import * as DicodingAPI from "../../data/api";

export default class HomePresenter {
  #view;
  #model;

  constructor({ view, model = DicodingAPI }) {
    this.#view = view;
    this.#model = model;
  }

  async loadStories() {
    try {
      const token = getToken();

      if (!token) {
        this.#view.showLoginRequired();
        return;
      }

      const response = await this.#model.getStories({ token });

      if (response.error) {
        throw new Error(response.message);
      }

      if (!response.listStory || response.listStory.length === 0) {
        this.#view.showEmptyStories();
        return;
      }

      this.#view.displayStories(response.listStory);
    } catch (error) {
      console.error("loadStories: error:", error);
      this.#view.showError(error.message);
    }
  }
}
