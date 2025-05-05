# 📱 Dicoding Story App

<div align="center">
  <br>
  <p><strong>Share moments with the Dicoding community</strong></p>
  <p>
    <a href="#features">Features</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#technology-stack">Technology Stack</a> •
    <a href="#project-structure">Project Structure</a> •
    <a href="#api-integration">API Integration</a>
  </p>
</div>

## 🌟 Features

Dicoding Story App is a modern web application that allows users to share their stories through photos and text. It includes:

- 📷 **Photo Sharing**: Capture photos using your device camera or upload from gallery
- 🗺️ **Location Tagging**: Add location data to your stories using an interactive map
- 👥 **User Authentication**: Secure login and registration system
- 🔍 **Story Exploration**: Browse stories in list view or on an interactive map
- 📱 **Responsive Design**: Works seamlessly on mobile, tablet, and desktop devices
- 🚀 **Modern Architecture**: Built with contemporary web technologies and best practices

## 🚀 Getting Started

### Prerequisites

- Node.js (v14.0.0 or later)
- npm or yarn package manager

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ramaaudra/dicoding-story-app.git
   cd dicoding-story-app
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

### Building for Production

```bash
npm run build
# or
yarn build
```

The build artifacts will be available in the `dist/` directory.

## 🛠️ Technology Stack

- **Frontend Framework**: Vanilla JavaScript with modern ES6+ features
- **Build Tool**: [Vite](https://vitejs.dev/) for fast development and optimized builds
- **Styling**: Custom CSS with responsive design principles
- **Maps**: [Leaflet.js](https://leafletjs.com/) for interactive maps
- **Authentication**: JWT-based authentication system
- **API Communication**: Fetch API with async/await pattern

## 📂 Project Structure

```
├── src/                  # Source files
│   ├── index.html        # Main HTML entry point
│   ├── public/           # Static assets
│   ├── scripts/          # JavaScript files
│   │   ├── config.js     # Application configuration
│   │   ├── index.js      # Main JavaScript entry point
│   │   ├── data/         # API and data handling
│   │   ├── pages/        # Page components
│   │   ├── routes/       # Routing system
│   │   └── utils/        # Utility functions
│   └── styles/           # CSS styles
├── vite.config.js        # Vite configuration
└── package.json          # Project dependencies and scripts
```

## 🔌 API Integration

The application connects to the Dicoding Story API, which provides endpoints for:

- User registration and login
- Story creation with photos and location data
- Retrieving stories with pagination and filtering options

Authentication is implemented using JWT tokens stored in the browser's local storage.

## 🙏 Acknowledgements

- [Dicoding Indonesia](https://www.dicoding.com/) for providing the API and learning resources
- [Leaflet](https://leafletjs.com/) for the interactive maps
- [Unsplash](https://unsplash.com/) for the beautiful stock images used in the UI

---

<div align="center">
  <p>© 2025 Dicoding Story App</p>
</div>
