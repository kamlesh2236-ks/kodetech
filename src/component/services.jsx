import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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

gsap.registerPlugin(ScrollTrigger);

const COLORS = ["var(--accent)", "var(--cyan)", "var(--pink)", "var(--blue)"];

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
    const stRef = useRef(null);
    const n = SERVICES.length;

    useLayoutEffect(() => {
        const root = rootRef.current;
        const mm = gsap.matchMedia();

        mm.add("(prefers-reduced-motion: no-preference)", () => {
            const panels = Array.from(root.querySelectorAll(".svc-panel"));
            const ghosts = Array.from(root.querySelectorAll(".svc-ghost"));
            const items = Array.from(root.querySelectorAll(".svc-item"));
            const fill = root.querySelector(".svc-fill");
            let current = -1;

            const setActive = (i) => {
                if (i === current) return;
                current = i;
                items.forEach((el, k) => {
                    el.classList.toggle("is-active", k === i);
                    if (k === i) el.setAttribute("aria-current", "true");
                    else el.removeAttribute("aria-current");
                });
                countRef.current.textContent = `${pad(i + 1)} / ${pad(n)}`;
            };
            setActive(0);

            const tl = gsap.timeline({
                defaults: { ease: "none" },
                scrollTrigger: {
                    trigger: root,
                    start: "top top",
                    end: () => "+=" + window.innerHeight * n * 0.7,
                    pin: true,
                    scrub: 0.6,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    onUpdate: (self) =>
                        setActive(Math.min(n - 1, Math.floor(self.progress * n))),
                },
            });

            stRef.current = tl.scrollTrigger;

            tl.to(fill, { scaleX: 1, duration: n }, 0);

            panels.forEach((panel, i) => {
                if (i > 0) {
                    tl.to(
                        panels[i - 1],
                        { autoAlpha: 0, y: -48, duration: 0.3, ease: "power2.in" },
                        i - 0.3
                    );
                    tl.fromTo(
                        panel,
                        { autoAlpha: 0, y: 48 },
                        { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" },
                        i - 0.15
                    );
                }
                tl.fromTo(
                    ghosts[i],
                    { rotate: -14, scale: 0.85 },
                    { rotate: 10, scale: 1.08, duration: 1.3 },
                    Math.max(0, i - 0.3)
                );
            });

            tl.to({}, { duration: 0.01 }, n - 0.01);

            return () => {
                stRef.current = null;
            };
        });

        mm.add("(prefers-reduced-motion: reduce)", () => {
            root.classList.add("svc--static");
            return () => root.classList.remove("svc--static");
        });

        return () => mm.revert();
    }, [n]);

    const jump = (i) => {
        const st = stRef.current;
        if (st) {
            st.scroll(st.start + ((i + 0.5) / n) * (st.end - st.start));
            return;
        }
        rootRef.current
            .querySelectorAll(".svc-panel")
        [i]?.scrollIntoView({ behavior: "smooth", block: "center" });
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
                        <div className="svc-bar">
                            <span className="svc-fill" />
                        </div>
                    </div>
                </header>

                <div className="svc-body">
                    <div className="svc-stage">
                        {SERVICES.map((s, i) => (
                            <article
                                key={s.title}
                                className={`svc-panel${i === 0 ? " is-first" : ""}`}
                                style={{ "--svc": COLORS[i % COLORS.length] }}
                            >
                                <FontAwesomeIcon icon={s.icon} className="svc-ghost" />

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
                                className="svc-item"
                                style={{ "--svc": COLORS[i % COLORS.length] }}
                                onClick={() => jump(i)}
                            >
                                <FontAwesomeIcon icon={s.icon} />
                                <span>{s.title}</span>
                            </button>
                        ))}
                    </nav>
                </div>
            </div>
        </section>
    );
}