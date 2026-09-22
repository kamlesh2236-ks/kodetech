import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import {
    IconMail,
    IconPhone,
    IconMapPin,
    IconBrandGithub,
    IconBrandLinkedin,
    IconBrandX,
    IconCheck,
    IconChevronDown,
    IconSend,
} from "@tabler/icons-react";

import "./Contact.css";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const socialLinks = [
    { label: "GitHub", href: "https://github.com/", icon: IconBrandGithub },
    { label: "LinkedIn", href: "https://linkedin.com/", icon: IconBrandLinkedin },
    { label: "X", href: "https://x.com/", icon: IconBrandX },
];

const STEP_NAMES = [
    "Basic details",
    "Project type",
    "Website requirements",
    "Content & branding",
    "Budget & timeline",
    "Additional notes",
];

const STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
    "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
    "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
    "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman & Nicobar Islands",
    "Chandigarh", "Dadra & Nagar Haveli and Daman & Diu", "Delhi", "Jammu & Kashmir",
    "Ladakh", "Lakshadweep", "Puducherry",
];

const ROLES = [
    "Owner / Founder",
    "Director / Principal",
    "Manager",
    "Marketing / Sales",
    "Student / Individual",
    "Other",
];

const PROJECT_TYPES = [
    "Basic Website",
    "Standard Website",
    "College / Institute",
    "Restaurant & Hotel Management",
    "Custom Package",
    "Web Development",
    "App Development",
    "Software Development",
    "Website Maintenance",
    "AI Chat Support",
    "AI Voice Agent",
    "Digital Marketing",
    "Meta & Google Ads",
    "Data Analytics",
    "MIS Expert (Advanced Excel)",
    "Other",
];

const YES_NO = ["Yes", "No", "Not sure"];
const PAGE_COUNTS = ["1 – 3 pages", "4 – 5 pages", "6 – 10 pages", "10 – 20 pages", "20+ pages", "Not sure"];

const PAGES = [
    "Home", "About", "Services", "Courses / Departments", "Gallery", "Notices / Events",
    "Admission / Enquiry", "Contact", "Blog / News", "Portfolio", "Testimonials", "Other",
];

const FEATURES = [
    "Contact form", "Admission enquiry form", "WhatsApp button", "Google Maps", "Photo gallery",
    "Notice board", "Downloadable PDFs", "Payment link", "Login system", "Admin panel",
    "Google Sheet integration", "Email alerts", "WhatsApp automation", "AI chatbot", "Not sure",
];

const LOGO = ["Yes, I have one", "No", "I need one designed"];
const CONTENT = ["Yes, ready", "Partly ready", "No, I need help"];
const PHOTOS = ["Yes", "Some", "No"];

const BUDGETS = [
    "Under ₹10,000",
    "₹10,000 – ₹25,000",
    "₹25,000 – ₹50,000",
    "₹50,000 – ₹1,00,000",
    "Above ₹1,00,000",
    "Not sure, please suggest",
];

const DEADLINES = ["Within 1 week", "Within 2 weeks", "Within 1 month", "2 – 3 months", "Flexible"];
const HOSTING = ["Yes, hosting and domain", "Only hosting", "Only domain", "No, I have both", "Not sure"];
const MAINTENANCE = ["Yes", "No", "Maybe later"];
const CALL_TIMES = ["Morning (9 – 12)", "Afternoon (12 – 4)", "Evening (4 – 8)", "Anytime"];
const SOURCES = ["Google search", "Instagram", "Facebook", "LinkedIn", "Friend or referral", "Other"];

const INITIAL = {
    name: "", org: "", city: "", state: "", phone: "", email: "", role: "",
    projectType: "", hasWebsite: "", websiteLink: "",
    pagesCount: "", pages: [], features: [],
    logo: "", content: "", photos: "", brand: "", references: "",
    budget: "", deadline: "", hosting: "", maintenance: "",
    message: "", callTime: "", source: "",
};

const isEmail = (v) => /^\S+@\S+\.\S+$/.test(v.trim());
const digitsOf = (v) => v.replace(/\D/g, "");

const Field = ({ name, label, required, error, full, children }) => (
    <div
        className={`ct-field${full ? " ct-field--full" : ""}${error ? " has-error" : ""}`}
        data-field={name}
    >
        <label htmlFor={`ct-${name}`}>
            {label}
            {required && <span className="ct-req"> *</span>}
        </label>
        {children}
        {error && (
            <span className="ct-error" role="alert">
                {error}
            </span>
        )}
    </div>
);

