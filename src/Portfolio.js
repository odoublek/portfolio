import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Github,
    Linkedin,
    Mail,
    Phone,
    Code,
    TrendingUp,
    Coffee,
    Database,
} from 'lucide-react';



const SignatureLogo = ({
  text = "Özgür Kaan Kaya",
  duration = 2000,
  fontSize = 46,
  loop = false
}) => {
  const textRef = useRef(null);

  useEffect(() => {
    const txt = textRef.current;
    if (!txt) return;

    const startAnimation = () => {
      const length = Math.ceil(txt.getComputedTextLength());
      txt.style.strokeDasharray = length;
      txt.style.strokeDashoffset = length;
      txt.style.transition = "none";

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          txt.style.transition = `stroke-dashoffset ${duration}ms cubic-bezier(.55,0,.1,1)`;
          txt.style.strokeDashoffset = "0";
        });
      });

      if (loop) {
        setInterval(() => {
          txt.style.transition = "none";
          txt.style.strokeDashoffset = length;
          txt.getBoundingClientRect(); // force reflow
          requestAnimationFrame(() => {
            txt.style.transition = `stroke-dashoffset ${duration}ms cubic-bezier(.55,0,.1,1)`;
            txt.style.strokeDashoffset = "0";
          });
        }, duration + 800);
      }
    };

    // Font yüklendiğinde garanti başlat
    if (document.fonts) {
      document.fonts.ready.then(startAnimation);
    } else {
      setTimeout(startAnimation, 200);
    }
  }, [text, duration, loop]);

  const viewW = 600;
  const viewH = 120;

  return (
    <svg
      className="signature-svg"
      viewBox={`0 0 ${viewW} ${viewH}`}
      width="260"
      height="70"
    >
      <text
        ref={textRef}
        x="50%"
        y="75%"
        textAnchor="middle"
        className="signature-text"
        style={{ fontSize: `${fontSize}px` }}
      >
        {text}
      </text>
    </svg>
  );
};

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full bg-slate-900/90 backdrop-blur-md z-50 border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer">

          <SignatureLogo
            text="Özgür Kaan Kaya"
            duration={1800}
            fontSize={48}
            loop={false}
          />
        </div>

        <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-300">
          <a href="#home" className="hover:text-teal-400 transition">Ana Sayfa</a>
          <a href="#about" className="hover:text-teal-400 transition">Hakkımda</a>
          <a href="#experience" className="hover:text-teal-400 transition">Deneyim</a>
          <a href="#projects" className="hover:text-teal-400 transition">Projeler</a>
          <a href="#contact" className="hover:text-teal-400 transition">İletişim</a>
        </div>
      </div>
    </nav>
  );
};


