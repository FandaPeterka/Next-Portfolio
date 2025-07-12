/* =========================================================
   Home page – s funkční LedMatrix (verze 2)
   ========================================================= */

"use client";

import React, {
  useRef,
  useEffect,
  useContext,
  useMemo,
} from "react";
import { useTranslation } from "react-i18next";
import gsap, { ScrollTrigger } from "gsap/all";

import { NavigationContext } from "@contexts/NavigationContext";

/* sekce + komponenty */
import ScrollIndicator    from "@components/ScrollIndicator";
import CardsComponent     from "@components/CardsComponent";
import Tech3DIcons        from "@components/Tech3DIcons";
import HorizontalTimeline from "@components/HorizontalTimeline";
import ProjectScreens     from "@components/ProjectScreens";
import ParticleNetwork    from "@components/ParticleNetwork";
import Footer             from "@components/Footer";
import BlogCornerButton  from "@components/BlogCornerButton";

import appData from "@data/dataApp";

/* ---------- pomocné komponenty ---------- */
const SectionHeading = ({ text, mb = "0.3rem" }) => {
  const r = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!r.current) return;

    gsap.fromTo(
      r.current,
      { x: -100, skewX: -8, opacity: 0 },
      {
        x: 0,
        skewX: 0,
        opacity: 1,
        duration: 0.9,
        ease: "expo.out",
        scrollTrigger: { trigger: r.current, start: "top 85%" },
      }
    );
  }, []);

  return (
    <h2
      ref={r}
      style={{
        fontFamily: "'Poppins','Inter',sans-serif",
        color: "var(--heading-color)",
        margin: `0 0 ${mb} 0`,
        fontSize: "clamp(1.8rem,3.8vw,2.6rem)",
        fontWeight: 700,
        textAlign: "center",
      }}
    >
      {text}
    </h2>
  );
};

const Spacer = ({ h = "3rem" }) => <div aria-hidden style={{ height: h }} />;

/* ---------- HLAVNÍ KOMPONENTA ---------- */
export default function Home() {
  const { t } = useTranslation();

  /* refs jednotlivých sekcí */
  const welcomeRef  = useRef(null);
  const introRef    = useRef(null);
  const techRef     = useRef(null);
  const expRef      = useRef(null);
  const projectsRef = useRef(null);
  const contactRef  = useRef(null);

  /* context */
  const { registerSections, updateActive } = useContext(NavigationContext);

  /* seznam sekcí (sdílený s Navbar) – memoizujeme, aby se reference neměnily */
  const sections = useMemo(() => ([
    { label: appData.sections[0].label, ref: welcomeRef  },
    { label: appData.sections[1].label, ref: introRef    },
    { label: appData.sections[2].label, ref: techRef     },
    { label: appData.sections[3].label, ref: expRef      },
    { label: appData.sections[4].label, ref: projectsRef },
    { label: appData.sections[5].label, ref: contactRef  },
  ]), []);

  /* zaregistrujeme do kontextu jen jednou */
  useEffect(() => registerSections(sections), [registerSections, sections]);

  /* ---------- sledování scrollu ---------- */
  useEffect(() => {
    const io = new IntersectionObserver(() => {}, {
      rootMargin: "-80px 0px 0px 0px",
      threshold : Array.from({ length: 11 }, (_, i) => i / 10),
    });
    sections.forEach(({ ref }) => ref.current && io.observe(ref.current));

    const recalc = () => {
      let best = 0, min = Infinity;
      sections.forEach(({ ref }, i) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        const d = Math.abs(r.top + 80);
        if (d < min) { min = d; best = i; }
      });

      /* aktualizujeme kontext (label + index) */
      updateActive(sections[best].label, best);
    };

    let t;
    const onScroll = () => { clearTimeout(t); t = setTimeout(recalc, 120); };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, [sections, updateActive]);

  /* ---------- render ---------- */
  return (
    <div className="App">
      {/* Welcome ------------------------------------------------ */}
      <div
        ref={welcomeRef}
        style={{
          marginTop: "clamp(0rem, 10vh, 0rem)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <ScrollIndicator
          nextRef={introRef}
          text={appData.scrollIndicatorText}
        />
      </div>

      <Spacer />

      {/* Intro -------------------------------------------------- */}
      <div ref={introRef} style={{ position: "relative", zIndex: 2 }}>
        <SectionHeading text={t(appData.sections[1].label)} />
        <CardsComponent />
      </div>

      <Spacer />

      {/* Tech --------------------------------------------------- */}
      <div ref={techRef} style={{ position: "relative", zIndex: 2 }}>
        <SectionHeading text={t(appData.sections[2].label)} mb="-5rem" />
        <Tech3DIcons />
      </div>

      <Spacer h="12rem" />

      {/* Experience -------------------------------------------- */}
      <div ref={expRef} style={{ position: "relative", zIndex: 2 }}>
        <SectionHeading text={t(appData.sections[3].label)} />
        <HorizontalTimeline />
      </div>

      <Spacer h="3.5rem" />

      {/* Projects ---------------------------------------------- */}
      <div ref={projectsRef} style={{ position: "relative", zIndex: 2 }}>
        <SectionHeading text={t(appData.sections[4].label)} />
        <ProjectScreens />
      </div>

      <Spacer />

      {/* Contact ----------------------------------------------- */}
      <div ref={contactRef} style={{ position: "relative", zIndex: 2 }}>
        <SectionHeading text={t(appData.sections[5].label)} />
        <ParticleNetwork />
      </div>

      <Footer />
      <BlogCornerButton />
    </div>
  );
}