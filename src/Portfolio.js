import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import Lenis from "lenis";
import {
  AnimatePresence,
  MotionConfig,
  animate,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { ArrowDown, ArrowUpRight, ChevronLeft, ChevronRight, Github, Plus } from "lucide-react";
import {
  DRINKS,
  TEA,
  TEMPS,
  aboutText,
  archive,
  contacts,
  education,
  experiences,
  featured,
  heroWords,
  languages,
  manifesto,
  navLinks,
  skillGroups,
  stack,
  stats,
} from "./data";

const EASE = [0.22, 1, 0.36, 1];
const EASE_IN_OUT = [0.76, 0, 0.24, 1];
const YEAR = new Date().getFullYear();

/* ------------------------------------------------------------------ */
/*  Hooks                                                             */
/* ------------------------------------------------------------------ */
const LenisContext = createContext(null);
const useLenis = () => useContext(LenisContext);

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const useSmoothScroll = (enabled) => {
  const [lenis, setLenis] = useState(null);
  useEffect(() => {
    if (!enabled) return;
    const instance = new Lenis({ autoRaf: true, anchors: true, lerp: 0.085 });
    setLenis(instance);
    return () => {
      instance.destroy();
      setLenis(null);
    };
  }, [enabled]);
  return lenis;
};

const useMedia = (query) => {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return matches;
};

const clockFormat = new Intl.DateTimeFormat("tr-TR", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Istanbul",
});
const useClock = () => {
  const [time, setTime] = useState(() => clockFormat.format(new Date()));
  useEffect(() => {
    const id = setInterval(() => setTime(clockFormat.format(new Date())), 10000);
    return () => clearInterval(id);
  }, []);
  return time;
};

// stops page scroll while an overlay is open
const useScrollLock = (locked) => {
  const lenis = useLenis();
  useEffect(() => {
    if (!locked) return;
    if (lenis) lenis.stop();
    else document.documentElement.style.overflow = "hidden";
    return () => {
      if (lenis) lenis.start();
      else document.documentElement.style.overflow = "";
    };
  }, [locked, lenis]);
};

/* ------------------------------------------------------------------ */
/*  Primitives                                                        */
/* ------------------------------------------------------------------ */
const Logo = ({ className = "", accent = "currentColor" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" role="img" aria-label="Özgür Kaan Kaya">
    {/* umlaut (Ö) */}
    <circle cx="32" cy="5.5" r="4.2" fill={accent} />
    <circle cx="68" cy="5.5" r="4.2" fill={accent} />
    {/* ouroboros ring biting its tail */}
    <path d="M86.14 38.26 A38 38 0 1 0 86.14 61.74" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
    <path d="M77 39 Q92 33 90.5 46 Q89 59 79 57 Q73 49 77 39 Z" fill="currentColor" />
    {/* symmetric double-K */}
    <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M50 16 V84" strokeWidth="6" />
      <path d="M50 50 L74 26 M50 50 L26 26 M50 50 L26 74 M50 50 L74 74" strokeWidth="5.5" />
    </g>
  </svg>
);

// a line of text that slides up from behind a mask
// the wrapper is observed (the child is clipped, so it never "intersects" itself)
const maskVariants = { hidden: { y: "130%" }, show: { y: "0%" } };
const MaskLine = ({ children, ready, delay = 0, className = "" }) => {
  const trigger = ready === undefined
    ? { whileInView: "show", viewport: { once: true, margin: "-40px" } }
    : { animate: ready ? "show" : "hidden" };
  return (
    <motion.span
      initial="hidden"
      {...trigger}
      className="-mb-[0.2em] -mt-[0.16em] block overflow-hidden pb-[0.2em] pt-[0.16em]"
    >
      <motion.span variants={maskVariants} transition={{ duration: 1.1, delay, ease: EASE }} className={`block ${className}`}>
        {children}
      </motion.span>
    </motion.span>
  );
};

const Reveal = ({ children, delay = 0, y = 24, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.9, delay, ease: EASE }}
    className={className}
  >
    {children}
  </motion.div>
);

// label that rolls up to a duplicate of itself on hover
const RollText = ({ children }) => (
  <span className="relative inline-flex overflow-hidden">
    <span className="block transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-full">
      {children}
    </span>
    <span
      aria-hidden
      className="absolute left-0 top-full block transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-full"
    >
      {children}
    </span>
  </span>
);

const Magnetic = ({ as = "a", strength = 0.35, children, className = "", ...props }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 14, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 180, damping: 14, mass: 0.4 });
  const Comp = as === "button" ? motion.button : motion.a;

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <Comp ref={ref} onMouseMove={onMove} onMouseLeave={reset} style={{ x: sx, y: sy }} className={className} {...props}>
      {children}
    </Comp>
  );
};

const Kicker = ({ children, className = "" }) => (
  <span className={`font-mono text-[11px] uppercase tracking-[0.22em] text-bone-muted ${className}`}>{children}</span>
);

const SectionHead = ({ index, label, title, italic }) => (
  <div className="mb-16 grid gap-6 border-t hairline pt-6 md:mb-24 md:grid-cols-12">
    <div className="md:col-span-3">
      <Kicker>
        ({index}) — {label}
      </Kicker>
    </div>
    <h2 className="font-serif text-[clamp(3.25rem,9vw,8.5rem)] leading-[0.88] tracking-[-0.02em] md:col-span-9">
      <MaskLine>
        {title} <span className="italic text-ember">{italic}</span>
      </MaskLine>
    </h2>
  </div>
);

/* ------------------------------------------------------------------ */
/*  Preloader — counter + curtain                                     */
/* ------------------------------------------------------------------ */
const loaderWords = ["Kod.", "Veri.", "Kahve."];

