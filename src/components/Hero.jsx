import { useState, useRef, useEffect, useMemo } from "react";
import { useTheme } from "../context/theme.context";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLinkedinIn,
  faXTwitter,
  faGithub,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faXmark } from "@fortawesome/free-solid-svg-icons";

import {
  IconSun,
  IconMoon,
  IconArrowNarrowRight,
  IconMenu2,
  IconSparkles,
} from "@tabler/icons-react";

import "./Hero.css";

import blackName from "../assets/blackname.svg";
import lightNameImg from "../assets/whitename.svg";

import reactSvg from "../assets/react.svg";
import nodeSvg from "../assets/nodejs.svg";
import mongoSvg from "../assets/mongo.svg";
import expressSvg from "../assets/express.svg";
import blackimg from "../assets/Development-pana.svg";

import TechOrbPit from "./TechOrbPit";

gsap.registerPlugin(ScrollToPlugin);

const NAV_LINKS = [
  { label: "Services", id: "services" },
  { label: "Packages", id: "packages" },
  { label: "Our Work", id: "project" },
  { label: "Contact Us", id: "contact" },
];

const TECH_STACK = [
  "React.js", "Node.js", "Express", "MongoDB", "Next.js",
  "PHP", "MySQL", "Tailwind", "REST API", "GSAP",
];

const PARTICLE_COUNT = 22;

