import { useState, useEffect, useRef, useCallback } from "react";
import emailjs from '@emailjs/browser';
import { motion, useMotionValue, useTransform, useSpring, useInView, AnimatePresence } from "framer-motion";
import { 
  Code2, 
  Mail, 
  ExternalLink, 
  Database, 
  Layout, 
  Cpu, 
  Globe, 
  MessageSquare,
  BookOpen,
  User,
  Terminal,
  Server,
  Layers,
  Sparkles,
  ChevronDown,
  TrendingUp,
  Bot,
  Zap,
  Send,
  GitBranch,
  Briefcase
} from 'lucide-react';
/*import { GitHub, Linkedin, Mail, ExternalLink, Code2, Database, Layers, Cpu, BookOpen, TrendingUp, ChevronDown, Send, Sparkles, Globe, Zap, Bot } from "lucide-react";*/

/* ─────────────────────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────────────────────── */
const T = {
  bg: "#060811",
  surface: "#0d1117",
  surfaceHigh: "#131c2e",
  border: "rgba(99,179,255,0.1)",
  borderGlow: "rgba(99,179,255,0.35)",
  blue: "#3b82f6",
  blueLight: "#60a5fa",
  blueBright: "#93c5fd",
  cyan: "#06b6d4",
  white: "#f0f6ff",
  muted: "#6b7ea0",
  glass: "rgba(13,17,23,0.7)",
};

/* ─────────────────────────────────────────────────────────────
   FONTS (injected once)
───────────────────────────────────────────────────────────── */
function FontLoader() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Figtree:ital,wght@0,300;0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;500&display=swap";
    document.head.appendChild(link);

    const style = document.createElement("style");
    style.textContent = `
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; }
      body { background: ${T.bg}; color: ${T.white}; font-family: 'Figtree', sans-serif; overflow-x: hidden; }
      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-track { background: ${T.bg}; }
      ::-webkit-scrollbar-thumb { background: ${T.blue}; border-radius: 2px; }
      ::selection { background: rgba(59,130,246,0.4); }
      .syne { font-family: 'Syne', sans-serif; }
      .mono { font-family: 'JetBrains Mono', monospace; }
      .glass {
        background: rgba(13,17,35,0.6);
        backdrop-filter: blur(20px) saturate(180%);
        -webkit-backdrop-filter: blur(20px) saturate(180%);
        border: 1px solid ${T.border};
      }
      .glow-text { text-shadow: 0 0 40px rgba(59,130,246,0.6), 0 0 80px rgba(59,130,246,0.2); }
      .noise {
        position: fixed; inset: 0; pointer-events: none; z-index: 100; opacity: 0.03;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
      }
    `;
    document.head.appendChild(style);
  }, []);
  return null;
}

