# E-Commerce Frontend

This is the frontend implementation of the Telusko E-Commerce application, built with React and Vite.

## 🚀 Tech Stack

-   **Framework**: React (Vite)
-   **Styling**: Bootstrap & Vanilla CSS
-   **API Client**: Axios
-   **Routing**: React Router DOM

## 🛠️ Setup Instructions

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Configuration**:
    Check `src/axios.jsx` to ensure the `baseURL` matches your backend server address (default: `http://localhost:8080/api`).

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## 📂 Project Structure

-   `src/components`: UI components like Navbar, Home, and Product forms.
-   `src/axios.jsx`: Centralized Axios configuration for API calls.
-   `src/App.jsx`: Main application routing and layout.

## ✨ Features

-   Dynamic product listing with categories and brands.
-   Real-time product search.
-   Responsive design using Bootstrap.
-   Seamless connection to Spring Boot backend.
