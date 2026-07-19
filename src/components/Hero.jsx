import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import './Hero.css';

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 300]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -200]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section className="hero">
      {/* Background chocolate abstract shapes / nature leaves */}
      <div className="hero-background">
        <motion.div 
          className="bg-shape shape-1 glass"
          style={{ y: y1 }}
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.05, 0.95, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="bg-shape shape-2 glass"
          style={{ y: y2 }}
          animate={{ 
            rotate: [0, -15, 15, 0],
            scale: [1, 1.1, 0.9, 1]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="container hero-content">
        <motion.div 
          className="hero-text-content"
          style={{ opacity }}
        >
          <motion.div 
            className="hero-badge glass"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Sparkles size={16} className="text-gradient-green" />
            <span>100% Organic Nuts & Cocoa</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            Dive into <br/>
            <span className="text-gradient">Pure Chocolate</span> <br/>
            & Nature.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Experience artisanal cakes crafted exclusively from the finest dry fruits, roasted nuts, and rich, decadent chocolate. No compromises, just pure indulgence.
          </motion.p>

          <motion.div 
            className="hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <button className="primary-btn">
              Explore Flavours
              <ArrowRight size={20} />
            </button>
            <button className="secondary-btn">
              Our Story
            </button>
          </motion.div>
        </motion.div>

        <motion.div 
          className="hero-image-container animate-float"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          style={{ y: y1 }}
        >
          {/* Main Hero Image */}
          <div className="image-wrapper">
             <img 
               src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000&auto=format&fit=crop" 
               alt="Decadent Chocolate Nut Cake" 
               className="hero-img"
             />
             <div className="image-glow"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
