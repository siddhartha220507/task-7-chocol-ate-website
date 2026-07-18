import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Menu, X, Leaf } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav 
      className={`navbar ${isScrolled ? 'scrolled glass' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
    >
      <div className="container nav-content">
        <div className="logo-container">
          <Leaf className="logo-icon" />
          <span className="logo-text">NuttyCocoa</span>
        </div>

        <div className="nav-links desktop-only">
          <a href="#about" className="nav-link">Our Story</a>
          <a href="#collection" className="nav-link">The Collection</a>
          <a href="#ingredients" className="nav-link">Ingredients</a>
        </div>

        <div className="nav-actions">
          <button className="cart-btn">
            <ShoppingBag size={20} />
            <span className="cart-badge">2</span>
          </button>
          
          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div 
          className="mobile-menu glass"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <a href="#about" onClick={() => setIsMobileMenuOpen(false)}>Our Story</a>
          <a href="#collection" onClick={() => setIsMobileMenuOpen(false)}>The Collection</a>
          <a href="#ingredients" onClick={() => setIsMobileMenuOpen(false)}>Ingredients</a>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