const Hero = () => {
  const { theme, toggleTheme } = useTheme();

  const imageRef = useRef(null);

  const [isaboutOpen, setisAboutOpen] = useState(false);
  const [isMenuOpen, setisMenuOpen] = useState(false);
  const [navSolid, setNavSolid] = useState(false);

  const heroRef = useRef(null);
  const menuRef = useRef(null);
  const textWrapRef = useRef(null);
  const glowRef = useRef(null);
  const avatarRef = useRef(null);
  const particlesRef = useRef(null);
  const ringRef = useRef(null);
  const auroraRef = useRef(null);

  const mouseRef = useRef({
    x: 0,
    y: 0,
    active: false,
  });

  const quickRefs = useRef({});

  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 2 + Math.random() * 3,
      })),
    []
  );

  /* =====================================================
     ENTRANCE TIMELINE
  ===================================================== */

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      tl.fromTo(
        ".light-icon",
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 }
      )

        .fromTo(
          ".nav-link",
          { y: -20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55, stagger: 0.08 },
          "-=0.45"
        )

        .fromTo(
          ".hero-eyebrow",
          { y: -14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          "-=0.3"
        )

        .fromTo(
          ".name",
          { x: -120, opacity: 0 },
          { x: 0, opacity: 1, duration: 1, ease: "power4.out" },
          "-=0.2"
        )

        .fromTo(
          ".name-logo svg",
          { y: -80, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 1, ease: "power3.out" },
          "-=0.65"
        )

        .fromTo(
          ".hero-stat-card",
          { y: 24, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.15, ease: "back.out(1.6)" },
          "-=0.7"
        )

        .fromTo(
          ".role",
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 },
          "-=0.55"
        )

        .fromTo(
          ".hero-cta-row > *",
          { y: 25, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.1, ease: "back.out(1.4)" },
          "-=0.45"
        )

        .fromTo(
          ".hero-marquee",
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.6 },
          "-=0.3"
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  /* =====================================================
     LOGO INTRO
  ===================================================== */

  useEffect(() => {
    if (!imageRef.current) return;

    gsap.fromTo(
      imageRef.current,
      { y: -100, opacity: 0, scale: 0.8 },
      { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "bounce.out" }
    );
  }, []);

  /* =====================================================
     BACKGROUND: AURORA DRIFT, ORBIT RING, PARTICLES
  ===================================================== */

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const blobs = auroraRef.current
        ? auroraRef.current.querySelectorAll(".hero-aurora")
        : [];

      blobs.forEach((blob, i) => {
        gsap.to(blob, {
          x: gsap.utils.random(-40, 40),
          y: gsap.utils.random(-30, 30),
          scale: gsap.utils.random(0.92, 1.12),
          duration: gsap.utils.random(7, 11),
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: i * 0.6,
        });
      });

      if (ringRef.current) {
        gsap.to(ringRef.current, {
          rotate: 360,
          duration: 40,
          ease: "none",
          repeat: -1,
        });
      }

      const dots = particlesRef.current
        ? particlesRef.current.querySelectorAll(".hero-particle")
        : [];

      dots.forEach((dot) => {
        gsap.to(dot, {
          y: gsap.utils.random(-70, -30),
          x: gsap.utils.random(-25, 25),
          opacity: gsap.utils.random(0.15, 0.7),
          duration: gsap.utils.random(4, 8),
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: gsap.utils.random(0, 3),
        });
      });
    });

    return () => mm.revert();
  }, []);

  /* =====================================================
     NAVBAR SCROLL STATE
  ===================================================== */

  useEffect(() => {
    const onScroll = () => setNavSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* =====================================================
     MOBILE MENU
  ===================================================== */

  useEffect(() => {
    if (!menuRef.current) return;

    if (isMenuOpen) {
      gsap.fromTo(
        menuRef.current,
        { autoAlpha: 0, y: -16 },
        { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" }
      );
      gsap.fromTo(
        menuRef.current.querySelectorAll(".mobile-nav-link"),
        { autoAlpha: 0, y: -10 },
        { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.06, delay: 0.1 }
      );
    }
  }, [isMenuOpen]);

  const goTo = (id) => {
    setisMenuOpen(false);
    const target = document.getElementById(id);
    if (!target) return;
    gsap.to(window, {
      duration: 1,
      ease: "power3.inOut",
      scrollTo: { y: target, offsetY: 90 },
    });
  };

  useEffect(() => {
    if (!isaboutOpen) return;

    gsap.fromTo(
      ".about-modal",
      { x: "-100%", opacity: 0 },
      { x: "0%", opacity: 1, duration: 1, ease: "power3.out" }
    );
  }, [isaboutOpen]);

  /* =====================================================
     MOUSE PARALLAX
  ===================================================== */

  useEffect(() => {
    if (!textWrapRef.current || !avatarRef.current || !glowRef.current) {
      return;
    }

    quickRefs.current = {
      textRotY: gsap.quickTo(textWrapRef.current, "rotateY", { duration: 0.9, ease: "power3.out" }),
      textRotX: gsap.quickTo(textWrapRef.current, "rotateX", { duration: 0.9, ease: "power3.out" }),
      textX: gsap.quickTo(textWrapRef.current, "x", { duration: 0.9, ease: "power3.out" }),
      textY: gsap.quickTo(textWrapRef.current, "y", { duration: 0.9, ease: "power3.out" }),
      avatarRotY: gsap.quickTo(avatarRef.current, "rotateY", { duration: 0.6, ease: "power3.out" }),
      avatarRotX: gsap.quickTo(avatarRef.current, "rotateX", { duration: 0.6, ease: "power3.out" }),
      glowX: gsap.quickTo(glowRef.current, "x", { duration: 0.3, ease: "power3.out" }),
      glowY: gsap.quickTo(glowRef.current, "y", { duration: 0.3, ease: "power3.out" }),
    };
  }, []);

  const handleMouseMove = (e) => {
    if (!heroRef.current) return;

    const rect = heroRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const relX = px - 0.5;
    const relY = py - 0.5;

    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    };

    const q = quickRefs.current;
    if (!q.textRotY) return;

    q.textRotY(relX * 6);
    q.textRotX(-relY * 6);
    q.textX(relX * 12);
    q.textY(relY * 8);

    q.avatarRotY(relX * 18);
    q.avatarRotX(-relY * 18);

    q.glowX(e.clientX - rect.left);
    q.glowY(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    mouseRef.current.active = false;

    const q = quickRefs.current;
    if (!q.textRotY) return;

    q.textRotY(0);
    q.textRotX(0);
    q.textX(0);
    q.textY(0);
    q.avatarRotY(0);
    q.avatarRotX(0);
  };

  return (
    <section
      className="hero-section"
      data-theme={theme}
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* =================================================
          NEW ADVANCED BACKGROUND (replaces the old contour SVG)
      ================================================= */}

      <div className="hero-bg" aria-hidden="true">
        <div className="hero-grid" />

        <div className="hero-aurora-wrap" ref={auroraRef}>
          <span className="hero-aurora hero-aurora--a" />
          <span className="hero-aurora hero-aurora--b" />
          <span className="hero-aurora hero-aurora--c" />
        </div>

        <div className="hero-particles" ref={particlesRef}>
          {particles.map((p) => (
            <span
              key={p.id}
              className="hero-particle"
              style={{
                left: `${p.left}%`,
                top: `${p.top}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="cursor-glow" ref={glowRef} />

      <TechOrbPit mouseRef={mouseRef} />

      <div className="grain-overlay" />

      {/* ================================================= NAVBAR ================================================= */}
      <header className={`hero-nav${navSolid ? " hero-nav--solid" : ""}`}>
        <div className="text">
          <img
            ref={imageRef}
            src={theme === "dark" ? lightNameImg : blackName}
            alt="KodeTech"
          />
        </div>

        <nav className="nav-links" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              className="nav-link"
              onClick={() => goTo(link.id)}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="nav-actions">
          <button
            className="light-icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <IconSun stroke={1.75} size={25} />
            ) : (
              <IconMoon stroke={1.75} size={25} />
            )}
          </button>

          <button
            className="menu-icon"
            onClick={() => setisMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <FontAwesomeIcon icon={faXmark} />
            ) : (
              <IconMenu2 stroke={1.75} size={22} />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <nav className="mobile-nav" ref={menuRef} aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                type="button"
                className="mobile-nav-link"
                onClick={() => goTo(link.id)}
              >
                {link.label}
              </button>
            ))}
          </nav>
        )}
      </header>

      <div className="mid-section">
        <div className="mid-section-text" ref={textWrapRef}>
          <span className="hero-eyebrow">
            <IconSparkles size={15} stroke={2} />
            Building digital products that work
          </span>

          <h1 className="name">Kode Tech</h1>

          <div className="role">
            <span>Web & Mobile Solutions for the Digital Future</span>
          </div>

          <div className="hero-cta-row">
            <button
              className="about-me-button"
              onClick={() => setisAboutOpen(true)}
            >
              <span className="about-me-btn-text">About Us</span>
              <IconArrowNarrowRight size={20} stroke={2} />
            </button>

            <button className="hero-quote-button" onClick={() => goTo("contact")}>
              Get Quote
            </button>
          </div>

          <div className="hero-marquee">
            <div className="hero-marquee-track">
              {[...TECH_STACK, ...TECH_STACK].map((tech, i) => (
                <span className="hero-marquee-item" key={`${tech}-${i}`}>
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* =================================================
            K LOGO + ORBIT RING + STAT CARDS
        ================================================= */}

        <div className="name-logo">
          <span className="hero-orbit-ring" ref={ringRef} />

          <div className="hero-stat-card hero-stat-card--a">
            <strong>10+</strong>
            <span>Projects delivered</span>
          </div>

          <div className="hero-stat-card hero-stat-card--b">
            <strong>2</strong>
            <span>Stacks: MERN & PHP</span>
          </div>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="600"
            height="600"
            viewBox="0 0 512 512"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient
                id="leftAurora"
                x1="54" y1="342" x2="224" y2="117"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#5B8CFF" />
                <stop offset="55%" stopColor="#7C5CFC" />
                <stop offset="100%" stopColor="#A78BFA" />
              </linearGradient>

              <linearGradient
                id="rightAurora"
                x1="211" y1="303" x2="458" y2="37"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#7C5CFC" />
                <stop offset="45%" stopColor="#5B8CFF" />
                <stop offset="78%" stopColor="#00D9FF" />
                <stop offset="100%" stopColor="#FF4ECD" />
              </linearGradient>
            </defs>

            <path
              d="
                M74 117
                H169
                L224 215
                L151 342
                H54
                L124 217
                Z
              "
              fill="url(#leftAurora)"
            />

            <path
              d="
                M361 37
                H458
                L311 300
                L403 472
                L307 475
                L211 303
                Z
              "
              fill="url(#rightAurora)"
            />
          </svg>
        </div>

        <div className="social-icons">
          <a
            href="https://www.linkedin.com/in/kamlesh-kumar-763367299"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faLinkedinIn} />
          </a>

          <a href="mailto:kamleshkumar223678@gmail.com">
            <FontAwesomeIcon icon={faEnvelope} />
          </a>

          <a
            href="https://www.instagram.com/kumar_k_ks"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faInstagram} />
          </a>

          <a href="https://x.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faXTwitter} />
          </a>

          <a
            href="https://github.com/kamlesh2236-ks"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faGithub} />
          </a>
        </div>

        <div className="scroll-cue" aria-hidden="true">
          <span />
        </div>
      </div>

      {isaboutOpen && (
        <div
          className="aboutModal-overlay"
          onClick={() => setisAboutOpen(false)}
        >
          <div className="about-modal" onClick={(e) => e.stopPropagation()}>
            <div className="about-head">
              <h1>About Us</h1>

              <button
                onClick={() => setisAboutOpen(false)}
                aria-label="Close about modal"
              >
                <FontAwesomeIcon icon={faXmark} className="Modal-closeBtn" />
              </button>
            </div>

            <div className="about-body">
              <div className="about-left">
                <p>
                  KodeTech is a modern digital development service that helps
                  businesses and individuals build professional websites, web
                  applications, and mobile apps. We combine creative design
                  with the latest technology to create fast, responsive,
                  secure, and user-friendly digital solutions that turn ideas
                  into reality.
                </p>

                <ul className="about-services">
                  <li>Business Websites & Landing Pages</li>
                  <li>Full Stack Web Applications</li>
                  <li>Admin Panels & Dashboards</li>
                  <li>Mobile-Friendly & Responsive Design</li>
                  <li>Deployment, Maintenance & Support</li>
                </ul>

                <div className="skills">
                  <p>#react.js</p>
                  <p>#node.js</p>
                  <p>#express</p>
                  <p>#mongoDB</p>
                  <p>#nextjs</p>
                  <p>#html</p>
                  <p>#css</p>
                  <p>#javascript</p>
                  <p>#php</p>
                  <p>#mySql</p>
                  <p>#tailwind</p>
                  <p>#bootstrap</p>
                  <p>#git</p>
                  <p>#github</p>
                  <p>#restApi</p>
                  <p>#cloudinary</p>
                  <p>#gsap</p>
                  <p>#imagekit</p>
                </div>
              </div>

              <div className="about-right" ref={avatarRef}>
                <img src={blackimg} alt="About Me" />
              </div>
            </div>

            <div className="mern">
              <div className="mongo-icon">
                <div className="iconName-overlay">
                  <span>MongoDB</span>
                </div>
                <img src={mongoSvg} alt="MongoDB" />
                <h2 style={{ color: "#4ba74b" }}>M</h2>
              </div>

              <div className="express-icon">
                <div className="iconName-overlay">
                  <span>Express.js</span>
                </div>
                <img src={expressSvg} alt="Express.js" />
                <h2>E</h2>
              </div>

              <div className="react-icon">
                <div className="iconName-overlay">
                  <span>React.js</span>
                </div>
                <img src={reactSvg} alt="React.js" />
                <h2 style={{ color: "#00d8ff" }}>R</h2>
              </div>

              <div className="node-icon">
                <div className="iconName-overlay">
                  <span>Node.js</span>
                </div>
                <img src={nodeSvg} alt="Node.js" />
                <h2 style={{ color: "#539e43" }}>N</h2>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;