/* ─────────────────────────────────────────────────────────────
   FLOATING PARTICLE BACKGROUND
───────────────────────────────────────────────────────────── */
function ParticleField() {
  const particles = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    dur: Math.random() * 20 + 15,
    delay: Math.random() * -20,
    opacity: Math.random() * 0.5 + 0.1,
  }));

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {/* Radial gradient blobs */}
      <div style={{
        position: "absolute", top: "-20%", left: "60%",
        width: "600px", height: "600px",
        background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)",
        borderRadius: "50%",
      }} />
      <div style={{
        position: "absolute", bottom: "10%", left: "-10%",
        width: "500px", height: "500px",
        background: "radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)",
        borderRadius: "50%",
      }} />
      {particles.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: p.id % 3 === 0 ? T.cyan : T.blue,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [p.opacity, p.opacity * 0.3, p.opacity],
          }}
          transition={{
            duration: p.dur,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PARALLAX TILT CARD
───────────────────────────────────────────────────────────── */
function TiltCard({ children, style = {}, className = "" }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-8, 8]);
  const springX = useSpring(rotateX, { stiffness: 200, damping: 25 });
  const springY = useSpring(rotateY, { stiffness: 200, damping: 25 });
  const glowX = useTransform(x, [-0.5, 0.5], [0, 100]);
  const glowY = useTransform(y, [-0.5, 0.5], [0, 100]);

  const handleMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      className={`glass ${className}`}
      style={{
        borderRadius: 16,
        perspective: 1000,
        transformStyle: "preserve-3d",
        rotateX: springX,
        rotateY: springY,
        cursor: "default",
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      whileHover={{ scale: 1.02 }}
      transition={{ scale: { type: "spring", stiffness: 300, damping: 25 } }}
    >
      <motion.div
        style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: useTransform(
            [glowX, glowY],
            ([gx, gy]) => `radial-gradient(circle at ${gx}% ${gy}%, rgba(59,130,246,0.12), transparent 60%)`
          ),
        }}
      />
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAGNETIC BUTTON
───────────────────────────────────────────────────────────── */
function MagneticBtn({ children, href, onClick, variant = "primary", style = {} }) {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 250, damping: 20 });
  const sy = useSpring(my, { stiffness: 250, damping: 20 });

  const handleMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left - r.width / 2) * 0.35);
    my.set((e.clientY - r.top - r.height / 2) * 0.35);
  };
  const handleLeave = () => { mx.set(0); my.set(0); };

  const base = {
    display: "inline-flex", alignItems: "center", gap: 8,
    padding: "12px 28px", borderRadius: 50, fontFamily: "'Syne', sans-serif",
    fontWeight: 600, fontSize: 14, letterSpacing: "0.06em", textTransform: "uppercase",
    cursor: "pointer", border: "none", textDecoration: "none",
    transition: "box-shadow 0.3s ease",
  };
  const styles = {
    primary: { background: `linear-gradient(135deg, ${T.blue}, ${T.cyan})`, color: "#fff", boxShadow: `0 4px 24px rgba(59,130,246,0.4)` },
    outline: { background: "transparent", color: T.blueLight, border: `1px solid ${T.borderGlow}`, boxShadow: "none" },
  };

  const Tag = href ? "a" : "button";

  return (
    <motion.div ref={ref} onMouseMove={handleMove} onMouseLeave={handleLeave} style={{ display: "inline-block" }}>
      <motion.a
        href={href}
        onClick={onClick}
        style={{ ...base, ...styles[variant], ...style }}
        animate={{ x: sx, y: sy }}
        whileHover={variant === "primary" ? { boxShadow: `0 8px 40px rgba(59,130,246,0.6)` } : { borderColor: T.blue, color: T.white }}
      >
        {children}
      </motion.a>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   REVEAL WRAPPER
───────────────────────────────────────────────────────────── */
function Reveal({ children, delay = 0, direction = "up", style = {} }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const dirs = { up: { y: 40 }, down: { y: -40 }, left: { x: 40 }, right: { x: -40 } };
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...dirs[direction] }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   TYPEWRITER
───────────────────────────────────────────────────────────── */
function Typewriter({ words }) {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[idx];
    let timeout;
    if (!deleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 60);
    } else if (!deleting && displayed.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIdx((idx + 1) % words.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, idx, words]);

  return (
    <span style={{ color: T.blueLight }}>
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
        style={{ borderRight: `2px solid ${T.blue}`, marginLeft: 2 }}
      />
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────
   NAV
───────────────────────────────────────────────────────────── */
const navLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Strategy", href: "#strategy" },
  { label: "Contact", href: "#contact" },
];

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        padding: "0 5vw",
        height: scrolled ? 60 : 72,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? "rgba(6,8,17,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(24px)" : "none",
        borderBottom: scrolled ? `1px solid ${T.border}` : "none",
        transition: "height 0.3s ease, background 0.3s ease",
      }}
    >
      <a href="#" className="syne" style={{ fontSize: 18, fontWeight: 800, color: T.white, textDecoration: "none", letterSpacing: "-0.02em" }}>
        W<span style={{ color: T.blue }}>.</span>Ibrar
      </a>

      {/* Desktop */}
      <div style={{ display: "flex", gap: 32, alignItems: "center" }} className="desktop-nav">
        {navLinks.map((l) => (
          <a key={l.label} href={l.href} className="syne" style={{
            color: T.muted, textDecoration: "none", fontSize: 13, fontWeight: 600,
            letterSpacing: "0.06em", textTransform: "uppercase",
            transition: "color 0.2s ease",
          }}
            onMouseEnter={e => e.target.style.color = T.blueLight}
            onMouseLeave={e => e.target.style.color = T.muted}
          >{l.label}</a>
        ))}
        <MagneticBtn href="#contact" style={{ padding: "8px 20px", fontSize: 12 }}>Hire Me</MagneticBtn>
      </div>

      {/* Mobile hamburger */}
      <button onClick={() => setMenuOpen(!menuOpen)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: T.white, padding: 4 }} className="mobile-menu-btn">
        <div style={{ width: 24, height: 2, background: T.white, marginBottom: 5, borderRadius: 2 }} />
        <div style={{ width: 16, height: 2, background: T.blue, marginBottom: 5, borderRadius: 2 }} />
        <div style={{ width: 24, height: 2, background: T.white, borderRadius: 2 }} />
      </button>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: "absolute", top: "100%", left: 0, right: 0,
              background: "rgba(6,8,17,0.98)", backdropFilter: "blur(20px)",
              padding: "24px 5vw", borderBottom: `1px solid ${T.border}`,
              display: "flex", flexDirection: "column", gap: 20,
            }}
          >
            {navLinks.map((l) => (
              <a key={l.label} href={l.href} className="syne" onClick={() => setMenuOpen(false)} style={{
                color: T.white, textDecoration: "none", fontSize: 16, fontWeight: 600,
              }}>{l.label}</a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

/* ─────────────────────────────────────────────────────────────
   HERO
───────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      padding: "120px 5vw 80px", position: "relative", zIndex: 1,
    }}>
      <div style={{ maxWidth: 1200, width: "100%", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr auto", gap: 40, alignItems: "center" }}>
        <div>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mono"
            style={{ color: T.cyan, fontSize: 13, letterSpacing: "0.15em", marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}
          >
            <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }} style={{ color: T.blue }}>▋</motion.span>
            Available for new opportunities
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="syne glow-text"
            style={{
              fontSize: "clamp(3rem, 7vw, 6rem)", fontWeight: 800,
              lineHeight: 1.0, letterSpacing: "-0.03em",
              color: T.white, marginBottom: 16,
            }}
          >
            Wasia<br />
            <span style={{
              WebkitTextStroke: `1.5px ${T.blue}`,
              color: "transparent",
              display: "block",
            }}>Ibrar</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="syne"
            style={{ fontSize: "clamp(1rem, 2vw, 1.3rem)", fontWeight: 600, marginBottom: 24, color: T.muted, lineHeight: 1.4 }}
          >
            <Typewriter words={["Full-Stack Web Developer", "Digital Content Strategist", "UI/UX Designer", "AI Automation Expert"]} />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            style={{ color: T.muted, fontSize: 16, lineHeight: 1.8, maxWidth: 520, marginBottom: 40 }}
          >
            Building scalable web applications and crafting data-driven digital strategies.
            I turn complex problems into elegant, functional solutions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            style={{ display: "flex", gap: 16, flexWrap: "wrap" }}
          >
            <MagneticBtn href="#projects"><Sparkles size={15} />View Work</MagneticBtn>
            <MagneticBtn href="#contact" variant="outline"><Mail size={15} />Get in Touch</MagneticBtn>
          </motion.div>
        </div>

        {/* Floating badge cluster */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: "relative", width: 280, height: 320 }}
          className="hero-badge-cluster"
        >
          {[
            { label: "Laravel", icon: "⚡", top: 0, left: 40, rotate: -6 },
            { label: "React", icon: "⚛", top: 80, left: 140, rotate: 4 },
            { label: "MySQL", icon: "🗄", top: 160, left: 20, rotate: -3 },
            { label: "Figma", icon: "🎨", top: 220, left: 120, rotate: 8 },
            { label: "AI/LLM", icon: "🤖", top: 100, left: -10, rotate: -8 },
          ].map((b, i) => (
            <motion.div
              key={b.label}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3 + i * 0.4, delay: i * 0.2, repeat: Infinity, ease: "easeInOut" }}
              style={{
                position: "absolute", top: b.top, left: b.left,
                background: "rgba(13,17,35,0.8)",
                backdropFilter: "blur(12px)",
                border: `1px solid ${T.border}`,
                borderRadius: 12, padding: "8px 16px",
                display: "flex", alignItems: "center", gap: 8,
                fontSize: 13, fontWeight: 600, color: T.blueLight,
                fontFamily: "'Syne', sans-serif",
                rotate: b.rotate, whiteSpace: "nowrap",
                boxShadow: `0 4px 20px rgba(59,130,246,0.1)`,
              }}
            >
              <span>{b.icon}</span> {b.label}
            </motion.div>
          ))}
          <style>{`@media (max-width: 768px) { .hero-badge-cluster { display: none !important; } }`}</style>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
          color: T.muted, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, fontSize: 11,
          fontFamily: "'Syne', sans-serif", letterSpacing: "0.1em", textTransform: "uppercase",
        }}
      >
        Scroll
        <ChevronDown size={16} style={{ color: T.blue }} />
      </motion.div>

      {/* Decorative grid lines */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: -1,
        backgroundImage: `linear-gradient(${T.border} 1px, transparent 1px), linear-gradient(90deg, ${T.border} 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
        maskImage: "radial-gradient(ellipse at 50% 50%, black 20%, transparent 70%)",
      }} />
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   ABOUT
───────────────────────────────────────────────────────────── */
function About() {
  const stats = [
    { value: "8th", label: "Semester IT" },
    { value: "10+", label: "E-books Published" },
    { value: "2+", label: "Years Experience" },
    { value: "∞", label: "Drive to Learn" },
  ];

  return (
    <section id="about" style={{ padding: "120px 5vw", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
        <div>
          <Reveal>
            <div className="mono" style={{ color: T.cyan, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>
              // about_me.js
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="syne" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 24, lineHeight: 1.1 }}>
              Where Logic Meets<br /><span style={{ color: T.blue }}>Aesthetics</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p style={{ color: T.muted, lineHeight: 1.9, fontSize: 16, marginBottom: 32 }}>
              I am a passionate Full-Stack Developer and Information Technology student (8th Semester) with a strong foundation in logic and design. With a diploma in IT Operations and hands-on experience in modern web frameworks, I bridge the gap between backend efficiency and frontend aesthetics.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div style={{ display: "flex", gap: 16 }}>
              <a href="https://github.com/hunfardi-rgb" target="_blank" rel="noreferrer"
                style={{ color: T.muted, transition: "color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.color = T.blue}
                onMouseLeave={e => e.currentTarget.style.color = T.muted}
              ><GitBranch size={22} /></a>
              <a href="https://www.linkedin.com/in/ibrar-wasia" target="_blank" rel="noreferrer"
                style={{ color: T.muted, transition: "color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.color = T.blue}
                onMouseLeave={e => e.currentTarget.style.color = T.muted}
              ><Briefcase size={22} /></a>
              <a href="mailto:wasiaibrar@gmail.com"
                style={{ color: T.muted, transition: "color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.color = T.blue}
                onMouseLeave={e => e.currentTarget.style.color = T.muted}
              ><Mail size={22} /></a>
            </div>
          </Reveal>
        </div>

        {/* Stats bento */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={0.1 * i} direction="left">
              <TiltCard style={{ padding: "28px 24px" }}>
                <div className="syne" style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 800, color: T.blue, letterSpacing: "-0.02em", marginBottom: 4 }}>
                  {s.value}
                </div>
                                <div style={{ color: T.muted, fontSize: 13, fontWeight: 500 }}>{s.label}</div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>

      <style>{`@media (max-width: 768px) { #about > div { grid-template-columns: 1fr !important; gap: 40px !important; } }`}</style>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   SKILLS
───────────────────────────────────────────────────────────── */
const skillGroups = [
  {
    title: "Backend",
    icon: Database,
    color: T.blue,
    items: ["PHP 8.2.12", "Laravel", "MySQL"],
    desc: "Server-side architecture & database design",
  },
  {
    title: "Frontend",
    icon: Code2,
    color: T.cyan,
    items: ["HTML5", "CSS3", "JavaScript ES6+", "Tailwind CSS"],
    desc: "Pixel-perfect interfaces & seamless UX",
  },
  {
    title: "UI/UX Design",
    icon: Layers,
    color: "#a78bfa",
    items: ["Figma", "Wireframing", "Prototyping"],
    desc: "Design systems & user-centered flows",
  },
  {
    title: "AI & Strategy",
    icon: Cpu,
    color: "#f472b6",
    items: ["Prompt Engineering", "Claude", "Grok", "AI Automation"],
    desc: "Next-gen AI-driven content workflows",
  },
  {
    title: "Finance",
    icon: TrendingUp,
    color: "#34d399",
    items: ["Stock Market Analysis", "Data Interpretation", "Risk Assessment"],
    desc: "Quantitative market analysis & insights",
  },
];

function Skills() {
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
  };
  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
  };

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="skills" style={{ padding: "120px 5vw", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal>
          <div className="mono" style={{ color: T.cyan, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>// technical_skills.array</div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="syne" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 60, lineHeight: 1.1 }}>
            My <span style={{ color: T.blue }}>Arsenal</span>
          </h2>
        </Reveal>

        <motion.div
          ref={ref}
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 20,
          }}
        >
          {skillGroups.map((g) => {
            const Icon = g.icon;
            return (
              <motion.div key={g.title} variants={item}>
                <TiltCard style={{ padding: "28px 24px", height: "100%" }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: `${g.color}18`,
                    border: `1px solid ${g.color}30`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: 16,
                  }}>
                    <Icon size={20} style={{ color: g.color }} />
                  </div>
                  <div className="syne" style={{ fontSize: 16, fontWeight: 700, color: T.white, marginBottom: 6 }}>{g.title}</div>
                  <div style={{ fontSize: 12, color: T.muted, marginBottom: 16, lineHeight: 1.6 }}>{g.desc}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {g.items.map((tag) => (
                      <span key={tag} className="mono" style={{
                        fontSize: 10, padding: "3px 10px", borderRadius: 50,
                        background: `${g.color}12`,
                        border: `1px solid ${g.color}25`,
                        color: g.color, letterSpacing: "0.04em",
                      }}>{tag}</span>
                    ))}
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   PROJECTS
───────────────────────────────────────────────────────────── */
const projects = [
  {
    num: "01",
    title: "Medibox",
    subtitle: "Smart Digital Pharmacy",
    desc: "A healthcare solution featuring a robust medication interaction engine and digital prescription management system. Designed to reduce medication errors and streamline patient care workflows.",
    tech: ["Laravel", "MySQL", "PHP 8.2", "Tailwind CSS"],
    color: T.blue,
    icon: "💊",
    badge: "Healthcare Tech",
  },
  {
    num: "02",
    title: "SeatFlow",
    subtitle: "Online Seat Reservation System",
    desc: "A high-performance booking management application focused on real-time resource allocation, optimized for zero latency. Handles concurrent bookings with race-condition-safe transactions.",
    tech: ["Laravel", "MySQL", "WebSockets", "REST API"],
    color: T.cyan,
    icon: "🎟",
    badge: "Real-Time Systems",
  },
];

function Projects() {
  return (
    <section id="projects" style={{ padding: "120px 5vw", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal>
          <div className="mono" style={{ color: T.cyan, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>// featured_work.php</div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="syne" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 60, lineHeight: 1.1 }}>
            Featured <span style={{ color: T.blue }}>Projects</span>
          </h2>
        </Reveal>

        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {projects.map((p, i) => (
            <Reveal key={p.num} delay={0.1 * i}>
              <TiltCard style={{ padding: "40px 40px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 32, alignItems: "start" }}>
                  {/* Number */}
                  <div className="mono" style={{ fontSize: 56, fontWeight: 700, color: `${p.color}20`, letterSpacing: "-0.04em", lineHeight: 1 }}>
                    {p.num}
                  </div>

                  {/* Content */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
                      <span style={{ fontSize: 24 }}>{p.icon}</span>
                      <span className="syne" style={{
                        fontSize: 11, padding: "3px 12px", borderRadius: 50,
                        background: `${p.color}15`, border: `1px solid ${p.color}30`,
                        color: p.color, letterSpacing: "0.08em", textTransform: "uppercase",
                      }}>{p.badge}</span>
                    </div>
                    <h3 className="syne" style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 800, color: T.white, marginBottom: 4, letterSpacing: "-0.02em" }}>
                      {p.title}
                    </h3>
                    <div className="syne" style={{ color: p.color, fontSize: 14, fontWeight: 600, marginBottom: 16 }}>{p.subtitle}</div>
                    <p style={{ color: T.muted, lineHeight: 1.8, fontSize: 15, marginBottom: 20 }}>{p.desc}</p>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {p.tech.map((t) => (
                        <span key={t} className="mono" style={{
                          fontSize: 11, padding: "4px 12px", borderRadius: 6,
                          background: "rgba(255,255,255,0.04)", border: `1px solid ${T.border}`,
                          color: T.muted,
                        }}>{t}</span>
                      ))}
                    </div>
                  </div>

                  {/* Arrow */}
                  <motion.div
                    whileHover={{ x: 4, y: -4 }}
                    style={{ color: p.color, cursor: "pointer", marginTop: 8 }}
                  >
                    <ExternalLink size={20} />
                  </motion.div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          #projects .project-grid { grid-template-columns: 1fr 1fr !important; }
          #projects .project-arrow { display: none !important; }
        }
      `}</style>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   DIGITAL STRATEGY & AI
───────────────────────────────────────────────────────────── */
function Strategy() {
  const cards = [
    { icon: BookOpen, color: "#f472b6", label: "Gumroad Author", value: "10+", sub: "Educational e-books on digital strategy & tech" },
    { icon: Bot, color: T.cyan, label: "AI Automation", value: "Claude + Grok", sub: "Expert in AI-driven content pipelines" },
    { icon: Zap, color: "#fbbf24", label: "Content Strategy", value: "Data-Driven", sub: "Building audiences with measurable impact" },
    { icon: Globe, color: "#34d399", label: "Digital Reach", value: "Growing", sub: "Multi-platform presence & authority building" },
  ];

  return (
    <section id="strategy" style={{ padding: "120px 5vw", position: "relative", zIndex: 1 }}>
      {/* Decorative accent band */}
      <div style={{
        position: "absolute", left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, transparent, ${T.blue}, transparent)`,
        top: 0, opacity: 0.4,
      }} />

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal>
          <div className="mono" style={{ color: T.cyan, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>// content_strategy.ai</div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="syne" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 16, lineHeight: 1.1 }}>
            Digital Strategy<br /><span style={{ color: T.blue }}>& AI Mastery</span>
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p style={{ color: T.muted, fontSize: 16, lineHeight: 1.8, maxWidth: 540, marginBottom: 60 }}>
            Beyond code — I architect content ecosystems and automate workflows using cutting-edge AI tools, publishing educational resources that empower thousands.
          </p>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
          {cards.map((c, i) => {
            const Icon = c.icon;
            return (
              <Reveal key={c.label} delay={0.1 * i}>
                <TiltCard style={{ padding: "32px 28px" }}>
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                      width: 48, height: 48, borderRadius: 14,
                      background: `${c.color}15`,
                      border: `1px solid ${c.color}30`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      marginBottom: 20,
                    }}
                  >
                    <Icon size={22} style={{ color: c.color }} />
                  </motion.div>
                  <div className="syne" style={{ fontSize: 12, color: T.muted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>{c.label}</div>
                  <div className="syne" style={{ fontSize: 20, fontWeight: 800, color: T.white, marginBottom: 8, letterSpacing: "-0.01em" }}>{c.value}</div>
                  <div style={{ color: T.muted, fontSize: 13, lineHeight: 1.6 }}>{c.sub}</div>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   CONTACT
───────────────────────────────────────────────────────────── */
function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Valid email required";
    if (form.message.trim().length < 10) e.message = "Message must be at least 10 characters";
    return e;
  };
const handleSubmit = (e) => {
  e.preventDefault();
  const errorsObj = validate();
  
  if (Object.keys(errorsObj).length > 0) {
    setErrors(errorsObj);
    return;
  }

  emailjs.send(
    'service_unoi42t',
    'template_9csxvbm',
    {
      name: form.name,
      email: form.email,
      message: form.message,
    }
  )
  .then((result) => {
    console.log("Email sent successfully!", result);
    setSent(true);
    setForm({ name: "", email: "", message: "" });
    setErrors({});
    alert("Message sent successfully! ✅");
  })
  .catch((err) => {
    console.error("Email sending failed:", err);
    alert(`Error: ${err.text || "Failed to send message"}`);
  });
};
 /* const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSent(true);
  };*/

  const fieldStyle = (err) => ({
    width: "100%", background: "rgba(255,255,255,0.04)",
    border: `1px solid ${err ? "#f87171" : T.border}`,
    borderRadius: 10, padding: "14px 18px",
    color: T.white, fontSize: 15, fontFamily: "'Figtree', sans-serif",
    outline: "none", transition: "border-color 0.2s",
    boxSizing: "border-box",
  });

  return (
    <section id="contact" style={{ padding: "120px 5vw 80px", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <Reveal>
          <div className="mono" style={{ color: T.cyan, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16, textAlign: "center" }}>
            // get_in_touch.send()
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="syne" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 16, textAlign: "center", lineHeight: 1.1 }}>
            Let's <span style={{ color: T.blue }}>Build</span> Something
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p style={{ color: T.muted, textAlign: "center", marginBottom: 48, lineHeight: 1.8, fontSize: 16 }}>
            Have a project in mind? Open to freelance gigs, collaborations, and full-time roles.
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="glass" style={{ borderRadius: 20, padding: "40px 40px", position: "relative", overflow: "hidden" }}>
            {/* Glow accent */}
            <div style={{
              position: "absolute", top: -60, right: -60, width: 200, height: 200,
              background: `radial-gradient(circle, ${T.blue}20, transparent 70%)`,
              pointerEvents: "none",
            }} />

            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ textAlign: "center", padding: "40px 0" }}
                >
                  <div style={{ fontSize: 48, marginBottom: 16 }}>🚀</div>
                  <div className="syne" style={{ fontSize: 22, fontWeight: 700, color: T.white, marginBottom: 8 }}>Message Sent!</div>
                  <div style={{ color: T.muted }}>I'll get back to you within 24 hours.</div>
                </motion.div>
              ) : (
                <motion.div key="form" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                    <div>
                      <input
                        placeholder="Your Name"
                        value={form.name}
                        onChange={e => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: "" }); }}
                        style={fieldStyle(errors.name)}
                        onFocus={e => e.target.style.borderColor = T.blue}
                        onBlur={e => e.target.style.borderColor = errors.name ? "#f87171" : T.border}
                      />
                      {errors.name && <div style={{ color: "#f87171", fontSize: 12, marginTop: 4 }}>{errors.name}</div>}
                    </div>
                    <div>
                      <input
                        placeholder="Email Address"
                        value={form.email}
                        onChange={e => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: "" }); }}
                        style={fieldStyle(errors.email)}
                        onFocus={e => e.target.style.borderColor = T.blue}
                        onBlur={e => e.target.style.borderColor = errors.email ? "#f87171" : T.border}
                      />
                      {errors.email && <div style={{ color: "#f87171", fontSize: 12, marginTop: 4 }}>{errors.email}</div>}
                    </div>
                  </div>
                  <div>
                    <textarea
                      placeholder="Tell me about your project..."
                      rows={5}
                      value={form.message}
                      onChange={e => { setForm({ ...form, message: e.target.value }); setErrors({ ...errors, message: "" }); }}
                      style={{ ...fieldStyle(errors.message), resize: "vertical" }}
                      onFocus={e => e.target.style.borderColor = T.blue}
                      onBlur={e => e.target.style.borderColor = errors.message ? "#f87171" : T.border}
                    />
                    {errors.message && <div style={{ color: "#f87171", fontSize: 12, marginTop: 4 }}>{errors.message}</div>}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
                    <div style={{ display: "flex", gap: 16 }}>
                      {/* Social links can be added here */}
                    </div>
                    <MagneticBtn onClick={handleSubmit}><Send size={15} />Send Message</MagneticBtn>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{
      padding: "32px 5vw", borderTop: `1px solid ${T.border}`,
      display: "flex", justifyContent: "space-between", alignItems: "center",
      flexWrap: "wrap", gap: 12, position: "relative", zIndex: 1,
    }}>
      <div className="syne" style={{ color: T.muted, fontSize: 13, fontWeight: 600 }}>
        W<span style={{ color: T.blue }}>.</span>Ibrar — Built with ⚡ passion
      </div>
      <div className="mono" style={{ color: T.muted, fontSize: 11 }}>
        © {new Date().getFullYear()} All rights reserved
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────────────────────
   CURSOR GLOW
───────────────────────────────────────────────────────────── */
function CursorGlow() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);

  useEffect(() => {
    const move = (e) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <motion.div
      style={{
        position: "fixed", pointerEvents: "none", zIndex: 9999,
        width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 65%)",
        translateX: "-50%", translateY: "-50%",
        left: x, top: y,
      }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────
   APP
───────────────────────────────────────────────────────────── */
export default function App() {
  useEffect(() => {
    emailjs.init('c6YkAqb12gC6GTYHr');
  }, []);

  return (
    <>
      <FontLoader />
      <div className="noise" />
      <ParticleField />
      <CursorGlow />
      <Nav />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Strategy />
        <Contact />
      </main>
      <Footer />
    </>
  );
}