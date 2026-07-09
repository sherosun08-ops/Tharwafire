import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";
import { useLang } from "../contexts/LanguageContext";

export const Route = createFileRoute("/faq")({ component: Faq });

const faqsAr = [
  { cat: "البداية", q: "كيف أبدأ الاستثمار مع ثروة كابيتال؟", a: "ابدأ بحجز استشارة مجانية عبر صفحة التواصل معنا. سيتواصل معك مستشارنا خلال 24 ساعة لتحديد أهدافك المالية ومستوى تحملك للمخاطر ثم نصمم معك محفظة استثمارية مخصصة." },
  { cat: "البداية", q: "ما الحد الأدنى للاستثمار؟", a: "يختلف الحد الأدنى حسب نوع الخدمة. خدمات إدارة المحافظ تبدأ من 50,000 ريال سعودي أو ما يعادلها، بينما تبدأ خدمات صناديق الاستثمار من 10,000 ريال. للتفاصيل الكاملة، تواصل مع فريقنا." },
  { cat: "البداية", q: "هل أنتم شركة مرخصة؟", a: "نعم، ثروة كابيتال شركة مرخصة ومنظمة من قِبل هيئة الأوراق المالية في دولة الإمارات العربية المتحدة، وتخضع لأعلى معايير الامتثال والشفافية المالية الدولية." },
  { cat: "المحفظة", q: "كيف يتم اختيار الأصول في محفظتي؟", a: "يعتمد اختيار الأصول على خوارزميات الذكاء الاصطناعي المطورة داخلياً، مدعومة بخبرة فريقنا الذي يضم أكثر من 30 محللاً ماليًا معتمداً. يتم التحليل على 15 معياراً تشمل: الأداء التاريخي، الزخم، التقييم، ومستوى المخاطرة." },
  { cat: "المحفظة", q: "كم مرة تُراجع المحفظة؟", a: "نراجع المحفظة بشكل يومي تلقائياً، وتتم المراجعة الاستراتيجية شهرياً مع خبيرنا المعين لحسابك. وفي حالات تقلبات السوق الكبيرة، نتدخل فورياً لحماية أصولك." },
  { cat: "المحفظة", q: "هل يمكنني الوصول لمحفظتي في أي وقت؟", a: "نعم، يمكنك الوصول الكامل لبوابة العملاء على مدار الساعة 24/7 عبر الويب أو تطبيق الموبايل. تتضمن البوابة لوحة تحكم شاملة مع تقارير فورية وتفصيلية." },
  { cat: "الرسوم", q: "ما هيكل الرسوم لديكم؟", a: "نعتمد نموذج رسوم شفافاً: رسوم إدارة سنوية تتراوح بين 0.5% و1.5% حسب حجم المحفظة، إضافة إلى رسوم أداء 10% على الأرباح التي تتجاوز المعدل المرجعي. لا توجد رسوم إدخال أو إخراج خفية." },
  { cat: "الرسوم", q: "هل هناك رسوم إضافية على المعاملات؟", a: "لا. رسوم التداول والمعاملات مدمجة في رسوم الإدارة السنوية ولا تُحتسب بشكل منفصل. ستجد تفصيلاً كاملاً لجميع الرسوم في عقد الخدمة قبل أي التزام." },
  { cat: "المخاطر", q: "هل استثماراتي مؤمنة؟", a: "أصولك محفوظة في حسابات منفصلة لدى مصرف حاضن مرخص، ومؤمنة حتى 500,000 دولار وفقاً لأنظمة الجهة التنظيمية. كما نُطبق استراتيجيات تحوط متقدمة لتقليل المخاطر." },
  { cat: "المخاطر", q: "كيف تتعاملون مع تقلبات السوق؟", a: "نستخدم أنظمة stop-loss تلقائية، وتنويع جغرافي وقطاعي، واستراتيجيات التحوط بالمشتقات المالية. هدفنا دائماً تحقيق أفضل عائد مع الحفاظ على مستوى المخاطر المتفق عليه." },
  { cat: "السحب", q: "متى يمكنني سحب أموالي؟", a: "أموالك متاحة للسحب خلال 3-5 أيام عمل لمعظم الأصول. العملات الرقمية تُحوَّل خلال 24-48 ساعة. قد تختلف أوقات التسوية حسب نوع الأصل والسوق." },
  { cat: "السحب", q: "هل يوجد غرامة على السحب المبكر؟", a: "لا توجد غرامات على معظم الخدمات. لبعض صناديق الاستثمار المتخصصة، قد تنطبق فترة استثمار دنيا مدتها 6 أشهر. سيُوضح مستشارك كل التفاصيل قبل التسجيل." },
];

