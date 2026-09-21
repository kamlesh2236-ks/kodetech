import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faGlobe,
    faLayerGroup,
    faGraduationCap,
    faBellConcierge,
    faWandMagicSparkles,
    faCheck,
} from "@fortawesome/free-solid-svg-icons";
import "./Packages.css";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const PACKAGES = [
    {
        name: "Basic Website",
        icon: faGlobe,
        color: "var(--blue)",
        desc: "For small businesses and professionals who need a simple online presence.",
        features: [
            "3-page website",
            "Home, About, Contact",
            "Mobile-friendly design",
            "Basic enquiry form",
            "WhatsApp / call button",
        ],
    },
    {
        name: "Standard Website",
        icon: faLayerGroup,
        color: "var(--accent)",
        badge: "Popular",
        popular: true,
        desc: "For organisations that need a more complete website.",
        features: [
            "Up to 5 pages",
            "Services / products section",
            "Enquiry form",
            "Gallery or portfolio section",
            "Basic SEO structure",
            "Mobile-friendly design",
        ],
    },
    {
        name: "College / Institute",
        icon: faGraduationCap,
        color: "var(--cyan)",
        badge: "Most complete",
        desc: "For colleges, schools, coaching centres and training institutes.",
        features: [
            "Home page",
            "About institution",
            "Courses / departments",
            "Notices & events section",
            "Gallery",
            "Admission enquiry form",
            "Contact page",
        ],
    },
    {
        name: "Restaurant & Hotel Management",
        icon: faBellConcierge,
        color: "var(--pink)",
        badge: "Full system",
        desc: "For restaurants, hotels and shops that want to run daily work from one system.",
        features: [
            "Menu, rooms & product management",
            "Orders & booking management",
            "Billing & invoices",
            "Staff & admin dashboard",
            "Sales & stock reports",
            "Customer records",
        ],
    },
    {
        name: "Custom Package",
        icon: faWandMagicSparkles,
        color: "var(--accent)",
        badge: "Made for you",
        custom: true,
        desc: "For ideas that don't fit a box. Tell us what you want to build and we shape the plan around it.",
        features: [
            "Requirement discussion",
            "Custom design & features",
            "SaaS, portals & AI tools",
            "Integrations & automation",
            "Deployment & support",
        ],
    },
];

const TILT = [-9, -4, 0, 4, 9];

export default function Packages({ onQuote, contactId = "contact", offsetY = 0 }) {
    const rootRef = useRef(null);
    const gridRef = useRef(null);

    useLayoutEffect(() => {
        const grid = gridRef.current;
        const cards = Array.from(grid.children);
        const mm = gsap.matchMedia();

        mm.add(
            "(min-width: 1000px) and (prefers-reduced-motion: no-preference)",
            () => {
                gsap
                    .timeline({
                        scrollTrigger: {
                            trigger: grid,
                            start: "top 90%",
                            end: "bottom 80%",
                            scrub: 0.8,
                            invalidateOnRefresh: true,
                        },
                    })
                    .fromTo(
                        cards,
                        {
                            x: (i, el) =>
                                grid.offsetWidth / 2 - (el.offsetLeft + el.offsetWidth / 2),
                            y: (i, el) =>
                                grid.offsetHeight / 2 - (el.offsetTop + el.offsetHeight / 2),
                            rotate: (i) => TILT[i] ?? 0,
                            scale: 0.86,
                            autoAlpha: 0,
                            zIndex: (i) => 10 - Math.abs(i - 2),
                        },
                        {
                            x: 0,
                            y: 0,
                            rotate: 0,
                            scale: 1,
                            autoAlpha: 1,
                            zIndex: 1,
                            ease: "power3.out",
                            duration: 1,
                            stagger: 0.12,
                        }
                    );
            }
        );

        mm.add(
            "(max-width: 999px) and (prefers-reduced-motion: no-preference)",
            () => {
                cards.forEach((card) => {
                    gsap.from(card, {
                        y: 48,
                        autoAlpha: 0,
                        duration: 0.7,
                        ease: "power3.out",
                        scrollTrigger: { trigger: card, start: "top 88%" },
                    });
                });
            }
        );

        return () => mm.revert();
    }, []);

    const trackPointer = (e) => {
        const el = e.currentTarget;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };

    const goToContact = (e, name) => {
        e.preventDefault();
        onQuote?.(name);
        const target = document.getElementById(contactId);
        if (!target) {
            console.warn(`Packages: no element found with id "${contactId}"`);
            return;
        }
        gsap.to(window, {
            duration: 1.2,
            ease: "power3.inOut",
            scrollTo: { y: target, offsetY },
        });
    };

    return (
        <section
            id="packages"
            className="pkg"
            ref={rootRef}
            aria-labelledby="pkg-title"
        >
            <div className="pkg-inner">
                <header className="pkg-head">
                    <h2 id="pkg-title">Our Packages</h2>
                    <p>
                        Pick a starting point that fits your work. Every project is quoted
                        after we understand what you need, so there is no fixed price to
                        decode.
                    </p>
                </header>

                <div className="pkg-grid" ref={gridRef}>
                    {PACKAGES.map((p) => (
                        <article
                            key={p.name}
                            className={`pkg-card${p.popular ? " pkg-card--popular" : ""}${p.custom ? " pkg-card--custom" : ""
                                }`}
                            style={{ "--pkg": p.color }}
                            onPointerMove={trackPointer}
                        >
                            <div className="pkg-top">
                                <span className="pkg-tile">
                                    <FontAwesomeIcon icon={p.icon} />
                                </span>
                                {p.badge && <span className="pkg-badge">{p.badge}</span>}
                            </div>

                            <h3>{p.name}</h3>
                            <p className="pkg-desc">{p.desc}</p>

                            <ul className="pkg-list">
                                {p.features.map((f) => (
                                    <li key={f}>
                                        <span className="pkg-check">
                                            <FontAwesomeIcon icon={faCheck} />
                                        </span>
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <a
                                className="pkg-btn"
                                href={`#${contactId}`}
                                onClick={(e) => goToContact(e, p.name)}
                            >
                                Get Quote
                            </a>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}