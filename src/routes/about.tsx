import { createFileRoute } from "@tanstack/react-router";
import { Shield, Award, Users, TrendingUp, Globe, Star } from "lucide-react";
import { useLang } from "../contexts/LanguageContext";

export const Route = createFileRoute("/about")({ component: About });

const timelineAr = [
  { year: "2010", title: "التأسيس", desc: "تأسست الشركة في دبي برأس مال أولي 50 مليون دولار وفريق من 12 خبيراً." },
  { year: "2013", title: "التوسع الإقليمي", desc: "افتتاح فروع في الرياض والكويت والقاهرة وأصول تجاوزت 500 مليون دولار." },
  { year: "2016", title: "الاعتراف الدولي", desc: "جائزة أفضل شركة استثمار في الشرق الأوسط من Bloomberg Markets." },
  { year: "2019", title: "الذكاء الاصطناعي", desc: "إطلاق منصة التحليل الذكي التي تخدم أكثر من 2000 عميل مؤسسي." },
  { year: "2022", title: "التوسع العالمي", desc: "مكاتب في لندن وسنغافورة والوصول إلى 15 سوقاً مالياً عالمياً." },
  { year: "2024", title: "رقمي أولاً", desc: "إطلاق منصة الاستثمار الرقمي ومحافظ العملات المشفرة المؤسسية." },
];

const timelineEn = [
  { year: "2010", title: "Founded", desc: "Established in Dubai with $50M initial capital and a team of 12 experts." },
  { year: "2013", title: "Regional Expansion", desc: "Opened offices in Riyadh, Kuwait and Cairo; assets exceeded $500M." },
  { year: "2016", title: "International Recognition", desc: "Best Investment Firm in the Middle East award from Bloomberg Markets." },
  { year: "2019", title: "AI Platform", desc: "Launched AI analytics platform serving over 2,000 institutional clients." },
  { year: "2022", title: "Global Expansion", desc: "Offices in London and Singapore; access to 15 global financial markets." },
  { year: "2024", title: "Digital First", desc: "Launched digital investment platform and institutional crypto portfolios." },
];

const teamAr = [
  { name: "م. خالد الحربي", role: "الرئيس التنفيذي", bio: "خبرة 25 عاماً في الأسواق المالية الخليجية والعالمية.", ab: "خ" },
  { name: "د. سارة المطيري", role: "مدير الاستثمار", bio: "دكتوراه اقتصاد من MIT، متخصصة في الأسواق الناشئة.", ab: "س" },
  { name: "م. فيصل العمري", role: "رئيس التحليل", bio: "محلل CFA معتمد مع خبرة 18 عاماً في وول ستريت.", ab: "ف" },
  { name: "أ. ليلى السعيد", role: "مديرة خدمة العملاء", bio: "متخصصة في إدارة علاقات المستثمرين وبناء المحافظ المخصصة.", ab: "ل" },
  { name: "م. أحمد الزهراني", role: "رئيس التكنولوجيا", bio: "مهندس متخصص في أنظمة التداول الآلي والذكاء الاصطناعي.", ab: "أ" },
  { name: "م. هند القحطاني", role: "مدير المخاطر", bio: "خبرة 15 عاماً في إدارة المخاطر المالية وتحليل المحافظ.", ab: "ه" },
];

const teamEn = [
  { name: "Khalid Al-Harbi", role: "CEO", bio: "25 years of experience in Gulf and global financial markets.", ab: "K" },
  { name: "Dr. Sara Al-Mutairi", role: "Investment Director", bio: "PhD in Economics from MIT, specializing in emerging markets.", ab: "S" },
  { name: "Faisal Al-Omari", role: "Head of Research", bio: "CFA-certified analyst with 18 years of Wall Street experience.", ab: "F" },
  { name: "Layla Al-Saeed", role: "Client Relations Director", bio: "Specialist in investor relationship management and custom portfolio building.", ab: "L" },
  { name: "Ahmed Al-Zahrani", role: "CTO", bio: "Engineer specializing in automated trading systems and AI.", ab: "A" },
  { name: "Hind Al-Qahtani", role: "Risk Manager", bio: "15 years of experience in financial risk management and portfolio analysis.", ab: "H" },
];

const valuesAr = [
  { icon: Shield, title: "الثقة والشفافية", desc: "نلتزم بأعلى معايير الشفافية في جميع تعاملاتنا مع عملائنا." },
  { icon: Award, title: "التميز المهني", desc: "فريق معتمد من أفضل الجامعات والمؤسسات المالية العالمية." },
  { icon: Users, title: "خدمة شخصية", desc: "خطة استثمارية مخصصة تناسب أهدافك وتحملك للمخاطر." },
  { icon: Globe, title: "وصول عالمي", desc: "شراكات مع أبرز البنوك والمؤسسات في أكثر من 30 دولة." },
];