const Hero = () => {
    return (
        <section
            id="home"
            className="min-h-screen flex items-center justify-center bg-slate-950 px-4 relative overflow-hidden"
        >
            {/* Arka Plan Efektleri */}
            <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 left-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>

            <div className="max-w-4xl text-center z-10">
                {/* Typewriter Animasyon */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6"
                >
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
                        Merhaba, ben Özgür Kaan Kaya.
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="text-xl md:text-2xl font-semibold text-teal-300 mb-8"
                >
                    <span className="inline-block animate-typing overflow-hidden whitespace-nowrap border-r-4 border-teal-400 pr-3">
                        Python ile Otomasyon • Veri Analizi • İş Geliştirme
                    </span>
                </motion.p>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12"
                >
                    Python tabanlı otomasyon sistemleri, veri analizi ve operasyonel raporlama üzerine yoğunlaşmış bir yazılımcıyım.Kariyerim boyunca yöneticilik ve operasyonel sorumluluklar üstlenerek yalnızca teknik becerilerimi değil, stratejik bakış açımı da güçlendirdim. Kodla süreçleri hızlandırmak, veriyi değer üreten bir yapıya dönüştürmek ve işletmelerin daha akıllı, daha verimli çalışmasını sağlamayı seviyorum.
                </motion.p>

                <div className="flex justify-center gap-4">
                    <a
                        href="#contact"
                        className="
      px-8 py-3 
      bg-teal-500 
      hover:bg-teal-400 
      text-slate-950 
      font-bold 
      rounded-full 
      transition 
      duration-300 
      shadow-md
      hover:shadow-teal-500/30 
      hover:scale-105
    "
                    >
                        İletişime Geç
                    </a>

                    <a
                        href="#projects"
                        className="
      px-8 py-3 
      border 
      border-slate-700 
      text-white 
      rounded-full 
      transition 
      duration-300
      hover:border-teal-400
      hover:text-teal-300
      hover:bg-slate-800/30
      hover:shadow-lg 
      hover:shadow-teal-500/20
      hover:scale-105
    "
                    >
                        Projelerim
                    </a>
                </div>

            </div>
        </section>
    );
};

const About = () => {
    return (
        <section id="about" className="py-20 bg-slate-900 text-white px-4">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                        <span className="w-8 h-1 bg-teal-500"></span> Hakkımda
                    </h2>

                    <p className="text-slate-300 leading-relaxed mb-4">
                        Ben, yazılım geliştirme ile yöneticiliği birleştiren çok yönlü bir profesyonelim.
                        Türkiye merkezli çalışıyor ve hem teknik hem de operasyonel alanlarda üretken çözümler üretiyorum.
                    </p>
                    <p className="text-slate-300 leading-relaxed mb-6">
                        Kariyerime web geliştirme ile başladım ve Freelance Web Geliştirici olarak kullanıcı dostu
                        ve responsive web siteleri geliştirdim. Daha sonra Jouret Development Solutions’ta Hesap Yöneticisi
                        olarak dijital kampanyaların landing page tasarımını ve müşteri iletişimini yönettim.
                        Ardından Metro Holding’de İş Analisti olarak veri analizi, otomasyon ve raporlama süreçlerinde
                        üstün performans sergiledim; bu başarı, Ekspres Kafe’de Yönetim Kurulu Başkan Yardımcısı
                        pozisyonuna geçişimi sağladı. Yönetici olarak operasyon, strateji ve tedarik zinciri süreçlerini
                        yönettim, marka tescil ve patent başvurularını yürüttüm ve verimlilik odaklı satın alma stratejileri geliştirdim.
                    </p>


                    <div className="grid grid-cols-2 gap-4 mt-8">
                        {/* Development */}
                        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                            <Code className="text-teal-400 mb-2" />
                            <h3 className="font-bold mb-2">Geliştirme</h3>
                            <ul className="text-sm text-slate-400 space-y-1 list-disc list-inside">
                                <li>Python (Otomasyon & Veri Analizi)</li>
                                <li>React.js</li>
                                <li>Tailwind CSS</li>
                                <li>Excel</li>
                                <li>HTML / CSS</li>
                            </ul>
                        </div>

                        {/* Business */}
                        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                            <TrendingUp className="text-teal-400 mb-2" />
                            <h3 className="font-bold mb-2">İş & Analiz</h3>
                            <ul className="text-sm text-slate-400 space-y-1 list-disc list-inside">
                                <li>Veri Analizi & Raporlama</li>
                                <li>İş Süreçleri Optimizasyonu</li>
                                <li>HubSpot CRM</li>
                                <li>Operasyon Yönetimi</li>
                                <li>Stratejik Planlama</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Education Card */}
                <div className="relative">
                    <div className="absolute inset-0 bg-teal-500 rounded-lg transform translate-x-4 translate-y-4"></div>
                    <div className="relative bg-slate-800 p-8 rounded-lg border border-slate-700">
                        <h3 className="text-xl font-bold mb-4">Eğitim</h3>
                        <ul className="space-y-6">
                            <li>
                                <div className="text-teal-400 font-bold">2022 - 2024</div>
                                <div className="font-medium">Bilgisayar Bilimleri Lisans</div>
                                <div className="text-slate-400 text-sm">Wroclaw University of Horyzont</div>
                            </li>
                            <li>
                                <div className="text-teal-400 font-bold">2018 - 2022</div>
                                <div className="font-medium">Bilgisayar Bilimleri Lisans</div>
                                <div className="text-slate-400 text-sm">Wroclaw University of Science & Technology</div>
                            </li>
                        </ul>

                        <div className="mt-6 pt-6 border-t border-slate-700">
                            <h4 className="font-bold mb-2">Diller</h4>
                            <div className="flex gap-4 text-sm text-slate-400">
                                <span>Türkçe (Ana Dil)</span>
                                <span>•</span>
                                <span>İngilizce (Profesyonel)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};


const ExperienceCard = ({ role, company, date, location, description, icon: Icon }) => (
    <div className="relative pl-8 md:pl-0">
        {/* Mobile Timeline Line */}
        <div className="absolute left-0 top-0 h-full w-0.5 bg-slate-800 md:hidden"></div>
        <div className="absolute left-[-5px] top-0 w-3 h-3 bg-teal-500 rounded-full md:hidden"></div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-teal-500/50 transition duration-300 group">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-800 rounded-lg text-teal-400 group-hover:text-white group-hover:bg-teal-500 transition">
                        <Icon size={20} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">{role}</h3>
                        <span className="text-teal-400 font-medium">{company}</span>
                    </div>
                </div>
                <div className="text-right mt-2 md:mt-0">
                    <div className="text-slate-400 text-sm">{date}</div>
                    <div className="text-slate-500 text-xs">{location}</div>
                </div>
            </div>
            <ul className="list-disc list-inside text-slate-400 space-y-2 text-sm">
                {description.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </div>
    </div>
);

const Experience = () => {
    const experiences = [
        {
            role: "Yönetim Kurulu Başkan Yardımcısı",
            company: "Ekspres Kafe",
            date: "Kasım 2025 - Ocak 2026",
            location: "Türkiye",
            icon: Coffee,
            description: [
                "Şirketin işlettiği dinlenme tesisleri ve Coffee Express markasının tüm operasyonel süreçlerini yönettim.",
                "Kendi markamız için Türk kahvesi ve menemen patent ve marka tescil süreçlerini yürüttüm.",
                "Tedarikçilerle sürekli iletişim kurarak maliyetleri optimize eden satın alma stratejileri geliştirdim."
            ]
        },
        {
            role: "İş Analisti",
            company: "Metro Holding",
            date: "Ağustos 2025 - Ekim 2025",
            location: "Türkiye",
            icon: Database,
            description: [
                "Excel ve diğer veri kaynaklarından alınan satış verilerini işleyen otomasyon yazılımları geliştirdim.",
                "Ciro, ürün performansı ve operasyonel metrikler için kapsamlı raporlar hazırladım.",
                "Raporlama ihtiyaçlarını birimlerle koordineli şekilde toplayarak yönetime sundum ve üstün performans sonucu yönetici pozisyonuna geçiş yaptım."
            ]
        },
        {
            role: "Hesap Yöneticisi",
            company: "Jouret Development Solutions",
            date: "Şubat 2024 - Kasım 2024",
            location: "Polonya",
            icon: TrendingUp,
            description: [
                "Dijital kampanyalar için responsive landing page tasarladım ve geliştirdim.",
                "HubSpot ve SalesQL gibi araçlarla hedefli araştırmalar yaparak potansiyel müşterilere ulaştım.",
                "Müşteri görüşmeleri ve proje yönetimi ile başarılı satış kapanışları gerçekleştirdim."
            ]
        },
        {
            role: "Freelance Web Geliştirici",
            company: "Serbest Çalışan",
            date: "Mayıs 2023 - Ocak 2024",
            location: "Polonya",
            icon: Code,
            description: [
                "React.js ve Tailwind CSS kullanarak kullanıcı dostu responsive web siteleri geliştirdim.",
                "Performans, erişilebilirlik ve cihaz uyumluluğuna odaklandım.",
                "Müşteri ihtiyaçlarına uygun kullanıcı arayüzleri ve deneyimler tasarladım."
            ]
        }
    ];

    return (
        <section id="experience" className="py-20 bg-slate-950 px-4">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-12 text-white text-center">İş Deneyimi</h2>
                <div className="space-y-6">
                    {experiences.map((exp, index) => (
                        <ExperienceCard key={index} {...exp} />
                    ))}
                </div>
            </div>
        </section>
    );
};


const ProjectCard = ({ title, tags, description, thumbnail, onClick, github }) => (
    <div
        onClick={onClick}
        className="bg-slate-900 cursor-pointer rounded-xl overflow-hidden border border-slate-800 hover:shadow-xl hover:shadow-teal-900/20 transition group"
    >
        {/* Thumbnail */}
        <div className="h-48 bg-slate-800 relative overflow-hidden group">
            {thumbnail ? (
                <img
                    src={thumbnail}
                    alt={title}
                    className="w-full h-full object-cover opacity-70 group-hover:scale-110 transition duration-500"
                />
            ) : (
                <div className="flex items-center justify-center w-full h-full text-8xl font-bold text-slate-700 opacity-20">
                    {title.charAt(0)}
                </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="p-6 relative z-20 -mt-10">
            <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag, i) => (
                    <span
                        key={i}
                        className="text-xs font-bold px-2 py-1 bg-teal-500/10 text-teal-400 rounded"
                    >
                        {tag}
                    </span>
                ))}
            </div>

            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-slate-400 text-sm mb-4">{description}</p>

            <div className="flex items-center justify-between">
                <button className="text-white text-sm font-medium flex items-center gap-1 group-hover:text-teal-400 transition">
                    Detayları Gör
                </button>

                {/* GitHub Icon */}
                {github && (
                    <a
                        href={github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-300 hover:text-white transition"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M12 .5C5.73.5.5 5.74.5 12.02c0 5.1 3.29 9.43 7.86 10.96.58.11.79-.25.79-.56v-2.1c-3.2.7-3.88-1.55-3.88-1.55-.53-1.35-1.3-1.71-1.3-1.71-1.06-.73.08-.72.08-.72 1.17.08 1.79 1.2 1.79 1.2 1.04 1.79 2.72 1.27 3.39.97.1-.76.41-1.27.74-1.57-2.55-.29-5.23-1.28-5.23-5.71 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.44-2.69 5.41-5.25 5.69.42.36.8 1.08.8 2.18v3.23c0 .31.21.68.8.56A10.53 10.53 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
                        </svg>
                    </a>
                )}
            </div>
        </div>
    </div>
);

const Projects = () => {
    const [activeProject, setActiveProject] = useState(null);
    const [slideIndex, setSlideIndex] = useState(0);

const projects = [
    {
        title: "Kömür Tüketimi – Sıcaklık Korelasyon Analizi",
        tags: ["Python", "Pandas", "Matplotlib", "Veri Analizi"],
        thumbnail: "/images/coal_usage_trend.png",
        description: "İngiltere kömür tüketimi ve sıcaklık değişimleri arasındaki ilişki analizi.",
        fullDescription:
            "Bu projede, İngiltere’de yıllara göre kömür tüketiminin nasıl değiştiğini ve sıcaklık dalgalanmalarıyla ilişkisinin olup olmadığını inceledim. Veriler temizlendi, yıllık ortalamalar çıkarıldı ve regresyon modeliyle tahminler üretildi. Ortaya çıkan grafikler, hem sıcaklığın hem de tüketimin uzun yıllardaki eğilimlerini açık biçimde ortaya koyuyor.",
        github: "https://github.com/odoublek/SystemAnalysisProject",
        images: [
            "/images/prediction_plot.png",
            "/images/coal_usage_trend.png",
            "/images/temperature_trend.png"
        ]
    },

{
  title: "Satış Raporlama & Otomasyon Sistemi",
  tags: ["Python", "Excel", "Otomasyon", "Raporlama", "Veri Analizi"],
  thumbnail: "/images/toplamcirolar.png",
  description: "Excel verilerini otomatik işleyip günlük/haftalık/aylık raporlar üreten Python otomasyon sistemi.",
  fullDescription:
    "Excel’den günlük, saatlik, haftalık veya aylık düzeyde veri çekip işleyen bir Python otomasyon sistemi tasarladım. Sistem; veri temizleme, zaman serisi özetleri, grafik üretimi ve KPI hesaplamalarını otomatikleştirir. Üretilen çıktıların PDF/Word raporları ve Excel özet dosyaları şeklinde otomatik oluşturulması sağlanır. Örnek çıktılar: bir ürünün haftalık/aylık satış grafiği, şubelere göre saatlik satışların ısı haritası ve toplam sipariş & ciro trend çizgileri — tümü yönetime sunulacak hazır raporlar olarak üretilir.", // gerektiği gibi güncelle
  images: [
    "/images/aylıksatislar.png",    // ürün haftalık/aylık satış grafiği
    "/images/pidetoplamsatislar.png",   // şube saatlik satış + ısı haritası
    "/images/saatdilimisatislar.png"     // toplam sipariş sayısı & ciro trendi
  ]
}
,
{
  title: "World Bank Nüfus Dashboard (1960–2024)",
  tags: ["Python", "Streamlit", "Pandas", "Matplotlib", "Plotly", "Veri Analizi"],
  thumbnail: "/images/verianalizi1.png",
  description: "World Bank toplam nüfus verisiyle ülke analizi, karşılaştırma, keşfet ve harita dashboard’u.",
  fullDescription:
    "World Bank’in 1960–2024 toplam nüfus verisini kullanarak interaktif bir dashboard geliştirdim. Uygulama; ülke bazlı trend analizi, yıllık büyüme oranları ve anomali paneli, çoklu ülke karşılaştırma, filtrelenebilir keşfet sayfası (CSV indirme) ve dünya haritası (nüfus / yüzde değişim / mutlak değişim) özelliklerini içerir. Projeyi eğlence ve analiz yeteneklerimi geliştirmek amacıyla geliştirdim.",
  github: "https://github.com/odoublek/total-population-dashboard",
  live: "", // Streamlit Cloud deploy edince buraya URL ekleyeceğiz
  images: [
    "/images/verianalizi1.png",
    "/images/verianalizi2.png",
    "/images/verianalizi3.png"
  ]
},


{
    title: "Medikal Klinik Websitesi",
    tags: ["HTML", "CSS", "JavaScript", "Tailwind CSS", "Sağlık Turizmi"],
    thumbnail: "/images/websitesi1.png",
    description: "Uluslararası hastalar için tasarlanmış modern ve kullanıcı dostu klinik web sitesi.",
    fullDescription:
        "Bu web sitesi, İstanbul merkezli bir medikal turizm kliniği için tasarlanmıştır. Site içerisinde klinik hizmetleri, doktor profilleri, hasta yorumları ve iletişim bölümleri yer almaktadır. Responsive tasarım prensipleri uygulanmış, Tailwind CSS ile modern bir arayüz oluşturulmuş ve kullanıcı deneyimi ön planda tutulmuştur. Çok dilli yapı ve hızlı erişim odaklı sayfa düzenleri sayesinde uluslararası hastalar için etkili bir tanıtım platformu sunar.",
    github: "https://github.com/odoublek/turan-atilla-clinic",
    images: [
        "/images/websitesi2.png",
        "/images/websitesi3.png",
        "/images/websitesi4.png"
    ]
}

];


    const nextSlide = () => {
        setSlideIndex((prev) => (prev + 1) % activeProject.images.length);
    };

    const prevSlide = () => {
        setSlideIndex((prev) =>
            prev === 0 ? activeProject.images.length - 1 : prev - 1
        );
    };

    return (
        <section id="projects" className="py-20 bg-slate-900 px-4">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold mb-12 text-white flex items-center gap-2">
                    <span className="w-8 h-1 bg-teal-500"></span> Projelerim
                </h2>

                <div className="grid md:grid-cols-3 gap-8">
                    {projects.map((proj, index) => (
                        <ProjectCard
                            key={index}
                            {...proj}
                            onClick={() => {
                                setActiveProject(proj);
                                setSlideIndex(0);
                            }}
                        />
                    ))}
                </div>

                {/* Project Detail Popup */}
                {activeProject && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 40 }}
                        className="mt-10 bg-slate-800 border border-slate-700 p-6 rounded-xl"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-white">
                                {activeProject.title}
                            </h3>
                            <button
                                onClick={() => setActiveProject(null)}
                                className="text-slate-400 hover:text-red-400"
                            >
                                Kapat ✕
                            </button>
                        </div>

                        <p className="text-slate-300 mb-4">
                            {activeProject.fullDescription}
                        </p>

                        {/* Slider */}
                        <div className="relative w-full h-64 bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center">
                            <motion.img
                                key={slideIndex}
                                src={activeProject.images[slideIndex]}
                                className="max-h-56 object-contain"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.6 }}
                            />

                            <button
                                onClick={prevSlide}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-slate-700/60 px-3 py-1 rounded text-white"
                            >
                                ‹
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-700/60 px-3 py-1 rounded text-white"
                            >
                                ›
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    );
};




