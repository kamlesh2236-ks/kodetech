import { useEffect, useRef } from "react";
import { IconExternalLink } from "@tabler/icons-react";
import gsap from "gsap";

const pad = (v) => String(v + 1).padStart(2, "0");

const ProjectCard = ({ project, reverse, index = 0 }) => {
  const stageRef = useRef(null);
  const innerRef = useRef(null);

  // 3D cursor-tilt + moving spotlight sheen across the tablet.
  useEffect(() => {
    const stage = stageRef.current;
    const inner = innerRef.current;
    if (!stage || !inner) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const rotateX = gsap.quickTo(inner, "rotationX", { duration: 0.6, ease: "power3.out" });
    const rotateY = gsap.quickTo(inner, "rotationY", { duration: 0.6, ease: "power3.out" });
    const liftZ = gsap.quickTo(inner, "z", { duration: 0.6, ease: "power3.out" });

    let rafId = null;
    let pendingEvent = null;

    const applyMove = () => {
      rafId = null;
      if (!pendingEvent) return;

      const rect = stage.getBoundingClientRect();
      const px = (pendingEvent.clientX - rect.left) / rect.width - 0.5; // -0.5 .. 0.5
      const py = (pendingEvent.clientY - rect.top) / rect.height - 0.5;

      rotateY(px * 16);
      rotateX(py * -12);
      liftZ(30);

      inner.style.setProperty("--mx", `${(px + 0.5) * 100}%`);
      inner.style.setProperty("--my", `${(py + 0.5) * 100}%`);
    };

    const handleMove = (e) => {
      pendingEvent = e;
      if (rafId === null) {
        rafId = requestAnimationFrame(applyMove);
      }
    };

    const handleLeave = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      pendingEvent = null;

      rotateY(0);
      rotateX(0);
      liftZ(0);
    };

    stage.addEventListener("mousemove", handleMove, { passive: true });
    stage.addEventListener("mouseleave", handleLeave);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      stage.removeEventListener("mousemove", handleMove);
      stage.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  const titleStyle = project.titleColor?.includes("gradient")
    ? {
      background: project.titleColor,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    }
    : { color: project.titleColor };

  return (
    <article className={`project-card ${reverse ? "reverse" : ""}`}>
      {/* =========================
          PROJECT VISUAL
      ========================== */}

      <div className="project-visual">
        <span className="card-index" aria-hidden="true">
          {pad(index)}
        </span>

        <div className="project-stage" ref={stageRef}>
          {/* Tablet */}

          <div className="tab-skills">
            <div className="tab-inner" ref={innerRef}>
              <span className="tab-sheen" aria-hidden="true" />

              <img
                src={project.image}
                className="content-img"
                alt={`${project.title} website`}
              />

              <img
                src={project.tabFrame}
                className="tab-frame"
                alt={`${project.title} tablet`}
              />

              {/* Hover Link */}

              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="hover-link"
              >
                <span>
                  {project.title}
                  <IconExternalLink stroke={2} size={18} />
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ========================= PROJECT CONTENT ========================== */}

      <div className="pr-text">
        <h1 style={titleStyle}>{project.title}</h1>

        <p className="sub-title" style={titleStyle}>
          {project.subtitle}
        </p>

        <p className="description">{project.description}</p>

        {/* Technologies */}

        <div className="tag">
          {project.technologies.map((tech, i) => (
            <span key={i}>{tech}</span>
          ))}
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;