const Section = ({ n, title, active, children }) => (
    <div
        className={`ct-section${active ? " is-active" : ""}`}
        role="group"
        aria-labelledby={`ct-s${n}`}
    >
        <header className="ct-section-head">
            <span className="ct-num">{n}</span>
            <h3 id={`ct-s${n}`}>{title}</h3>
        </header>
        <div className="ct-row">{children}</div>
    </div>
);

const Contact = ({ presetType, endpoint }) => {
    const sectionRef = useRef(null);
    const lineRef = useRef(null);
    const headingRef = useRef(null);
    const descRef = useRef(null);
    const railRef = useRef(null);
    const mainRef = useRef(null);
    const formRef = useRef(null);
    const successRef = useRef(null);
    const barRef = useRef(null);
    const buttonRef = useRef(null);

    const [form, setForm] = useState(INITIAL);
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState("idle");
    const [active, setActive] = useState(0);

    const sent = status === "sent";

    const done = [
        !!(form.name.trim() && digitsOf(form.phone).length >= 10 && isEmail(form.email)),
        !!form.projectType,
        !!(form.pagesCount || form.pages.length || form.features.length),
        !!(form.logo || form.content || form.photos || form.brand.trim() || form.references.trim()),
        !!(form.budget || form.deadline || form.hosting || form.maintenance),
        !!(form.message.trim() || form.callTime || form.source),
    ];
    const doneCount = done.filter(Boolean).length;

    useEffect(() => {
        if (presetType && PROJECT_TYPES.includes(presetType)) {
            setForm((f) => ({ ...f, projectType: presetType }));
        }
    }, [presetType]);

    useLayoutEffect(() => {
        const mm = gsap.matchMedia();

        mm.add("(prefers-reduced-motion: no-preference)", () => {
            gsap
                .timeline({
                    scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
                })
                .fromTo(
                    lineRef.current,
                    { scaleY: 0 },
                    { scaleY: 1, duration: 0.6, ease: "power2.out", transformOrigin: "top" }
                )
                .fromTo(
                    headingRef.current,
                    { opacity: 0, y: 18, scale: 0.94 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out" },
                    "-=0.15"
                )
                .fromTo(
                    descRef.current,
                    { opacity: 0, y: 14 },
                    { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
                    "-=0.4"
                )
                .fromTo(
                    railRef.current,
                    { autoAlpha: 0, x: -30 },
                    { autoAlpha: 1, x: 0, duration: 0.8, ease: "power3.out", clearProps: "transform" },
                    "-=0.3"
                );
        });

        return () => mm.revert();
    }, []);

    useLayoutEffect(() => {
        if (sent) return;

        const root = sectionRef.current;
        const secs = Array.from(root.querySelectorAll(".ct-section"));

        const spy = gsap.context(() => {
            secs.forEach((s, i) => {
                ScrollTrigger.create({
                    trigger: s,
                    start: "top 55%",
                    end: "bottom 55%",
                    onToggle: (self) => {
                        if (self.isActive) setActive(i);
                    },
                });
            });
        }, root);

        const mm = gsap.matchMedia();

        mm.add("(prefers-reduced-motion: no-preference)", () => {
            gsap.set(secs, { autoAlpha: 0, y: 40 });
            ScrollTrigger.batch(secs, {
                start: "top 88%",
                once: true,
                onEnter: (batch) =>
                    gsap.to(batch, {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.7,
                        stagger: 0.12,
                        ease: "power3.out",
                    }),
            });
        });

        return () => {
            spy.revert();
            mm.revert();
        };
    }, [sent]);

    useEffect(() => {
        gsap.to(barRef.current, {
            scaleX: doneCount / 6,
            duration: 0.6,
            ease: "power3.out",
        });
    }, [doneCount]);

    useEffect(() => {
        const button = buttonRef.current;
        if (!button || !window.matchMedia("(hover: hover)").matches) return;

        const xTo = gsap.quickTo(button, "x", { duration: 0.4, ease: "power3" });
        const yTo = gsap.quickTo(button, "y", { duration: 0.4, ease: "power3" });

        const handleMove = (e) => {
            const rect = button.getBoundingClientRect();
            xTo((e.clientX - (rect.left + rect.width / 2)) * 0.25);
            yTo((e.clientY - (rect.top + rect.height / 2)) * 0.35);
        };

        const handleLeave = () => {
            xTo(0);
            yTo(0);
        };

        button.addEventListener("mousemove", handleMove);
        button.addEventListener("mouseleave", handleLeave);

        return () => {
            button.removeEventListener("mousemove", handleMove);
            button.removeEventListener("mouseleave", handleLeave);
        };
    }, [status]);

    useEffect(() => {
        if (!sent || !successRef.current) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const el = successRef.current;
        const ring = el.querySelector(".ct-check-ring");
        const path = el.querySelector(".ct-check-path");

        const ctx = gsap.context(() => {
            const ringLen = ring.getTotalLength();
            const pathLen = path.getTotalLength();

            gsap.set(ring, { strokeDasharray: ringLen, strokeDashoffset: ringLen });
            gsap.set(path, { strokeDasharray: pathLen, strokeDashoffset: pathLen });

            gsap
                .timeline()
                .fromTo(el, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" })
                .to(ring, { strokeDashoffset: 0, duration: 0.7, ease: "power2.inOut" }, 0.1)
                .to(path, { strokeDashoffset: 0, duration: 0.45, ease: "power2.out" }, "-=0.2")
                .fromTo(
                    el.querySelectorAll(".ct-success-text > *"),
                    { autoAlpha: 0, y: 12 },
                    { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.4 },
                    "-=0.3"
                );

            gsap.to(window, {
                duration: 0.8,
                ease: "power3.inOut",
                scrollTo: { y: mainRef.current, offsetY: 120 },
            });
        }, el);

        return () => ctx.revert();
    }, [sent]);

    const update = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
        setErrors((er) => (er[name] ? { ...er, [name]: undefined } : er));
    };

    const toggle = (key, value, e) => {
        const el = e.currentTarget;
        setForm((f) => ({
            ...f,
            [key]: f[key].includes(value)
                ? f[key].filter((x) => x !== value)
                : [...f[key], value],
        }));
        gsap.fromTo(el, { scale: 0.9 }, { scale: 1, duration: 0.4, ease: "back.out(3)" });
    };

    const validate = () => {
        const er = {};
        if (!form.name.trim()) er.name = "Please enter your name";
        if (digitsOf(form.phone).length < 10) er.phone = "Enter a valid phone number";
        if (!isEmail(form.email)) er.email = "Enter a valid email address";
        if (!form.projectType) er.projectType = "Please choose what you need";
        return er;
    };

    const send = async (data) => {
        if (!endpoint) {
            await new Promise((r) => setTimeout(r, 1200));
            return;
        }
        const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Request failed");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (status === "sending") return;

        const er = validate();
        setErrors(er);
        const first = Object.keys(er)[0];

        if (first) {
            const el = formRef.current.querySelector(`[data-field="${first}"]`);
            gsap.to(window, {
                duration: 0.8,
                ease: "power3.inOut",
                scrollTo: { y: el, offsetY: 140 },
            });
            gsap.fromTo(el, { x: -8 }, { x: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
            return;
        }

        setStatus("sending");
        gsap.to(buttonRef.current, { scale: 0.96, duration: 0.15, yoyo: true, repeat: 1 });

        try {
            await send(form);
            setStatus("sent");
        } catch {
            setStatus("error");
        }
    };

    const reset = () => {
        setForm(INITIAL);
        setErrors({});
        setActive(0);
        setStatus("idle");
    };

    const jumpTo = (i) => {
        const el = sectionRef.current.querySelectorAll(".ct-section")[i];
        if (!el) return;
        gsap.to(window, {
            duration: 0.9,
            ease: "power3.inOut",
            scrollTo: { y: el, offsetY: 110 },
        });
    };

    const text = (name, label, o = {}) => (
        <Field name={name} label={label} required={o.required} error={errors[name]} full={o.full}>
            <input
                className="ct-input"
                id={`ct-${name}`}
                name={name}
                type={o.type || "text"}
                value={form[name]}
                onChange={update}
                placeholder={o.placeholder}
                disabled={o.disabled}
                inputMode={o.inputMode}
                autoComplete={o.autoComplete}
                aria-invalid={!!errors[name]}
            />
        </Field>
    );

    const pick = (name, label, options, o = {}) => (
        <Field name={name} label={label} required={o.required} error={errors[name]} full={o.full}>
            <div className={`ct-select${form[name] ? "" : " is-empty"}`}>
                <select
                    className="ct-input"
                    id={`ct-${name}`}
                    name={name}
                    value={form[name]}
                    onChange={update}
                    aria-invalid={!!errors[name]}
                >
                    <option value="">{o.placeholder || "Select..."}</option>
                    {options.map((opt) => (
                        <option key={opt} value={opt}>
                            {opt}
                        </option>
                    ))}
                </select>
                <IconChevronDown size={18} stroke={1.75} />
            </div>
        </Field>
    );

    const area = (name, label, o = {}) => (
        <Field name={name} label={label} full>
            <textarea
                className="ct-input"
                id={`ct-${name}`}
                name={name}
                rows={o.rows || 5}
                value={form[name]}
                onChange={update}
                placeholder={o.placeholder}
            />
        </Field>
    );

    const chips = (key, label, options) => (
        <div className="ct-field ct-field--full">
            <span className="ct-label">{label}</span>
            <div className="ct-chips" role="group" aria-label={label}>
                {options.map((opt) => {
                    const on = form[key].includes(opt);
                    return (
                        <button
                            key={opt}
                            type="button"
                            className={`ct-chip${on ? " is-on" : ""}`}
                            aria-pressed={on}
                            onClick={(e) => toggle(key, opt, e)}
                        >
                            {on && <IconCheck size={14} stroke={2.5} />}
                            {opt}
                        </button>
                    );
                })}
            </div>
        </div>
    );

    return (
        <section id="contact" className="ct" ref={sectionRef} aria-labelledby="ct-title">
            <span className="ct-blob ct-blob--a" aria-hidden="true" />
            <span className="ct-blob ct-blob--b" aria-hidden="true" />

            <div className="ct-inner">
                <div className="ct-head">
                    <div className="ct-head-line" ref={lineRef} />
                    <div>
                        <h2 id="ct-title" ref={headingRef}>
                            Let's Connect
                        </h2>
                        <p ref={descRef}>
                            Tell us about your project. The more you share, the better we can
                            plan it. Skip anything you are not sure about.
                        </p>
                    </div>
                </div>

                <div className="ct-grid">
                    <aside className="ct-rail" ref={railRef}>
                        <ul className="ct-details">
                            <li>
                                <span className="ct-detail-icon">
                                    <IconMail size={20} stroke={1.5} />
                                </span>
                                <a href="mailto:kodetechsupport@gmail.com">kodetechsupport@gmail.com</a>
                            </li>
                            <li>
                                <span className="ct-detail-icon">
                                    <IconPhone size={20} stroke={1.5} />
                                </span>
                                <span>
                                    <a href="tel:+918084124525">+91 8084124525</a>,{" "}
                                    <a href="tel:+916201802142">+91 6201802142</a>
                                </span>
                            </li>
                            <li>
                                <span className="ct-detail-icon">
                                    <IconMapPin size={20} stroke={1.5} />
                                </span>
                                <span>Patna, Bihar, India</span>
                            </li>
                        </ul>

                        <div className="ct-socials">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="ct-social"
                                    >
                                        <Icon size={18} stroke={1.5} />
                                        {social.label}
                                    </a>
                                );
                            })}
                        </div>

                        <div className="ct-progress">
                            <div className="ct-progress-head">
                                <span>Your request</span>
                                <span className="ct-count">{doneCount} / 6</span>
                            </div>

                            <div className="ct-bar" aria-hidden="true">
                                <span className="ct-bar-fill" ref={barRef} />
                            </div>

                            <ol className="ct-steps">
                                {STEP_NAMES.map((name, i) => (
                                    <li key={name}>
                                        <button
                                            type="button"
                                            className={`ct-step${active === i && !sent ? " is-active" : ""}${done[i] ? " is-done" : ""}`}
                                            onClick={() => jumpTo(i)}
                                            disabled={sent}
                                        >
                                            <span className="ct-step-dot">
                                                {done[i] ? <IconCheck size={14} stroke={3} /> : i + 1}
                                            </span>
                                            {name}
                                        </button>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </aside>

                    <div className="ct-main" ref={mainRef}>
                        {sent ? (
                            <div className="ct-success" ref={successRef} aria-live="polite">
                                <svg className="ct-check" viewBox="0 0 52 52" aria-hidden="true">
                                    <circle className="ct-check-ring" cx="26" cy="26" r="24" />
                                    <path className="ct-check-path" d="M15 27l8 8 15-17" />
                                </svg>

                                <div className="ct-success-text">
                                    <h3>Request received</h3>
                                    <p>
                                        Thanks{form.name.trim() ? `, ${form.name.trim().split(" ")[0]}` : ""}.
                                        We will review your details and get back to you on the number
                                        or email you shared.
                                    </p>
                                    <button type="button" className="ct-ghost" onClick={reset}>
                                        Send another request
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <form ref={formRef} onSubmit={handleSubmit} noValidate>
                                <Section n={1} title="Basic Details" active={active === 0}>
                                    {text("name", "Full Name", { required: true, placeholder: "Your full name", autoComplete: "name" })}
                                    {text("org", "Organisation / Company / Institution Name", { placeholder: "Organisation name", autoComplete: "organization" })}
                                    {text("city", "City", { placeholder: "City" })}
                                    {pick("state", "State", STATES, { placeholder: "Select state" })}
                                    {text("phone", "Phone / WhatsApp Number", { required: true, type: "tel", inputMode: "tel", placeholder: "+91 98765 43210", autoComplete: "tel" })}
                                    {text("email", "Email Address", { required: true, type: "email", placeholder: "you@example.com", autoComplete: "email" })}
                                    {pick("role", "Your Role", ROLES, { full: true })}
                                </Section>

                                <Section n={2} title="Project Type" active={active === 1}>
                                    {pick("projectType", "What do you need?", PROJECT_TYPES, { required: true, full: true, placeholder: "Select project type" })}
                                    {pick("hasWebsite", "Do you already have a website?", YES_NO)}
                                    {text("websiteLink", "Existing website link (if any)", {
                                        type: "url",
                                        placeholder: form.hasWebsite === "Yes" ? "https://" : "Choose Yes to add your link",
                                        disabled: form.hasWebsite !== "Yes",
                                    })}
                                </Section>

                                {/* <Section n={3} title="Website Requirements" active={active === 2}>
                                    {pick("pagesCount", "Approximate number of pages needed", PAGE_COUNTS, { full: true })}
                                    {chips("pages", "Which pages do you need? (select all that apply)", PAGES)}
                                    {chips("features", "What features do you need? (select all that apply)", FEATURES)}
                                </Section> */}

                                {/* <Section n={4} title="Content & Branding" active={active === 3}>
                                    {pick("logo", "Do you have a logo?", LOGO)}
                                    {pick("content", "Do you have website content ready?", CONTENT)}
                                    {pick("photos", "Do you have photos / images?", PHOTOS)}
                                    <div className="ct-spacer" aria-hidden="true" />
                                    {text("brand", "Do you have brand colors or design preferences?", { full: true, placeholder: "e.g. Blue and white, modern and clean, any preferences..." })}
                                    {text("references", "Any reference websites you like?", { full: true, placeholder: "Paste website links separated by commas" })}
                                </Section>

                                <Section n={5} title="Budget & Timeline" active={active === 4}>
                                    {pick("budget", "Approximate budget range", BUDGETS)}
                                    {pick("deadline", "When do you need the project completed?", DEADLINES)}
                                    {pick("hosting", "Do you need hosting / domain support?", HOSTING)}
                                    {pick("maintenance", "Do you need regular maintenance after launch?", MAINTENANCE)}
                                </Section> */}

                                <Section n={6} title="Additional Notes" active={active === 5}>
                                    {area("message", "Describe your requirement in your own words", {
                                        placeholder: "Tell us more about what you need. The more detail, the better we can help...",
                                    })}
                                    {pick("callTime", "Best time to call", CALL_TIMES)}
                                    {pick("source", "How did you hear about KodeTech?", SOURCES)}
                                </Section>

                                <div className="ct-submit-row">
                                    <p className="ct-note">
                                        Fields marked <span className="ct-req">*</span> are required.
                                        Everything else is optional.
                                    </p>

                                    <button
                                        type="submit"
                                        className={`ct-submit${status === "sending" ? " is-sending" : ""}`}
                                        ref={buttonRef}
                                        disabled={status === "sending"}
                                    >
                                        <span>{status === "sending" ? "Sending..." : "Send request"}</span>
                                        <IconSend size={18} stroke={2} />
                                    </button>
                                </div>

                                {status === "error" && (
                                    <p className="ct-submit-error" role="alert">
                                        Something went wrong while sending. Please try again or call us directly.
                                    </p>
                                )}
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;