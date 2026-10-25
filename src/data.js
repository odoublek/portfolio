/* ------------------------------------------------------------------ */
/*  Site content — kept apart from the presentation in Portfolio.js   */
/* ------------------------------------------------------------------ */

export const navLinks = [
  { id: "about", label: "Hakkımda" },
  { id: "experience", label: "Deneyim" },
  { id: "projects", label: "Projeler" },
  { id: "contact", label: "İletişim" },
];

export const heroWords = ["otomasyon", "iç sistemler", "veri analizi", "kurumsal web"];

export const stack = [
  "Python", "React", "Full-stack", "Otomasyon", "Veri Analizi", "Tailwind CSS",
  "E-Fatura", "Streamlit", "Plotly", "Raporlama", "Süreç Tasarımı",
];

// words wrapped in *asterisks* are set in italic accent
export const manifesto =
  "Yazılım geliştirme ile yöneticiliği aynı masada *buluşturuyorum.* Kodla süreçleri hızlandırıyor, veriyi *karara* dönüştürüyor ve işletmelerin daha *akıllı* çalışmasını sağlayan sistemler kuruyorum.";

export const aboutText =
  "Freelance tasarımcı olarak başladığım kariyerimde satış ve operasyonda görev aldım; Metro Holding bünyesindeki başarılarımın ardından yönetim kuruluna girdim. Şu anda Yazılım Geliştirme Uzmanı olarak Python tabanlı iç sistemler, React ile arayüzler ve kurumsal web çözümleri geliştiriyorum.";

export const stats = [
  { n: 5, suffix: "+", label: "Aktif proje" },
  { n: 20, suffix: "+", label: "Tamamlanan proje" },
  { n: 2, suffix: "", label: "Ülkede yaşam & iş" },
];

export const skillGroups = [
  { title: "Geliştirme", items: ["Python", "React.js", "Tailwind CSS", "Web Tasarım", "Otomasyon"] },
  { title: "İş & Analiz", items: ["Veri Analizi", "Raporlama", "İş Geliştirme", "Operasyon & Süreç Optimizasyonu"] },
];

export const education = [
  { years: "2022 — 2024", degree: "Bilgisayar Bilimleri Lisans", school: "Wroclaw University of Horyzont" },
  { years: "2018 — 2022", degree: "Bilgisayar Bilimleri Lisans", school: "Wroclaw University of Science & Technology" },
];

export const languages = ["Türkçe · Ana dil", "İngilizce · Profesyonel"];

export const experiences = [
  {
    role: "Yazılım Geliştirme Uzmanı",
    company: "Metro Holding",
    date: "Şub 2026 — Halen",
    location: "Türkiye",
    current: true,
    description: [
      "Python kullanarak işletmelerimizin operasyonlarını yöneten yönetici (admin) arayüzleri geliştirdim.",
      "React ve frontend kütüphaneleriyle şirketimizin kurumsal web sitelerini geliştirdim.",
      "Şubelerin sipariş süreçlerini, tam entegre çalışan full-stack bir uygulama olarak baştan sona geliştirdim.",
    ],
  },
  {
    role: "Yönetim Kurulu Başkan Yardımcısı",
    company: "Ekspres Kafe · Metro Holding",
    date: "Kas 2025 — Oca 2026",
    location: "Türkiye",
    description: [
      "Coffee Express ve KöftExpress markalarımızın operasyonel ve stratejik yönetiminde aktif rol aldım.",
      "Türk kahvesi ve menemen markalarımızın patent sürecini yönetip tescilini aldım.",
      "Tedarikçi ilişkilerini yöneterek aynı kaliteyi daha uygun maliyetle sağlayan satın alma stratejileri geliştirdim.",
    ],
  },
  {
    role: "İş Analisti",
    company: "Metro Holding",
    date: "Ağu 2025 — Eki 2025",
    location: "Türkiye",
    description: [
      "Satış verilerini işleyen otomasyon yazılımları geliştirerek ciro, ürün ve operasyon performansı raporları oluşturdum.",
      "İş süreçlerini analiz edip iyileştirme fırsatlarını belirledim ve yönetime düzenli analitik içgörüler sundum.",
    ],
  },
  {
    role: "Hesap Yöneticisi",
    company: "Jouret Development Solutions",
    date: "Şub 2024 — Kas 2024",
    location: "Polonya",
    description: [
      "Müşteri hedeflerine uygun, mobil uyumlu landing page'ler tasarlayıp geliştirerek dönüşüm oranlarını artırdım.",
      "Müşteri araştırması, proje görüşmeleri ve satış süreçlerini uçtan uca yönettim (HubSpot, SalesQL vb.).",
    ],
  },
  {
    role: "Freelance Web Geliştirici",
    company: "Serbest",
    date: "May 2023 — Oca 2024",
    location: "Polonya",
    description: [
      "React.js ve Tailwind CSS ile modern, mobil uyumlu web siteleri geliştirdim.",
      "Güncel teknolojileri takip ederek performans ve erişilebilirliğe odaklı, başarılı bir UX/UI deneyimi tasarladım.",
    ],
  },
];

