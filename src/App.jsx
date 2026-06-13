import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css'; // <-- alag CSS file import

const App = () => {
  // ---------- LOADER ----------
  const [loading, setLoading] = useState(true);

  // ---------- FEATURE CARDS ----------
  const [activeFeature, setActiveFeature] = useState(0);
  const featureData = [
    { number: '01', icon: '◎', title: 'MINIATURE SIZE AND WIRELESS CONNECTION', text: 'The device is easily integrated into the brain, guaranteeing reliable connection and complete freedom.' },
    { number: '02', icon: '◈', title: 'ADVANCED BIONIC INTERFACE', text: 'Cybernetic integration with your neural pathways for precision audio transmission.' },
    { number: '03', icon: '◆', title: 'AI-POWERED MUSIC CURATION', text: 'Intelligent algorithms learn your preferences and curate playlists that evolve with your mood.' },
    { number: '04', icon: '◉', title: 'INSTANT NEURAL STREAMING', text: 'Zero-latency audio streaming directly to your auditory cortex with lossless quality.' },
    { number: '05', icon: '▣', title: '3D SPATIAL AUDIO PERCEPTION', text: 'Immersive 360° soundscapes with haptic feedback that responds to every beat.' },
    { number: '06', icon: '◍', title: 'BIO-RHYTHM SYNC ENGINE', text: 'Emotion-driven audio that adapts to your heart rate, movement and mood.' },
  ];

  // ---------- HERO MASK ----------
  const heroRef = useRef(null);

  // ---------- PRODUCT ROW PREVIEW ----------
  const [previewData, setPreviewData] = useState({
    visible: false,
    imgSrc: '',
    x: 0,
    y: 0,
  });
  const previewImgRef = useRef(null);
  const activeRowRef = useRef(null);

  // ---------- INTERSECTION OBSERVER ----------
  const observerRef = useRef(null);

  // ---------- LOADER LOGIC ----------
  useEffect(() => {
    const handleLoad = () => setLoading(false);
    if (document.readyState === 'complete') {
      setLoading(false);
    } else {
      window.addEventListener('load', handleLoad);
    }
    const timeout = setTimeout(() => setLoading(false), 3000);
    return () => {
      window.removeEventListener('load', handleLoad);
      clearTimeout(timeout);
    };
  }, []);

  // ---------- SMOOTH SCROLL ----------
  const handleAnchorClick = useCallback((e) => {
    const href = e.currentTarget.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // ---------- HERO MASK EFFECT ----------
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const handleMouseMove = (e) => {
      const rect = hero.getBoundingClientRect();
      hero.style.setProperty('--x', `${e.clientX - rect.left}px`);
      hero.style.setProperty('--y', `${e.clientY - rect.top}px`);
    };

    const handleMouseLeave = () => {
      hero.style.setProperty('--x', '50%');
      hero.style.setProperty('--y', '50%');
    };

    const handleTouchMove = (e) => {
      const rect = hero.getBoundingClientRect();
      const touch = e.touches[0];
      hero.style.setProperty('--x', `${touch.clientX - rect.left}px`);
      hero.style.setProperty('--y', `${touch.clientY - rect.top}px`);
    };

    const handleTouchEnd = () => {
      hero.style.setProperty('--x', '50%');
      hero.style.setProperty('--y', '50%');
    };

    hero.addEventListener('mousemove', handleMouseMove);
    hero.addEventListener('mouseleave', handleMouseLeave);
    hero.addEventListener('touchmove', handleTouchMove, { passive: true });
    hero.addEventListener('touchend', handleTouchEnd);

    return () => {
      hero.removeEventListener('mousemove', handleMouseMove);
      hero.removeEventListener('mouseleave', handleMouseLeave);
      hero.removeEventListener('touchmove', handleTouchMove);
      hero.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  // ---------- INTERSECTION OBSERVER ----------
  useEffect(() => {
    const elements = document.querySelectorAll(
      '.animate-on-scroll, .animate-fade-left, .animate-fade-right, .animate-scale-in, .stagger-children'
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
    );

    elements.forEach((el) => observer.observe(el));
    observerRef.current = observer;

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  // ---------- FEATURE CARD HANDLERS ----------
  const handleFeatureActivate = (index) => setActiveFeature(index);

  // ---------- PRODUCT ROW PREVIEW ----------
  const showPreview = (imgSrc, clientX, clientY, rowElement) => {
    if (window.innerWidth <= 768) return;
    setPreviewData({
      visible: true,
      imgSrc,
      x: clientX + 30,
      y: clientY - 90,
    });
    if (rowElement) rowElement.classList.add('active-row');
    activeRowRef.current = rowElement;
  };

  const hidePreview = (rowElement) => {
    setPreviewData((prev) => ({ ...prev, visible: false }));
    if (rowElement) rowElement.classList.remove('active-row');
    if (activeRowRef.current === rowElement) activeRowRef.current = null;
  };

  const handleRowMouseEnter = (e, imgSrc) => {
    showPreview(imgSrc, e.clientX, e.clientY, e.currentTarget);
  };

  const handleRowMouseLeave = (e) => {
    hidePreview(e.currentTarget);
  };

  const handleRowTouchStart = (e, imgSrc) => {
    if (window.innerWidth <= 768) return;
    const touch = e.touches[0];
    const row = e.currentTarget;
    const timer = setTimeout(() => showPreview(imgSrc, touch.clientX, touch.clientY, row), 400);
    row._touchTimer = timer;
  };

  const handleRowTouchEnd = (e) => {
    clearTimeout(e.currentTarget._touchTimer);
    setTimeout(() => hidePreview(e.currentTarget), 800);
  };

  const handleRowTouchMove = (e) => {
    clearTimeout(e.currentTarget._touchTimer);
    hidePreview(e.currentTarget);
  };

  const handleRowKeyDown = (e, imgSrc) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const rect = e.currentTarget.getBoundingClientRect();
      showPreview(
        imgSrc,
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        e.currentTarget
      );
    }
  };

  const handleRowFocus = (e, imgSrc) => {
    const rect = e.currentTarget.getBoundingClientRect();
    showPreview(
      imgSrc,
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
      e.currentTarget
    );
  };

  const handleRowBlur = (e) => {
    hidePreview(e.currentTarget);
  };

  // Handle resize to hide preview on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768 && activeRowRef.current) {
        hidePreview(activeRowRef.current);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ---------- FORM HANDLERS ----------
  const handleCyberFormSubmit = (e) => {
    e.preventDefault();
    alert('CyberBeat form submitted successfully! (demo)');
    e.target.reset();
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert('Newsletter subscribed! (demo)');
    e.target.reset();
  };

  // ---------- CIRCLE TEXT for projects ----------
  const circleTextString = ' END - TO - END SYSTEM ';
  const circleSpans = circleTextString.split('').map((char, i) => (
    <span
      key={i}
      style={{
        position: 'absolute',
        left: '50%',
        top: '10px',
        transformOrigin: `0 calc(clamp(100px, 14vw, 150px))`,
        transform: `rotate(${i * (360 / circleTextString.length)}deg)`,
        fontSize: 'clamp(11px, 1.2vw, 14px)',
        color: 'var(--accent-blue)',
        letterSpacing: '2px',
      }}
    >
      {char}
    </span>
  ));

  // ---------- PRODUCT TABLE DATA ----------
  const products = [
    { name: 'Vision Sensor Module', tags: ['3D depth'], price: '249 USD', img: 'img/2.png', delay: '' },
    { name: 'Edge AI Processor', tags: ['NPU 8 TOPS'], price: '29 USD', img: 'img/3.png', delay: 'delay-100', tagDark: true },
    { name: 'LiDAR Array', tags: ['360° scan', 'outdoor'], price: '129 USD', img: 'img/4.png', delay: 'delay-200' },
    { name: 'Robotic Arm Kit', tags: ['6‑axis'], price: '69 USD', img: 'img/2.png', delay: 'delay-300' },
  ];

  return (
    <>
      {/* LOADER */}
      {loading && (
        <div className="page-loader" id="pageLoader">
          <div className="loader-spinner"></div>
        </div>
      )}

      {/* ===================== AIRONIX HERO ===================== */}
      <section className="hero-section" id="aironix">
        <div className="hero-top-bar">
          <h1 className="hero-logo animate-on-scroll">AIronix</h1>
          <div className="hero-team animate-on-scroll delay-200">
            <div className="hero-team-images">
              <img src="https://i.pravatar.cc/100?img=11" alt="Team member" loading="lazy" />
              <img src="https://i.pravatar.cc/100?img=22" alt="Team member" loading="lazy" />
              <img src="https://i.pravatar.cc/100?img=33" alt="Team member" loading="lazy" />
            </div>
            <span>Our team.</span>
          </div>
        </div>
        <div className="hero-mini-nav animate-on-scroll delay-300">
          <div className="hero-pill">intelligence<div className="hero-dot"></div></div>
          <div className="hero-nav-item">automation<div className="hero-dot"></div></div>
          <div className="hero-nav-item">precision<div className="hero-dot"></div></div>
        </div>
        <div className="hero-content-wrap">
          <div className="animate-on-scroll delay-200">
            <h2>Combining AI &amp; robotics</h2>
            <p>to build intelligent automation for the future.</p>
          </div>
          <div></div>
        </div>
        <div className="hero-image-wrap animate-scale-in">
          <img src="img/3.png" alt="AI robotics lab" loading="lazy" />
          <div className="hero-arrow" aria-hidden="true">↗</div>
          <div className="hero-explore">explore</div>
        </div>
        <div className="hero-bottom-bar animate-on-scroll">
          <button className="hero-menu-btn" aria-label="Open menu">☰</button>
          <div className="hero-caption">(AI robotics &amp; automation system)</div>
          <div className="hero-links">
            <a href="#">FAQs</a>
            <a href="#">Partner Us</a>
          </div>
        </div>
      </section>

      {/* ===================== ABOUT SECTION ===================== */}
      <section className="about" id="about">
        <div className="about-grid">
          <div className="about-left animate-on-scroll">
            <h2>ABOUT<br />CYBERBEAT</h2>
            <p>Streaming services allow us to download and listen to millions of tracks. CyberBeat implants are embedded directly into the body, enabling complete immersion in music without external interference.<br /><br />This innovative technology opens a new era where sound becomes part of human experience.</p>
          </div>
          <div className="about-right animate-on-scroll">
            <div className="small-title">INTRODUCTION</div>
            <div className="big-title">TO CYBERBEAT</div>
            <p>Music cyber implants transform the way we consume audio. Designed for comfort, clarity and seamless integration, CyberBeat creates a futuristic listening experience.</p>
            <div className="cards">
              <div className="card">◉</div>
              <div className="card">◉</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== GUIDE SECTION ===================== */}
      <section className="guide-section" id="guide">
        <div className="guide-header animate-on-scroll">
          <h2>SUPPORT AND USAGE GUIDE OF</h2>
          <h3>CYBERBEAT</h3>
        </div>
        <div className="guide-grid stagger-children">
          <div className="guide-card"><span className="guide-number">01</span>
            <h4>START WITH THE BASICS</h4>
            <p>Read the manual attached to your cyber implant. In it you will find information about functionality, settings and basic operations.</p>
          </div>
          <div className="guide-card"><span className="guide-number">02</span>
            <h4>REGULAR UPDATES</h4>
            <p>We constantly improve our software to provide new features and an improved user experience. Make sure you follow updates and install them.</p>
          </div>
          <div className="guide-card"><span className="guide-number">03</span>
            <h4>TECHNICAL SUPPORT</h4>
            <p>If you have any questions or problems, our technical support team is ready to help. Contact us by phone or email.</p>
          </div>
          <div className="guide-card"><span className="guide-number">04</span>
            <h4>FULL CONTROL</h4>
            <p>Your CyberBeat offers a wide selection of genres and playlists to create a unique musical experience tailored precisely to your taste.</p>
          </div>
          <div className="guide-card"><span className="guide-number">05</span>
            <h4>THE COMMUNITY</h4>
            <p>Join our community where you can chat with users, share experiences and discover new music together with fellow CyberBeat enthusiasts.</p>
          </div>
        </div>
      </section>

      {/* ===================== CSR SECTION ===================== */}
      <section className="csr-section">
        <div className="csr-about-badge animate-on-scroll">ABOUT US</div>
        <div className="csr-top-header">
          <div className="csr-left-top animate-fade-left">
            <div>
              <h2 className="csr-logo">AIronix CSR<sup>®</sup></h2>
            </div>
            <div className="csr-small-text">AI Responsibility<br />Initiative</div>
            <button className="csr-site-btn">aironixcsr.com ↗</button>
          </div>
          <div className="csr-right-top animate-fade-right">
            <div className="csr-tabs">
              <div className="csr-tab active">OUR PURPOSE <span>01</span></div>
              <div className="csr-tab">OUR IDENTITY <span>02</span></div>
              <div className="csr-tab">OUR ROLE <span>03</span></div>
            </div>
          </div>
        </div>
        <div className="csr-main-grid">
          <div className="csr-left-box animate-scale-in">
            <div className="csr-shape" aria-hidden="true"></div>
            <img src="img/2.png" alt="AI specialist working" loading="lazy" />
            <button className="csr-explore-btn" aria-label="Explore CSR">
              <div className="csr-explore-arrow">↗</div><span>explore</span>
            </button>
          </div>
          <div className="csr-right-box">
            <div className="csr-blur-circle" aria-hidden="true"></div>
            <div className="csr-tag csr-tag1 animate-fade-right delay-100">⌁ build</div>
            <div className="csr-tag csr-tag2 animate-fade-left delay-200">✎ design</div>
            <div className="csr-tag csr-tag3 animate-fade-right delay-300">⬡ deploy</div>
            <div className="csr-content animate-on-scroll">
              <h2>OUR PURPOSE</h2>
              <p>We help businesses integrate AI robotics to optimize workflows and improve safety.</p>
              <button className="csr-read-btn">read more<div className="csr-circle-arrow">↗</div></button>
            </div>
          </div>
        </div>
        <div className="csr-bottom-text">
          <div className="csr-scroll-wrapper">
            <h2>WITSA <span>⊕</span> / GLOBAL ICT <span>⊕</span> / INNOVATIVE AI ROBOTICS</h2>
            <h2>WITSA <span>⊕</span> / GLOBAL ICT <span>⊕</span> / INNOVATIVE AI ROBOTICS</h2>
          </div>
        </div>
      </section>

      {/* ===================== CYBERBEAT HERO ===================== */}
      <section className="hero" id="hero" ref={heroRef}>
        <div className="robot-bg"></div>
        <div className="reveal"></div>
        <div className="frame">
          <div className="hero-content">
            <h1 className="hero-title">
              <span>CYBER</span>
              <span>BEAT</span>
            </h1>
            <p className="hero-text">
              Now you can listen to your favorite music right in your head without external devices. Experience a futuristic way of enjoying sound.
            </p>
            <div className="buttons">
              <a href="#cta" className="btn btn-dark" onClick={handleAnchorClick}>Buy Now</a>
              <a href="#features" className="btn btn-light" onClick={handleAnchorClick}>Explore Features</a>
            </div>
          </div>
          <div className="dots">
            <span></span><span></span><span></span><span></span>
          </div>
        </div>
      </section>

      {/* ===================== BENEFITS SECTION ===================== */}
      <section className="benefits-section">
        <div className="benefits-top-label animate-on-scroll">
          <div className="benefits-dot"></div> BENEFITS
        </div>
        <div className="benefits-hero">
          <div className="benefits-left animate-fade-left">
            <h2>ENHANCE<br />ROBOTIC<br />INTELLIGENCE</h2>
          </div>
          <div className="benefits-center animate-scale-in">
            <div className="benefits-circle-image"><img src="img/4.png" alt="AI efficiency visualization" loading="lazy" /></div>
            <button className="benefits-explore" aria-label="Explore benefits">
              <div className="benefits-explore-arrow">↗</div><span>explore</span>
            </button>
          </div>
          <div className="benefits-right animate-fade-right">
            <p>By combining AI and robotics, intelligent machines handle complex tasks, freeing human talent for higher‑value work.</p>
            <div className="benefits-read-more">Read More<div className="benefits-circle-sm">↗</div></div>
            <button className="benefits-work-btn">work with us<div className="benefits-dot"></div></button>
          </div>
        </div>
        <div className="benefits-list-item animate-on-scroll">
          <div className="benefits-number">2</div>
          <div className="benefits-small-img"><img src="https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=500&auto=format&fit=crop" alt="Streamline process" loading="lazy" /></div>
          <div className="benefits-item-text">STREAMLINE AI‑DRIVEN PROCESSES &amp; WORKFLOWS</div>
          <div className="benefits-menu-dots">•••</div>
        </div>
        <div className="benefits-list-item animate-on-scroll delay-200">
          <div className="benefits-number">3</div>
          <div className="benefits-small-img"><img src="https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=500&auto=format&fit=crop" alt="Safety improvement" loading="lazy" /></div>
          <div className="benefits-item-text">IMPROVE OPERATIONAL SAFETY &amp; ACCURACY</div>
          <div className="benefits-menu-dots">•••</div>
        </div>
      </section>

      {/* ===================== FEATURES SECTION ===================== */}
      <section className="features-section" id="features">
        <div className="features-header animate-on-scroll">
          <h2>FEATURES OF</h2>
          <h3>CYBERBEAT</h3>
        </div>
        <div className="features-slider stagger-children">
          {featureData.map((feature, index) => (
            <div
              key={index}
              className={`feature-card${activeFeature === index ? ' active' : ''}`}
              tabIndex="0"
              role="button"
              aria-expanded={activeFeature === index ? 'true' : 'false'}
              onClick={() => handleFeatureActivate(index)}
              onMouseEnter={() => handleFeatureActivate(index)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleFeatureActivate(index);
                }
              }}
            >
              <span className="number">{feature.number}</span>
              <div className="content">
                <div className="icon">{feature.icon}</div>
                <h4>{feature.title}</h4>
                <p>{feature.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== PROJECTS SECTION ===================== */}
      <section className="projects-section">
        <div className="projects-top-label animate-on-scroll">
          <div className="projects-dot"></div> PROJECTS
        </div>
        <div className="projects-main">
          <div className="projects-left animate-scale-in">
            <div className="projects-robot-box"><img src="img/2.png" alt="Autonomous warehouse robot" loading="lazy" /></div>
            <button className="projects-explore" aria-label="Explore project">
              <div className="projects-explore-arrow">↗</div><span>explore</span>
            </button>
            <div className="projects-floating-btns">
              <div className="projects-float-btn">•••</div>
              <div className="projects-float-btn">↙</div>
            </div>
          </div>
          <div className="projects-right">
            <div>
              <div className="projects-tags animate-fade-right">
                <div className="projects-tag active">⌁ logistics</div>
                <div className="projects-tag">✎ fulfillment</div>
                <div className="projects-tag">⬡ packaging</div>
              </div>
              <div className="projects-title-row">
                <div className="projects-title animate-fade-left">
                  <h2>AUTONOMOUS ROBOTIC WAREHOUSE SYSTEM</h2>
                  <p>Automate warehouse sorting, packing, and shipping with AI precision.</p>
                  <button className="projects-read-btn">read more<div className="projects-read-circle">↗</div></button>
                </div>
                <div className="projects-nav-arrows animate-fade-right">
                  <button className="projects-nav-btn" aria-label="Previous project">←</button>
                  <button className="projects-nav-btn" aria-label="Next project">→</button>
                </div>
              </div>
            </div>
            <div className="projects-bottom animate-on-scroll">
              <button className="projects-contact-btn">contact us<div className="projects-dot"></div></button>
              <div className="projects-system">
                <div className="projects-outer-ring" aria-hidden="true"></div>
                <div className="projects-system-text">{circleSpans}</div>
                <div className="projects-inner-circle"><img src="img/1.png" alt="AI system brain" loading="lazy" />
                  <div className="projects-play">▶</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== PRODUCTS SECTION ===================== */}
      <section className="products-section">
        <div className="products-top">
          <h2 className="products-title animate-on-scroll">
            <div className="products-title-dot"></div> AI Modules &amp; Sensors
          </h2>
          <p className="products-desc animate-on-scroll delay-200">Discover the modules and sensors that power our AI robots</p>
        </div>
        <table className="products-table">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Tags</th>
              <th scope="col">Price</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, idx) => (
              <tr
                key={idx}
                className={`animate-on-scroll ${product.delay}`}
                tabIndex="0"
                onMouseEnter={(e) => handleRowMouseEnter(e, product.img)}
                onMouseLeave={handleRowMouseLeave}
                onTouchStart={(e) => handleRowTouchStart(e, product.img)}
                onTouchEnd={handleRowTouchEnd}
                onTouchMove={handleRowTouchMove}
                onKeyDown={(e) => handleRowKeyDown(e, product.img)}
                onFocus={(e) => handleRowFocus(e, product.img)}
                onBlur={handleRowBlur}
              >
                <td className="products-product-name">{product.name}</td>
                <td>
                  <div className="products-tags-wrap">
                    {product.tags.map((tag, i) => (
                      <div key={i} className={`products-tag${product.tagDark && i === 0 ? ' dark' : ''}`}>{tag}</div>
                    ))}
                  </div>
                </td>
                <td className="products-price">{product.price}</td>
                <td><span className="products-arrow-btn" aria-hidden="true">→</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ===================== HOVER PREVIEW ===================== */}
      <div
        className="hover-preview"
        style={{
          opacity: previewData.visible ? 1 : 0,
          visibility: previewData.visible ? 'visible' : 'hidden',
          left: `${previewData.x}px`,
          top: `${previewData.y}px`,
        }}
      >
        <img ref={previewImgRef} src={previewData.visible ? previewData.imgSrc : ''} alt="Product preview" loading="lazy" />
      </div>

      {/* ===================== CTA SECTION ===================== */}
      <section className="cta-section" id="cta">
        <div className="cta-left animate-on-scroll">
          <div className="wire-head"></div>
          <h2>READY <br /> TO TRY <br /> CYBERBEAT?</h2>
          <p>Leave a request for a call and our manager will contact you soon</p>
          <div className="arrow-group"><span></span><span></span><span></span><span></span></div>
        </div>
        <div className="cta-right animate-on-scroll">
          <form className="cyber-form" onSubmit={handleCyberFormSubmit}>
            <input type="text" placeholder="First Name" required />
            <input type="text" placeholder="Last Name" required />
            <input type="tel" placeholder="Phone Number" required />
            <input type="email" placeholder="Email" required />
            <button type="submit">Send Request</button>
          </form>
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer className="site-footer">
        <div className="footer-grid stagger-children">
          <div className="footer-col">
            <h4>CYBERBEAT</h4>
            <p>Pioneering the future of audio technology with neural implant systems that redefine how you experience music.</p>
          </div>
          <div className="footer-col">
            <h4>Links</h4>
            <ul>
              <li><a href="#about" onClick={handleAnchorClick}>About</a></li>
              <li><a href="#features" onClick={handleAnchorClick}>Features</a></li>
              <li><a href="#guide" onClick={handleAnchorClick}>Usage Guide</a></li>
              <li><a href="#cta" onClick={handleAnchorClick}>Contact</a></li>
              <li><a href="#aironix" onClick={handleAnchorClick}>AIronix</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <ul>
              <li><a href="#">FAQs</a></li>
              <li><a href="#">Warranty</a></li>
              <li><a href="#">Returns</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>
          <div className="footer-col footer-newsletter">
            <h4>Stay Updated</h4>
            <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '16px' }}>Get the latest updates and offers.</p>
            <form onSubmit={handleNewsletterSubmit}>
              <input type="email" placeholder="Your email address" required />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
        <div className="footer-bottom">
          <span>&copy; 2026 CyberBeat & AIronix. All rights reserved.</span>
          <div className="footer-social">
            <a href="#" aria-label="Twitter">𝕏</a>
            <a href="#" aria-label="Instagram">◉</a>
            <a href="#" aria-label="YouTube">▶</a>
            <a href="#" aria-label="LinkedIn">◈</a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default App;