import { getToken } from "../../utils/auth";
import * as DicodingAPI from "../../data/api";

export default class DetailPresenter {
  #view;
  #model;

  constructor({ view, model = DicodingAPI }) {
    this.#view = view;
    this.#model = model;
  }

  async loadStoryDetail(id) {
    if (!id) {
      this.#view.showMissingIdError();
      return;
    }

    const token = getToken();

    if (!token) {
      this.#view.showLoginRequired();
      return;
    }

    try {
      const response = await this.#model.getStoryDetail({ id, token });

      if (response.error) {
        throw new Error(response.message);
      }

      this.#view.displayStoryDetail(response.story);

      // Initialize map if coordinates are available
      if (response.story.lat && response.story.lon) {
        this.#view.initMap(response.story);
      }
    } catch (error) {
      console.error("loadStoryDetail: error:", error);
      this.#view.showError(error.message);
    }
  }
}