export const featured = [
  {
    title: "Şube Sipariş & Tedarik Otomasyonu",
    short: "Sipariş Otomasyonu",
    year: "2026",
    domain: "siparis.coffeeexpress.com.tr",
    images: ["/images/siparis1.webp", "/images/siparis2.webp", "/images/siparis3.webp"],
    kind: "internal",
    tags: ["React", "Python", "Full-stack", "E-Fatura", "Otomasyon"],
    description:
      "Şubelerin siparişlerini tek sistemden verip tedarik, irsaliye ve e-fatura süreçlerini uçtan uca otomatikleştiren full-stack uygulama.",
    fullDescription:
      "Zincir şubelerimizin sipariş süreçlerini baştan sona dijitalleştiren, tam entegre full-stack bir uygulama olarak geliştirdim. Şubeler siparişlerini tek panelden veriyor; sistem tedarik, irsaliye ve e-fatura adımlarını otomatik olarak yürütüyor. Böylece manuel evrak ve takip yükü ortadan kalkıyor, tedarik zinciri gerçek zamanlı ve hatasız işliyor. En son geliştirdiğim ve şu anda aktif kullanılan sistem.",
  },
  {
    title: "Canlı Operasyon & Analitik Panel",
    short: "Operasyon Paneli",
    year: "2026",
    domain: "ops.coffeeexpress.com.tr",
    images: ["/images/ops2.webp", "/images/ops1.webp", "/images/ops3.webp"],
    kind: "internal",
    tags: ["Python", "Veri Analizi", "Dashboard", "Projeksiyon"],
    description:
      "Tüm işletmelerin satış-alış verilerini anlık olarak tek panelde toplayıp modelle projeksiyon üreten analitik arayüz.",
    fullDescription:
      "İşletmelerimizin satış, alış ve ürün bazlı tüm detaylarını anlık olarak tek panelde bir araya getiren analitik bir arayüz geliştirdim. Yönetim, hangi üründen ne kadar satıldığını/alındığını canlı olarak görebiliyor; sistem bu veriler üzerinde model çalıştırarak ileriye dönük projeksiyonlar üretiyor. Karar alma süreçlerini veriye dayalı ve hızlı hale getiren merkezî bir operasyon merkezi.",
  },
  {
    title: "Coffee Express — Kurumsal Web",
    short: "Coffee Express",
    year: "2026",
    domain: "coffeeexpress.com.tr",
    url: "https://coffeeexpress.com.tr",
    images: ["/images/coffee1.webp", "/images/coffee2.webp"],
    kind: "live",
    tags: ["React", "Tailwind CSS", "Kurumsal", "Web Tasarım"],
    description: "Coffee Express markası için sıfırdan tasarlayıp geliştirdiğim kurumsal web sitesi.",
    fullDescription:
      "Coffee Express markamız için kurumsal web sitesini sıfırdan tasarlayıp geliştirdim. Marka kimliğini yansıtan modern, hızlı ve mobil uyumlu bir arayüz kurdum; içerik yapısı ve kullanıcı deneyimi marka tanıtımına odaklı olacak şekilde kurgulandı.",
  },
  {
    title: "KöftExpress — Kurumsal Web",
    short: "KöftExpress",
    year: "2026",
    domain: "koftexpress.com.tr",
    url: "https://koftexpress.com.tr",
    images: ["/images/kofte1.webp", "/images/kofte2.webp"],
    kind: "live",
    tags: ["React", "Tailwind CSS", "Kurumsal", "Web Tasarım"],
    description: "KöftExpress markası için tasarlayıp geliştirdiğim kurumsal web sitesi.",
    fullDescription:
      "KöftExpress markamız için kurumsal web sitesini tasarlayıp geliştirdim. Coffee Express ile tutarlı bir tasarım dili kurarak, markanın dijital vitrinini modern ve responsive bir yapıda hayata geçirdim.",
  },
];

