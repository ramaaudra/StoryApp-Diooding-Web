import routes from "../routes/routes";
import { getActiveRoute, parseActivePathname } from "../routes/url-parser";
import { getAuth, isAuthenticated } from "../utils/auth";

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;
  #authButton = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;
    this.#authButton = document.querySelector("#auth-button");

    this.#setupDrawer();
    this.#initAuth();
  }

  #setupDrawer() {
    this.#drawerButton.addEventListener("click", () => {
      this.#navigationDrawer.classList.toggle("open");
    });

    document.body.addEventListener("click", (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove("open");
      }

      this.#navigationDrawer.querySelectorAll("a").forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove("open");
        }
      });
    });
  }

  #initAuth() {
    this.#updateAuthButton();
    window.addEventListener("auth-changed", () => {
      this.#updateAuthButton();
    });
  }

  #updateAuthButton() {
    if (isAuthenticated()) {
      const { loginResult } = getAuth();
      this.#authButton.textContent = `Logout (${loginResult.name})`;
      this.#authButton.href = "#/";
      this.#authButton.addEventListener("click", this.#handleLogout);
    } else {
      this.#authButton.textContent = "Login";
      this.#authButton.href = "#/login";
      this.#authButton.removeEventListener("click", this.#handleLogout);
    }
  }

  #handleLogout = (event) => {
    event.preventDefault();
    localStorage.removeItem("dicoding_story_auth");
    window.dispatchEvent(new CustomEvent("auth-changed"));
    window.location.hash = "#/";
  };

  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url];
    const urlParams = parseActivePathname();

    if (!page) {
      this.#content.innerHTML = `<div class="container"><h2>Page Not Found</h2></div>`;
      return;
    }

    try {
      // Use View Transition API if available
      if (document.startViewTransition) {
        await document.startViewTransition(async () => {
          this.#content.innerHTML = await page.render(urlParams);
          await page.afterRender(urlParams);
        }).ready;
      } else {
        this.#content.innerHTML = await page.render(urlParams);
        await page.afterRender(urlParams);
      }
    } catch (error) {
      console.error("Error rendering page:", error);
      this.#content.innerHTML = `
        <div class="container">
          <div class="alert alert-error">
            <p>Failed to load page content. Please try again later.</p>
          </div>
        </div>
      `;
    }
  }
}

export default App;