const faqsEn = [
  { cat: "Getting Started", q: "How do I start investing with Tharwah Capital?", a: "Start by booking a free consultation via our Contact page. Our advisor will reach out within 24 hours to identify your financial goals and risk tolerance, then we design a custom investment portfolio together." },
  { cat: "Getting Started", q: "What is the minimum investment?", a: "The minimum varies by service type. Portfolio management starts at SAR 50,000 or equivalent, while investment fund services start from SAR 10,000. For full details, contact our team." },
  { cat: "Getting Started", q: "Are you a licensed company?", a: "Yes, Tharwah Capital is licensed and regulated by the Securities Authority of the UAE, and adheres to the highest international compliance and financial transparency standards." },
  { cat: "Portfolio", q: "How are assets selected for my portfolio?", a: "Asset selection relies on proprietary AI algorithms supported by our team of 30+ certified financial analysts. Analysis covers 15 criteria including historical performance, momentum, valuation, and risk level." },
  { cat: "Portfolio", q: "How often is the portfolio reviewed?", a: "The portfolio is reviewed daily automatically, with a strategic monthly review by your assigned expert. During significant market volatility, we intervene immediately to protect your assets." },
  { cat: "Portfolio", q: "Can I access my portfolio at any time?", a: "Yes, you have full access to the client portal 24/7 via web or mobile app. The portal includes a comprehensive dashboard with real-time detailed reports." },
  { cat: "Fees", q: "What is your fee structure?", a: "We follow a transparent fee model: annual management fees of 0.5%–1.5% depending on portfolio size, plus 10% performance fees on profits exceeding the benchmark. No hidden entry or exit fees." },
  { cat: "Fees", q: "Are there additional transaction fees?", a: "No. Trading and transaction fees are embedded in the annual management fee and are not charged separately. You'll find a full breakdown in the service contract before any commitment." },
  { cat: "Risk", q: "Are my investments insured?", a: "Your assets are held in segregated accounts at a licensed custodian bank, insured up to $500,000 per regulatory guidelines. We also apply advanced hedging strategies to minimize risk." },
  { cat: "Risk", q: "How do you handle market volatility?", a: "We use automated stop-loss systems, geographic and sector diversification, and derivative hedging strategies. Our goal is always to achieve the best return while maintaining agreed risk levels." },
  { cat: "Withdrawals", q: "When can I withdraw my money?", a: "Your funds are available for withdrawal within 3–5 business days for most assets. Cryptocurrencies transfer within 24–48 hours. Settlement times may vary by asset type and market." },
  { cat: "Withdrawals", q: "Is there a penalty for early withdrawal?", a: "No penalties on most services. For some specialized investment funds, a minimum investment period of 6 months may apply. Your advisor will clarify all details before registration." },
];

function Faq() {
  const { t, lang } = useLang();
  const isAr = lang === 'ar';

  const [apiFaqs, setApiFaqs] = useState<typeof faqsAr | null>(null);
  useEffect(() => {
    fetch('/api/v1/faqs')
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d.items) && d.items.length > 0) {
          setApiFaqs(d.items.map((x: Record<string,string>) => ({
            cat: isAr ? (x.cat || x.category || '') : (x.cat_en || x.category_en || x.cat || x.category || ''),
            q: isAr ? (x.q || x.question || '') : (x.q_en || x.question_en || x.q || x.question || ''),
            a: isAr ? (x.a || x.answer || '') : (x.a_en || x.answer_en || x.a || x.answer || ''),
          })));
        }
      })
      .catch(() => {});
  }, [isAr]);

  const faqs = apiFaqs ?? (isAr ? faqsAr : faqsEn);
  const cats = [t('faq_cat_all'), ...Array.from(new Set(faqs.map((f) => f.cat)))];

  const [open, setOpen] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState(t('faq_cat_all'));

  const filtered = faqs.filter((f) => {
    const matchCat = cat === t('faq_cat_all') || f.cat === cat;
    const matchSearch = !search || f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="bg-background">
      <section className="relative py-28 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(oklch(0.55 0.25 300) 1px,transparent 1px),linear-gradient(90deg,oklch(0.55 0.25 300) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8 text-center">
          <span className="text-xs font-black tracking-[0.3em] text-gold uppercase">{t('faq_label')}</span>
          <h1 className="mt-5 text-5xl md:text-6xl font-black text-foreground leading-tight">
            {t('faq_heading')} <span className="text-gradient-gold">{t('faq_heading_gold')}</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-text-muted leading-relaxed">{t('faq_desc')}</p>
          <div className="relative mt-8 max-w-xl mx-auto">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-text-muted" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCat(t('faq_cat_all')); }}
              placeholder={t('faq_search_placeholder')}
              className="w-full rounded-2xl border border-border bg-white py-4 pr-12 pl-5 text-sm shadow-card focus:border-gold focus:outline-none"
            />
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-5 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${cat === c ? "bg-gradient-gold text-white shadow-gold" : "border border-border bg-navy-mid text-text-muted hover:border-gold hover:text-gold"}`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {filtered.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={i} className={`rounded-2xl border transition-all ${isOpen ? "border-gold shadow-card" : "border-border"} bg-white overflow-hidden`}>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex items-center justify-between w-full px-6 py-5 text-right"
                  >
                    <span className="font-bold text-foreground text-right leading-snug">{f.q}</span>
                    <ChevronDown className={`size-5 text-gold shrink-0 transition-transform ms-4 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 text-sm text-text-muted leading-relaxed border-t border-border pt-4">{f.a}</div>
                  )}
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="text-center py-16 text-text-muted">
                {isAr ? "لا توجد نتائج مطابقة" : "No matching results"}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
