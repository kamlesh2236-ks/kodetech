import React, { useLayoutEffect, useRef } from "react";
import "./project.css";
import { projects } from "../data/project";
import ProjectCard from "../components/ProjectCard";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import skillPlatform from "../assets/skill_platform_light_on.svg";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const SLIDE_DISTANCE = 160;

const pad = (v) => String(v).padStart(2, "0");

const Projects = () => {
  const sectionRef = useRef(null);
  const platformRef = useRef(null); // platform image + light rig
  const headWrapRef = useRef(null);
  const headCountRef = useRef(null);
  const railPathRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const platform = platformRef.current;

    if (!section || !platform) return;

    let handleResize = () => { };

    const ctx = gsap.context(() => {
      const stages = section.querySelectorAll(".project-stage");
      const tabs = section.querySelectorAll(".tab-skills");
      const cards = section.querySelectorAll(".project-card");
      const n = stages.length;

      if (!stages.length || !tabs.length) return;

      // ---------- Heading reveal ----------
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

      const setActiveCount = (i) => {
        if (headCountRef.current) {
          headCountRef.current.textContent = `${pad(i + 1)} / ${pad(n)}`;
        }
      };
      setActiveCount(0);

      // ---------- Card entrance reveal ----------
      cards.forEach((card, i) => {
        const tabInner = card.querySelector(".tab-inner");
        const contentImg = card.querySelector(".content-img");
        const numeral = card.querySelector(".card-index");
        const textEls = card.querySelectorAll(".pr-text > *");
        const fromX = i % 2 !== 0 ? 80 : -80;

        if (contentImg) {
          gsap.set(contentImg, { clipPath: "inset(0% 100% 0% 0%)" });
        }

        const tl = gsap.timeline({
          scrollTrigger: { trigger: card, start: "top 78%" },
        });

        if (numeral) {
          tl.fromTo(
            numeral,
            { autoAlpha: 0, x: fromX * 0.5 },
            { autoAlpha: 1, x: 0, duration: 0.9, ease: "power3.out" },
            0
          );
        }

        if (tabInner) {
          tl.fromTo(
            tabInner,
            { autoAlpha: 0, x: fromX, scale: 0.86, rotateZ: fromX > 0 ? 5 : -5 },
            {
              autoAlpha: 1,
              x: 0,
              scale: 1,
              rotateZ: 0,
              duration: 0.9,
              ease: "power3.out",
              onComplete: () => {
                gsap.to(tabInner, {
                  y: "+=12",
                  duration: 2.6,
                  ease: "sine.inOut",
                  yoyo: true,
                  repeat: -1,
                });
              },
            },
            0
          );
        }

        if (contentImg) {
          tl.to(
            contentImg,
            { clipPath: "inset(0% 0% 0% 0%)", duration: 0.95, ease: "power4.out" },
            0.2
          );
        }

        if (textEls.length) {
          tl.fromTo(
            textEls,
            { autoAlpha: 0, y: 26 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.08,
              ease: "power3.out",
            },
            0.15
          );
        }
      });

      // ---------- Tab visibility helpers ----------
      const tabSide = (i) => (i % 2 !== 0 ? "right" : "left");

      const hideTab = (i) => {
        const tab = tabs[i];
        if (!tab) return;
        const side = tabSide(i);

        tab.style.setProperty(
          "--slide-x",
          side === "left" ? `-${SLIDE_DISTANCE}px` : `${SLIDE_DISTANCE}px`
        );
        tab.style.setProperty("--tab-opacity", "0");
        tab.style.pointerEvents = "none";
      };

      const showTab = (i) => {
        const tab = tabs[i];
        if (!tab) return;

        tab.style.setProperty("--slide-x", "0px");
        tab.style.setProperty("--tab-opacity", "1");
        tab.style.pointerEvents = "auto";
      };

      tabs.forEach((tab, i) => {
        i === 0 ? showTab(0) : hideTab(i);
      });

      // ---------- Platform movement ----------
      const getRawPosition = (stage) => {
        const sectionRect = section.getBoundingClientRect();
        const stageRect = stage.getBoundingClientRect();

        const x =
          stageRect.left -
          sectionRect.left +
          stageRect.width / 2 -
          platform.offsetWidth / 2;

        const y =
          stageRect.top -
          sectionRect.top +
          stageRect.height / 2 -
          platform.offsetHeight / 2;

        return { x, y };
      };

      let stagePositions = [];
      const computeStagePositions = () => {
        stagePositions = Array.from(stages).map(getRawPosition);
      };
      computeStagePositions();

      const xTo = gsap.quickTo(platform, "x", { duration: 0.35, ease: "power3.out" });
      const yTo = gsap.quickTo(platform, "y", { duration: 0.35, ease: "power3.out" });

      gsap.set(platform, {
        x: stagePositions[0].x,
        y: stagePositions[0].y,
        autoAlpha: 0,
      });
      gsap.to(platform, { autoAlpha: 1, duration: 0.7, delay: 0.15 });

      platform.classList.remove("is-scrolling");

      const flare = platform.querySelector(".platform-flare");
      const pulseFlare = () => {
        if (!flare) return;
        gsap.fromTo(
          flare,
          { scale: 1.4, opacity: 1 },
          { scale: 1, opacity: 0.65, duration: 0.65, ease: "power2.out" }
        );
      };

      // ---------- Glowing rail connecting every stage ----------
      const buildRail = () => {
        const path = railPathRef.current;
        if (!path) return;

        const points = stagePositions.map((pos) => ({
          x: pos.x + platform.offsetWidth / 2,
          y: pos.y + platform.offsetHeight / 2,
        }));

        if (!points.length) return;

        let d = `M ${points[0].x} ${points[0].y}`;
        for (let i = 1; i < points.length; i++) {
          const prev = points[i - 1];
          const curr = points[i];
          const midY = (prev.y + curr.y) / 2;
          d += ` C ${prev.x} ${midY}, ${curr.x} ${midY}, ${curr.x} ${curr.y}`;
        }
        path.setAttribute("d", d);

        const length = path.getTotalLength();
        path.style.strokeDasharray = `${length}`;
        gsap.set(path, { strokeDashoffset: length });

        gsap.to(path, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 65%",
            end: "bottom 75%",
            scrub: true,
          },
          overwrite: true,
        });
      };

      buildRail();

      stages.forEach((stage, index) => {
        if (index === 0) return;

        ScrollTrigger.create({
          trigger: stage,

          start: "top 70%",
          end: "top 25%",

          scrub: true,

          onEnter: () => {
            platform.classList.add("is-scrolling");
            hideTab(index - 1);
            setActiveCount(index);
          },
          onLeave: () => {
            platform.classList.remove("is-scrolling");
            showTab(index);
            pulseFlare();
          },

          onEnterBack: () => {
            platform.classList.add("is-scrolling");
            hideTab(index);
            setActiveCount(index - 1);
          },
          onLeaveBack: () => {
            platform.classList.remove("is-scrolling");
            showTab(index - 1);
            pulseFlare();
          },

          onUpdate: (self) => {
            const previous = stagePositions[index - 1];
            const current = stagePositions[index];

            xTo(gsap.utils.interpolate(previous.x, current.x, self.progress));
            yTo(gsap.utils.interpolate(previous.y, current.y, self.progress));
          },
        });
      });

      ScrollTrigger.refresh();

      let resizeTimeout;
      let lastWidth = window.innerWidth;
      handleResize = () => {
        if (window.innerWidth === lastWidth) return;
        lastWidth = window.innerWidth;

        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          computeStagePositions();

          gsap.set(platform, {
            x: stagePositions[0].x,
            y: stagePositions[0].y,
          });

          buildRail();
          ScrollTrigger.refresh();
        }, 150);
      };

      window.addEventListener("resize", handleResize);
    }, sectionRef);

    return () => {
      window.removeEventListener("resize", handleResize);
      ctx.revert();
    };
  }, []);

  return (
    <section id="project" className="project-section" ref={sectionRef}>
      <svg className="project-rail" aria-hidden="true">
        <path ref={railPathRef} className="project-rail-path" />
      </svg>

      <div className="head-container" ref={headWrapRef}>
        <h1>Our Latest Work</h1>
        <span className="head-count" ref={headCountRef}>
          01 / {pad(projects.length)}
        </span>
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

      <div ref={platformRef} className="platform-rig">
        <div className="platform-flare"></div>

        <div className="beam-source">
          <span className="hard-beam b1"></span>
          <span className="hard-beam b2"></span>
          <span className="hard-beam b3"></span>
          <span className="hard-beam b4"></span>
          <span className="hard-beam b5"></span>
        </div>

        <div className="light-particles">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>

        <img src={skillPlatform} className="scroll-platform" alt="" />
      </div>
    </section>
  );
};

export default Projects;