import React, { useState } from 'react';
import axios from '../axios';

const AdminControl = () => {
    const [banner, setBanner] = useState({ title: '', subtitle: '', image: null, buttonText: '', buttonUrl: '', validUntil: '' });
    const [flashSale, setFlashSale] = useState({ name: '', discountDescription: '', startTime: '', endTime: '', active: true });

    const handleBannerSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', banner.title);
        formData.append('subtitle', banner.subtitle);
        formData.append('image', banner.image);
        formData.append('buttonText', banner.buttonText);
        formData.append('buttonUrl', banner.buttonUrl);
        formData.append('validUntil', banner.validUntil);

        try {
            await axios.post('/admin/banners', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Banner created successfully!');
        } catch (error) {
            console.error("Error creating banner:", error);
            alert('Failed to create banner.');
        }
    };

    const handleFlashSaleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/admin/flash-sales', flashSale);
            alert('Flash Sale created successfully!');
        } catch (error) {
            console.error("Error creating flash sale:", error);
            alert('Failed to create flash sale.');
        }
    };

    return (
        <div className="container py-5">
            <h1 className="fw-bold mb-5 text-center">Admin Marketing Dashboard</h1>
            
            <div className="row g-5">
                {/* Banner Management */}
                <div className="col-md-6">
                    <div className="card shadow-sm border-0 p-4" style={{ borderRadius: '20px' }}>
                        <h3 className="fw-bold mb-4"><i className="bi bi-image me-2 text-primary"></i>Create New Banner</h3>
                        <form onSubmit={handleBannerSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Title</label>
                                <input type="text" className="form-control rounded-pill" value={banner.title} onChange={e => setBanner({...banner, title: e.target.value})} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Subtitle</label>
                                <input type="text" className="form-control rounded-pill" value={banner.subtitle} onChange={e => setBanner({...banner, subtitle: e.target.value})} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Banner Image</label>
                                <input type="file" className="form-control" onChange={e => setBanner({...banner, image: e.target.files[0]})} required />
                            </div>
                            <div className="row mb-3">
                                <div className="col">
                                    <label className="form-label">Button Text</label>
                                    <input type="text" className="form-control rounded-pill" value={banner.buttonText} onChange={e => setBanner({...banner, buttonText: e.target.value})} required />
                                </div>
                                <div className="col">
                                    <label className="form-label">Button URL</label>
                                    <input type="text" className="form-control rounded-pill" value={banner.buttonUrl} onChange={e => setBanner({...banner, buttonUrl: e.target.value})} required />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="form-label">Valid Until</label>
                                <input type="date" className="form-control rounded-pill" value={banner.validUntil} onChange={e => setBanner({...banner, validUntil: e.target.value})} required />
                            </div>
                            <button type="submit" className="btn btn-primary w-100 rounded-pill fw-bold py-2 shadow-sm">Upload Banner</button>
                        </form>
                    </div>
                </div>

                {/* Flash Sale Management */}
                <div className="col-md-6">
                    <div className="card shadow-sm border-0 p-4" style={{ borderRadius: '20px' }}>
                        <h3 className="fw-bold mb-4"><i className="bi bi-lightning-charge me-2 text-warning"></i>New Flash Sale</h3>
                        <form onSubmit={handleFlashSaleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Sale Name</label>
                                <input type="text" className="form-control rounded-pill" value={flashSale.name} onChange={e => setFlashSale({...flashSale, name: e.target.value})} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Discount Description</label>
                                <input type="text" className="form-control rounded-pill" placeholder="e.g. Up to 50% Off" value={flashSale.discountDescription} onChange={e => setFlashSale({...flashSale, discountDescription: e.target.value})} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Start Time</label>
                                <input type="datetime-local" className="form-control rounded-pill" value={flashSale.startTime} onChange={e => setFlashSale({...flashSale, startTime: e.target.value})} required />
                            </div>
                            <div className="mb-4">
                                <label className="form-label">End Time</label>
                                <input type="datetime-local" className="form-control rounded-pill" value={flashSale.endTime} onChange={e => setFlashSale({...flashSale, endTime: e.target.value})} required />
                            </div>
                            <button type="submit" className="btn btn-warning w-100 rounded-pill fw-bold py-2 shadow-sm text-white">Start Flash Sale</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminControl;
