export default class AboutPage {
  async render() {
    return `
      <section class="container about-page">
        <div class="about-hero">
          <div class="about-overlay"></div>
          <div class="about-hero-content">
            <h1>About Dicoding Story</h1>
            <p class="about-tagline">Share your moments with the Dicoding community</p>
          </div>
        </div>
        
        <div class="about-container">
          <div class="about-section">
            <div class="about-intro">
              <i class="about-icon">📖</i>
              <div>
                <h2>Our Story</h2>
                <p>Dicoding Story is a platform for sharing stories and experiences within the Dicoding community. Users can create and view stories with images and location data, connecting developers across Indonesia through shared moments and experiences.</p>
              </div>
            </div>
          </div>

          <div class="about-section features-section">
            <h2><i class="about-icon">✨</i> Features</h2>
            <div class="features-grid">
              <div class="feature-card">
                <div class="feature-icon">📱</div>
                <h3>Browse Stories</h3>
                <p>View stories from Dicoding users with a beautiful, responsive interface</p>
              </div>
              <div class="feature-card">
                <div class="feature-icon">📷</div>
                <h3>Camera Integration</h3>
                <p>Create stories with photos taken directly from your device camera</p>
              </div>
              <div class="feature-card">
                <div class="feature-icon">🗺️</div>
                <h3>Location Sharing</h3>
                <p>Add location data to your stories and view them on an interactive map</p>
              </div>
              <div class="feature-card">
                <div class="feature-icon">👤</div>
                <h3>User Accounts</h3>
                <p>Create an account to start sharing your stories with the community</p>
              </div>
            </div>
          </div>
          
          <div class="about-section tech-section">
            <h2><i class="about-icon">🔧</i> Technologies Used</h2>
            <div class="tech-grid">
              <div class="tech-item">
                <span class="tech-badge">SPA</span>
                <p>Single Page Application architecture</p>
              </div>
              <div class="tech-item">
                <span class="tech-badge">MVP</span>
                <p>Model-View-Presenter design pattern</p>
              </div>
              <div class="tech-item">
                <span class="tech-badge">View Transitions</span>
                <p>Smooth page transitions</p>
              </div>
              <div class="tech-item">
                <span class="tech-badge">Leaflet.js</span>
                <p>Interactive maps</p>
              </div>
              <div class="tech-item">
                <span class="tech-badge">MediaDevices API</span>
                <p>Camera functionality</p>
              </div>
              <div class="tech-item">
                <span class="tech-badge">Accessibility</span>
                <p>Skip-to-content and semantic HTML</p>
              </div>
            </div>
          </div>
          
          <div class="about-section api-section">
            <h2><i class="about-icon">🔌</i> API Information</h2>
            <div class="api-box">
              <p>This application uses the Dicoding Story API to manage users and stories.</p>
              <div class="api-url">
                <span>API Base URL:</span>
                <code>https://story-api.dicoding.dev/v1</code>
              </div>
            </div>
          </div>
          
          <div class="about-section developer-section">
            <h2><i class="about-icon">👨‍💻</i> Developer Information</h2>
            <div class="developer-info">
              <p>This application was created as part of the Dicoding course requirements for web development.</p>
              <p>© ${new Date().getFullYear()} Dicoding Story App</p>
              <div class="developer-links">
                <a href="https://www.dicoding.com" target="_blank" class="btn btn-outline">Visit Dicoding</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    // Not needed for this static page
  }
}
