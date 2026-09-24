import React, { useLayoutEffect, useRef } from "react";
import "./project.css";
import { projects } from "../data/project";
import ProjectCard from "../components/ProjectCard";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const pad = (v) => String(v).padStart(2, "0");

const Projects = () => {
  const sectionRef = useRef(null);
  const headWrapRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      if (headWrapRef.current) {
        gsap.fromTo(
          headWrapRef.current,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: headWrapRef.current, start: "top 90%" },
          }
        );
      }

      const cards = section.querySelectorAll(".project-card");
      cards.forEach((card, i) => {
        const visual = card.querySelector(".project-visual");
        const numeral = card.querySelector(".card-index");
        const textEls = card.querySelectorAll(".pr-text > *");
        const fromX = i % 2 !== 0 ? 60 : -60;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 82%",
            toggleActions: "play none none none",
          },
        });

        if (numeral) {
          tl.fromTo(
            numeral,
            { autoAlpha: 0, x: fromX * 0.4 },
            { autoAlpha: 1, x: 0, duration: 0.6, ease: "power3.out" },
            0
          );
        }

        if (visual) {
          tl.fromTo(
            visual,
            { autoAlpha: 0, x: fromX, scale: 0.94 },
            { autoAlpha: 1, x: 0, scale: 1, duration: 0.65, ease: "power3.out" },
            0
          );
        }

        if (textEls.length) {
          tl.fromTo(
            textEls,
            { autoAlpha: 0, y: 18 },
            { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power3.out" },
            0.1
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="project" className="project-section" ref={sectionRef}>
      <div className="head-container" ref={headWrapRef}>
        <h1>Our Latest Work</h1>
        <span className="head-count">{pad(projects.length)} Projects</span>
      </div>

      <div className="projects-container">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            reverse={index % 2 !== 0}
          />
        ))}
      </div>
    </section>
  );
};

export default Projects;