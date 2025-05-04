import { registerUser } from "../../data/api";

export default class RegisterPage {
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
    const registerForm = document.getElementById("register-form");
    const registerButton = document.getElementById("register-button");
    const alertContainer = document.getElementById("alert-container");

    registerForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        registerButton.disabled = true;
        registerButton.textContent = "Registering...";

        const response = await registerUser({ name, email, password });

        if (response.error) {
          throw new Error(response.message);
        }

        // Show success message and redirect
        alertContainer.innerHTML = `
          <div class="alert alert-success">
            <p>Registration successful. Please login with your new account.</p>
          </div>
        `;

        setTimeout(() => {
          window.location.hash = "#/login";
        }, 2000);
      } catch (error) {
        console.error("Registration error:", error);
        alertContainer.innerHTML = `
          <div class="alert alert-error">
            <p>${error.message || "Failed to register. Please try again."}</p>
          </div>
        `;

        registerButton.disabled = false;
        registerButton.textContent = "Register";
      }
    });
  }
}
