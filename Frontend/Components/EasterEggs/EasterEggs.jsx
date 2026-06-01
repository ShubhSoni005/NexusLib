import { useState, useEffect, useRef } from 'react';
import DesignSystemPanel from '../DesignSystemPanel/DesignSystemPanel';
import './EasterEggs.css';

class ConfettiParticle {
  constructor(canvasWidth, canvasHeight, side) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.x = side === 'left' ? 0 : canvasWidth;
    this.y = canvasHeight;
    
    // Shoot upwards and towards the center
    const angle = side === 'left' 
      ? -Math.PI / 4 - Math.random() * (Math.PI / 6) // -45 deg to -75 deg
      : -Math.PI * 3 / 4 + Math.random() * (Math.PI / 6); // -135 deg to -105 deg
      
    const speed = 14 + Math.random() * 16; // 14 to 30px per frame
    
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    
    this.gravity = 0.25 + Math.random() * 0.15;
    this.drag = 0.975;
    
    this.size = 8 + Math.random() * 10;
    // Premium color palette (Indigos, Cyans, Pinks, Golds, Emeralds)
    this.color = [
      '#6366f1', '#818cf8', '#4f46e5', // Indigos
      '#06b6d4', '#22d3ee', '#0891b2', // Cyans
      '#ec4899', '#f43f5e',             // Pinks/Roses
      '#fbbf24', '#f59e0b',             // Golds/Yellows
      '#10b981', '#34d399'              // Emeralds/Mints
    ][Math.floor(Math.random() * 12)];
    
    this.rotation = Math.random() * 360;
    this.rotationSpeed = (Math.random() - 0.5) * 12;
    
    this.opacity = 1;
    this.fadeSpeed = 0.006 + Math.random() * 0.006;
    this.shape = ['circle', 'rect', 'triangle'][Math.floor(Math.random() * 3)];
  }

  update() {
    this.vx *= this.drag;
    this.vy *= this.drag;
    this.vy += this.gravity;
    
    // Smooth sinus wind drift
    this.x += this.vx + Math.sin(Date.now() / 400 + this.size) * 0.35;
    this.y += this.vy;
    
    this.rotation += this.rotationSpeed;
    this.opacity -= this.fadeSpeed;
  }

  draw(ctx) {
    if (this.opacity <= 0) return;
    
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;

    if (this.shape === 'circle') {
      ctx.beginPath();
      ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.shape === 'rect') {
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.7);
    } else if (this.shape === 'triangle') {
      ctx.beginPath();
      ctx.moveTo(0, -this.size / 2);
      ctx.lineTo(this.size / 2, this.size / 2);
      ctx.lineTo(-this.size / 2, this.size / 2);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }
}

export default function EasterEggs() {
  const [showPanel, setShowPanel] = useState(false);
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationFrameIdRef = useRef(null);

  // Resize canvas to match full viewport size
  const resizeCanvas = () => {
    if (canvasRef.current) {
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
    }
  };

  // Launch dual-sided confetti cannons
  const launchConfetti = () => {
    resizeCanvas();
    const newParticles = [];
    const burstCount = 80; // per side

    // Left cannon
    for (let i = 0; i < burstCount; i++) {
      newParticles.push(new ConfettiParticle(window.innerWidth, window.innerHeight, 'left'));
    }
    // Right cannon
    for (let i = 0; i < burstCount; i++) {
      newParticles.push(new ConfettiParticle(window.innerWidth, window.innerHeight, 'right'));
    }

    particlesRef.current = [...particlesRef.current, ...newParticles];

    // Start/Resume animation loop
    if (!animationFrameIdRef.current) {
      const loop = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Filter out expired particles
        particlesRef.current = particlesRef.current.filter(
          p => p.opacity > 0 && p.y < canvas.height + 20 && p.x > -20 && p.x < canvas.width + 20
        );

        particlesRef.current.forEach(p => {
          p.update();
          p.draw(ctx);
        });

        if (particlesRef.current.length > 0) {
          animationFrameIdRef.current = requestAnimationFrame(loop);
        } else {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          animationFrameIdRef.current = null;
        }
      };
      animationFrameIdRef.current = requestAnimationFrame(loop);
    }
  };

  useEffect(() => {
    // 1. Resize listener
    window.addEventListener('resize', resizeCanvas);
    
    // 2. Keyboard sequences
    const konamiCode = [
      'arrowup', 'arrowup', 'arrowdown', 'arrowdown',
      'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'
    ];
    let konamiInput = [];

    const devCode = ['D', 'E', 'V'];
    let devInput = [];

    const handleKeyDown = (e) => {
      // Konami Code Tracker
      konamiInput.push(e.key.toLowerCase());
      konamiInput = konamiInput.slice(-konamiCode.length);
      if (konamiInput.join(',') === konamiCode.join(',')) {
        launchConfetti();
        konamiInput = [];
      }

      // Shift+D+E+V Tracker
      if (e.shiftKey && ['D', 'E', 'V'].includes(e.key.toUpperCase())) {
        devInput.push(e.key.toUpperCase());
        devInput = devInput.slice(-3);
        if (devInput.join('') === devCode.join('')) {
          setShowPanel(prev => !prev);
          devInput = [];
        }
      } else if (!e.shiftKey) {
        devInput = [];
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // 3. Logo triple-click listener (polls slightly for mount, then binds)
    let clickCount = 0;
    let clickTimer = null;
    let logoElement = null;

    const handleLogoClick = (e) => {
      e.preventDefault();
      clickCount++;
      if (clickCount === 3) {
        launchConfetti();
        clickCount = 0;
      }
      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => {
        clickCount = 0;
      }, 500); // 500ms threshold for triple click
    };

    const bindLogoListener = () => {
      logoElement = document.querySelector('.navbar__logo');
      if (logoElement) {
        logoElement.addEventListener('click', handleLogoClick);
      } else {
        // Retry in 1s if routing hasn't rendered it yet
        setTimeout(bindLogoListener, 1000);
      }
    };

    bindLogoListener();

    // Cleanups
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('keydown', handleKeyDown);
      if (logoElement) {
        logoElement.removeEventListener('click', handleLogoClick);
      }
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="easter-eggs-canvas"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 99999
        }}
      />
      {showPanel && <DesignSystemPanel onClose={() => setShowPanel(false)} />}
    </>
  );
}