export const archive = [
  {
    title: "World Bank Nüfus Dashboard",
    year: "1960–2024",
    tags: ["Python", "Streamlit", "Pandas", "Plotly"],
    thumbnail: "/images/verianalizi1.webp",
    description: "World Bank nüfus verisiyle ülke analizi, karşılaştırma ve harita dashboard'u.",
    fullDescription:
      "World Bank'in 1960–2024 toplam nüfus verisini kullanarak interaktif bir dashboard geliştirdim. Uygulama; ülke bazlı trend analizi, yıllık büyüme oranları ve anomali paneli, çoklu ülke karşılaştırma, filtrelenebilir keşfet sayfası (CSV indirme) ve dünya haritası (nüfus / yüzde değişim / mutlak değişim) özelliklerini içerir. Projeyi analiz yeteneklerimi geliştirmek amacıyla geliştirdim.",
    github: "https://github.com/odoublek/total-population-dashboard",
    images: ["/images/verianalizi1.webp", "/images/verianalizi2.webp", "/images/verianalizi3.webp"],
  },
  {
    title: "Satış Raporlama & Otomasyon",
    year: "Python",
    tags: ["Python", "Excel", "Otomasyon", "Raporlama"],
    thumbnail: "/images/toplamcirolar.webp",
    description: "Excel verilerini işleyip günlük/haftalık/aylık raporlar üreten Python otomasyonu.",
    fullDescription:
      "Excel'den günlük, saatlik, haftalık veya aylık düzeyde veri çekip işleyen bir Python otomasyon sistemi tasarladım. Sistem; veri temizleme, zaman serisi özetleri, grafik üretimi ve KPI hesaplamalarını otomatikleştirir. Çıktılar PDF/Word raporları ve Excel özet dosyaları olarak otomatik üretilir: ürünün haftalık/aylık satış grafiği, şubelere göre saatlik satış ısı haritası ve toplam sipariş & ciro trend çizgileri.",
    images: ["/images/aylıksatislar.webp", "/images/pidetoplamsatislar.webp", "/images/saatdilimisatislar.webp"],
  },
  {
    title: "Medikal Klinik Websitesi",
    year: "Web",
    tags: ["Tailwind CSS", "JavaScript", "Sağlık Turizmi"],
    thumbnail: "/images/websitesi1.webp",
    description: "Uluslararası hastalar için modern, çok dilli klinik web sitesi.",
    fullDescription:
      "İstanbul merkezli bir medikal turizm kliniği için tasarladığım web sitesi; klinik hizmetleri, doktor profilleri, hasta yorumları ve iletişim bölümlerini içerir. Responsive tasarım ve Tailwind CSS ile modern bir arayüz kurdum; çok dilli yapı ve hızlı erişim odaklı sayfa düzenleriyle uluslararası hastalar için etkili bir tanıtım platformu sağladım.",
    github: "https://github.com/odoublek/turan-atilla-clinic",
    images: ["/images/websitesi2.webp", "/images/websitesi3.webp", "/images/websitesi4.webp"],
  },
  {
    title: "Kömür Tüketimi – Sıcaklık Analizi",
    year: "Analiz",
    tags: ["Python", "Pandas", "Matplotlib"],
    thumbnail: "/images/coal_usage_trend.webp",
    description: "İngiltere kömür tüketimi ve sıcaklık değişimi arasındaki ilişki analizi.",
    fullDescription:
      "İngiltere'de yıllara göre kömür tüketiminin nasıl değiştiğini ve sıcaklık dalgalanmalarıyla ilişkisini inceledim. Veriler temizlendi, yıllık ortalamalar çıkarıldı ve regresyon modeliyle tahminler üretildi. Grafikler, hem sıcaklığın hem de tüketimin uzun yıllardaki eğilimlerini açık biçimde ortaya koyuyor.",
    github: "https://github.com/odoublek/SystemAnalysisProject",
    images: ["/images/prediction_plot.webp", "/images/coal_usage_trend.webp", "/images/temperature_trend.webp"],
  },
];

