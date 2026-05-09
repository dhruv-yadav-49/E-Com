import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

const BannerCarousel = () => {
    const [banners, setBanners] = useState([]);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await axios.get('/api/banners/active');
                setBanners(response.data);
            } catch (error) {
                console.error("Error fetching banners:", error);
            }
        };
        fetchBanners();
    }, []);

    if (banners.length === 0) return null;

    return (
        <div id="bannerCarousel" className="carousel slide mb-5" data-bs-ride="carousel">
            <div className="carousel-inner" style={{ borderRadius: '15px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                {banners.map((banner, index) => (
                    <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={banner.id}>
                        <div style={{ position: 'relative', height: '400px', background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${banner.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                            <div className="carousel-caption d-none d-md-block" style={{ bottom: '20%', textAlign: 'left', left: '10%' }}>
                                <h1 style={{ fontWeight: '800', fontSize: '3.5rem', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>{banner.title}</h1>
                                <p style={{ fontSize: '1.5rem', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>{banner.subtitle}</p>
                                <a href={banner.buttonUrl} className="btn btn-primary btn-lg px-5 py-3" style={{ borderRadius: '30px', fontWeight: '600', transition: 'transform 0.3s' }}>
                                    {banner.buttonText}
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {banners.length > 1 && (
                <>
                    <button className="carousel-control-prev" type="button" data-bs-target="#bannerCarousel" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#bannerCarousel" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </>
            )}
        </div>
    );
};

export default BannerCarousel;