const valuesEn = [
  { icon: Shield, title: "Trust & Transparency", desc: "We are committed to the highest standards of transparency in all our client dealings." },
  { icon: Award, title: "Professional Excellence", desc: "A team certified by the world's top universities and financial institutions." },
  { icon: Users, title: "Personal Service", desc: "A customized investment plan that fits your goals and risk tolerance." },
  { icon: Globe, title: "Global Access", desc: "Partnerships with leading banks and institutions in over 30 countries." },
];

function About() {
  const { t, lang } = useLang();
  const isAr = lang === 'ar';
  const timeline = isAr ? timelineAr : timelineEn;
  const team = isAr ? teamAr : teamEn;
  const values = isAr ? valuesAr : valuesEn;

  const heroStats = [
    { icon: TrendingUp, v: "$2B+", l: t('about_stat1') },
    { icon: Users, v: "5,000+", l: t('about_stat2') },
    { icon: Star, v: "98.5%", l: t('about_stat3') },
    { icon: Globe, v: "15+", l: t('about_stat4') },
  ];

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative py-28 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(oklch(0.55 0.25 300) 1px,transparent 1px),linear-gradient(90deg,oklch(0.55 0.25 300) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8 text-center">
          <span className="text-xs font-black tracking-[0.3em] text-gold uppercase">{t('about_label')}</span>
          <h1 className="mt-5 text-5xl md:text-6xl font-black text-foreground leading-tight">
            {t('about_heading')} <span className="text-gradient-gold">{t('about_heading_gold')}</span> {t('about_heading_end')}
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-text-muted leading-relaxed">{t('about_desc')}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-10">
            {heroStats.map(({ icon: Icon, v, l }) => (
              <div key={l} className="text-center">
                <Icon className="size-5 text-gold mx-auto mb-1" />
                <div className="text-3xl font-black text-gold font-mono">{v}</div>
                <div className="text-xs text-text-muted">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <h2 className="text-center text-4xl font-black text-foreground mb-16">
            {t('about_values_heading')} <span className="text-gradient-gold">{t('about_values_heading_gold')}</span>
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="rounded-2xl border border-border bg-navy-mid p-8 text-center hover:border-gold hover:shadow-card transition-all">
                <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-gold/10 border border-gold/20 text-gold"><v.icon className="size-7" /></div>
                <h3 className="mt-5 text-lg font-bold text-foreground">{v.title}</h3>
                <p className="mt-3 text-sm text-text-muted leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-navy-mid">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <h2 className="text-center text-4xl font-black text-foreground mb-16">
            {t('about_timeline_heading')} <span className="text-gradient-gold">{t('about_timeline_heading_gold')}</span>
          </h2>
          <div className="flex flex-col gap-8">
            {timeline.map((item, i) => (
              <div key={item.year} className={`flex flex-col md:flex-row items-center gap-6 ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
                <div className={`flex-1 ${i % 2 === 1 ? "md:text-left" : "md:text-right"}`}>
                  <div className="rounded-2xl border border-border bg-white p-6 shadow-card hover:border-gold transition-colors">
                    <div className="text-xs font-black text-gold tracking-widest">{item.year}</div>
                    <h3 className="mt-2 text-lg font-bold text-foreground">{item.title}</h3>
                    <p className="mt-2 text-sm text-text-muted leading-relaxed">{item.desc}</p>
                  </div>
                </div>
                <div className="relative shrink-0 z-10">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-gold shadow-gold text-white font-black text-sm border-4 border-white">{item.year.slice(2)}</div>
                </div>
                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <h2 className="text-center text-4xl font-black text-foreground mb-4">
            {t('about_team_heading')} <span className="text-gradient-gold">{t('about_team_heading_gold')}</span>
          </h2>
          <p className="text-center text-text-muted mb-16 text-lg">
            {isAr ? "خبراء متمرسون يضعون مصلحتك أولاً" : "Seasoned experts who put your interests first"}
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((m) => (
              <div key={m.name} className="rounded-2xl border border-border bg-navy-mid p-8 text-center hover:border-gold hover:shadow-card transition-all">
                <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-gold shadow-gold text-white font-black text-3xl">{m.ab}</div>
                <h3 className="mt-5 text-lg font-bold text-foreground">{m.name}</h3>
                <p className="text-xs font-bold text-gold mt-1">{m.role}</p>
                <p className="mt-3 text-sm text-text-muted leading-relaxed">{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-gold text-white text-center">
        <div className="mx-auto max-w-2xl px-5">
          <h2 className="text-4xl font-black">
            {isAr ? "ابدأ رحلتك الاستثمارية اليوم" : "Start Your Investment Journey Today"}
          </h2>
          <p className="mt-4 opacity-90 text-lg">
            {isAr ? "احجز استشارتك المجانية مع أحد خبرائنا المعتمدين" : "Book your free consultation with one of our certified experts"}
          </p>
          <a href="/contact" className="mt-8 inline-block rounded-xl bg-white text-gold font-black px-8 py-4 shadow-lg hover:-translate-y-1 transition-transform">
            {isAr ? "تواصل معنا الآن" : "Contact Us Now"}
          </a>
        </div>
      </section>
    </div>
  );
}
