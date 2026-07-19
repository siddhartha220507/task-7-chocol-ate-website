import React from 'react';
import { Leaf, Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <div className="logo-container">
            <Leaf className="logo-icon" size={28} />
            <span className="logo-text">NuttyCocoa</span>
          </div>
          <p className="footer-desc">
            Elevating the art of cake making with nature's finest ingredients. Pure chocolate, roasted nuts, and boundless passion.
          </p>
          <div className="social-links">
            <a href="#" className="social-icon"><Mail size={20} /></a>
            <a href="#" className="social-icon"><Phone size={20} /></a>
            <a href="#" className="social-icon"><MapPin size={20} /></a>
          </div>
        </div>

        <div className="footer-links-grid">
          <div className="footer-column">
            <h4>Shop</h4>
            <a href="#">The Collection</a>
            <a href="#">Best Sellers</a>
            <a href="#">Gift Boxes</a>
            <a href="#">Custom Orders</a>
          </div>
          <div className="footer-column">
            <h4>About</h4>
            <a href="#">Our Story</a>
            <a href="#">Ingredients</a>
            <a href="#">Sustainability</a>
            <a href="#">Careers</a>
          </div>
          <div className="footer-column">
            <h4>Support</h4>
            <a href="#">FAQ</a>
            <a href="#">Shipping & Returns</a>
            <a href="#">Contact Us</a>
            <a href="#">Track Order</a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom border-top">
        <div className="container bottom-content">
          <p>&copy; {new Date().getFullYear()} NuttyCocoa. All rights reserved.</p>
          <div className="bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
