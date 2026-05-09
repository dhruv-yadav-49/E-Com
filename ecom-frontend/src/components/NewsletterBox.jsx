import React, { useState } from 'react';
import axios from '../axios';

const NewsletterBox = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`/newsletter/subscribe?email=${email}`);
            setStatus('success');
            setEmail('');
        } catch (error) {
            console.error("Subscription error:", error);
            setStatus('error');
        }
    };

    return (
        <div className="newsletter-section my-5 py-5 text-center" style={{ backgroundColor: '#f8f9fa', borderRadius: '20px', border: '1px solid #dee2e6' }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <i className="bi bi-envelope-paper fs-1 text-primary mb-3"></i>
                        <h2 className="fw-bold mb-3">Subscribe to our Newsletter</h2>
                        <p className="text-muted mb-4 fs-5">Get the latest updates on new arrivals, special offers and other discount information.</p>
                        
                        <form onSubmit={handleSubmit} className="d-flex gap-2 max-width-500 mx-auto">
                            <input 
                                type="email" 
                                className="form-control form-control-lg rounded-pill px-4" 
                                placeholder="Enter your email address" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{ border: '2px solid #0d6efd' }}
                            />
                            <button type="submit" className="btn btn-primary btn-lg rounded-pill px-5 fw-bold shadow">
                                Subscribe
                            </button>
                        </form>

                        {status === 'success' && (
                            <div className="alert alert-success mt-3 rounded-pill">
                                Awesome! You've been subscribed.
                            </div>
                        )}
                        {status === 'error' && (
                            <div className="alert alert-danger mt-3 rounded-pill">
                                Oops! Something went wrong. Please try again.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsletterBox;
