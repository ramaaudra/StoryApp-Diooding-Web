import LoginPresenter from "./login-presenter";
import * as DicodingAPI from "../../data/api";

export default class LoginPage {
  #presenter = null;

  async render() {
    return `
      <section class="container">
        <div class="auth-container">
          <h2 class="form-title">Login to Dicoding Story</h2>
          
          <div id="alert-container"></div>
          
          <form id="login-form">
            <div class="form-group">
              <label for="email">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                class="form-control" 
                required 
                autocomplete="email"
                placeholder="Enter your email"
              />
            </div>
            
            <div class="form-group">
              <label for="password">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                class="form-control" 
                required 
                autocomplete="current-password"
                placeholder="Enter your password"
                minlength="8"
              />
            </div>
            
            <button type="submit" class="btn btn-full" id="login-button">
              Login
            </button>
          </form>
          
          <div class="form-footer">
            <p>Don't have an account? <a href="#/register">Register</a></p>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new LoginPresenter({
      view: this,
      model: DicodingAPI,
    });

    this.attachFormListener();
  }

  attachFormListener() {
    const loginForm = document.getElementById("login-form");

    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      await this.#presenter.login(email, password);
    });
  }

  setLoading(isLoading) {
    const loginButton = document.getElementById("login-button");

    if (isLoading) {
      loginButton.disabled = true;
      loginButton.textContent = "Logging in...";
    } else {
      loginButton.disabled = false;
      loginButton.textContent = "Login";
    }
  }

  showSuccess(message) {
    const alertContainer = document.getElementById("alert-container");
    alertContainer.innerHTML = `
      <div class="alert alert-success">
        <p>${message}</p>
      </div>
    `;
  }

  showError(message) {
    const alertContainer = document.getElementById("alert-container");
    alertContainer.innerHTML = `
      <div class="alert alert-error">
        <p>${message}</p>
      </div>
    `;
  }
}