const Preloader = ({ onDone }) => {
  const [n, setN] = useState(0);
  useEffect(() => {
    let t;
    const controls = animate(0, 100, {
      duration: 2,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setN(Math.round(v)),
      onComplete: () => {
        t = setTimeout(onDone, 300);
      },
    });
    return () => {
      controls.stop();
      clearTimeout(t);
    };
  }, [onDone]);

  const wordIdx = Math.min(loaderWords.length - 1, Math.floor(n / 34));

  return (
    <motion.div
      initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
      exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
      transition={{ duration: 1, ease: EASE_IN_OUT }}
      className="fixed inset-0 z-[110] flex flex-col justify-between bg-ink-950 px-5 py-6 text-bone sm:px-10 sm:py-8"
    >
      <div className="flex justify-between">
        <Kicker>Özgür Kaan Kaya</Kicker>
        <Kicker>Portfolyo ©{YEAR}</Kicker>
      </div>

      <div className="flex items-center gap-5">
        <Logo className="h-12 w-12 text-bone sm:h-16 sm:w-16" accent="#ff5b1f" />
        <div className="flex gap-3 font-serif text-[clamp(2rem,6vw,4.5rem)] leading-none">
          {loaderWords.map((w, i) => (
            <span
              key={w}
              className={`transition-all duration-500 ${
                i === wordIdx ? "italic text-ember" : i < wordIdx ? "text-bone" : "text-bone/15"
              }`}
            >
              {w}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-end justify-between gap-6">
        <div className="w-1/2 max-w-sm pb-3">
          <Kicker>Hazırlanıyor</Kicker>
          <div className="mt-3 h-px w-full bg-bone/10">
            <div className="h-px bg-ember" style={{ width: `${n}%` }} />
          </div>
        </div>
        <div className="font-serif text-[clamp(5.5rem,18vw,15rem)] leading-[0.78] tracking-tight">
          {n}
          <span className="text-ember">%</span>
        </div>
      </div>
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/*  Custom cursor — dot + lagging ring that carries a label          */
/* ------------------------------------------------------------------ */
const Cursor = () => {
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState(false);
  const [label, setLabel] = useState("");
  const [hidden, setHidden] = useState(true);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 420, damping: 34, mass: 0.6 });
  const ry = useSpring(y, { stiffness: 420, damping: 34, mass: 0.6 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");

    const onMove = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setHidden(false);
      const t = e.target.closest ? e.target.closest("[data-cursor], a, button") : null;
      setHover(!!t);
      setLabel(t ? t.getAttribute("data-cursor") || "" : "");
    };
    const onLeave = () => setHidden(true);
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [x, y]);

  if (!enabled) return null;
  const size = label ? 92 : hover ? 54 : 30;

  return (
    <div aria-hidden className={`transition-opacity duration-300 ${hidden ? "opacity-0" : "opacity-100"}`}>
      <motion.div
        style={{ x: rx, y: ry }}
        className={`pointer-events-none fixed left-0 top-0 z-[120] ${label ? "" : "mix-blend-difference"}`}
      >
        <motion.div
          animate={{ width: size, height: size }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className={`grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border font-mono text-[10px] uppercase tracking-[0.18em] transition-colors duration-300 ${
            label ? "border-ember bg-ember text-ink-950" : "border-bone/60 bg-transparent"
          }`}
        >
          {label}
        </motion.div>
      </motion.div>
      <motion.div style={{ x, y }} className="pointer-events-none fixed left-0 top-0 z-[121] mix-blend-difference">
        <div className={`h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-bone ${label ? "opacity-0" : ""}`} />
      </motion.div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Editorial column guides                                           */
/* ------------------------------------------------------------------ */
const GridLines = () => (
  <div aria-hidden className="pointer-events-none fixed inset-0 z-0 px-5 sm:px-10">
    <div className="grid h-full grid-cols-4 md:grid-cols-12">
      {Array.from({ length: 12 }).map((_, i) => (
        <span key={i} className={`border-l border-bone/[0.035] ${i >= 4 ? "hidden md:block" : ""} ${i === 11 || i === 3 ? "border-r" : ""} ${i === 3 ? "md:border-r-0" : ""}`} />
      ))}
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/*  Navbar                                                            */
/* ------------------------------------------------------------------ */
const Navbar = () => {
  const lenis = useLenis();
  const time = useClock();
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);
  useScrollLock(open);

  const { scrollYProgress } = useScroll();
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((en) => en.isIntersecting && setActive(en.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ["home", ...navLinks.map((l) => l.id)].forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const goMobile = (e, id) => {
    e.preventDefault();
    setOpen(false);
    if (lenis) {
      lenis.start();
      lenis.scrollTo(`#${id}`, { duration: 1.6 });
    } else {
      document.getElementById(id)?.scrollIntoView();
    }
  };

  return (
    <>
      <motion.div style={{ scaleX: bar }} className="fixed left-0 top-0 z-[82] h-px w-full origin-left bg-ember" />

      <header className="fixed inset-x-0 top-0 z-[80] text-bone mix-blend-difference">
        <div className="flex items-center justify-between px-5 py-5 sm:px-10">
          <a href="#home" aria-label="Ana sayfa" className="group flex items-center gap-3">
            <Logo className="h-9 w-9 transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:rotate-[-25deg]" />
            <span className="hidden font-mono text-[11px] uppercase leading-tight tracking-[0.2em] sm:block">
              Özgür Kaan
              <br />
              Kaya
            </span>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((l, i) => (
              <a key={l.id} href={`#${l.id}`} className="group flex items-start gap-1.5 text-sm">
                <span className={`font-mono text-[9px] transition-colors ${active === l.id ? "text-bone" : "text-bone/50"}`}>
                  0{i + 1}
                </span>
                <span className="relative">
                  <RollText>{l.label}</RollText>
                  <span
                    className={`absolute -bottom-1 left-0 h-px bg-bone transition-all duration-500 ${
                      active === l.id ? "w-full" : "w-0"
                    }`}
                  />
                </span>
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-6 md:flex">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em]">
              İST <span className="tabular-nums">{time}</span>
            </span>
            <a href="#contact" className="group rounded-full border border-bone/40 px-5 py-2 text-sm transition-colors hover:bg-bone hover:text-ink-950">
              <RollText>Konuşalım</RollText>
            </a>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="font-mono text-[11px] uppercase tracking-[0.2em] md:hidden"
            aria-label="Menüyü aç"
          >
            Menü
          </button>
        </div>
      </header>

      {/* mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.8, ease: EASE_IN_OUT }}
            className="fixed inset-0 z-[85] flex flex-col bg-ember px-5 py-5 text-ink-950 md:hidden"
          >
            <div className="flex items-center justify-between">
              <Logo className="h-9 w-9" />
              <button onClick={() => setOpen(false)} className="font-mono text-[11px] uppercase tracking-[0.2em]">
                Kapat
              </button>
            </div>
            <div className="mt-auto flex flex-col gap-1">
              {navLinks.map((l, i) => (
                <a key={l.id} href={`#${l.id}`} onClick={(e) => goMobile(e, l.id)} className="flex items-start gap-3">
                  <span className="pt-3 font-mono text-[10px]">0{i + 1}</span>
                  <span className="font-serif text-[15vw] leading-[0.95]">
                    <MaskLine ready delay={0.25 + i * 0.07}>
                      {l.label}
                    </MaskLine>
                  </span>
                </a>
              ))}
            </div>
            <div className="mt-10 flex justify-between border-t border-ink-950/20 pt-4 font-mono text-[11px] uppercase tracking-[0.2em]">
              <span>İstanbul — {time}</span>
              <span>©{YEAR}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

/* ------------------------------------------------------------------ */
/*  Hero dot field — a grid of points pushed around by the cursor    */
/* ------------------------------------------------------------------ */
const DotField = () => {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = prefersReducedMotion();
    const GAP = 24;
    const RADIUS = 150;
    const mouse = { x: -9999, y: -9999 };
    let dots = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;
    let t = 0;

    const build = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = [];
      for (let y = GAP / 2; y < h; y += GAP) {
        for (let x = GAP / 2; x < w; x += GAP) dots.push({ ox: x, oy: y, x, y, vx: 0, vy: 0 });
      }
    };

    const draw = () => {
      t += 0.012;
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        const dx = d.x - mouse.x;
        const dy = d.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        if (dist < RADIUS) {
          const f = (1 - dist / RADIUS) * 2.4;
          d.vx += (dx / dist) * f;
          d.vy += (dy / dist) * f;
        }
        d.vx = (d.vx + (d.ox - d.x) * 0.055) * 0.8;
        d.vy = (d.vy + (d.oy - d.y) * 0.055) * 0.8;
        d.x += d.vx;
        d.y += d.vy;

        const disp = Math.min(Math.hypot(d.x - d.ox, d.y - d.oy) / 16, 1);
        const wave = (Math.sin(d.ox * 0.011 + t * 2) + Math.cos(d.oy * 0.014 + t * 1.3)) * 0.25 + 0.5;
        const a = 0.1 + wave * 0.16 + disp * 0.7;
        ctx.fillStyle = disp > 0.12 ? `rgba(255,91,31,${a})` : `rgba(237,230,218,${a})`;
        const s = 1.2 + disp * 1.8;
        ctx.fillRect(d.x - s / 2, d.y - s / 2, s, s);
      }
      if (running) raf = requestAnimationFrame(draw);
    };

    const start = () => {
      if (running || reduce) return;
      running = true;
      raf = requestAnimationFrame(draw);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onResize = () => {
      build();
      if (!running) draw();
    };

    build();
    draw();
    const io = new IntersectionObserver(([en]) => (en.isIntersecting ? start() : stop()));
    io.observe(canvas);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("resize", onResize);
    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="absolute inset-0 h-full w-full"
      style={{
        WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 60% 40%, #000 30%, transparent 85%)",
        maskImage: "radial-gradient(ellipse 80% 70% at 60% 40%, #000 30%, transparent 85%)",
      }}
    />
  );
};

/* ------------------------------------------------------------------ */
/*  Hero                                                              */
/* ------------------------------------------------------------------ */
const RoundBadge = () => (
  <Magnetic href="#about" data-cursor="Kaydır" className="relative grid h-28 w-28 shrink-0 place-items-center sm:h-36 sm:w-36">
    <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full animate-spin-slow" aria-hidden>
      <defs>
        <path id="badge-circle" d="M50,50 m-41,0 a41,41 0 1,1 82,0 a41,41 0 1,1 -82,0" />
      </defs>
      <text className="fill-bone font-mono text-[7.5px] uppercase">
        <textPath href="#badge-circle" textLength="255" lengthAdjust="spacing">
          Aşağı kaydır ✦ Keşfet ✦ Aşağı kaydır ✦ Keşfet ✦
        </textPath>
      </text>
    </svg>
    <span className="grid h-12 w-12 place-items-center rounded-full bg-ember text-ink-950 sm:h-14 sm:w-14">
      <ArrowDown size={20} />
    </span>
  </Magnetic>
);

const Hero = ({ ready }) => {
  const ref = useRef(null);
  const [wi, setWi] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  useEffect(() => {
    const t = setInterval(() => setWi((i) => (i + 1) % heroWords.length), 2400);
    return () => clearInterval(t);
  }, []);

  const fade = (delay) => ({
    initial: { opacity: 0, y: 16 },
    animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
    transition: { duration: 1, delay, ease: EASE },
  });

  return (
    <section id="home" ref={ref} className="relative flex min-h-[100svh] flex-col overflow-hidden px-5 pb-8 pt-24 sm:px-10">
      <DotField />

      <motion.div style={{ y, opacity }} className="relative z-10 flex flex-1 flex-col">
        <motion.div {...fade(0.5)} className="grid grid-cols-2 gap-4 border-b hairline pb-4 md:grid-cols-12">
          <Kicker className="whitespace-nowrap md:col-span-3">Portfolyo ©{YEAR}</Kicker>
          <Kicker className="hidden md:col-span-5 md:block">Yazılım Geliştirme Uzmanı · Metro Holding</Kicker>
          <span className="flex items-center justify-end gap-2 md:col-span-4">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ember" />
            </span>
            <Kicker className="whitespace-nowrap text-bone">Projelere açık</Kicker>
          </span>
        </motion.div>

        <h1 className="mt-auto pt-12 font-serif text-[29vw] leading-[0.8] tracking-[-0.035em] md:pt-16 md:text-[clamp(4.2rem,17.5vw,19rem)]">
          <span className="flex items-end justify-between gap-6">
            <MaskLine ready={ready} delay={0.1}>
              Özgür
            </MaskLine>
            <motion.span
              {...fade(0.9)}
              className="mb-[0.18em] hidden max-w-[16rem] text-right font-sans text-[clamp(0.95rem,1.25vw,1.15rem)] leading-snug tracking-normal text-bone-muted md:block"
            >
              Python ile{" "}
              <span className="relative inline-flex h-[1.3em] overflow-hidden align-bottom">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={wi}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 0.55, ease: EASE }}
                    className="block whitespace-nowrap font-serif text-[1.35em] italic leading-[1] text-ember"
                  >
                    {heroWords[wi]}
                  </motion.span>
                </AnimatePresence>
              </span>
              <br />
              geliştiren bir yazılımcı.
            </motion.span>
          </span>
          <span className="flex flex-col md:flex-row md:items-end md:justify-between md:gap-6">
            <MaskLine ready={ready} delay={0.2} className="italic text-ember">
              Kaan
            </MaskLine>
            <MaskLine ready={ready} delay={0.28} className="text-right md:text-left">
              Kaya
            </MaskLine>
          </span>
        </h1>

        <div className="mt-10 grid items-end gap-8 md:grid-cols-12">
          <motion.p {...fade(1)} className="max-w-md text-base leading-relaxed text-bone-muted md:col-span-5 md:text-lg">
            Python tabanlı iç sistemler, React ile kurumsal web çözümleri ve uçtan uca otomasyonlar
            geliştiriyorum. Kodla süreci hızlandırıp veriyi değere dönüştürüyorum.
          </motion.p>
          <motion.div {...fade(1.1)} className="flex items-center gap-6 md:col-span-4 md:col-start-6">
            <Magnetic
              href="#projects"
              data-cursor="Bak"
              className="group inline-flex items-center gap-3 rounded-full bg-bone px-7 py-4 text-sm font-medium text-ink-950"
            >
              <RollText>Seçili işler</RollText>
              <ArrowUpRight size={16} className="transition-transform duration-500 group-hover:rotate-45" />
            </Magnetic>
            <a href="#contact" className="group text-sm text-bone">
              <span className="link-draw pb-1">İletişime geç</span>
            </a>
          </motion.div>
          <motion.div {...fade(1.2)} className="hidden justify-end md:col-span-3 md:flex">
            <RoundBadge />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/*  Velocity marquee — speeds up and skews with scroll velocity       */
/* ------------------------------------------------------------------ */
const wrap = (min, max, v) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

const VelocityMarquee = ({ items, baseVelocity = -2.2 }) => {
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [0, 1000], [0, 4], { clamp: false });
  const skew = useTransform(smooth, [-2500, 2500], [7, -7]);
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const dir = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    let move = dir.current * baseVelocity * (delta / 1000);
    if (factor.get() < 0) dir.current = -1;
    else if (factor.get() > 0) dir.current = 1;
    move += dir.current * move * factor.get();
    baseX.set(baseX.get() + move);
  });

  return (
    <div className="relative overflow-hidden border-y hairline py-8 md:py-10">
      <motion.div style={{ x, skewX: skew }} className="flex w-max whitespace-nowrap">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
            {items.map((s, i) => (
              <span key={i} className="flex items-center font-serif text-[clamp(2.75rem,7.5vw,7rem)] leading-none">
                <span className={i % 2 ? "italic text-ember" : "text-bone"}>{s}</span>
                <span className="mx-8 text-[0.4em] text-bone-dim md:mx-12">✦</span>
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  About                                                             */
/* ------------------------------------------------------------------ */
const ScrollWord = ({ children, progress, range, accent }) => {
  const opacity = useTransform(progress, range, [0.12, 1]);
  return (
    <span className="mr-[0.24em] inline-block">
      <motion.span style={{ opacity }} className={accent ? "italic text-ember" : ""}>
        {children}
      </motion.span>
    </span>
  );
};

const ScrollWords = ({ text, className = "" }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => {
        const accent = w.startsWith("*");
        return (
          <ScrollWord
            key={i}
            progress={scrollYProgress}
            range={[i / words.length, (i + 1) / words.length]}
            accent={accent}
          >
            {accent ? w.replace(/\*/g, "") : w}
          </ScrollWord>
        );
      })}
    </p>
  );
};

const CountUp = ({ to, suffix }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.8, ease: EASE, onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, to]);
  return (
    <span ref={ref} className="tabular-nums">
      {v}
      <span className="text-ember">{suffix}</span>
    </span>
  );
};

const About = () => (
  <section id="about" className="relative px-5 py-28 sm:px-10 md:py-40">
    <SectionHead index="01" label="Hakkımda" title="Kısaca" italic="ben." />

    <ScrollWords
      text={manifesto}
      className="max-w-[24ch] font-serif text-[clamp(2.1rem,5vw,5rem)] leading-[1.02] tracking-[-0.01em] md:ml-[25%]"
    />

    <div className="mt-24 grid gap-16 md:mt-40 md:grid-cols-12">
      <div className="grid grid-cols-3 gap-4 md:col-span-3 md:grid-cols-1 md:gap-10">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} className="border-t hairline pt-4">
            <div className="font-serif text-[clamp(3rem,7vw,6.5rem)] leading-none">
              <CountUp to={s.n} suffix={s.suffix} />
            </div>
            <Kicker className="mt-3 block">{s.label}</Kicker>
          </Reveal>
        ))}
      </div>

      <div className="md:col-span-8 md:col-start-5">
        <Reveal>
          <p className="max-w-2xl text-lg leading-relaxed text-bone-muted md:text-xl">{aboutText}</p>
        </Reveal>

        <div className="mt-16 grid gap-12 sm:grid-cols-2">
          {skillGroups.map((g, gi) => (
            <Reveal key={g.title} delay={gi * 0.08}>
              <Kicker>({g.title})</Kicker>
              <ul className="mt-5 border-t hairline">
                {g.items.map((item) => (
                  <li
                    key={item}
                    className="group flex items-center justify-between border-b hairline py-3 font-serif text-2xl transition-colors duration-300 hover:text-ember md:text-[1.7rem]"
                  >
                    <span className="transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-2">
                      {item}
                    </span>
                    <span className="text-sm text-bone-dim opacity-0 transition-opacity group-hover:opacity-100">✦</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 grid gap-12 sm:grid-cols-2">
          <Reveal>
            <Kicker>(Eğitim)</Kicker>
            <ul className="mt-5 space-y-6 border-t hairline pt-5">
              {education.map((e) => (
                <li key={e.school}>
                  <span className="font-mono text-[11px] text-ember">{e.years}</span>
                  <div className="mt-1 text-lg text-bone">{e.degree}</div>
                  <div className="text-sm text-bone-muted">{e.school}</div>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.08}>
            <Kicker>(Diller)</Kicker>
            <ul className="mt-5 space-y-3 border-t hairline pt-5">
              {languages.map((l) => (
                <li key={l} className="text-lg text-bone">
                  {l}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/*  Experience — editorial accordion index                           */
/* ------------------------------------------------------------------ */
const ExperienceRow = ({ exp, index, open, onToggle }) => (
  <div className="border-b hairline">
    <button
      onClick={onToggle}
      aria-expanded={open}
      data-cursor={open ? "Kapat" : "Aç"}
      className="group relative grid w-full grid-cols-12 items-baseline gap-x-4 gap-y-2 overflow-hidden py-7 text-left md:py-9"
    >
      <span className="absolute inset-0 origin-bottom scale-y-0 bg-bone transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] md:group-hover:scale-y-100" />
      <span className="relative col-span-2 font-mono text-[11px] text-bone-muted transition-colors duration-500 md:col-span-1 md:group-hover:text-ink-950">
        0{index + 1}
      </span>
      <span className="relative col-span-9 font-serif text-[clamp(1.75rem,3.6vw,3.25rem)] leading-[1.02] transition-[color,transform] duration-500 ease-[cubic-bezier(.22,1,.36,1)] md:col-span-6 md:group-hover:translate-x-3 md:group-hover:text-ink-950">
        {exp.role}
        {exp.current && (
          <span className="ml-3 inline-flex translate-y-[-0.4em] items-center gap-1.5 rounded-full bg-ember px-2.5 py-1 align-middle font-mono text-[9px] uppercase tracking-[0.15em] text-ink-950">
            Halen
          </span>
        )}
      </span>
      <span className="relative col-span-12 col-start-3 text-sm text-bone-muted transition-colors duration-500 md:col-span-3 md:col-start-auto md:group-hover:text-ink-950">
        {exp.company}
      </span>
      <span className="relative col-span-12 col-start-3 flex items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.12em] text-bone-muted transition-colors duration-500 md:col-span-2 md:col-start-auto md:group-hover:text-ink-950">
        {exp.date}
        <Plus
          size={18}
          className={`shrink-0 transition-transform duration-500 ${open ? "rotate-45 text-ember" : ""}`}
        />
      </span>
    </button>

    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="overflow-hidden"
        >
          <div className="grid grid-cols-12 gap-4 pb-10">
            <ul className="col-span-12 space-y-3 md:col-span-6 md:col-start-2">
              {exp.description.map((d, i) => (
                <li key={i} className="flex gap-4 text-base leading-relaxed text-bone-muted md:text-lg">
                  <span className="mt-[0.7em] h-px w-5 shrink-0 bg-ember" />
                  {d}
                </li>
              ))}
            </ul>
            <div className="col-span-12 md:col-span-3 md:col-start-9">
              <Kicker>Konum</Kicker>
              <div className="mt-1 text-bone">{exp.location}</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const Experience = () => {
  const [open, setOpen] = useState(0);
  return (
    <section id="experience" className="relative px-5 py-28 sm:px-10 md:py-40">
      <SectionHead index="02" label="Deneyim" title="İş" italic="deneyimi." />
      <Reveal className="border-t hairline">
        {experiences.map((exp, i) => (
          <ExperienceRow key={exp.role} exp={exp} index={i} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
        ))}
      </Reveal>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/*  Projects — sticky horizontal showcase                             */
/* ------------------------------------------------------------------ */
const ShowcasePanel = ({ project, index, total, onOpen, className = "", style }) => (
  <article
    onClick={onOpen}
    data-cursor="İncele"
    className={`group relative shrink-0 cursor-pointer ${className}`}
    style={style}
  >
    <div className="mb-4 flex items-baseline justify-between gap-4">
      <Kicker className="truncate">
        ({String(index + 1).padStart(2, "0")}/{String(total).padStart(2, "0")})
        <span className="ml-4 hidden normal-case tracking-normal text-bone-dim sm:inline">{project.domain}</span>
      </Kicker>
      <Kicker className={project.kind === "live" ? "text-ember" : ""}>
        {project.kind === "live" ? "● Canlı site" : "İç sistem"}
      </Kicker>
    </div>

    <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-ink-800">
      <img
        src={project.images[0]}
        alt={project.title}
        loading="lazy"
        className="h-full w-full scale-[1.02] object-cover object-top transition-transform duration-[1.6s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.08]"
      />
      <div className="absolute inset-0 bg-ink-950/0 transition-colors duration-700 group-hover:bg-ink-950/20" />
    </div>

    <div className="mt-6 grid gap-4 md:grid-cols-12">
      <h3 className="font-serif text-[clamp(2rem,3.4vw,3.4rem)] leading-[0.95] transition-colors duration-500 group-hover:text-ember md:col-span-7">
        {project.title}
      </h3>
      <div className="md:col-span-5">
        <p className="text-sm leading-relaxed text-bone-muted">{project.description}</p>
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
          {project.tags.map((t) => (
            <span key={t} className="font-mono text-[10px] uppercase tracking-[0.15em] text-bone-dim">
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  </article>
);

const HorizontalShowcase = ({ items, onOpen }) => {
  const target = useRef(null);
  const track = useRef(null);
  const [distance, setDistance] = useState(0);
  const dist = useMotionValue(0);
  const { scrollYProgress } = useScroll({ target, offset: ["start start", "end end"] });
  const x = useTransform(() => -scrollYProgress.get() * dist.get());
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    const measure = () => {
      const d = Math.max(0, track.current.scrollWidth - window.innerWidth);
      dist.set(d);
      setDistance(d);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [dist]);

  useEffect(
    () =>
      scrollYProgress.on("change", (v) =>
        setCurrent(Math.min(items.length, Math.max(1, Math.round(v * (items.length - 1)) + 1)))
      ),
    [scrollYProgress, items.length]
  );

  return (
    <div ref={target} className="relative" style={{ height: `calc(100vh + ${distance}px)` }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <motion.div ref={track} style={{ x }} className="flex w-max items-center gap-[5vw] pl-10 pr-[8vw]">
          <div className="flex w-[26vw] shrink-0 flex-col justify-between self-stretch py-4">
            <Kicker>Öne çıkan · güncel</Kicker>
            <div>
              <p className="font-serif text-[clamp(2.25rem,3.6vw,3.75rem)] leading-[1]">
                Şu an <span className="italic text-ember">aktif</span> kullanılan, sahada çalışan sistemler.
              </p>
              <div className="mt-8 flex items-center gap-3">
                <span className="h-px w-12 bg-bone/40" />
                <Kicker className="text-bone">Kaydırmaya devam et</Kicker>
              </div>
            </div>
          </div>
          {items.map((p, i) => (
            <ShowcasePanel
              key={p.title}
              project={p}
              index={i}
              total={items.length}
              onOpen={() => onOpen(p)}
              style={{ width: "min(58vw, 92vh)" }}
            />
          ))}
        </motion.div>

        <div className="absolute inset-x-10 bottom-8 flex items-center gap-6">
          <span className="font-mono text-[11px] tabular-nums text-bone">
            {String(current).padStart(2, "0")}
          </span>
          <div className="h-px flex-1 bg-bone/10">
            <motion.div style={{ scaleX: bar }} className="h-px origin-left bg-ember" />
          </div>
          <span className="font-mono text-[11px] tabular-nums text-bone-muted">
            {String(items.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
};

const StackedShowcase = ({ items, onOpen }) => (
  <div className="space-y-20 px-5 sm:px-10">
    {items.map((p, i) => (
      <Reveal key={p.title}>
        <ShowcasePanel project={p} index={i} total={items.length} onOpen={() => onOpen(p)} className="w-full" />
      </Reveal>
    ))}
  </div>
);

/* --- Archive list with a cursor-following preview --- */
const Archive = ({ items, onOpen }) => {
  const [hover, setHover] = useState(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 26, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 220, damping: 26, mass: 0.6 });

  return (
    <div
      onMouseMove={(e) => {
        x.set(e.clientX);
        y.set(e.clientY);
      }}
      onMouseLeave={() => setHover(null)}
      className="relative border-t hairline"
    >
      {items.map((p, i) => (
        <button
          key={p.title}
          onClick={() => onOpen(p)}
          onMouseEnter={() => setHover(i)}
          data-cursor="Aç"
          className={`group grid w-full grid-cols-12 items-center gap-4 border-b hairline py-6 text-left transition-opacity duration-500 md:py-8 ${
            hover !== null && hover !== i ? "md:opacity-30" : ""
          }`}
        >
          <span className="col-span-1 hidden font-mono text-[11px] text-bone-muted md:block">0{i + 1}</span>
          <img src={p.thumbnail} alt="" loading="lazy" className="col-span-3 aspect-[4/3] w-full rounded-sm object-cover md:hidden" />
          <span className="col-span-9 font-serif text-[clamp(1.6rem,3.4vw,3.25rem)] leading-[1] transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-3 md:col-span-6">
            {p.title}
          </span>
          <span className="col-span-3 hidden font-mono text-[10px] uppercase tracking-[0.15em] text-bone-muted md:block">
            {p.tags.slice(0, 3).join(" · ")}
          </span>
          <span className="col-span-2 hidden items-center justify-end gap-3 font-mono text-[11px] text-bone-muted md:flex">
            {p.year}
            <ArrowUpRight size={16} className="text-bone transition-transform duration-500 group-hover:rotate-45 group-hover:text-ember" />
          </span>
        </button>
      ))}

      <motion.div style={{ x: sx, y: sy }} className="pointer-events-none fixed left-0 top-0 z-[70] hidden md:block">
        <AnimatePresence>
          {hover !== null && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.7, rotate: -6 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.7, rotate: 6 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="-translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-md border hairline bg-ink-800 shadow-2xl shadow-black/60"
              style={{ width: 340, height: 240 }}
            >
              <AnimatePresence initial={false}>
                <motion.img
                  key={hover}
                  src={items[hover].thumbnail}
                  alt=""
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  exit={{ y: "-100%" }}
                  transition={{ duration: 0.55, ease: EASE }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

/* --- Project sheet (modal) --- */
const ProjectSheet = ({ project, onClose }) => {
  const [slide, setSlide] = useState(0);
  const count = project.images.length;
  useScrollLock(true);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setSlide((s) => (s + 1) % count);
      if (e.key === "ArrowLeft") setSlide((s) => (s - 1 + count) % count);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, count]);

  // portalled so it sits above the fixed header, outside main's stacking context
  return createPortal(
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        onClick={onClose}
        data-cursor="Kapat"
        className="fixed inset-0 z-[95] bg-ink-950/70 backdrop-blur-sm"
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        initial={{ y: "100%" }}
        animate={{ y: "0%" }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.9, ease: EASE_IN_OUT }}
        data-lenis-prevent
        className="fixed inset-x-0 bottom-0 top-[5vh] z-[96] overflow-y-auto overscroll-contain rounded-t-[20px] bg-bone text-ink-950"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between bg-bone/90 px-5 py-4 backdrop-blur sm:px-10">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-950/60">
            (Proje) — {project.kind === "live" ? "Canlı site" : project.kind === "internal" ? "İç sistem" : project.year}
          </span>
          <button onClick={onClose} className="group flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em]">
            <RollText>Kapat</RollText>
            <span className="grid h-8 w-8 place-items-center rounded-full bg-ink-950 text-bone transition-transform duration-500 group-hover:rotate-90">
              <Plus size={16} className="rotate-45" />
            </span>
          </button>
        </div>

        <div className="px-5 pb-16 sm:px-10">
          <h3 className="max-w-5xl pt-6 font-serif text-[clamp(2.75rem,7vw,6.5rem)] leading-[0.92] tracking-[-0.02em]">
            <MaskLine ready delay={0.35}>
              {project.title}
            </MaskLine>
          </h3>

          {/* gallery */}
          <div className="relative mt-10 overflow-hidden rounded-md bg-ink-950">
            <div className="relative aspect-[16/9] w-full">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.img
                  key={slide}
                  src={project.images[slide]}
                  alt={`${project.title} — görsel ${slide + 1}`}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: EASE }}
                  className="absolute inset-0 h-full w-full object-contain"
                />
              </AnimatePresence>
            </div>
            {count > 1 && (
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <span className="mr-2 font-mono text-[11px] tabular-nums text-bone">
                  {slide + 1}/{count}
                </span>
                <button
                  onClick={() => setSlide((s) => (s - 1 + count) % count)}
                  aria-label="Önceki görsel"
                  className="grid h-10 w-10 place-items-center rounded-full bg-bone text-ink-950 transition hover:bg-ember"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setSlide((s) => (s + 1) % count)}
                  aria-label="Sonraki görsel"
                  className="grid h-10 w-10 place-items-center rounded-full bg-bone text-ink-950 transition hover:bg-ember"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
          {count > 1 && (
            <div className="mt-3 flex gap-3">
              {project.images.map((src, i) => (
                <button
                  key={src}
                  onClick={() => setSlide(i)}
                  aria-label={`Görsel ${i + 1}`}
                  className={`h-14 w-20 overflow-hidden rounded-sm border-2 transition sm:h-16 sm:w-24 ${
                    i === slide ? "border-ember" : "border-transparent opacity-50 hover:opacity-100"
                  }`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="mt-14 grid gap-10 border-t border-ink-950/15 pt-8 md:grid-cols-12">
            <div className="space-y-6 md:col-span-4">
              {project.domain && (
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-950/50">Adres</span>
                  <div className="mt-1 font-mono text-sm">{project.domain}</div>
                </div>
              )}
              <div>
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-950/50">Teknolojiler</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {project.tags.map((t) => (
                    <span key={t} className="rounded-full border border-ink-950/20 px-3 py-1 text-xs">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <p className="text-lg leading-relaxed text-ink-950/80 md:text-xl">{project.fullDescription}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 rounded-full bg-ink-950 px-6 py-3 text-sm text-bone transition-colors hover:bg-ember hover:text-ink-950"
                  >
                    <RollText>Siteyi ziyaret et</RollText>
                    <ArrowUpRight size={16} />
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 rounded-full border border-ink-950/25 px-6 py-3 text-sm transition-colors hover:border-ink-950 hover:bg-ink-950 hover:text-bone"
                  >
                    <Github size={16} />
                    <RollText>Kaynak kod</RollText>
                  </a>
                )}
                {project.kind === "internal" && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-ink-950/15 px-6 py-3 text-sm text-ink-950/60">
                    İç sistem · yetkiyle erişilir
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>,
    document.body
  );
};

const Projects = () => {
  const [active, setActive] = useState(null);
  const wide = useMedia("(min-width: 768px)");
  const close = useCallback(() => setActive(null), []);

  return (
    <section id="projects" className="relative py-28 md:py-40">
      <div className="px-5 sm:px-10">
        <SectionHead index="03" label="Projeler" title="Seçili" italic="işler." />
      </div>

      {wide ? <HorizontalShowcase items={featured} onOpen={setActive} /> : <StackedShowcase items={featured} onOpen={setActive} />}

      <div className="px-5 pt-28 sm:px-10 md:pt-40">
        <div className="mb-10 flex items-end justify-between gap-6">
          <h3 className="font-serif text-[clamp(2.5rem,6vw,5.5rem)] leading-none">
            <MaskLine>
              Arşiv<span className="text-ember">.</span>
            </MaskLine>
          </h3>
          <Kicker className="pb-2 text-right">Analiz & kişisel projeler</Kicker>
        </div>
        <Archive items={archive} onOpen={setActive} />
      </div>

      <AnimatePresence>{active && <ProjectSheet key={active.title} project={active} onClose={close} />}</AnimatePresence>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/*  Contact — coffee order unlocks the details                       */
/* ------------------------------------------------------------------ */
const STEP_LABELS = ["Sıcaklık", "Kahve", "Servis"];
const COFFEE_FILL = {
  hot: ["#1c0f08", "#4a2614", "#8a5a36"],
  cold: ["#3a220f", "#7a4a26", "#c09065"],
};

const Cup = ({ temp, drink }) => {
  const isCold = temp?.id === "cold";
  const fill = drink?.fill || COFFEE_FILL[isCold ? "cold" : "hot"];
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        {!isCold && (
          <div className="pointer-events-none absolute -top-10 left-1/2 flex -translate-x-1/2 gap-2.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-10 w-[3px] animate-steam rounded-full bg-bone/50 blur-[2px]"
                style={{ animationDelay: `${0.8 + i * 0.45}s` }}
              />
            ))}
          </div>
        )}
        <span className="absolute -right-5 top-4 h-10 w-7 rounded-r-2xl border-[3px] border-l-0 border-bone/40" />
        <div className="relative h-32 w-36 overflow-hidden rounded-b-[2.6rem] rounded-t-sm border-[3px] border-bone/40">
          <motion.div
            initial={{ height: "0%" }}
            animate={{ height: "86%" }}
            transition={{ duration: 1.9, ease: "easeInOut" }}
            className="absolute inset-x-0 bottom-0"
            style={{ background: `linear-gradient(to top, ${fill[0]}, ${fill[1]}, ${fill[2]})` }}
          >
            <div className="h-[3px] w-full bg-[#e9d3b4]/70" />
          </motion.div>
          {isCold &&
            [0, 1, 2].map((i) => (
              <motion.span
                key={i}
                initial={{ y: -60, opacity: 0, rotate: 0 }}
                animate={{ y: 0, opacity: 1, rotate: 12 + i * 14 }}
                transition={{ delay: 0.7 + i * 0.22, type: "spring", stiffness: 260, damping: 14 }}
                className="absolute h-5 w-5 rounded-[3px] border border-bone/60 bg-bone/20 backdrop-blur-sm"
                style={{ left: `${20 + i * 24}%`, bottom: `${30 + (i % 2) * 18}%` }}
              />
            ))}
        </div>
      </div>
      <div className="mt-2 h-2 w-48 rounded-full bg-bone/10" />
    </div>
  );
};

const CoffeeOrder = ({ onServed }) => {
  const [step, setStep] = useState("temp"); // temp | type | brewing | done
  const [temp, setTemp] = useState(null);
  const [drink, setDrink] = useState(null);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const brew = (d) => {
    clearTimeout(timer.current);
    setDrink(d);
    setStep("brewing");
    timer.current = setTimeout(() => {
      setStep("done");
      onServed();
    }, 2300);
  };
  const restart = () => {
    setTemp(null);
    setDrink(null);
    setStep("temp");
  };

  const stepIdx = step === "temp" ? 0 : step === "type" ? 1 : 2;
  const done = step === "done";

  const sparks = useMemo(
    () =>
      Array.from({ length: 22 }).map(() => ({
        x: (Math.random() * 2 - 1) * 260,
        y: -(Math.random() * 200 + 60),
        r: Math.random() * 360,
        d: Math.random() * 0.25,
        s: 4 + Math.random() * 6,
      })),
    []
  );

  const swap = {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -18 },
    transition: { duration: 0.45, ease: EASE },
  };

  return (
    <div className="relative flex min-h-[460px] flex-col rounded-[18px] border hairline bg-ink-900/70 p-6 backdrop-blur-sm sm:p-10">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <Kicker>Sipariş · ÖKK-{YEAR}</Kicker>
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.15em]">
          {STEP_LABELS.map((l, i) => (
            <span key={l} className={`flex items-center gap-2 ${i <= stepIdx ? "text-ember" : "text-bone-dim"}`}>
              0{i + 1} {l}
              {i < STEP_LABELS.length - 1 && <span className="h-px w-4 bg-bone/15" />}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <AnimatePresence mode="wait">
          {step === "temp" && (
            <motion.div key="temp" {...swap} className="flex flex-1 flex-col">
              <p className="font-serif text-[clamp(2rem,3.4vw,3rem)] leading-none">
                Nasıl <span className="italic text-ember">seversin?</span>
              </p>
              <div className="mt-8 grid flex-1 grid-cols-2 gap-3">
                {TEMPS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTemp(t);
                      setStep("type");
                    }}
                    className="group relative flex min-h-[180px] flex-col justify-between overflow-hidden rounded-xl border hairline p-5 text-left"
                  >
                    <span className="absolute inset-0 translate-y-full bg-ember transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-y-0" />
                    <span className="relative font-serif text-5xl leading-none transition-colors duration-500 group-hover:text-ink-950">
                      {t.glyph}
                    </span>
                    <span className="relative">
                      <span className="block font-serif text-4xl transition-colors duration-500 group-hover:text-ink-950">
                        {t.label}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-bone-muted transition-colors duration-500 group-hover:text-ink-950/70">
                        {t.sub}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => brew(TEA)}
                className="mt-6 self-start font-mono text-[11px] uppercase tracking-[0.15em] text-bone-muted transition-colors hover:text-bone"
              >
                <span className="link-draw pb-0.5">Kahve sevmiyorum → çay olsun</span>
              </button>
            </motion.div>
          )}

          {step === "type" && (
            <motion.div key="type" {...swap} className="flex flex-1 flex-col">
              <p className="font-serif text-[clamp(1.75rem,3vw,2.6rem)] leading-[1.05]">
                {temp.id === "cold" ? "Soğuk" : "Sıcak"} tarafı seçtin.{" "}
                <span className="italic text-ember">Hangisi senin kahven?</span>
              </p>
              <ul className="mt-8 border-t hairline">
                {DRINKS[temp.id].map((d, i) => (
                  <li key={d.id}>
                    <button
                      onClick={() => brew(d)}
                      className="group flex w-full items-center justify-between border-b hairline py-4 text-left"
                    >
                      <span className="flex items-baseline gap-4">
                        <span className="font-mono text-[10px] text-bone-dim">0{i + 1}</span>
                        <span className="font-serif text-[clamp(1.6rem,2.6vw,2.25rem)] leading-none transition-[color,transform] duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-2 group-hover:text-ember">
                          {d.label}
                        </span>
                      </span>
                      <ArrowUpRight size={18} className="text-bone-dim transition-transform duration-500 group-hover:rotate-45 group-hover:text-ember" />
                    </button>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setStep("temp")}
                className="mt-6 self-start font-mono text-[11px] uppercase tracking-[0.15em] text-bone-muted transition-colors hover:text-bone"
              >
                ← Geri
              </button>
            </motion.div>
          )}

          {(step === "brewing" || done) && (
            <motion.div key="cup" {...swap} className="relative flex flex-1 flex-col items-center gap-10 sm:flex-row sm:items-center">
              {done && (
                <div className="pointer-events-none absolute left-[18%] top-1/3 z-20">
                  {sparks.map((s, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, x: 0, y: 0, rotate: 0 }}
                      animate={{ opacity: [0, 1, 1, 0], x: s.x, y: s.y, rotate: s.r }}
                      transition={{ duration: 1.5, delay: s.d, ease: "easeOut" }}
                      className={`absolute ${i % 3 ? "bg-ember" : "bg-bone"}`}
                      style={{ width: s.s, height: s.s }}
                    />
                  ))}
                </div>
              )}

              <div className="pt-10 sm:w-2/5">
                <Cup temp={temp} drink={drink} />
              </div>

              <div className="w-full sm:w-3/5">
                <AnimatePresence mode="wait">
                  {!done ? (
                    <motion.div key="brewing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <Kicker>Hazırlanıyor</Kicker>
                      <p className="mt-2 font-serif text-4xl">
                        Bir <span className="italic text-ember">{drink?.label}</span>…
                      </p>
                      <div className="mt-6 h-px w-full bg-bone/10">
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 2.2, ease: "linear" }}
                          className="h-px origin-left bg-ember"
                        />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="done"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, ease: EASE }}
                    >
                      <Kicker className="text-ember">Servis edildi</Kicker>
                      <p className="mt-2 font-serif text-[clamp(2.25rem,3.4vw,3rem)] leading-none">
                        {drink?.label} <span className="italic">hazır.</span>
                      </p>
                      <p className="mt-4 leading-relaxed text-bone-muted">{drink?.note}</p>
                      <p className="mt-4 text-sm text-bone">Bunu ilk buluşmamızda ben ısmarlıyorum. Bilgilerim aşağıda ↓</p>
                      <button
                        onClick={restart}
                        className="mt-5 font-mono text-[11px] uppercase tracking-[0.15em] text-bone-muted transition-colors hover:text-bone"
                      >
                        <span className="link-draw pb-0.5">↺ Başka bir kahve dene</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const Contact = () => {
  const [revealed, setRevealed] = useState(false);
  const serve = useCallback(() => setRevealed(true), []);

  return (
    <section id="contact" className="relative px-5 py-28 sm:px-10 md:py-40">
      <SectionHead index="04" label="İletişim" title="Bir kahve" italic="ısmarla." />

      <div className="grid gap-12 md:grid-cols-12">
        <Reveal className="md:col-span-4">
          <p className="max-w-sm text-lg leading-relaxed text-bone-muted md:text-xl">
            Buraya kadar geldiyseniz size katabileceğim değere dair bir fikriniz oluşmuştur. Çalışmadan
            önce ben de sizi biraz tanımak isterim — en sevdiğiniz kahveden başlayalım.
          </p>
          <div className="mt-10 hidden md:block">
            <Kicker>Konum</Kicker>
            <div className="mt-1 text-bone">İstanbul, Türkiye</div>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="md:col-span-8">
          <CoffeeOrder onServed={serve} />
        </Reveal>
      </div>

      <div className="relative mt-20 md:mt-28">
        {!revealed && (
          <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center">
            <span className="rounded-full border hairline bg-ink-950/80 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-bone backdrop-blur">
              Önce kahveni seç — bilgiler açılsın
            </span>
          </div>
        )}
        <motion.div
          animate={{ filter: revealed ? "blur(0px)" : "blur(10px)", opacity: revealed ? 1 : 0.35 }}
          transition={{ duration: 0.8 }}
          className={`border-t hairline ${revealed ? "" : "pointer-events-none select-none"}`}
          aria-hidden={!revealed}
        >
          {contacts.map((c) => {
            const ext = c.href.startsWith("http");
            return (
              <a
                key={c.label}
                href={revealed ? c.href : undefined}
                tabIndex={revealed ? 0 : -1}
                {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group grid grid-cols-12 items-center gap-4 border-b hairline py-6 md:py-8"
              >
                <Kicker className="col-span-12 md:col-span-3">{c.label}</Kicker>
                <span className="col-span-11 break-all font-serif text-[clamp(1.6rem,4.4vw,4rem)] leading-none transition-[color,transform] duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-3 group-hover:text-ember md:col-span-8">
                  {c.value}
                </span>
                <ArrowUpRight
                  size={28}
                  className="col-span-1 justify-self-end text-bone-dim transition-transform duration-500 group-hover:rotate-45 group-hover:text-ember"
                />
              </a>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/*  Footer — giant wordmark                                           */
/* ------------------------------------------------------------------ */
const Footer = () => {
  const lenis = useLenis();
  const time = useClock();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], ["35%", "0%"]);

  const toTop = () => (lenis ? lenis.scrollTo(0, { duration: 2 }) : window.scrollTo({ top: 0 }));
  const socials = contacts.filter((c) => c.href.startsWith("http"));

  return (
    <footer ref={ref} className="relative overflow-hidden border-t hairline px-5 pt-16 sm:px-10">
      <div className="grid gap-10 md:grid-cols-12">
        <p className="font-serif text-[clamp(2rem,3.6vw,3.25rem)] leading-[1] md:col-span-5">
          Bir sonraki projeyi <span className="italic text-ember">birlikte</span> yapalım.
        </p>
        <div className="md:col-span-2 md:col-start-7">
          <Kicker>Menü</Kicker>
          <ul className="mt-4 space-y-1.5">
            {navLinks.map((l) => (
              <li key={l.id}>
                <a href={`#${l.id}`} className="group text-bone">
                  <RollText>{l.label}</RollText>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-2">
          <Kicker>Sosyal</Kicker>
          <ul className="mt-4 space-y-1.5">
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1 text-bone">
                  <RollText>{s.label}</RollText>
                  <ArrowUpRight size={13} />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col items-start justify-between gap-6 md:col-span-2 md:items-end">
          <div className="md:text-right">
            <Kicker>Yerel saat</Kicker>
            <div className="mt-4 tabular-nums text-bone">İstanbul {time}</div>
          </div>
          <button onClick={toTop} data-cursor="Yukarı" className="group inline-flex items-center gap-2 text-sm text-bone">
            <RollText>Başa dön</RollText>
            <span className="grid h-9 w-9 place-items-center rounded-full border border-bone/30 transition-colors group-hover:border-ember group-hover:bg-ember group-hover:text-ink-950">
              <ArrowUpRight size={15} className="-rotate-45" />
            </span>
          </button>
        </div>
      </div>

      <motion.div style={{ y }} aria-hidden className="mt-16 select-none whitespace-nowrap pb-[0.16em] font-serif text-[17.4vw] leading-[0.8] tracking-[-0.045em] md:mt-24">
        Özgür Kaan <span className="italic text-ember">Kaya</span>
      </motion.div>

      <div className="flex flex-col justify-between gap-2 border-t hairline py-5 sm:flex-row">
        <Kicker>© {YEAR} Özgür Kaan Kaya</Kicker>
        <Kicker>Tasarım & kod — ÖKK</Kicker>
      </div>
    </footer>
  );
};

/* ------------------------------------------------------------------ */
/*  Root                                                              */
/* ------------------------------------------------------------------ */
const INTRO_KEY = "okk-intro-seen";

const Portfolio = () => {
  const [reduce] = useState(prefersReducedMotion);
  const [loading, setLoading] = useState(() => {
    if (reduce) return false;
    try {
      return !sessionStorage.getItem(INTRO_KEY);
    } catch {
      return true;
    }
  });
  const lenis = useSmoothScroll(!reduce);

  useEffect(() => {
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!lenis) return;
    if (loading) lenis.stop();
    else lenis.start();
  }, [lenis, loading]);

  const finishIntro = useCallback(() => {
    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {
      /* storage unavailable — intro simply replays next time */
    }
    setLoading(false);
  }, []);

  return (
    <LenisContext.Provider value={lenis}>
      <MotionConfig reducedMotion="user">
        <div className="grain relative min-h-screen bg-ink-950 font-sans text-bone">
          <AnimatePresence>{loading && <Preloader key="loader" onDone={finishIntro} />}</AnimatePresence>
          <Cursor />
          <GridLines />
          <Navbar />
          <main className="relative z-10">
            <Hero ready={!loading} />
            <VelocityMarquee items={stack} />
            <About />
            <Experience />
            <Projects />
            <Contact />
          </main>
          <div className="relative z-10">
            <Footer />
          </div>
        </div>
      </MotionConfig>
    </LenisContext.Provider>
  );
};

export default Portfolio;
