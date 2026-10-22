import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  IconHeadset,
  IconSpeakerphone,
  IconMapPin,
  IconClock,
  IconCurrencyRupee,
  IconCheck,
  IconArrowRight,
  IconArrowLeft,
  IconUsers,
  IconTrendingUp,
  IconSchool,
  IconCalendarEvent,
  IconSend,
  IconX,
} from "@tabler/icons-react";
import "./Career.css";

gsap.registerPlugin(ScrollTrigger);

const API_URL = "/api/careers";

const JOBS = [
  {
    id: "telecaller",
    title: "Telecaller",
    icon: IconHeadset,
    type: "Full-time",
    location: "Patna, Bihar",
    salary: "Fixed salary + incentives",
    openings: 3,
    summary:
      "Call leads, explain our web, app and digital marketing services, and book meetings for the sales team.",
    responsibilities: [
      "Make 60-80 outbound calls daily to warm and cold leads",
      "Explain KodeTech services clearly in Hindi and English",
      "Follow up with interested leads and update the lead sheet",
      "Fix demo calls and meetings for the senior team",
    ],
    requirements: [
      "Clear communication in Hindi; basic English is a plus",
      "Confident voice and good listening skills",
      "Basic computer and Excel / Google Sheets knowledge",
      "Freshers are welcome, training is provided",
    ],
  },
  {
    id: "marketing",
    title: "Marketing Executive",
    icon: IconSpeakerphone,
    type: "Full-time",
    location: "Patna, Bihar",
    salary: "Fixed salary + incentives",
    openings: 2,
    summary:
      "Find new clients for our services through field visits, social media outreach and local business networking.",
    responsibilities: [
      "Meet shops, schools, colleges, hospitals and restaurants to pitch our services",
      "Generate and qualify leads from social media and online platforms",
      "Support Meta and Google ad campaigns with lead data",
      "Share daily reports and close deals with the team",
    ],
    requirements: [
      "Good communication and negotiation skills",
      "Interest in sales, marketing and technology",
      "Own bike or comfortable with local travel",
      "Basic knowledge of social media platforms",
    ],
  },
];

const PERKS = [
  { icon: IconTrendingUp, title: "Incentives", text: "Earn more on every client you bring in." },
  { icon: IconSchool, title: "Free training", text: "Learn sales, pitching and our services from scratch." },
  { icon: IconUsers, title: "Young team", text: "Work with developers and designers who build real products." },
  { icon: IconCalendarEvent, title: "Growth path", text: "Grow from executive to team lead as we scale." },
];

const STEPS = [
  { title: "Apply", text: "Fill the form below with your details." },
  { title: "Screening call", text: "A short phone call to know you better." },
  { title: "Interview", text: "Face-to-face or video round with our team." },
  { title: "Offer", text: "Get your offer letter and start date." },
];

const EMPTY_FORM = {
  name: "",
  phone: "",
  email: "",
  city: "",
  position: "",
  experience: "",
  message: "",
};

