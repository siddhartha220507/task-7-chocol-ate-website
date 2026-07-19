import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function AsmrCake() {
  const [isPressed, setIsPressed] = useState(false);
  
  // This will create a 'ripple' or 'squish' particle effect
  const handlePointerDown = () => setIsPressed(true);
  const handlePointerUp = () => setIsPressed(false);

  return (
    <section className="asmr-section container" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
      <h2 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>
        Feel the Softness
      </h2>
      <p style={{ marginBottom: '3rem', color: 'var(--text-secondary)' }}>
        Interact with our signature sponge base. (Click & Hold)
      </p>

      <div className="cake-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <motion.div 
          className="asmr-cake"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          animate={{
            scaleY: isPressed ? 0.7 : 1,
            scaleX: isPressed ? 1.1 : 1,
            borderRadius: isPressed ? '50% 50% 40% 40%' : '50% 50% 10px 10px',
            boxShadow: isPressed 
              ? '0 5px 15px rgba(0,0,0,0.5), inset 0 20px 20px rgba(58, 38, 24, 0.8)' 
              : '0 20px 30px rgba(0,0,0,0.5), inset 0 5px 10px rgba(255, 207, 150, 0.2)'
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 10,
            mass: 0.8
          }}
          style={{
            width: '250px',
            height: '120px',
            background: 'linear-gradient(to bottom, #d4a373, #8b5a2b)',
            cursor: 'none', // Handled by CustomCursor
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Top layer/glaze */}
          <motion.div
            animate={{
              y: isPressed ? 10 : 0,
              scaleX: isPressed ? 1.05 : 1
            }}
            style={{
              width: '100%',
              height: '40px',
              background: '#2b1a10', // Dark chocolate glaze
              borderRadius: '50%',
              position: 'absolute',
              top: '-20px',
              left: 0
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
