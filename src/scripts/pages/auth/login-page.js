import { loginUser } from "../../data/api";
import { saveAuth } from "../../utils/auth";

export default class LoginPage {
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
    const loginForm = document.getElementById("login-form");
    const loginButton = document.getElementById("login-button");
    const alertContainer = document.getElementById("alert-container");

    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        loginButton.disabled = true;
        loginButton.textContent = "Logging in...";

        const response = await loginUser({ email, password });

        if (response.error) {
          throw new Error(response.message);
        }

        // Save auth data to local storage
        saveAuth(response);

        // Dispatch auth changed event
        window.dispatchEvent(new CustomEvent("auth-changed"));

        // Show success message and redirect
        alertContainer.innerHTML = `
          <div class="alert alert-success">
            <p>Login successful. Redirecting to homepage...</p>
          </div>
        `;

        setTimeout(() => {
          window.location.hash = "#/";
        }, 1500);
      } catch (error) {
        console.error("Login error:", error);
        alertContainer.innerHTML = `
          <div class="alert alert-error">
            <p>${error.message || "Failed to login. Please try again."}</p>
          </div>
        `;

        loginButton.disabled = false;
        loginButton.textContent = "Login";
      }
    });
  }
}
