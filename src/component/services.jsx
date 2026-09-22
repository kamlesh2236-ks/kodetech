import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCode,
    faMobileScreenButton,
    faLaptopCode,
    faScrewdriverWrench,
    faComments,
    faMicrophoneLines,
    faBullhorn,
    faRectangleAd,
    faChartLine,
    faTableCells,
} from "@fortawesome/free-solid-svg-icons";
import "./services.css";

const COLORS = ["var(--accent)", "var(--cyan)", "var(--pink)", "var(--blue)"];

// Seconds each tab stays active before auto-advancing to the next one.
const SLIDE_DURATION = 5;

const SERVICES = [
    {
        title: "Web Development",
        icon: faCode,
        text: "Fast, responsive websites and web apps built with React, Next.js, Node.js, PHP and MySQL, from online stores to complete management systems.",
        tags: [
            "Business websites",
            "E-commerce web apps",
            "Hospital management",
            "Restaurant management",
            "Educational websites",
            "Admin panels",
            "Custom web apps",
        ],
    },
    {
        title: "App Development",
        icon: faMobileScreenButton,
        text: "Mobile apps that feel smooth on every phone, from the first screen to the store launch.",
        tags: ["Android & iOS", "Cross-platform", "API integration", "Store publishing"],
    },
    {
        title: "Software Development",
        icon: faLaptopCode,
        text: "Custom software shaped around how your business really works, from billing to full SaaS products.",
        tags: ["Custom software", "SaaS products", "Billing & inventory", "Multi-user dashboards"],
    },
    {
        title: "Website Maintenance",
        icon: faScrewdriverWrench,
        text: "We keep your website fast, secure and up to date, so you can focus on running your business.",
        tags: ["Bug fixes", "Updates & backups", "Security checks", "Speed tuning"],
    },
    {
        title: "AI Chat Support",
        icon: faComments,
        text: "An AI assistant trained on your business that answers customer questions any time of day.",
        tags: ["24/7 replies", "Trained on your data", "Lead capture", "Human handoff"],
    },
    {
        title: "AI Voice Agent",
        icon: faMicrophoneLines,
        text: "Voice agents that pick up calls, answer questions and book appointments without a missed ring.",
        tags: ["Inbound calls", "Appointment booking", "Multi-language", "Call summaries"],
    },
    {
        title: "Digital Marketing",
        icon: faBullhorn,
        text: "SEO, social media and content that bring the right customers to your business.",
        tags: ["SEO", "Social media", "Content plans", "Local reach"],
    },
    {
        title: "Meta & Google Ads",
        icon: faRectangleAd,
        text: "Paid campaigns on Facebook, Instagram and Google, tracked all the way to leads and sales.",
        tags: ["Campaign setup", "Audience targeting", "Conversion tracking", "Monthly reports"],
    },
    {
        title: "Data Analytics",
        icon: faChartLine,
        text: "Turn scattered business data into clear dashboards and insights you can act on.",
        tags: ["Dashboards", "Sales reports", "Data cleaning", "Trend analysis"],
    },
    {
        title: "MIS Expert (Advanced Excel)",
        icon: faTableCells,
        text: "Automated MIS reports, formulas and dashboards in Excel that save hours every week.",
        tags: ["MIS reports", "Pivot tables", "Macros & VBA", "Excel dashboards"],
    },
];

const pad = (v) => String(v).padStart(2, "0");