export const contacts = [
  { label: "Telefon", value: "0544 811 55 31", href: "tel:05448115531" },
  { label: "E-posta", value: "kayaozgurkaan@gmail.com", href: "mailto:kayaozgurkaan@gmail.com" },
  { label: "LinkedIn", value: "/in/ozgurkaankaya", href: "https://www.linkedin.com/in/ozgurkaankaya/" },
  { label: "GitHub", value: "@odoublek", href: "https://github.com/odoublek" },
];

/* --- Coffee order flow --- */
export const TEMPS = [
  { id: "hot", label: "Sıcak", sub: "Demli, buharı tüten", glyph: "◐" },
  { id: "cold", label: "Soğuk", sub: "Buzlu, ferah", glyph: "◑" },
];

export const TEA = {
  id: "tea",
  label: "Çay",
  fill: ["#3b0d06", "#8a2b0c", "#c8601d"],
  note: "Kahve içmiyorsan çayımız her zaman hazır — ince belli bardakta, tavşan kanı. Umarım bunu seversin.",
};

export const DRINKS = {
  hot: [
    { id: "espresso", label: "Espresso", note: "Sade, sert, oyalanmadan işine bakan. Sabahları ilk bunu içerim; lafı uzatmadan işe koyulmak gibi." },
    { id: "turk", label: "Türk Kahvesi", note: "Yanında bir bardak su, karşında iyi bir sohbet. Acele etmeye gelmez — sağlam iş çıkarmak gibi, bir fincanının kırk yıl hatırı var." },
    { id: "latte", label: "Latte", note: "Sütüyle yumuşamış, dengeli bir kahve. Sert espressoyu sevmeyenlerin limanı; güzel bir orta yol." },
    { id: "cappuccino", label: "Cappuccino", note: "Köpüğü tam kıvamında olsun isteyenlerdensin. Detaya bu kadar takılıyorsan iyi anlaşacağız." },
  ],
  cold: [
    { id: "ice-latte", label: "Buzlu Latte", note: "Sıcağı sevip serinlemek isteyenlerin kahvesi. Yumuşak ve ferah — arada kalanların en doğru tercihi." },
    { id: "cold-brew", label: "Cold Brew", note: "Saatlerce soğukta, sabırla demlenir. En çok emek isteyen ama en yumuşak içilen kahve; beklemenin karşılığını fazlasıyla verir." },
    { id: "frappe", label: "Frappe", note: "Açıkçası pek tercih etmem ama değişik tatlara saygım sonsuz. Farklı bir bakış açısı her zaman iyi gelir." },
    { id: "ice-americano", label: "Buzlu Americano", note: "Serin ve sert — benim de en sevdiğim soğuk kahve. Anlaşılan ilk görüşmede ne içeceğimiz şimdiden belli oldu." },
  ],
};