const Contact = () => {
    return (
        <section id="contact" className="py-20 bg-slate-950 px-4 border-t border-slate-800">
            <div className="max-w-4xl mx-auto text-center">
                
                <h2 className="text-3xl font-bold text-white mb-6">Birlikte Çalışalım</h2>

                <p className="text-slate-400 mb-10 max-w-xl mx-auto">
                    İş süreçlerinizi otomasyonla hızlandırmak, verilerinizi anlamlandırmak veya operasyonel yapınızı güçlendirmek istiyorsanız, sizinle çalışmaktan memnuniyet duyarım.
Hedeflerinize uygun çözümleri birlikte tasarlayabiliriz.
                </p>

                <div className="grid md:grid-cols-4 gap-6 mb-12">
                    {/* Telefon */}
                    <a 
                        href="tel:05448115531" 
                        className="p-6 bg-slate-900 rounded-xl border border-slate-800 hover:border-teal-400 group transition"
                    >
                        <Phone className="mx-auto text-teal-400 mb-3 group-hover:scale-110 transition" />
                        <div className="text-white font-medium">Telefon</div>
                        <div className="text-slate-400 text-sm">0544 811 55 31</div>
                    </a>

                    {/* Email */}
                    <a 
                        href="mailto:kayaozgurkaan@gmail.com" 
                        className="p-6 bg-slate-900 rounded-xl border border-slate-800 hover:border-teal-400 group transition"
                    >
                        <Mail className="mx-auto text-teal-400 mb-3 group-hover:scale-110 transition" />
                        <div className="text-white font-medium">E-posta</div>
                        <div className="text-slate-400 text-sm">kayaozgurkaan@gmail.com</div>
                    </a>

                    {/* LinkedIn */}
                    <a 
                        href="https://www.linkedin.com/in/ozgurkaankaya/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-6 bg-slate-900 rounded-xl border border-slate-800 hover:border-teal-400 group transition"
                    >
                        <Linkedin className="mx-auto text-teal-400 mb-3 group-hover:scale-110 transition" />
                        <div className="text-white font-medium">LinkedIn</div>
                        <div className="text-slate-400 text-sm">Özgür Kaan Kaya</div>
                    </a>

                    {/* GitHub */}
                    <a 
                        href="https://github.com/odoublek"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-6 bg-slate-900 rounded-xl border border-slate-800 hover:border-teal-400 group transition"
                    >
                        <Github className="mx-auto text-teal-400 mb-3 group-hover:scale-110 transition" />
                        <div className="text-white font-medium">GitHub</div>
                        <div className="text-slate-400 text-sm">@odoublek</div>
                    </a>
                </div>

                <div className="text-slate-600 text-sm">
                    &copy; {new Date().getFullYear()} Özgür Kaan Kaya — React & Tailwind ile geliştirildi.
                </div>
            </div>
        </section>
    );
};

// --- Main App Component ---

const Portfolio = () => {
    return (
        <div className="bg-slate-950 min-h-screen font-sans selection:bg-teal-500 selection:text-white">
            <Navbar />
            <Hero />
            <About />
            <Experience />
            <Projects />
            <Contact />
        </div>
    );
};

export default Portfolio;