export default function Services() {
    const rootRef = useRef(null);
    const countRef = useRef(null);
    const panelRefs = useRef([]);
    const ghostRefs = useRef([]);
    const progressRefs = useRef([]);
    const progressTweenRef = useRef(null);
    const reducedMotionRef = useRef(false);

    const [active, setActive] = useState(0);
    const n = SERVICES.length;

    // Track prefers-reduced-motion once, live.
    useLayoutEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        reducedMotionRef.current = mq.matches;
        const onChange = (e) => {
            reducedMotionRef.current = e.matches;
        };
        mq.addEventListener("change", onChange);
        return () => mq.removeEventListener("change", onChange);
    }, []);

    // Crossfade the panels + spin the ghost icon whenever the active tab changes.
    useLayoutEffect(() => {
        const panels = panelRefs.current;
        const ghosts = ghostRefs.current;
        const reduced = reducedMotionRef.current;

        panels.forEach((panel, i) => {
            if (!panel) return;
            gsap.killTweensOf(panel);
            if (i === active) {
                gsap.fromTo(
                    panel,
                    reduced ? { autoAlpha: 1, y: 0 } : { autoAlpha: 0, y: 32 },
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration: reduced ? 0 : 0.5,
                        ease: "power3.out",
                    }
                );
            } else {
                gsap.to(panel, {
                    autoAlpha: 0,
                    y: reduced ? 0 : -24,
                    duration: reduced ? 0 : 0.35,
                    ease: "power2.in",
                });
            }
        });

        const ghost = ghosts[active];
        if (ghost && !reduced) {
            gsap.killTweensOf(ghost);
            gsap.fromTo(
                ghost,
                { rotate: -14, scale: 0.85 },
                { rotate: 10, scale: 1.08, duration: SLIDE_DURATION * 0.9, ease: "none" }
            );
        }

        if (countRef.current) {
            countRef.current.textContent = `${pad(active + 1)} / ${pad(n)}`;
        }
    }, [active, n]);

    // Per-tab progress bars: filled for past tabs, animating for the active
    // one, empty for the rest. When it finishes, auto-advance to the next tab.
    useEffect(() => {
        progressTweenRef.current?.kill();

        progressRefs.current.forEach((bar, i) => {
            if (!bar) return;
            gsap.killTweensOf(bar);
            if (i < active) gsap.set(bar, { scaleX: 1 });
            else if (i > active) gsap.set(bar, { scaleX: 0 });
        });

        const bar = progressRefs.current[active];
        if (!bar) return;

        if (reducedMotionRef.current) {
            gsap.set(bar, { scaleX: 1 });
            return;
        }

        gsap.set(bar, { scaleX: 0 });
        progressTweenRef.current = gsap.to(bar, {
            scaleX: 1,
            duration: SLIDE_DURATION,
            ease: "none",
            onComplete: () => setActive((prev) => (prev + 1) % n),
        });

        return () => progressTweenRef.current?.kill();
    }, [active, n]);

    // Pause autoplay while the user is hovering / focused inside the section.
    useEffect(() => {
        const root = rootRef.current;
        const pause = () => progressTweenRef.current?.pause();
        const resume = () => progressTweenRef.current?.play();
        root.addEventListener("mouseenter", pause);
        root.addEventListener("mouseleave", resume);
        root.addEventListener("focusin", pause);
        root.addEventListener("focusout", resume);
        return () => {
            root.removeEventListener("mouseenter", pause);
            root.removeEventListener("mouseleave", resume);
            root.removeEventListener("focusin", pause);
            root.removeEventListener("focusout", resume);
        };
    }, []);

    const selectTab = (i) => {
        if (i === active) return;
        setActive(i);
    };

    return (
        <section
            id="services"
            className="svc"
            ref={rootRef}
            aria-labelledby="svc-title"
        >
            <div className="svc-pin">
                <header className="svc-head">
                    <div className="svc-head-text">
                        <h2 id="svc-title">Our Services</h2>
                        <p>
                            From your first website to AI agents that answer your calls, one
                            team takes care of it all.
                        </p>
                    </div>

                    <div className="svc-meter" aria-hidden="true">
                        <span className="svc-count" ref={countRef}>
                            01 / {pad(n)}
                        </span>
                    </div>
                </header>

                <div className="svc-body">
                    <div className="svc-stage">
                        {SERVICES.map((s, i) => (
                            <article
                                key={s.title}
                                ref={(el) => (panelRefs.current[i] = el)}
                                className={`svc-panel${i === active ? " is-active" : ""}`}
                                style={{ "--svc": COLORS[i % COLORS.length] }}
                                aria-hidden={i !== active}
                            >
                                <span
                                    className="svc-ghost"
                                    ref={(el) => (ghostRefs.current[i] = el)}
                                >
                                    <FontAwesomeIcon icon={s.icon} />
                                </span>

                                <span className="svc-tile">
                                    <FontAwesomeIcon icon={s.icon} />
                                </span>

                                <div className="svc-copy">
                                    <h3>{s.title}</h3>
                                    <p>{s.text}</p>
                                    <ul className="svc-tags">
                                        {s.tags.map((t) => (
                                            <li key={t}>{t}</li>
                                        ))}
                                    </ul>
                                </div>
                            </article>
                        ))}
                    </div>

                    <nav className="svc-list" aria-label="All services">
                        {SERVICES.map((s, i) => (
                            <button
                                key={s.title}
                                type="button"
                                className={`svc-item${i === active ? " is-active" : ""}`}
                                style={{ "--svc": COLORS[i % COLORS.length] }}
                                onClick={() => selectTab(i)}
                                aria-current={i === active ? "true" : undefined}
                            >
                                <FontAwesomeIcon icon={s.icon} />
                                <span>{s.title}</span>
                                <span className="svc-item-track" aria-hidden="true">
                                    <span
                                        className="svc-item-progress"
                                        ref={(el) => (progressRefs.current[i] = el)}
                                    />
                                </span>
                            </button>
                        ))}
                    </nav>
                </div>
            </div>
        </section>
    );
}