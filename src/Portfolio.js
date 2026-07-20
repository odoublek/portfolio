import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useMotionValue,
} from "framer-motion";
import {
  Github,
  Linkedin,
  Mail,
  Phone,
  Code,
  TrendingUp,
  Coffee,
  Database,
  Cpu,
  ArrowUpRight,
  ArrowRight,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  MapPin,
  Globe,
  ExternalLink,
  Lock,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Cursor spotlight — big soft glow that trails the pointer          */
/* ------------------------------------------------------------------ */
const CursorGlow = () => {
  const ref = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const el = ref.current;
    let raf = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;

    const onMove = (e) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const loop = () => {
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      if (el) el.style.transform = `translate3d(${x - 250}px, ${y - 250}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[2] h-[500px] w-[500px] rounded-full opacity-60 mix-blend-screen"
      style={{
        background:
          "radial-gradient(circle, rgba(139,92,246,0.15), rgba(217,70,239,0.06) 40%, transparent 70%)",
      }}
    />
  );
};

/* ------------------------------------------------------------------ */
/*  Animated aurora background                                        */
/* ------------------------------------------------------------------ */
const Aurora = () => (
  <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
    <div className="absolute -left-40 -top-40 h-[560px] w-[560px] rounded-full bg-indigo-600/25 blur-[120px] animate-aurora-1" />
    <div className="absolute -right-40 top-10 h-[520px] w-[520px] rounded-full bg-fuchsia-600/20 blur-[130px] animate-aurora-2" />
    <div className="absolute bottom-[-160px] left-1/3 h-[520px] w-[520px] rounded-full bg-violet-600/20 blur-[140px] animate-aurora-3" />
    <div className="absolute inset-0 dotgrid opacity-60" />
    <div className="absolute inset-0 bg-gradient-to-b from-ink-950/40 via-transparent to-ink-950" />
  </div>
);

/* ------------------------------------------------------------------ */
/*  Reveal-on-scroll wrapper                                          */
/* ------------------------------------------------------------------ */
const Reveal = ({ children, delay = 0, y = 22, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

/* ------------------------------------------------------------------ */
/*  Magnetic button — pulls toward the cursor                        */
/* ------------------------------------------------------------------ */
const Magnetic = ({ children, className = "", ...props }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.4);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.4);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className={className}
      {...props}
    >
      {children}
    </motion.a>
  );
};

/* ------------------------------------------------------------------ */
/*  Spotlight card — tracks cursor to light its surface              */
/* ------------------------------------------------------------------ */
const SpotlightCard = ({ children, className = "", ...props }) => {
  const onMove = useCallback((e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
  }, []);
  return (
    <div onMouseMove={onMove} className={`spotlight glow-border ${className}`} {...props}>
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Navbar                                                            */
/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
/*  Logo — ouroboros "Ö" ring with umlaut + symmetric double-K (ÖKK)   */
/* ------------------------------------------------------------------ */
const Logo = ({ className = "" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" role="img" aria-label="Özgür Kaan Kaya">
    <defs>
      <linearGradient id="okk-grad" x1="8" y1="6" x2="92" y2="94" gradientUnits="userSpaceOnUse">
        <stop stopColor="#a78bfa" />
        <stop offset="0.5" stopColor="#e879f9" />
        <stop offset="1" stopColor="#fbbf24" />
      </linearGradient>
    </defs>

    {/* umlaut (Ö) — sits above the ring, spread to the sides, not touching */}
    <circle cx="32" cy="5.5" r="4.2" fill="#fbbf24" />
    <circle cx="68" cy="5.5" r="4.2" fill="#fbbf24" />

    {/* ouroboros body — snake curved into the "O" */}
    <path d="M86.14 38.26 A38 38 0 1 0 86.14 61.74" stroke="url(#okk-grad)" strokeWidth="8" strokeLinecap="round" />
    {/* head biting the tail */}
    <path d="M77 39 Q92 33 90.5 46 Q89 59 79 57 Q73 49 77 39 Z" fill="url(#okk-grad)" />
    {/* eye */}
    <circle cx="84.5" cy="43" r="1.7" fill="#0b0b16" />

    {/* symmetric double-K monogram inside the ring */}
    <g stroke="url(#okk-grad)" strokeLinecap="round" strokeLinejoin="round">
      <path d="M50 16 V84" strokeWidth="6" />
      <path d="M50 50 L74 26 M50 50 L26 26 M50 50 L26 74 M50 50 L74 74" strokeWidth="5.5" />
    </g>
  </svg>
);

const links = [
  { id: "home", label: "Ana Sayfa" },
  { id: "about", label: "Hakkımda" },
  { id: "experience", label: "Deneyim" },
  { id: "projects", label: "Projeler" },
];

const Navbar = () => {
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { scrollYProgress } = useScroll();
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) setActive(en.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    links.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <motion.div
        style={{ scaleX: bar }}
        className="fixed left-0 top-0 z-[60] h-[2px] w-full origin-left bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-spark"
      />
      <nav
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          scrolled ? "border-b border-white/10 bg-ink-950/70 backdrop-blur-xl" : "border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <a href="#home" className="group flex items-center" aria-label="Özgür Kaan Kaya">
            <Logo className="h-10 w-10 drop-shadow-[0_2px_10px_rgba(139,92,246,0.35)] transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-6" />
          </a>

          <div className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                className={`relative rounded-full px-4 py-2 text-sm font-medium transition ${
                  active === l.id ? "text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                {active === l.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-white/10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{l.label}</span>
              </a>
            ))}
          </div>

          <a
            href="#contact"
            className="hidden rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:border-spark/60 hover:text-spark md:inline-block"
          >
            Konuşalım
          </a>

          <button
            onClick={() => setOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 text-white md:hidden"
            aria-label="Menü"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-white/10 bg-ink-950/95 backdrop-blur-xl md:hidden"
            >
              <div className="flex flex-col px-5 py-3">
                {links.map((l) => (
                  <a
                    key={l.id}
                    href={`#${l.id}`}
                    onClick={() => setOpen(false)}
                    className={`py-3 text-base ${active === l.id ? "text-spark" : "text-slate-300"}`}
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

/* ------------------------------------------------------------------ */
/*  Hero                                                              */
/* ------------------------------------------------------------------ */
const heroWords = ["otomasyon", "iç sistemler", "veri analizi", "kurumsal web"];

const Hero = () => {
  const [wi, setWi] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setWi((i) => (i + 1) % heroWords.length), 2200);
    return () => clearInterval(t);
  }, []);

  const title = "Özgür Kaan Kaya";

  return (
    <section id="home" className="relative flex min-h-screen items-center px-5 pt-28 pb-16">
      <div className="mx-auto w-full max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-slate-300"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Yazılım Geliştirme Uzmanı · Türkiye
        </motion.div>

        <h1 className="font-display text-5xl font-bold leading-[1.08] tracking-tight text-white sm:text-7xl md:text-8xl">
          <span className="block pb-2">
            {title.split(" ").map((word, wIdx) => (
              <span key={wIdx} className="mr-4 inline-block">
                {word.split("").map((ch, i) => (
                  <motion.span
                    key={i}
                    initial={{ y: 24, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      delay: 0.15 + wIdx * 0.1 + i * 0.03,
                      duration: 0.7,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="inline-block"
                  >
                    {ch}
                  </motion.span>
                ))}
              </span>
            ))}
          </span>
        </h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-display text-2xl font-medium text-slate-400 sm:text-3xl"
        >
          <span>Python ile</span>
          <span className="relative inline-grid h-[1.4em] overflow-hidden align-bottom">
            <AnimatePresence mode="wait">
              <motion.span
                key={wi}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="text-gradient whitespace-nowrap font-semibold"
              >
                {heroWords[wi]}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-8 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg"
        >
          Yazılım Geliştirme Uzmanı olarak Python tabanlı iç sistemler, React ile kurumsal web
          çözümleri ve uçtan uca otomasyonlar geliştiriyorum. Kodla süreçleri hızlandırmayı, veriyi
          değere dönüştürmeyi ve işletmeleri daha akıllı çalıştırmayı seviyorum.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Magnetic
            href="#contact"
            className="group inline-flex cursor-pointer items-center gap-2 rounded-full bg-spark px-7 py-3.5 font-display text-sm font-bold text-ink-950 shadow-lg shadow-amber-500/20 transition-shadow hover:shadow-amber-500/40"
          >
            İletişime Geç
            <ArrowUpRight size={17} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Magnetic>
          <Magnetic
            href="#projects"
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/15 px-7 py-3.5 font-display text-sm font-semibold text-white transition hover:border-violet-400/60 hover:bg-white/5"
          >
            Projelerimi Gör
          </Magnetic>
        </motion.div>

        {/* stat strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-16 grid max-w-lg grid-cols-3 gap-6"
        >
          {[
            { k: "5+", v: "Aktif proje" },
            { k: "20+", v: "Tamamlanan proje" },
            { k: "2", v: "Ülkede yaşam" },
          ].map((s) => (
            <div key={s.v}>
              <div className="font-display text-3xl font-bold text-white">{s.k}</div>
              <div className="mt-1 text-xs text-slate-500">{s.v}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/*  Tech marquee                                                      */
/* ------------------------------------------------------------------ */
const stack = [
  "Python", "React.js", "Full-stack", "Otomasyon", "Veri Analizi", "Tailwind CSS",
  "E-Fatura Otomasyonu", "Streamlit", "Plotly", "Excel", "Raporlama", "Süreç Optimizasyonu",
];

const Marquee = () => (
  <div className="marquee-mask relative border-y border-white/5 bg-white/[0.015] py-5">
    <div className="flex w-max animate-marquee gap-4">
      {[...stack, ...stack].map((s, i) => (
        <span
          key={i}
          className="flex items-center gap-2 whitespace-nowrap rounded-full border border-white/10 px-4 py-1.5 font-mono text-xs text-slate-400"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-violet-400/70" />
          {s}
        </span>
      ))}
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/*  Section heading                                                  */
/* ------------------------------------------------------------------ */
const Heading = ({ index, title, kicker }) => (
  <Reveal className="mb-12">
    <div className="mb-3 flex items-center gap-3 font-mono text-xs text-violet-400">
      <span>{index}</span>
      <span className="h-px w-8 bg-violet-400/40" />
      <span className="uppercase tracking-widest text-slate-500">{kicker}</span>
    </div>
    <h2 className="font-display text-4xl font-bold text-white sm:text-5xl">{title}</h2>
  </Reveal>
);

/* ------------------------------------------------------------------ */
/*  About                                                             */
/* ------------------------------------------------------------------ */
const skillGroups = [
  {
    icon: Code,
    color: "text-violet-400",
    dot: "bg-violet-400",
    title: "Geliştirme",
    items: ["Python", "React.js", "Tailwind CSS", "Web Tasarım", "Otomasyon"],
  },
  {
    icon: TrendingUp,
    color: "text-spark",
    dot: "bg-spark",
    title: "İş & Analiz",
    items: ["Veri Analizi", "Raporlama", "İş Geliştirme", "Operasyon & Süreç Optimizasyonu"],
  },
];

const About = () => (
  <section id="about" className="relative px-5 py-28">
    <div className="mx-auto max-w-6xl">
      <Heading index="01" kicker="Kimim" title="Hakkımda" />

      <div className="grid gap-10 md:grid-cols-5">
        <div className="md:col-span-3">
          <Reveal>
            <p className="text-lg leading-relaxed text-slate-300">
              Yazılım geliştirme ile yöneticiliği aynı kişide birleştiren çok yönlü bir
              profesyonelim. Türkiye merkezli çalışıyor, hem teknik hem de operasyonel tarafta
              üretken çözümler kuruyorum.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 leading-relaxed text-slate-400">
              Freelance tasarımcı olarak başladığım kariyerimde satış ve operasyonda görev aldıktan
              sonra, Metro Holding bünyesinde gösterdiğim başarılar sonrası yönetim kuruluna girdim.
              Şu anda Yazılım Geliştirme Uzmanı olarak Python tabanlı iç sistemler, React ile
              tasarımlar ve kurumsal web çözümleri geliştiriyorum.
            </p>
          </Reveal>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {skillGroups.map((g, i) => {
              const Icon = g.icon;
              return (
                <Reveal key={g.title} delay={0.15 + i * 0.05}>
                  <SpotlightCard className="h-full rounded-2xl glass p-5">
                    <Icon className={`mb-3 ${g.color}`} size={22} />
                    <h3 className="mb-3 font-display font-bold text-white">{g.title}</h3>
                    <ul className="space-y-1.5 text-sm text-slate-400">
                      {g.items.map((x) => (
                        <li key={x} className="flex gap-2">
                          <span className={`mt-1.5 h-1 w-1 shrink-0 rounded-full ${g.dot}`} />
                          {x}
                        </li>
                      ))}
                    </ul>
                  </SpotlightCard>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* Education */}
        <div className="md:col-span-2">
          <Reveal delay={0.15}>
            <SpotlightCard className="rounded-2xl glass p-7">
              <div className="mb-6 flex items-center gap-2">
                <Sparkles size={18} className="text-spark" />
                <h3 className="font-display text-lg font-bold text-white">Eğitim</h3>
              </div>
              <ul className="space-y-6">
                <li className="relative border-l border-white/10 pl-5">
                  <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-violet-500" />
                  <div className="font-mono text-xs text-violet-400">2022 - 2024</div>
                  <div className="mt-1 font-medium text-white">Bilgisayar Bilimleri Lisans</div>
                  <div className="text-sm text-slate-500">Wroclaw University of Horyzont</div>
                </li>
                <li className="relative border-l border-white/10 pl-5">
                  <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-fuchsia-500" />
                  <div className="font-mono text-xs text-violet-400">2018 - 2022</div>
                  <div className="mt-1 font-medium text-white">Bilgisayar Bilimleri Lisans</div>
                  <div className="text-sm text-slate-500">Wroclaw University of Science & Technology</div>
                </li>
              </ul>
              <div className="mt-6 border-t border-white/10 pt-5">
                <h4 className="mb-2 font-display text-sm font-bold text-white">Diller</h4>
                <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                  <span className="rounded-full border border-white/10 px-3 py-1">Türkçe · Ana Dil</span>
                  <span className="rounded-full border border-white/10 px-3 py-1">İngilizce · Profesyonel</span>
                </div>
              </div>
            </SpotlightCard>
          </Reveal>
        </div>
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/*  Experience                                                        */
/* ------------------------------------------------------------------ */
const experiences = [
  {
    role: "Yazılım Geliştirme Uzmanı",
    company: "Metro Holding",
    date: "Şubat 2026 – Halen",
    location: "Türkiye",
    icon: Cpu,
    current: true,
    description: [
      "Python kullanarak işletmelerimizin operasyonlarını yöneten yönetici (admin) arayüzleri geliştirdim.",
      "React ve frontend kütüphaneleriyle şirketimizin kurumsal web sitelerini geliştirdim.",
      "Şubelerin sipariş süreçlerini, tam entegre çalışan full-stack bir uygulama olarak baştan sona geliştirdim.",
    ],
  },
  {
    role: "Yönetim Kurulu Başkan Yardımcısı",
    company: "Ekspres Kafe (Metro Holding)",
    date: "Kasım 2025 – Ocak 2026",
    location: "Türkiye",
    icon: Coffee,
    description: [
      "Coffee Express ve KöftExpress markalarımızın operasyonel ve stratejik yönetiminde aktif rol aldım.",
      "Türk kahvesi ve menemen markalarımızın patent sürecini yönetip tescilini aldım.",
      "Tedarikçi ilişkilerini yöneterek aynı kaliteyi daha uygun maliyetle sağlayan satın alma stratejileri geliştirdim.",
    ],
  },
  {
    role: "İş Analisti",
    company: "Metro Holding",
    date: "Ağustos 2025 – Ekim 2025",
    location: "Türkiye",
    icon: Database,
    description: [
      "Satış verilerini işleyen otomasyon yazılımları geliştirerek ciro, ürün ve operasyon performansı raporları oluşturdum.",
      "İş süreçlerini analiz edip iyileştirme fırsatlarını belirledim ve yönetime düzenli analitik içgörüler sundum.",
    ],
  },
  {
    role: "Hesap Yöneticisi",
    company: "Jouret Development Solutions",
    date: "Şubat 2024 – Kasım 2024",
    location: "Polonya",
    icon: TrendingUp,
    description: [
      "Müşteri hedeflerine uygun, mobil uyumlu landing page'ler tasarlayıp geliştirerek dönüşüm oranlarını artırdım.",
      "Müşteri araştırması, proje görüşmeleri ve satış süreçlerini uçtan uca yönettim (HubSpot, SalesQL vb.).",
    ],
  },
  {
    role: "Freelance Web Geliştirici",
    company: "Freelancer",
    date: "Mayıs 2023 – Ocak 2024",
    location: "Polonya",
    icon: Code,
    description: [
      "React.js ve Tailwind CSS ile modern, mobil uyumlu web siteleri geliştirdim.",
      "Güncel teknolojileri takip ederek performans ve erişilebilirliğe odaklı, başarılı bir UX/UI deneyimi tasarladım.",
    ],
  },
];

const Experience = () => (
  <section id="experience" className="relative px-5 py-28">
    <div className="mx-auto max-w-4xl">
      <Heading index="02" kicker="Yolculuk" title="İş Deneyimi" />
      <div className="relative">
        <div className="absolute left-[15px] top-2 h-full w-px bg-gradient-to-b from-violet-500/60 via-white/10 to-transparent md:left-1/2" />
        <div className="space-y-8">
          {experiences.map((exp, index) => {
            const Icon = exp.icon;
            return (
              <Reveal key={index} delay={index * 0.05}>
                <div className="relative pl-12 md:pl-0">
                  <span className="absolute left-[7px] top-6 z-10 grid h-4 w-4 place-items-center rounded-full border border-violet-400 bg-ink-950 md:left-1/2 md:-translate-x-1/2">
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                  </span>
                  <div
                    className={`md:w-1/2 ${
                      index % 2 === 0 ? "md:pr-10" : "md:ml-auto md:pl-10"
                    }`}
                  >
                    <SpotlightCard className="rounded-2xl glass p-6 transition duration-300 hover:-translate-y-1">
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 text-violet-300">
                            <Icon size={18} />
                          </div>
                          <div>
                            <h3 className="font-display font-bold leading-tight text-white">{exp.role}</h3>
                            <span className="text-sm text-violet-300">{exp.company}</span>
                          </div>
                        </div>
                        {exp.current && (
                          <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                            Halen
                          </span>
                        )}
                      </div>
                      <div className="mb-4 flex items-center gap-3 font-mono text-xs text-slate-500">
                        <span>{exp.date}</span>
                        <span className="flex items-center gap-1">
                          <MapPin size={11} /> {exp.location}
                        </span>
                      </div>
                      <ul className="space-y-2 text-sm text-slate-400">
                        {exp.description.map((item, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-violet-400/70" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </SpotlightCard>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/*  Projects data                                                     */
/* ------------------------------------------------------------------ */
const featured = [
  {
    title: "Şube Sipariş & Tedarik Otomasyonu",
    domain: "siparis.coffeeexpress.com.tr",
    images: ["/images/siparis1.png", "/images/siparis2.png", "/images/siparis3.png"],
    emoji: "📦",
    accent: "from-violet-500/30 to-fuchsia-500/15",
    kind: "internal",
    tags: ["React", "Python", "Full-stack", "E-Fatura", "Otomasyon"],
    description:
      "Şubelerin siparişlerini tek sistemden verip tedarik, irsaliye ve e-fatura süreçlerini uçtan uca otomatikleştiren full-stack uygulama.",
    fullDescription:
      "Zincir şubelerimizin sipariş süreçlerini baştan sona dijitalleştiren, tam entegre full-stack bir uygulama olarak geliştirdim. Şubeler siparişlerini tek panelden veriyor; sistem tedarik, irsaliye ve e-fatura adımlarını otomatik olarak yürütüyor. Böylece manuel evrak ve takip yükü ortadan kalkıyor, tedarik zinciri gerçek zamanlı ve hatasız işliyor. En son geliştirdiğim ve şu anda aktif kullanılan sistem.",
  },
  {
    title: "Canlı Operasyon & Analitik Panel",
    domain: "ops.coffeeexpress.com.tr",
    images: ["/images/ops2.png", "/images/ops1.png", "/images/ops3.png"],
    emoji: "📊",
    accent: "from-indigo-500/30 to-violet-500/15",
    kind: "internal",
    tags: ["Python", "Veri Analizi", "Dashboard", "Projeksiyon"],
    description:
      "Tüm işletmelerin satış-alış verilerini anlık olarak tek panelde toplayıp modelle projeksiyon üreten analitik arayüz.",
    fullDescription:
      "İşletmelerimizin satış, alış ve ürün bazlı tüm detaylarını anlık olarak tek panelde bir araya getiren analitik bir arayüz geliştirdim. Yönetim, hangi üründen ne kadar satıldığını/alındığını canlı olarak görebiliyor; sistem bu veriler üzerinde model çalıştırarak ileriye dönük projeksiyonlar üretiyor. Karar alma süreçlerini veriye dayalı ve hızlı hale getiren merkezî bir operasyon merkezi.",
  },
  {
    title: "Coffee Express — Kurumsal Web",
    domain: "coffeeexpress.com.tr",
    url: "https://coffeeexpress.com.tr",
    images: ["/images/coffee1.png", "/images/coffee2.png"],
    emoji: "☕",
    accent: "from-amber-500/30 to-orange-500/15",
    kind: "live",
    tags: ["React", "Tailwind CSS", "Kurumsal", "Web Tasarım"],
    description:
      "Coffee Express markası için sıfırdan tasarlayıp geliştirdiğim kurumsal web sitesi.",
    fullDescription:
      "Coffee Express markamız için kurumsal web sitesini sıfırdan tasarlayıp geliştirdim. Marka kimliğini yansıtan modern, hızlı ve mobil uyumlu bir arayüz kurdum; içerik yapısı ve kullanıcı deneyimi marka tanıtımına odaklı olacak şekilde kurgulandı.",
  },
  {
    title: "KöftExpress — Kurumsal Web",
    domain: "koftexpress.com.tr",
    url: "https://koftexpress.com.tr",
    images: ["/images/kofte1.png", "/images/kofte2.png"],
    emoji: "🍢",
    accent: "from-rose-500/30 to-fuchsia-500/15",
    kind: "live",
    tags: ["React", "Tailwind CSS", "Kurumsal", "Web Tasarım"],
    description:
      "KöftExpress markası için tasarlayıp geliştirdiğim kurumsal web sitesi.",
    fullDescription:
      "KöftExpress markamız için kurumsal web sitesini tasarlayıp geliştirdim. Coffee Express ile tutarlı bir tasarım dili kurarak, markanın dijital vitrinini modern ve responsive bir yapıda hayata geçirdim.",
  },
];

const others = [
  {
    title: "World Bank Nüfus Dashboard (1960–2024)",
    tags: ["Python", "Streamlit", "Pandas", "Plotly"],
    thumbnail: "/images/verianalizi1.png",
    description: "World Bank nüfus verisiyle ülke analizi, karşılaştırma ve harita dashboard'u.",
    fullDescription:
      "World Bank'in 1960–2024 toplam nüfus verisini kullanarak interaktif bir dashboard geliştirdim. Uygulama; ülke bazlı trend analizi, yıllık büyüme oranları ve anomali paneli, çoklu ülke karşılaştırma, filtrelenebilir keşfet sayfası (CSV indirme) ve dünya haritası (nüfus / yüzde değişim / mutlak değişim) özelliklerini içerir. Projeyi analiz yeteneklerimi geliştirmek amacıyla geliştirdim.",
    github: "https://github.com/odoublek/total-population-dashboard",
    images: ["/images/verianalizi1.png", "/images/verianalizi2.png", "/images/verianalizi3.png"],
  },
  {
    title: "Satış Raporlama & Otomasyon Sistemi",
    tags: ["Python", "Excel", "Otomasyon", "Raporlama"],
    thumbnail: "/images/toplamcirolar.png",
    description: "Excel verilerini işleyip günlük/haftalık/aylık raporlar üreten Python otomasyonu.",
    fullDescription:
      "Excel'den günlük, saatlik, haftalık veya aylık düzeyde veri çekip işleyen bir Python otomasyon sistemi tasarladım. Sistem; veri temizleme, zaman serisi özetleri, grafik üretimi ve KPI hesaplamalarını otomatikleştirir. Çıktılar PDF/Word raporları ve Excel özet dosyaları olarak otomatik üretilir: ürünün haftalık/aylık satış grafiği, şubelere göre saatlik satış ısı haritası ve toplam sipariş & ciro trend çizgileri.",
    images: ["/images/aylıksatislar.png", "/images/pidetoplamsatislar.png", "/images/saatdilimisatislar.png"],
  },
  {
    title: "Medikal Klinik Websitesi",
    tags: ["Tailwind CSS", "JavaScript", "Sağlık Turizmi"],
    thumbnail: "/images/websitesi1.png",
    description: "Uluslararası hastalar için modern, çok dilli klinik web sitesi.",
    fullDescription:
      "İstanbul merkezli bir medikal turizm kliniği için tasarladığım web sitesi; klinik hizmetleri, doktor profilleri, hasta yorumları ve iletişim bölümlerini içerir. Responsive tasarım ve Tailwind CSS ile modern bir arayüz kurdum; çok dilli yapı ve hızlı erişim odaklı sayfa düzenleriyle uluslararası hastalar için etkili bir tanıtım platformu sağladım.",
    github: "https://github.com/odoublek/turan-atilla-clinic",
    images: ["/images/websitesi2.png", "/images/websitesi3.png", "/images/websitesi4.png"],
  },
  {
    title: "Kömür Tüketimi – Sıcaklık Analizi",
    tags: ["Python", "Pandas", "Matplotlib"],
    thumbnail: "/images/coal_usage_trend.png",
    description: "İngiltere kömür tüketimi ve sıcaklık değişimi arasındaki ilişki analizi.",
    fullDescription:
      "İngiltere'de yıllara göre kömür tüketiminin nasıl değiştiğini ve sıcaklık dalgalanmalarıyla ilişkisini inceledim. Veriler temizlendi, yıllık ortalamalar çıkarıldı ve regresyon modeliyle tahminler üretildi. Grafikler, hem sıcaklığın hem de tüketimin uzun yıllardaki eğilimlerini açık biçimde ortaya koyuyor.",
    github: "https://github.com/odoublek/SystemAnalysisProject",
    images: ["/images/prediction_plot.png", "/images/coal_usage_trend.png", "/images/temperature_trend.png"],
  },
];

/* --- Featured (browser-mockup) card --- */
const FeaturedCard = ({ project, onClick, index }) => (
  <Reveal delay={(index % 2) * 0.08}>
    <SpotlightCard
      onClick={onClick}
      className="group h-full cursor-pointer overflow-hidden rounded-2xl glass transition duration-300 hover:-translate-y-1.5"
    >
      {/* browser chrome preview */}
      <div className={`relative overflow-hidden bg-gradient-to-br ${project.accent}`}>
        <div className="flex items-center gap-2 border-b border-white/10 bg-ink-950/40 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="ml-2 flex-1 truncate rounded-md bg-ink-950/50 px-3 py-1 font-mono text-[11px] text-slate-300">
            {project.domain}
          </span>
        </div>
        <div className="relative h-44 overflow-hidden">
          {project.images ? (
            <img
              src={project.images[0]}
              alt={project.title}
              loading="lazy"
              className="h-full w-full object-cover object-top opacity-90 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
            />
          ) : (
            <div className="grid h-full place-items-center dotgrid">
              <span className="text-5xl drop-shadow-lg transition-transform duration-500 group-hover:scale-110">
                {project.emoji}
              </span>
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-900/70 via-transparent to-transparent" />
          <span
            className={`absolute right-3 top-3 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold backdrop-blur ${
              project.kind === "live"
                ? "bg-emerald-400/20 text-emerald-200"
                : "bg-ink-950/50 text-slate-200"
            }`}
          >
            {project.kind === "live" ? (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Canlı
              </>
            ) : (
              <>
                <Lock size={10} /> İç Sistem
              </>
            )}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-3 flex flex-wrap gap-2">
          {project.tags.slice(0, 4).map((tag, i) => (
            <span key={i} className="rounded-md bg-violet-500/10 px-2 py-1 font-mono text-[11px] text-violet-300">
              {tag}
            </span>
          ))}
        </div>
        <h3 className="font-display text-lg font-bold leading-snug text-white">{project.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">{project.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 text-sm font-medium text-spark">
            Detayları gör <ArrowRight size={14} />
          </span>
          {project.kind === "live" && (
            <span className="inline-flex items-center gap-1 text-xs text-slate-500">
              <Globe size={13} /> Ziyaret et
            </span>
          )}
        </div>
      </div>
    </SpotlightCard>
  </Reveal>
);

/* --- Other (image) card --- */
const ImageCard = ({ project, onClick, index }) => (
  <Reveal delay={(index % 4) * 0.06}>
    <SpotlightCard
      onClick={onClick}
      className="group h-full cursor-pointer overflow-hidden rounded-2xl glass transition duration-300 hover:-translate-y-1.5"
    >
      <div className="relative h-36 overflow-hidden">
        <img
          src={project.thumbnail}
          alt={project.title}
          loading="lazy"
          className="h-full w-full object-cover opacity-75 transition duration-700 group-hover:scale-110 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/20 to-transparent" />
      </div>
      <div className="p-5">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {project.tags.slice(0, 2).map((tag, i) => (
            <span key={i} className="rounded bg-violet-500/10 px-1.5 py-0.5 font-mono text-[10px] text-violet-300">
              {tag}
            </span>
          ))}
        </div>
        <h3 className="font-display text-sm font-bold leading-snug text-white">{project.title}</h3>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{project.description}</p>
      </div>
    </SpotlightCard>
  </Reveal>
);

/* --- Project modal --- */
const ProjectModal = ({ project, onClose }) => {
  const hasImages = project.images && project.images.length > 0;
  const [slide, setSlide] = useState(0);
  const next = () => setSlide((s) => (s + 1) % project.images.length);
  const prev = () => setSlide((s) => (s === 0 ? project.images.length - 1 : s - 1));

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (hasImages && e.key === "ArrowRight") next();
      if (hasImages && e.key === "ArrowLeft") prev();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-ink-950/80 p-4 backdrop-blur-md"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 10 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className="relative my-8 w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-ink-900"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-ink-950/60 text-slate-300 transition hover:text-white"
          aria-label="Kapat"
        >
          <X size={16} />
        </button>

        {hasImages ? (
          <div className="relative aspect-video w-full bg-ink-950">
            <AnimatePresence mode="wait">
              <motion.img
                key={slide}
                src={project.images[slide]}
                alt=""
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="h-full w-full object-contain"
              />
            </AnimatePresence>
            {project.images.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-ink-950/70 text-white transition hover:bg-ink-800"
                  aria-label="Önceki"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={next}
                  className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-ink-950/70 text-white transition hover:bg-ink-800"
                  aria-label="Sonraki"
                >
                  <ChevronRight size={18} />
                </button>
                <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                  {project.images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setSlide(i)}
                      className={`h-1.5 rounded-full transition-all ${
                        i === slide ? "w-6 bg-spark" : "w-1.5 bg-white/30"
                      }`}
                      aria-label={`Görsel ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className={`relative bg-gradient-to-br ${project.accent}`}>
            <div className="flex items-center gap-2 border-b border-white/10 bg-ink-950/40 px-5 py-3">
              <span className="h-3 w-3 rounded-full bg-white/20" />
              <span className="h-3 w-3 rounded-full bg-white/20" />
              <span className="h-3 w-3 rounded-full bg-white/20" />
              <span className="ml-2 flex-1 truncate rounded-md bg-ink-950/50 px-3 py-1.5 font-mono text-xs text-slate-300">
                {project.domain}
              </span>
            </div>
            <div className="grid h-44 place-items-center dotgrid">
              <span className="text-7xl drop-shadow-lg">{project.emoji}</span>
            </div>
          </div>
        )}

        <div className="p-7">
          <div className="mb-4 flex flex-wrap gap-2">
            {project.tags.map((tag, i) => (
              <span key={i} className="rounded-md bg-violet-500/10 px-2 py-1 font-mono text-[11px] text-violet-300">
                {tag}
              </span>
            ))}
          </div>
          <h3 className="font-display text-2xl font-bold text-white">{project.title}</h3>
          {project.domain && (
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-white/5 px-2.5 py-1 font-mono text-[11px] text-slate-400">
              {project.kind === "live" ? <Globe size={12} /> : <Lock size={12} />} {project.domain}
            </div>
          )}
          <p className="mt-4 leading-relaxed text-slate-400">{project.fullDescription}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-violet-400/60 hover:bg-white/5"
              >
                <Github size={16} /> Kaynak Kod
              </a>
            )}
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-spark px-5 py-2.5 text-sm font-bold text-ink-950 transition hover:bg-amber-300"
              >
                Siteyi Ziyaret Et <ExternalLink size={15} />
              </a>
            )}
            {project.kind === "internal" && (
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-sm font-medium text-slate-400">
                <Lock size={15} /> İç sistem · yetkiyle erişilir
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Projects = () => {
  const [active, setActive] = useState(null);
  return (
    <section id="projects" className="relative px-5 py-28">
      <div className="mx-auto max-w-6xl">
        <Heading index="03" kicker="Seçili işler" title="Projelerim" />

        {/* Featured — recent production systems */}
        <Reveal className="mb-5 flex items-center gap-2 text-sm font-medium text-slate-400">
          <Sparkles size={15} className="text-spark" /> Öne çıkan güncel çalışmalar
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2">
          {featured.map((proj, index) => (
            <FeaturedCard key={index} project={proj} index={index} onClick={() => setActive(proj)} />
          ))}
        </div>

        {/* Others */}
        <Reveal className="mb-5 mt-16 flex items-center gap-2 text-sm font-medium text-slate-400">
          <Database size={15} className="text-violet-400" /> Analiz & kişisel projeler
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {others.map((proj, index) => (
            <ImageCard key={index} project={proj} index={index} onClick={() => setActive(proj)} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active && <ProjectModal project={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/*  Contact — coffee-catch reveal game                                */
/* ------------------------------------------------------------------ */
const contacts = [
  { icon: Phone, label: "Telefon", value: "0544 811 55 31", href: "tel:05448115531" },
  { icon: Mail, label: "E-posta", value: "kayaozgurkaan@gmail.com", href: "mailto:kayaozgurkaan@gmail.com" },
  { icon: Linkedin, label: "LinkedIn", value: "Özgür Kaan Kaya", href: "https://www.linkedin.com/in/ozgurkaankaya/" },
  { icon: Github, label: "GitHub", value: "@odoublek", href: "https://github.com/odoublek" },
];

/* --- Coffee data --- */
const TEMPS = [
  { id: "hot", label: "Sıcak Kahve", emoji: "🔥", grad: "from-amber-500/25 to-orange-600/10", ring: "hover:border-amber-400/60" },
  { id: "cold", label: "Soğuk Kahve", emoji: "🧊", grad: "from-sky-500/25 to-cyan-600/10", ring: "hover:border-sky-400/60" },
];

const TEA = {
  id: "tea",
  label: "Çay",
  emoji: "🍵",
  fill: "from-red-950 via-orange-900 to-amber-500",
  note: "Kahve içmiyorsan çayımız her zaman hazır — ince belli bardakta, tavşan kanı. Umarım bunu seversin.",
};

const DRINKS = {
  hot: [
    { id: "espresso", label: "Espresso", emoji: "☕", note: "Sade, sert, oyalanmadan işine bakan. Sabahları ilk bunu içerim; lafı uzatmadan işe koyulmak gibi." },
    { id: "turk", label: "Türk Kahvesi", emoji: "🫖", note: "Yanında bir bardak su, karşında iyi bir sohbet. Acele etmeye gelmez — sağlam iş çıkarmak gibi, bir fincanının kırk yıl hatırı var." },
    { id: "latte", label: "Latte", emoji: "🥛", note: "Sütüyle yumuşamış, dengeli bir kahve. Sert espressoyu sevmeyenlerin limanı; güzel bir orta yol." },
    { id: "cappuccino", label: "Cappuccino", emoji: "☕", note: "Köpüğü tam kıvamında olsun isteyenlerdensin. Detaya bu kadar takılıyorsan iyi anlaşacağız." },
  ],
  cold: [
    { id: "ice-latte", label: "Buzlu Latte", emoji: "🥤", note: "Sıcağı sevip serinlemek isteyenlerin kahvesi. Yumuşak ve ferah — arada kalanların en doğru tercihi." },
    { id: "cold-brew", label: "Cold Brew", emoji: "🧊", note: "Saatlerce soğukta, sabırla demlenir. En çok emek isteyen ama en yumuşak içilen kahve; beklemenin karşılığını fazlasıyla verir." },
    { id: "frappe", label: "Frappe", emoji: "🥤", note: "Açıkçası pek tercih etmem ama değişik tatlara saygım sonsuz. Farklı bir bakış açısı her zaman iyi gelir." },
    { id: "ice-americano", label: "Buzlu Americano", emoji: "🧋", note: "Serin ve sert — benim de en sevdiğim soğuk kahve. Anlaşılan ilk görüşmede ne içeceğimiz şimdiden belli oldu." },
  ],
};

/* --- Tilt card (pseudo-3D on hover) --- */
const TiltCard = ({ children, className = "", onClick }) => {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 200, damping: 15 });
  const sry = useSpring(ry, { stiffness: 200, damping: 15 });
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 16);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 16);
  };
  const reset = () => {
    rx.set(0);
    ry.set(0);
  };
  return (
    <motion.button
      onMouseMove={onMove}
      onMouseLeave={reset}
      onClick={onClick}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }}
      whileTap={{ scale: 0.95 }}
      className={className}
    >
      {children}
    </motion.button>
  );
};

const STEP_LABELS = ["Sıcaklık", "Kahve", "Servis"];

const ContactReveal = () => {
  const [step, setStep] = useState("temp"); // temp | type | brewing | done
  const [temp, setTemp] = useState(null);
  const [drink, setDrink] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const chooseTemp = (t) => {
    setTemp(t);
    setStep("type");
  };
  const chooseDrink = (d) => {
    setDrink(d);
    setStep("brewing");
    timerRef.current = setTimeout(() => setStep("done"), 2200);
  };
  const serveTea = () => {
    clearTimeout(timerRef.current);
    setDrink(TEA);
    setStep("brewing");
    timerRef.current = setTimeout(() => setStep("done"), 2200);
  };
  const restart = () => {
    setTemp(null);
    setDrink(null);
    setStep("temp");
  };

  const stepIdx = step === "temp" ? 0 : step === "type" ? 1 : 2;
  const done = step === "done";
  const isCold = temp?.id === "cold";

  // one-time confetti burst positions
  const confetti = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        x: (Math.random() * 2 - 1) * 280,
        y: -(Math.random() * 180 + 70),
        rot: Math.random() * 360,
        delay: Math.random() * 0.25,
        e: ["☕", "✨", "🎉", "🤎", "🔥", "🧊"][i % 6],
      })),
    []
  );

  return (
    <div className="mt-10">
      {/* Step indicator */}
      <div className="mb-8 flex items-center justify-center gap-2 font-mono text-[11px]">
        {STEP_LABELS.map((l, i) => (
          <React.Fragment key={l}>
            <span className={`flex items-center gap-1.5 ${i <= stepIdx ? "text-spark" : "text-slate-600"}`}>
              <span
                className={`grid h-5 w-5 place-items-center rounded-full border ${
                  i <= stepIdx ? "border-spark/50 bg-spark/10" : "border-white/10"
                }`}
              >
                {i + 1}
              </span>
              {l}
            </span>
            {i < STEP_LABELS.length - 1 && <span className="h-px w-6 bg-white/10" />}
          </React.Fragment>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1 — temperature */}
        {step === "temp" && (
          <motion.div
            key="temp"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
          >
            <p className="mb-6 text-center font-display text-lg font-semibold text-white">
              Bana bir kahve ısmarla — nasıl seversin?
            </p>
            <div className="mx-auto grid max-w-md grid-cols-2 gap-4">
              {TEMPS.map((t) => (
                <TiltCard
                  key={t.id}
                  onClick={() => chooseTemp(t)}
                  className={`group rounded-2xl border border-white/10 bg-gradient-to-br ${t.grad} ${t.ring} p-6 text-center transition`}
                >
                  <div className="mb-2 text-5xl transition-transform duration-300 group-hover:scale-110">{t.emoji}</div>
                  <div className="font-display text-lg font-bold text-white">{t.label}</div>
                </TiltCard>
              ))}
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={serveTea}
                className="font-mono text-xs text-slate-500 underline-offset-4 transition hover:text-slate-300 hover:underline"
              >
                kahve sevmiyorum →
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 2 — drink type */}
        {step === "type" && (
          <motion.div
            key="type"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
          >
            <p className="mb-6 text-center font-display text-lg font-semibold text-white">
              {isCold ? "Soğuk" : "Sıcak"} tarafı seçtin. Hangisi senin kahven?
            </p>
            <div className="mx-auto grid max-w-lg grid-cols-2 gap-3 sm:grid-cols-4">
              {DRINKS[temp.id].map((d, i) => (
                <motion.button
                  key={d.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -4, scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => chooseDrink(d)}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center transition hover:border-spark/50 hover:bg-white/[0.06]"
                >
                  <div className="mb-1.5 text-3xl">{d.emoji}</div>
                  <div className="text-xs font-semibold text-white">{d.label}</div>
                </motion.button>
              ))}
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={() => setStep("temp")}
                className="font-mono text-xs text-slate-500 underline-offset-4 transition hover:text-slate-300 hover:underline"
              >
                ← geri
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3 — brewing + done share the cup */}
        {(step === "brewing" || step === "done") && (
          <motion.div
            key="cup"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="relative flex flex-col items-center"
          >
            {/* confetti on done */}
            {done && (
              <div className="pointer-events-none absolute inset-x-0 top-10 z-20 flex justify-center">
                {confetti.map((c, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, x: 0, y: 0, rotate: 0 }}
                    animate={{ opacity: [0, 1, 1, 0], x: c.x, y: c.y, rotate: c.rot }}
                    transition={{ duration: 1.4, delay: c.delay, ease: "easeOut" }}
                    className="absolute text-xl"
                  >
                    {c.e}
                  </motion.span>
                ))}
              </div>
            )}

            {/* Cup */}
            <div className="mb-5 flex flex-col items-center">
              <div className="relative">
                {/* steam (hot) */}
                {!isCold && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="pointer-events-none absolute -top-9 left-1/2 flex -translate-x-1/2 gap-2"
                  >
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="steam h-9 w-1.5 rounded-full bg-white/50 blur-[2px]"
                        style={{ animationDelay: `${i * 0.45}s` }}
                      />
                    ))}
                  </motion.div>
                )}
                {/* handle */}
                <span className="absolute -right-4 top-3 h-9 w-6 rounded-r-xl border-[3px] border-l-0 border-white/25" />
                {/* body */}
                <div className="relative h-24 w-28 overflow-hidden rounded-b-[2rem] rounded-t-md border-2 border-white/25 bg-white/[0.04]">
                  <motion.div
                    initial={{ height: "0%" }}
                    animate={{ height: "88%" }}
                    transition={{ duration: 1.8, ease: "easeInOut" }}
                    className={`absolute inset-x-0 bottom-0 bg-gradient-to-t ${
                      drink?.fill || (isCold ? "from-amber-900 via-amber-700 to-amber-500" : "from-amber-950 via-amber-800 to-amber-600")
                    }`}
                  >
                    <div className="h-[3px] w-full bg-amber-100/70" />
                  </motion.div>
                  {/* ice cubes for cold */}
                  {isCold &&
                    [0, 1].map((i) => (
                      <motion.span
                        key={i}
                        initial={{ y: -30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 + i * 0.25, type: "spring", stiffness: 300, damping: 14 }}
                        className="absolute text-sm"
                        style={{ left: `${28 + i * 34}%`, bottom: `${22 + i * 16}%` }}
                      >
                        🧊
                      </motion.span>
                    ))}
                </div>
              </div>
              {/* saucer */}
              <div className="mt-1.5 h-2 w-40 rounded-full bg-white/10" />
            </div>

            <AnimatePresence mode="wait">
              {!done ? (
                <motion.p
                  key="brewing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-mono text-sm text-slate-400"
                >
                  Bir <span className="text-spark">{drink?.label}</span> hazırlanıyor…
                </motion.p>
              ) : (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 240, damping: 20 }}
                  className="max-w-md text-center"
                >
                  <div className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full border border-spark/30 bg-spark/10 px-4 py-1.5 font-display text-sm font-semibold text-spark">
                    {drink?.emoji} {drink?.label} hazır!
                  </div>
                  <p className="text-sm leading-relaxed text-slate-300">{drink?.note}</p>
                  <button
                    onClick={restart}
                    className="mt-3 font-mono text-xs text-slate-500 underline-offset-4 transition hover:text-slate-300 hover:underline"
                  >
                    ↺ başka bir kahve dene
                  </button>
                  <p className="mt-5 text-sm text-slate-400">
                    Bunu ilk buluşmamızda ısmarlıyorum. İşte bana ulaşman için her şey 👇
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact cards — blurred until done */}
      <motion.div
        animate={{ filter: done ? "blur(0px)" : "blur(9px)", opacity: done ? 1 : 0.5 }}
        transition={{ duration: 0.6 }}
        className={`mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 ${done ? "" : "pointer-events-none select-none"}`}
        aria-hidden={!done}
      >
        {contacts.map((c) => {
          const Icon = c.icon;
          const ext = c.href.startsWith("http");
          return (
            <a
              key={c.label}
              href={done ? c.href : undefined}
              tabIndex={done ? 0 : -1}
              {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group flex flex-col items-center rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:-translate-y-1 hover:border-violet-400/50 hover:bg-white/5"
            >
              <Icon className="mb-3 text-violet-300 transition group-hover:scale-110 group-hover:text-spark" size={22} />
              <div className="text-sm font-semibold text-white">{c.label}</div>
              <div className="mt-0.5 break-all text-xs text-slate-500">{c.value}</div>
            </a>
          );
        })}
      </motion.div>
    </div>
  );
};

const Contact = () => (
  <section id="contact" className="relative px-5 py-28">
    <div className="mx-auto max-w-4xl">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-8 text-center sm:p-14">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-600/20 blur-[100px]" />
          <div className="relative">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 font-mono text-xs text-slate-300">
              <Sparkles size={13} className="text-spark" /> Birlikte çalışalım
            </div>
            <h2 className="font-display text-4xl font-bold text-white sm:text-5xl">
              Bir sonraki projenize <span className="text-gradient">yaratıcı bir çözüm</span> mü arıyorsunuz?
            </h2>
            <p className="mx-auto mt-5 max-w-xl leading-relaxed text-slate-400">
              Buraya kadar geldiğinize göre size katabileceğim değere dair bir fikriniz oluşmuştur.
              Sizinle çalışmadan önce ben de sizi biraz tanımak isterim — hadi en sevdiğiniz kahveden
              başlayalım. ☕
            </p>

            <ContactReveal />
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/*  Footer                                                            */
/* ------------------------------------------------------------------ */
const Footer = () => (
  <footer className="border-t border-white/10 px-5 py-8">
    <div className="mx-auto max-w-6xl text-center text-sm text-slate-500">
      <span>© {new Date().getFullYear()} Özgür Kaan Kaya</span>
    </div>
  </footer>
);

/* ------------------------------------------------------------------ */
/*  Root                                                              */
/* ------------------------------------------------------------------ */
const Portfolio = () => {
  return (
    <div className="grain relative min-h-screen font-sans">
      <Aurora />
      <CursorGlow />
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Marquee />
        <About />
        <Experience />
        <Projects />
        <Contact />
        <Footer />
      </div>
    </div>
  );
};

export default Portfolio;
