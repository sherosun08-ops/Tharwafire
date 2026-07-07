import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle, ArrowLeft, TrendingUp, Loader2 } from "lucide-react";
import { useSiteSettings } from "../contexts/SiteSettingsContext";

export const Route = createFileRoute("/service/$id")({ component: ServiceDetail });

// Default services as fallback
const defaultServices: Record<string, {
  emoji: string; title: string; subtitle: string; desc: string;
  features: string[]; returns: string; risk: string; minInv: string;
  faq: { q: string; a: string }[];
}> = {
  "gulf-stocks": {
    emoji: "📈", title: "الأسهم الخليجية والعربية", subtitle: "استثمر في القلب الاقتصادي للمنطقة",
    desc: "إدارة استثماراتك في أسواق تداول السعودية وأبوظبي ودبي والكويت ومصر والبحرين. نوظف خبراءنا المحليين وتحليلاتنا الخوارزمية لاختيار أفضل الأسهم بكل توقيت.",
    features: ["تحليل يومي للأسهم", "محافظ مخصصة", "تقارير شهرية مفصّلة", "دعم مباشر 24/7", "أسهم نمو + أسهم قيمة", "REIT عقارية خليجية"],
    returns: "+18.5% متوسط سنوي", risk: "متوسط", minInv: "50,000 ريال سعودي",
    faq: [
      { q: "هل تشمل الخدمة أسواق الكويت والبحرين؟", a: "نعم، نغطي 7 أسواق خليجية وعربية رئيسية بالكامل." },
      { q: "هل يمكنني اختيار الأسهم بنفسي؟", a: "نعم، يمكنك الاختيار أو التفويض الكامل لفريقنا حسب تفضيلك." },
    ],
  },
  "global-stocks": {
    emoji: "🌍", title: "الأسهم العالمية", subtitle: "استثمر في عمالقة الاقتصاد العالمي",
    desc: "وصول مباشر إلى أسواق وول ستريت وناسداك ولندن وطوكيو وهونغ كونغ. نستخدم تحليلات الذكاء الاصطناعي لتحديد أفضل الفرص في قطاعات التقنية والطاقة والصحة والمال.",
    features: ["15+ سوق عالمي", "تحليل AI معتمد", "تحوط العملات", "تقارير ربعية", "أسهم S&P 500", "ETF القطاعية"],
    returns: "+22.3% متوسط سنوي", risk: "متوسط–مرتفع", minInv: "100,000 ريال سعودي",
    faq: [
      { q: "هل يتم تحوط مخاطر العملات؟", a: "نعم، نوفر خيارات تحوط مرنة للدولار واليورو والجنيه." },
      { q: "ما هي أبرز القطاعات التي تستثمر فيها؟", a: "التقنية، الذكاء الاصطناعي، الطاقة المتجددة، والرعاية الصحية." },
    ],
  },
  "crypto": {
    emoji: "₿", title: "العملات الرقمية", subtitle: "الأصول الرقمية بأمان مؤسسي",
    desc: "محافظ منوّعة من Bitcoin وEthereum والأصول الرقمية الواعدة. نوفر حفظاً آمناً، وإدارة مخاطر متقدمة، وتقارير ضريبية مبسّطة.",
    features: ["Bitcoin & Ethereum", "حفظ Cold Storage", "تنويع ذكي", "إدارة مخاطر", "تقارير ضريبية", "DeFi متاح"],
    returns: "+45.8% متوسط سنوي (متقلب)", risk: "مرتفع", minInv: "25,000 ريال سعودي",
    faq: [
      { q: "هل أصولي الرقمية مؤمنة؟", a: "نعم، مؤمنة بتأمين مؤسسي حتى $500,000 مع حفظ Cold Storage." },
      { q: "كم يستغرق تحويل أرباحي؟", a: "عادةً 24–48 ساعة للعملات الرقمية الرئيسية." },
    ],
  },
  "funds": {
    emoji: "🏛", title: "صناديق الاستثمار", subtitle: "تنويع ذكي بإدارة احترافية",
    desc: "صناديق متخصصة بمستويات مخاطر متعددة — من الصناديق المحافِظة ذات الدخل الثابت إلى صناديق النمو العدوانية. صناديقنا تُدار من قِبل كبار المحللين المعتمدين.",
    features: ["صناديق دخل ثابت", "صناديق نمو", "صناديق متوازنة", "ETF عالمية", "صناديق إسلامية", "صناديق عقارية"],
    returns: "+14.2% متوسط سنوي", risk: "منخفض–متوسط", minInv: "10,000 ريال سعودي",
    faq: [
      { q: "هل توجد صناديق متوافقة مع الشريعة؟", a: "نعم، لدينا صناديق إسلامية بالكامل معتمدة من هيئة الرقابة الشرعية." },
      { q: "ما حد الاستحقاق الأدنى؟", a: "معظم الصناديق متاحة للاسترداد أسبوعياً. بعض الصناديق المتخصصة تتطلب 6 أشهر." },
    ],
  },
  "metals": {
    emoji: "💎", title: "المعادن والذهب", subtitle: "الملاذ الآمن ضد التضخم",
    desc: "استثمارات في الذهب والفضة والبلاتين عبر عقود آجلة وETF وذهب فيزيائي. نوظّف المعادن كأداة تحوط استراتيجية داخل محفظتك الإجمالية.",
    features: ["ذهب فيزيائي", "ETF معادن", "عقود آجلة", "تحوط تضخم", "البلاتين والفضة", "إعداد تقارير ضريبية"],
    returns: "+11.7% متوسط سنوي", risk: "منخفض–متوسط", minInv: "20,000 ريال سعودي",
    faq: [
      { q: "هل يمكنني الحصول على ذهب فيزيائي؟", a: "نعم، نوفر خيار الذهب المادي مع خدمة التخزين الآمن أو الشحن." },
      { q: "هل المعادن جزء من محفظة أشمل؟", a: "يمكن دمجها في محفظتك الشاملة أو استثمار مستقل حسب رغبتك." },
    ],
  },
  "energy": {
    emoji: "⛽", title: "النفط والطاقة", subtitle: "استثمر في شريان الاقتصاد العالمي",
    desc: "استثمارات في عقود النفط الخام WTI وبرنت، وأسهم شركات الطاقة المتجددة، والغاز الطبيعي. نوفر أدوات تحوط متقدمة لإدارة مخاطر أسعار الطاقة.",
    features: ["نفط WTI & برنت", "غاز طبيعي", "طاقة متجددة", "أسهم طاقة", "عقود آجلة", "تحوط نفطي"],
    returns: "+16.9% متوسط سنوي", risk: "متوسط–مرتفع", minInv: "50,000 ريال سعودي",
    faq: [
      { q: "هل يمكن الاستثمار في الطاقة الشمسية؟", a: "نعم، لدينا محافظ متخصصة في شركات الطاقة الشمسية والمتجددة عالمياً." },
      { q: "كيف تتعاملون مع تقلبات أسعار النفط؟", a: "نستخدم استراتيجيات التحوط بالخيارات والعقود الآجلة لتحمي المحفظة." },
    ],
  },
};

