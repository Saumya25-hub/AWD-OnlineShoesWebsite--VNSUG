import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Award, HeartHandshake, CheckCircle } from 'lucide-react';

const About = () => {
  return (
    <div className="container section-padding">
      <div className="card-box" style={{ padding: '40px 32px', marginBottom: '32px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <span className="hero-badge">About StepUp Footwear</span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary)', margin: '14px 0' }}>
            Delivering Comfort, Quality & Style For Every Step
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.7' }}>
            StepUp Footwear is an online e-commerce platform dedicated to bringing you the best athletic running shoes, lifestyle sneakers, formal footwear, and rugged outdoor boots at honest prices.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '36px' }}>
        <div className="card-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <div className="feature-icon-wrap"><Award size={24} /></div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)' }}>Our Mission</h3>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            To simplify online footwear shopping with a clean, fast, and transparent catalog featuring authentic designs, easy size selection, and responsive order fulfillment.
          </p>
        </div>

        <div className="card-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <div className="feature-icon-wrap"><HeartHandshake size={24} /></div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)' }}>Quality First</h3>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Every pair is curated for durability, ergonomic foot cushioning, and premium breathable materials that suit sports, work, and casual wear.
          </p>
        </div>
      </div>

      {/* Academic Project Info Box */}
      <div className="card-box" style={{ background: '#f1f5f9', border: '1px solid var(--border)' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '12px' }}>
          🎓 Academic Project Profile
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', fontSize: '0.9rem' }}>
          <div>
            <strong>Course:</strong> Bachelor of Computer Applications (BCA)
          </div>
          <div>
            <strong>Semester:</strong> Semester-5
          </div>
          <div>
            <strong>Paper:</strong> AWD (503-01: Advanced Web Development)
          </div>
          <div>
            <strong>Technology Stack:</strong> React, Vite, Node.js, Express, MongoDB
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