export default function Career() {
  const root = useRef(null);
  const formRef = useRef(null);
  const [openJob, setOpenJob] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState("idle");

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".cr-hero-tag, .cr-hero h1, .cr-hero p, .cr-hero-actions", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
      });

      gsap.to(".cr-orb-a", { y: 30, x: 20, duration: 5, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".cr-orb-b", { y: -25, x: -20, duration: 6, repeat: -1, yoyo: true, ease: "sine.inOut" });

      gsap.utils.toArray(".cr-reveal").forEach((el) => {
        gsap.from(el, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });

      gsap.from(".cr-step", {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: { trigger: ".cr-steps", start: "top 80%" },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  const scrollToForm = (position) => {
    if (position) setForm((f) => ({ ...f, position }));
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "career-page" }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      setForm(EMPTY_FORM);
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="cr" ref={root}>
      <header className="cr-bar">
        <Link to="/" className="cr-back">
          <IconArrowLeft size={18} /> Back to home
        </Link>
        <span className="cr-brand">KodeTech</span>
      </header>

      <section className="cr-hero">
        <div className="cr-orb cr-orb-a" />
        <div className="cr-orb cr-orb-b" />
        <div className="cr-wrap">
          <span className="cr-hero-tag">
            <span className="cr-dot" /> We are hiring
          </span>
          <h1>
            Build your career <em>with KodeTech</em>
          </h1>
          <p>
            Join a growing tech team that builds websites, apps and AI solutions for real businesses.
            We are looking for energetic people to talk to clients and grow our brand.
          </p>
          <div className="cr-hero-actions">
            <button className="cr-btn cr-btn-primary" onClick={() => document.getElementById("openings")?.scrollIntoView({ behavior: "smooth" })}>
              View openings <IconArrowRight size={18} />
            </button>
            <button className="cr-btn cr-btn-ghost" onClick={() => scrollToForm()}>
              Apply now
            </button>
          </div>
          <div className="cr-stats">
            <div><strong>2</strong><span>Open roles</span></div>
            <div><strong>5</strong><span>Positions</span></div>
            <div><strong>0</strong><span>Experience needed*</span></div>
          </div>
        </div>
      </section>

      <section className="cr-section" id="openings">
        <div className="cr-wrap">
          <div className="cr-head cr-reveal">
            <span className="cr-eyebrow">Open positions</span>
            <h2>Find the role that fits you</h2>
          </div>

          <div className="cr-jobs">
            {JOBS.map((job) => {
              const Icon = job.icon;
              return (
                <article className="cr-job cr-reveal" key={job.id}>
                  <div className="cr-job-top">
                    <div className="cr-job-icon"><Icon size={28} stroke={1.6} /></div>
                    <span className="cr-badge">{job.openings} openings</span>
                  </div>
                  <h3>{job.title}</h3>
                  <p className="cr-job-sum">{job.summary}</p>
                  <ul className="cr-meta">
                    <li><IconMapPin size={16} /> {job.location}</li>
                    <li><IconClock size={16} /> {job.type}</li>
                    <li><IconCurrencyRupee size={16} /> {job.salary}</li>
                  </ul>
                  <div className="cr-job-actions">
                    <button className="cr-btn cr-btn-primary" onClick={() => scrollToForm(job.title)}>
                      Apply for this role
                    </button>
                    <button className="cr-btn cr-btn-ghost" onClick={() => setOpenJob(job)}>
                      Details
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="cr-section cr-soft">
        <div className="cr-wrap">
          <div className="cr-head cr-reveal">
            <span className="cr-eyebrow">Why join us</span>
            <h2>More than just a job</h2>
          </div>
          {/* <div className="cr-perks">
            {PERKS.map((p) => {
              const Icon = p.icon;
              return (
                <div className="cr-perk cr-reveal" key={p.title}>
                  <Icon size={26} stroke={1.6} />
                  <h4>{p.title}</h4>
                  <p>{p.text}</p>
                </div>
              );
            })}
          </div> */}
        </div>
      </section>

      <section className="cr-section">
        <div className="cr-wrap">
          <div className="cr-head cr-reveal">
            <span className="cr-eyebrow">Hiring process</span>
            <h2>Simple and quick</h2>
          </div>
          <div className="cr-steps">
            {STEPS.map((s, i) => (
              <div className="cr-step" key={s.title}>
                <span className="cr-step-no">{String(i + 1).padStart(2, "0")}</span>
                <h4>{s.title}</h4>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cr-section cr-soft" ref={formRef} id="apply">
        <div className="cr-wrap cr-form-wrap">
          <div className="cr-head cr-reveal">
            <span className="cr-eyebrow">Apply now</span>
            <h2>Send us your details</h2>
            <p className="cr-sub">We will call you within 2-3 working days if your profile matches.</p>
          </div>

          {status === "success" ? (
            <div className="cr-success cr-reveal">
              <div className="cr-success-icon"><IconCheck size={34} /></div>
              <h3>Application received</h3>
              <p>Thank you for applying to KodeTech. Our team will contact you soon.</p>
              <button className="cr-btn cr-btn-ghost" onClick={() => setStatus("idle")}>
                Submit another application
              </button>
            </div>
          ) : (
            <form className="cr-form cr-reveal" onSubmit={handleSubmit}>
              <div className="cr-grid">
                <label>
                  Full name
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" required />
                </label>
                <label>
                  Phone number
                  <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="10-digit mobile number" pattern="[0-9]{10}" required />
                </label>
                <label>
                  Email
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
                </label>
                <label>
                  City
                  <input name="city" value={form.city} onChange={handleChange} placeholder="Your city" required />
                </label>
                <label>
                  Position
                  <select name="position" value={form.position} onChange={handleChange} required>
                    <option value="" disabled>Select a position</option>
                    {JOBS.map((j) => (
                      <option key={j.id} value={j.title}>{j.title}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Experience
                  <select name="experience" value={form.experience} onChange={handleChange} required>
                    <option value="" disabled>Select experience</option>
                    <option>Fresher</option>
                    <option>Less than 1 year</option>
                    <option>1-3 years</option>
                    <option>3+ years</option>
                  </select>
                </label>
              </div>
              <label>
                Tell us about yourself
                <textarea name="message" rows={4} value={form.message} onChange={handleChange} placeholder="Why do you want to join KodeTech?" />
              </label>

              {status === "error" && (
                <p className="cr-error">Something went wrong. Please try again.</p>
              )}

              <button className="cr-btn cr-btn-primary cr-submit" type="submit" disabled={status === "sending"}>
                {status === "sending" ? "Sending..." : "Submit application"} <IconSend size={18} />
              </button>
            </form>
          )}
        </div>
      </section>

      {openJob && (
        <div className="cr-modal" onClick={() => setOpenJob(null)}>
          <div className="cr-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="cr-modal-close" onClick={() => setOpenJob(null)} aria-label="Close">
              <IconX size={20} />
            </button>
            <h3>{openJob.title}</h3>
            <p className="cr-job-sum">{openJob.summary}</p>

            <h5>Responsibilities</h5>
            <ul className="cr-list">
              {openJob.responsibilities.map((r) => (
                <li key={r}><IconCheck size={16} /> {r}</li>
              ))}
            </ul>

            <h5>Requirements</h5>
            <ul className="cr-list">
              {openJob.requirements.map((r) => (
                <li key={r}><IconCheck size={16} /> {r}</li>
              ))}
            </ul>

            <button
              className="cr-btn cr-btn-primary"
              onClick={() => {
                const title = openJob.title;
                setOpenJob(null);
                scrollToForm(title);
              }}
            >
              Apply for this role <IconArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}