import RegisterPresenter from "./register-presenter";
import * as DicodingAPI from "../../data/api";

export default class RegisterPage {
  #presenter = null;

  async render() {
    return `
      <section class="container">
        <div class="auth-container">
          <h2 class="form-title">Register for Dicoding Story</h2>
          
          <div id="alert-container"></div>
          
          <form id="register-form">
            <div class="form-group">
              <label for="name">Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                class="form-control" 
                required 
                autocomplete="name"
                placeholder="Enter your name"
              />
            </div>
            
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
                autocomplete="new-password"
                placeholder="Enter your password (min 8 characters)"
                minlength="8"
              />
            </div>
            
            <button type="submit" class="btn btn-full" id="register-button">
              Register
            </button>
          </form>
          
          <div class="form-footer">
            <p>Already have an account? <a href="#/login">Login</a></p>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new RegisterPresenter({
      view: this,
      model: DicodingAPI,
    });

    this.attachFormListener();
  }

  attachFormListener() {
    const registerForm = document.getElementById("register-form");

    registerForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      await this.#presenter.register(name, email, password);
    });
  }

  setLoading(isLoading) {
    const registerButton = document.getElementById("register-button");

    if (isLoading) {
      registerButton.disabled = true;
      registerButton.textContent = "Registering...";
    } else {
      registerButton.disabled = false;
      registerButton.textContent = "Register";
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
