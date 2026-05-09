import React, { useState, useEffect } from 'react';
import axios from '../axios';

const FlashSaleSection = () => {
    const [sales, setSales] = useState([]);
    const [timeLeft, setTimeLeft] = useState({});

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const response = await axios.get('/flash-sales');
                setSales(response.data);
            } catch (error) {
                console.error("Error fetching flash sales:", error);
            }
        };
        fetchSales();
    }, []);

    useEffect(() => {
        if (sales.length === 0) return;

        const timer = setInterval(() => {
            const newTimeLeft = {};
            sales.forEach(sale => {
                const difference = +new Date(sale.endTime) - +new Date();
                if (difference > 0) {
                    newTimeLeft[sale.id] = {
                        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                        minutes: Math.floor((difference / 1000 / 60) % 60),
                        seconds: Math.floor((difference / 1000) % 60)
                    };
                }
            });
            setTimeLeft(newTimeLeft);
        }, 1000);

        return () => clearInterval(timer);
    }, [sales]);

    if (sales.length === 0) return null;

    return (
        <div className="flash-sale-container mb-5 p-4" style={{ background: 'linear-gradient(135deg, #ff416c, #ff4b2b)', borderRadius: '15px', color: 'white' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center">
                    <i className="bi bi-lightning-charge-fill fs-2 me-2 text-warning"></i>
                    <h2 className="mb-0 fw-bold">FLASH SALE</h2>
                </div>
                <div className="d-flex gap-3 align-items-center">
                    <span className="fw-semibold">Ends in:</span>
                    {sales.map(sale => (
                        timeLeft[sale.id] && (
                            <div key={sale.id} className="d-flex gap-2">
                                <TimeBox value={timeLeft[sale.id].hours} label="HRS" />
                                <span className="fs-3">:</span>
                                <TimeBox value={timeLeft[sale.id].minutes} label="MIN" />
                                <span className="fs-3">:</span>
                                <TimeBox value={timeLeft[sale.id].seconds} label="SEC" />
                            </div>
                        )
                    ))}
                </div>
            </div>
            
            <div className="row g-4">
                {/* Sale Items would go here, for now we just show a placeholder or the sale info */}
                {sales.map(sale => (
                    <div key={sale.id} className="col-12">
                        <div className="bg-white text-dark p-3 rounded-3 d-flex justify-content-between align-items-center shadow-sm">
                            <div>
                                <h4 className="mb-1 fw-bold">{sale.name}</h4>
                                <p className="mb-0 text-muted">{sale.discountDescription}</p>
                            </div>
                            <button className="btn btn-danger rounded-pill px-4 fw-bold">Shop Now</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const TimeBox = ({ value, label }) => (
    <div className="text-center">
        <div className="bg-white text-danger fw-bold fs-4 px-2 py-1 rounded" style={{ minWidth: '45px' }}>
            {value < 10 ? `0${value}` : value}
        </div>
        <small style={{ fontSize: '0.7rem', opacity: 0.8 }}>{label}</small>
    </div>
);

export default FlashSaleSection;
