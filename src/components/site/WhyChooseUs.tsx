import { Shield, Award, Users, Clock, Lock, Zap } from "lucide-react";
import { useLang } from "../../contexts/LanguageContext";

const featuresAr = [
  { icon: Shield, t: "ترخيص رسمي", d: "مرخصون من هيئات رقابية معتمدة في الإمارات والسعودية." },
  { icon: Award, t: "خبرة 15+ سنة", d: "فريق محترف من المحللين والمستشارين الماليين الدوليين." },
  { icon: Users, t: "إدارة شخصية", d: "مستشار مالي مخصص لكل عميل بمتابعة دائمة وشخصية." },
  { icon: Clock, t: "دعم 24/7", d: "خدمة عملاء على مدار الساعة بالعربية والإنجليزية." },
  { icon: Lock, t: "أمان مؤسسي", d: "تشفير بنكي وحماية متعددة الطبقات لأصولك ومعلوماتك." },
  { icon: Zap, t: "تنفيذ فوري", d: "منصة تداول متقدمة بتنفيذ لحظي للصفقات في الأسواق العالمية." },
];

const featuresEn = [
  { icon: Shield, t: "Official License", d: "Licensed by recognized regulatory bodies in the UAE and Saudi Arabia." },
  { icon: Award, t: "15+ Years Experience", d: "A professional team of internationally certified analysts and financial advisors." },
  { icon: Users, t: "Personal Management", d: "A dedicated financial advisor for every client with continuous personal follow-up." },
  { icon: Clock, t: "24/7 Support", d: "Round-the-clock customer service in both Arabic and English." },
  { icon: Lock, t: "Institutional Security", d: "Bank-grade encryption and multi-layer protection for your assets and data." },
  { icon: Zap, t: "Instant Execution", d: "Advanced trading platform with real-time order execution in global markets." },
];

export function WhyChooseUs() {
  const { t, lang } = useLang();
  const features = lang === 'ar' ? featuresAr : featuresEn;

  return (
    <section className="py-24 lg:py-32 bg-navy-mid/40 border-y border-border">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-xs font-black tracking-[0.3em] text-gold uppercase">{t('why_label')}</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-black text-text-light">
            {t('why_heading')} <span className="text-gradient-gold">{t('why_heading_gold')}</span>
          </h2>
          <p className="mt-5 text-text-muted text-lg">{t('why_desc')}</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.t} className="flex gap-4 rounded-2xl border border-border bg-navy-dark/60 p-6 hover:border-gold/60 transition-colors">
              <div className="shrink-0 grid size-12 place-items-center rounded-xl bg-gold/15 text-gold">
                <f.icon className="size-6" />
              </div>
              <div>
                <h3 className="font-bold text-text-light">{f.t}</h3>
                <p className="mt-1.5 text-sm text-text-muted leading-relaxed">{f.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
