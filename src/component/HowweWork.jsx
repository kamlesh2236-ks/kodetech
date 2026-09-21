import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCommentDots,
    faDiagramProject,
    faPenRuler,
    faEye,
    faRocket,
} from "@fortawesome/free-solid-svg-icons";
import "./HowweWork.css";

gsap.registerPlugin(ScrollTrigger);

const TITLE = "A simple process from idea to launch";

const STEPS = [
    {
        title: "Requirement",
        icon: faCommentDots,
        color: "var(--blue)",
        text: "You tell us what you need — your pages, features, content, and deadline. We listen carefully and ask the right questions.",
    },
    {
        title: "Planning",
        icon: faDiagramProject,
        color: "var(--cyan)",
        text: "We suggest the right structure, package, and technical approach based on your goals and budget.",
    },
    {
        title: "Design & Build",
        icon: faPenRuler,
        color: "var(--accent)",
        text: "We create the website or system with a clean, professional design that represents your organisation well.",
    },
    {
        title: "Review",
        icon: faEye,
        color: "var(--pink)",
        text: "You check the work and request changes before launch. We make sure everything meets your expectations.",
    },
    {
        title: "Launch & Support",
        icon: faRocket,
        color: "var(--cyan)",
        text: "We launch the project and support you with updates, fixes, or future improvements as your business grows.",
    },
];

const pad = (v) => String(v).padStart(2, "0");

export default function HowWeWork() {
    const rootRef = useRef(null);

    useLayoutEffect(() => {
        const root = rootRef.current;
        const stepsEl = root.querySelector(".hww-steps");
        const steps = Array.from(root.querySelectorAll(".hww-step"));

        const setTrack = () => {
            const last = steps[steps.length - 1];
            const node = last.querySelector(".hww-node");
            const center = last.offsetTop + node.offsetTop + node.offsetHeight / 2;
            stepsEl.style.setProperty(
                "--track-bottom",
                `${stepsEl.offsetHeight - center}px`
            );
        };

        setTrack();
        ScrollTrigger.addEventListener("refreshInit", setTrack);
        document.fonts?.ready.then(() => ScrollTrigger.refresh());

        const mm = gsap.matchMedia();

        mm.add(
            {
                desktop: "(min-width: 900px)",
                reduce: "(prefers-reduced-motion: reduce)",
            },
            (context) => {
                const { desktop, reduce } = context.conditions;

                if (reduce) {
                    root.classList.add("hww--static");
                    steps.forEach((s) => s.classList.add("is-active"));
                    return () => {
                        root.classList.remove("hww--static");
                        steps.forEach((s) => s.classList.remove("is-active"));
                    };
                }

                const words = root.querySelectorAll(".hww-word");
                const track = root.querySelector(".hww-track");
                const fill = root.querySelector(".hww-fill");
                const blobs = root.querySelectorAll(".hww-blob");

                gsap.fromTo(
                    words,
                    { opacity: 0.18 },
                    {
                        opacity: 1,
                        ease: "none",
                        stagger: 0.12,
                        scrollTrigger: {
                            trigger: root.querySelector(".hww-title"),
                            start: "top 85%",
                            end: "bottom 55%",
                            scrub: true,
                        },
                    }
                );

                blobs.forEach((blob, i) => {
                    gsap.fromTo(
                        blob,
                        { yPercent: i ? 20 : -20 },
                        {
                            yPercent: i ? -20 : 20,
                            ease: "none",
                            scrollTrigger: {
                                trigger: root,
                                start: "top bottom",
                                end: "bottom top",
                                scrub: true,
                            },
                        }
                    );
                });

                gsap.to(fill, {
                    height: "100%",
                    ease: "none",
                    scrollTrigger: {
                        trigger: track,
                        start: "top 60%",
                        end: "bottom 60%",
                        scrub: 0.5,
                    },
                });

                steps.forEach((step) => {
                    const card = step.querySelector(".hww-card");
                    const node = step.querySelector(".hww-node");
                    const fromX = desktop
                        ? step.classList.contains("is-right")
                            ? 70
                            : -70
                        : 50;

                    gsap.set(card, { autoAlpha: 0, x: fromX });

                    const tl = gsap
                        .timeline({ paused: true })
                        .to(node, { scale: 1.2, duration: 0.2, ease: "power2.out" })
                        .to(node, { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.5)" })
                        .to(
                            card,
                            { autoAlpha: 1, x: 0, duration: 0.8, ease: "power3.out" },
                            0.1
                        );

                    ScrollTrigger.create({
                        trigger: node,
                        start: "center 60%",
                        end: "max",
                        onEnter: () => {
                            step.classList.add("is-active");
                            tl.play();
                        },
                        onLeaveBack: () => {
                            step.classList.remove("is-active");
                            tl.reverse();
                        },
                    });
                });

                return () => steps.forEach((s) => s.classList.remove("is-active"));
            }
        );

        return () => {
            ScrollTrigger.removeEventListener("refreshInit", setTrack);
            mm.revert();
        };
    }, []);

    return (
        <section
            id="how-we-work"
            className="hww"
            ref={rootRef}
            aria-labelledby="hww-title"
        >
            <span className="hww-blob hww-blob--a" aria-hidden="true" />
            <span className="hww-blob hww-blob--b" aria-hidden="true" />

            <div className="hww-inner">
                <header className="hww-head">
                    <span className="hww-eyebrow">How we work</span>

                    <h2 id="hww-title" className="hww-title">
                        {TITLE.split(" ").map((w, i) => (
                            <span key={i}>
                                <span className="hww-word">{w}</span>{" "}
                            </span>
                        ))}
                    </h2>

                    <p>
                        No complexity, no confusion — just a clear path to delivering your
                        project on time.
                    </p>
                </header>

                <div className="hww-steps">
                    <div className="hww-track" aria-hidden="true">
                        <span className="hww-fill" />
                    </div>

                    {STEPS.map((s, i) => (
                        <article
                            key={s.title}
                            className={`hww-step ${i % 2 === 0 ? "is-right" : "is-left"}`}
                            style={{ "--st": s.color }}
                        >
                            <span className="hww-node">
                                <FontAwesomeIcon icon={s.icon} />
                            </span>

                            <div className="hww-card">
                                <span className="hww-num">Step {pad(i + 1)}</span>
                                <h3>{s.title}</h3>
                                <p>{s.text}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}