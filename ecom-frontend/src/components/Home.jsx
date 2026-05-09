import React, { useEffect, useState } from "react";
import axios from "../axios";
import BannerCarousel from "./BannerCarousel";
import FlashSaleSection from "./FlashSaleSection";
import NewsletterBox from "./NewsletterBox";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsError(true);
      }
    };
    fetchData();
  }, []);

  if (isError) {
    return (
      <div className="container text-center" style={{ padding: "10rem" }}>
        <i className="bi bi-exclamation-triangle fs-1 text-danger"></i>
        <h2 className="mt-3">Something went wrong...</h2>
        <p className="text-muted">Please check your connection or try again later.</p>
        <button className="btn btn-primary mt-3" onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <BannerCarousel />
      
      <FlashSaleSection />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold m-0">Featured Products</h2>
        <div className="dropdown">
          <button className="btn btn-outline-secondary dropdown-toggle rounded-pill" type="button" data-bs-toggle="dropdown">
            Sort By
          </button>
          <ul className="dropdown-menu">
            <li><a className="dropdown-item" href="#">Price: Low to High</a></li>
            <li><a className="dropdown-item" href="#">Price: High to Low</a></li>
            <li><a className="dropdown-item" href="#">Newest First</a></li>
          </ul>
        </div>
      </div>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 mb-5">
        {products.map((product) => (
          <div className="col" key={product.id}>
            <div
              className="card h-100 border-0 shadow-sm transition-hover"
              style={{
                borderRadius: "15px",
                overflow: "hidden",
                transition: "transform 0.3s, box-shadow 0.3s"
              }}
            >
              <div className="position-relative" style={{ height: "200px", backgroundColor: "#f8f9fa" }}>
                {/* Image placeholder since product might not have one or it's separate */}
                <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                    <i className="bi bi-image fs-1 opacity-25"></i>
                </div>
                <div className="position-absolute top-0 end-0 m-2">
                    <button className="btn btn-white btn-sm rounded-circle shadow-sm">
                        <i className="bi bi-heart text-danger"></i>
                    </button>
                </div>
              </div>
              <div className="card-body d-flex flex-column p-3">
                <div className="mb-2">
                  <h5 className="card-title fw-bold mb-1 text-truncate">
                    {product.name.toUpperCase()}
                  </h5>
                  <span className="badge bg-light text-dark fw-normal border">
                    {product.brand}
                  </span>
                </div>
                
                <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
                  <h5 className="fw-bold m-0 text-primary">
                    <i className="bi bi-currency-rupee"></i>
                    {product.price}
                  </h5>
                  <button className="btn btn-primary rounded-pill btn-sm px-3 shadow-sm">
                    <i className="bi bi-cart-plus me-1"></i>
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <NewsletterBox />

      <style>{`
        .transition-hover:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
        .btn-white {
          background-color: white;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default Home;