function ServiceDetail() {
  const { id } = Route.useParams();
  const { settings, loading } = useSiteSettings();

  // Get services from CMS or use defaults
  const services = (settings?.services_data as Record<string, typeof defaultServices[string]>) || defaultServices;
  const service = services[id];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-gold" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-5 gap-6">
        <div className="text-7xl">🔍</div>
        <h1 className="text-3xl font-black text-foreground">الخدمة غير موجودة</h1>
        <Link to="/services" className="rounded-xl bg-gradient-gold px-6 py-3 font-bold text-white shadow-gold hover:-translate-y-0.5 transition-transform">
          عرض كل الخدمات
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <section className="relative py-28 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(oklch(0.55 0.25 300) 1px,transparent 1px),linear-gradient(90deg,oklch(0.55 0.25 300) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <Link to="/services" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-gold transition-colors mb-6">
            <ArrowLeft className="size-4 rotate-180" /> العودة إلى الخدمات
          </Link>
          <div className="flex items-center gap-5 mb-6">
            <span className="text-6xl">{service.emoji}</span>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-foreground">{service.title}</h1>
              <p className="mt-1 text-lg text-text-muted">{service.subtitle}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-5">
            {[
              { l: "متوسط العائد", v: service.returns },
              { l: "مستوى المخاطر", v: service.risk },
              { l: "الحد الأدنى", v: service.minInv },
            ].map((s) => (
              <div key={s.l} className="rounded-xl border border-gold/30 bg-white/80 backdrop-blur px-5 py-3">
                <div className="text-[10px] font-black text-gold uppercase">{s.l}</div>
                <div className="font-bold text-foreground text-sm mt-0.5">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 grid lg:grid-cols-[1.5fr_0.5fr] gap-12">
          <div>
            <h2 className="text-2xl font-black text-foreground mb-4">نظرة عامة على الخدمة</h2>
            <p className="text-text-muted leading-relaxed text-lg mb-10">{service.desc}</p>

            <h3 className="text-xl font-black text-foreground mb-6">ما يشمله البرنامج</h3>
            <div className="grid sm:grid-cols-2 gap-3 mb-12">
              {service.features.map((f) => (
                <div key={f} className="flex items-center gap-3 rounded-xl border border-border bg-navy-mid px-4 py-3">
                  <CheckCircle className="size-4 text-gold shrink-0" />
                  <span className="text-sm font-semibold text-foreground">{f}</span>
                </div>
              ))}
            </div>

            <h3 className="text-xl font-black text-foreground mb-5">الأسئلة الشائعة</h3>
            <div className="flex flex-col gap-3">
              {service.faq.map((f) => (
                <div key={f.q} className="rounded-2xl border border-border bg-navy-mid p-5">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="size-4 text-gold mt-0.5 shrink-0" />
                    <div>
                      <div className="font-bold text-foreground text-sm">{f.q}</div>
                      <p className="mt-2 text-sm text-text-muted leading-relaxed">{f.a}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA sidebar */}
          <div>
            <div className="sticky top-28 rounded-2xl border border-gold/30 bg-white shadow-gold p-6">
              <h3 className="font-black text-foreground text-lg mb-2">ابدأ الاستثمار الآن</h3>
              <p className="text-sm text-text-muted leading-relaxed mb-5">استشارة مجانية مع خبيرنا المتخصص في هذه الخدمة</p>
              <Link to="/contact" className="block text-center rounded-xl bg-gradient-gold py-3.5 font-black text-white shadow-gold hover:-translate-y-0.5 transition-transform mb-3">
                احجز استشارة مجانية
              </Link>
              <Link to="/login" className="block text-center rounded-xl border border-gold/40 py-3.5 font-bold text-gold hover:bg-gold/5 transition-colors">
                تسجيل الدخول
              </Link>
              <div className="mt-5 flex flex-col gap-2 text-xs text-text-muted">
                <div className="flex items-center gap-2"><CheckCircle className="size-3.5 text-gold" />لا رسوم خفية</div>
                <div className="flex items-center gap-2"><CheckCircle className="size-3.5 text-gold" />استرداد مرن</div>
                <div className="flex items-center gap-2"><CheckCircle className="size-3.5 text-gold" />تقارير شهرية</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
