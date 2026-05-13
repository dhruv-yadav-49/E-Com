import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BannerCarousel = () => {
    const [banners, setBanners] = useState([]);
    const [current, setCurrent] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await API.get('/api/banners/active');
                setBanners(response.data);
            } catch (error) {
                console.error("Error fetching banners:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBanners();
    }, []);

    // Auto-advance
    useEffect(() => {
        if (banners.length <= 1) return;
        const timer = setInterval(() => {
            setCurrent(prev => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [banners]);

    if (loading || banners.length === 0) return null;

    const next = () => setCurrent((current + 1) % banners.length);
    const prev = () => setCurrent((current - 1 + banners.length) % banners.length);

    return (
        <div className="banner-carousel-container">
            <div className="banner-carousel-track" style={{ transform: `translateX(-${current * 100}%)` }}>
                {banners.map((banner) => (
                    <div className="banner-slide" key={banner.id}>
                        {/* Background Image */}
                        <div 
                            className="banner-bg" 
                            style={{ 
                                backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url("${banner.imageUrl}")`
                            }}
                        />
                        
                        <div className="banner-content">
                            <h1 className="banner-title">{banner.title}</h1>
                            <p className="banner-subtitle">{banner.subtitle}</p>
                            <a href={banner.buttonUrl || '#'} className="banner-btn">
                                {banner.buttonText || 'Shop Now'}
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {banners.length > 1 && (
                <>
                    <button className="carousel-nav prev" onClick={prev}><ChevronLeft size={24}/></button>
                    <button className="carousel-nav next" onClick={next}><ChevronRight size={24}/></button>
                    
                    <div className="carousel-dots">
                        {banners.map((_, i) => (
                            <button 
                                key={i} 
                                className={`dot ${i === current ? 'active' : ''}`}
                                onClick={() => setCurrent(i)}
                            />
                        ))}
                    </div>
                </>
            )}

            <style>{`
                .banner-carousel-container {
                    position: relative;
                    width: 100%;
                    height: 450px;
                    overflow: hidden;
                    background: #0f172a;
                    margin-bottom: 2rem;
                }
                .banner-carousel-track {
                    display: flex;
                    width: 100%;
                    height: 100%;
                    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .banner-slide {
                    flex: 0 0 100%;
                    width: 100%;
                    height: 100%;
                    position: relative;
                    display: flex;
                    align-items: center;
                    padding: 0 10%;
                }
                .banner-bg {
                    position: absolute;
                    inset: 0;
                    background-size: cover;
                    background-position: center;
                    z-index: 1;
                }
                .banner-content {
                    position: relative;
                    z-index: 2;
                    max-width: 600px;
                    color: white;
                    animation: fadeInUp 0.8s ease-out;
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .banner-title {
                    font-size: 3.5rem;
                    font-weight: 800;
                    line-height: 1.1;
                    margin-bottom: 1rem;
                    text-shadow: 0 2px 10px rgba(0,0,0,0.3);
                }
                .banner-subtitle {
                    font-size: 1.25rem;
                    color: rgba(255,255,255,0.9);
                    margin-bottom: 2rem;
                    max-width: 500px;
                }
                .banner-btn {
                    display: inline-block;
                    padding: 14px 32px;
                    background: #6366f1;
                    color: white;
                    font-weight: 600;
                    border-radius: 50px;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
                }
                .banner-btn:hover {
                    background: #4f46e5;
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.6);
                }
                .carousel-nav {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    z-index: 3;
                    background: rgba(255,255,255,0.1);
                    backdrop-filter: blur(8px);
                    color: white;
                    border: 1px solid rgba(255,255,255,0.2);
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                .carousel-nav:hover {
                    background: rgba(255,255,255,0.2);
                    transform: translateY(-50%) scale(1.1);
                }
                .carousel-nav.prev { left: 20px; }
                .carousel-nav.next { right: 20px; }
                
                .carousel-dots {
                    position: absolute;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    gap: 10px;
                    z-index: 3;
                }
                .dot {
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.3);
                    border: none;
                    cursor: pointer;
                    padding: 0;
                    transition: all 0.3s;
                }
                .dot.active {
                    background: white;
                    width: 24px;
                    border-radius: 10px;
                }
                @media (max-width: 768px) {
                    .banner-title { font-size: 2.2rem; }
                    .banner-carousel-container { height: 350px; }
                    .carousel-nav { display: none; }
                }
            `}</style>
        </div>
    );
};

export default BannerCarousel;
