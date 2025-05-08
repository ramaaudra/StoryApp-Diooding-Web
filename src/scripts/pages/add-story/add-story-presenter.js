import { getToken } from "../../utils/auth";
import * as DicodingAPI from "../../data/api";

export default class AddStoryPresenter {
  #view;
  #model;

  constructor({ view, model = DicodingAPI }) {
    this.#view = view;
    this.#model = model;
  }

  checkAuth() {
    const token = getToken();

    if (!token) {
      this.#view.showLoginRequired();
      return false;
    }

    return true;
  }

  async createStory(description, photo, location) {
    const token = getToken();

    if (!token) {
      this.#view.showLoginRequired();
      return false;
    }

    try {
      this.#view.setLoading(true);

      const response = await this.#model.addStory({
        description,
        photo,
        lat: location?.lat,
        lon: location?.lon,
        token,
      });

      if (response.error) {
        throw new Error(response.message);
      }

      this.#view.showSuccess(
        "Story created successfully! Redirecting to home..."
      );

      setTimeout(() => {
        window.location.hash = "#/";
      }, 2000);

      return true;
    } catch (error) {
      console.error("createStory: error:", error);
      this.#view.showError(
        error.message || "Failed to create story. Please try again."
      );
      return false;
    } finally {
      this.#view.setLoading(false);
    }
  }

  validateFormData(description, imageFile) {
    if (!imageFile) {
      this.#view.showError("Please capture a photo or upload an image.");
      return false;
    }

    if (!description.trim()) {
      this.#view.showError("Please enter a story description.");
      return false;
    }

    return true;
  }
}
