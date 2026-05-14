# ⚡ ShopZen | Full-Stack Premium E-Commerce Platform

![E-commerce Banner](https://img.shields.io/badge/ShopZen-Premium_E--commerce-blue?style=for-the-badge&logo=shopify)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)
![AWS S3](https://img.shields.io/badge/AWS_S3-FF9900?style=for-the-badge&logo=amazons3&logoColor=white)

ShopZen is a high-performance, full-stack e-commerce application built with a modern architecture. It features a premium, Flipkart-inspired UI/UX and a robust Spring Boot backend. Designed for scalability, it includes advanced features like real-time stock tracking, flash sales, and secure cloud asset management.

---

## ✨ Key Features

### 🛒 For Customers
- **Modern UI**: A premium, responsive shopping experience inspired by industry leaders.
- **Advanced Search**: Real-time product search and category-based filtering.
- **Shopping Mechanics**: Fully functional Cart and Wishlist management.
- **Flash Sales**: Dynamic sale sections with countdowns and specialized pricing.
- **Secure Checkout**: Integrated with Razorpay for seamless payment processing.
- **Personalization**: Recently viewed products and order history tracking.

### 🛡️ For Administrators
- **Comprehensive Dashboard**: Centralized management for all store operations.
- **Catalogue Management**: Full CRUD operations for products and categories.
- **Bulk Actions**: Optimized tools for deleting or updating large batches of products.
- **Marketing Suite**: Manage promotional banners and hero section content dynamically.
- **Inventory Tracking**: Real-time stock status monitoring and automated alerts.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: [React.js](https://reactjs.org/) (Vite)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: Context API / Hooks
- **Networking**: Axios with Interceptors

### Backend
- **Framework**: [Spring Boot 3.4.2](https://spring.io/projects/spring-boot)
- **Security**: Spring Security with **JWT** (JSON Web Tokens)
- **Persistence**: Spring Data JPA + Hibernate
- **Database**: MySQL
- **Cloud Storage**: AWS S3 (Simple Storage Service)
- **Payments**: Razorpay SDK
- **Mailing**: Spring Boot Starter Mail (SMTP)

---

## 🚀 Getting Started

### Prerequisites
- **Java 17** or higher
- **Node.js 18+**
- **MySQL Server**
- **Maven**

### 1. Backend Setup
```bash
cd ecom-project
# Configure application.properties with your DB credentials & JWT Secret
# Run the application
mvn spring-boot:run
```

### 2. Frontend Setup
```bash
cd frontend
# Install dependencies
npm install
# Start development server
npm run dev
```

### 3. Database Initialization
- Create a database named `productdb`.
- The application will automatically seed default categories on the first run via the `DataSeeder` component.

---

## 📂 Project Structure

```bash
├── ecom-project         # Spring Boot Source Code
│   ├── src/main/java    # Java Controllers, Services, Models
│   ├── src/main/res     # SQL Scripts & Configuration
│   └── pom.xml          # Backend Dependencies
├── frontend             # React Source Code
│   ├── src/components   # Reusable UI Components
│   ├── src/pages        # Application Views (Home, Admin, etc.)
│   └── tailwind.config  # Design Tokens
└── README.md            # You are here
```

---

## 🔒 Security & Performance
- **Stateless Auth**: JWT-based authentication ensures secure and scalable user sessions.
- **Optimized Queries**: Paginated API calls to handle thousands of products efficiently.
- **Asset Clouding**: Offloading image storage to AWS S3 to ensure fast page loads and reduced server strain.

## 🤝 Contributing
Contributions are welcome! Feel free to open an issue or submit a pull request.

---
*Made By❤️ Dhruv Yadav.*
