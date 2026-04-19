# E-Commerce Backend API

This is a Spring Boot REST API for managing products in the Telusko E-Commerce application.

## 🚀 Tech Stack

-   **Java**: 17+
-   **Framework**: Spring Boot 3
-   **Data Access**: Spring Data JPA
-   **Database**: MySQL
-   **Build Tool**: Maven

## 🛠️ Setup Instructions

1.  **Configure Database**:
    -   Create a MySQL database named `productdb`.
    -   Update `src/main/resources/application.properties` with your MySQL username and password.

2.  **Build and Run**:
    ```bash
    ./mvnw spring-boot:run
    ```

## 📡 API Endpoints

### Products CRUD
-   `GET /api/products`: Retrieve all products.
-   `GET /api/products/{id}`: Retrieve a specific product.
-   `POST /api/products`: Add a new product (Multipart support for images).
-   `PUT /api/products/{id}`: Update an existing product.
-   `DELETE /api/products/{id}`: Delete a product.

### Search & Filtering
-   `GET /api/products/search?keyword={key}`: Search products by name, brand, or category.

### Pagination (New)
-   `GET /api/products/page?page={#}&size={#}&sortBy={field}`: Get paginated products.
-   `GET /api/products/category?category={cat}&page={#}&size={#}&sortBy={field}`: Get paginated products filtered by category.

## 📂 Project Structure

-   `Controller`: REST controllers handling HTTP requests.
-   `Service`: Business logic layer.
-   `Repository`: Spring Data JPA repositories.
-   `Model`: Entity classes.
