import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Calendar, ArrowLeft, ArrowRight, Search, Clock } from "lucide-react";
import { useLang } from "../contexts/LanguageContext";

export const Route = createFileRoute("/news")({ component: News });

const articlesAr = [
  { slug: "bitcoin-2025-outlook", cat: "عملات رقمية", title: "بيتكوين يسجل مستويات قياسية جديدة — ماذا يعني ذلك للمستثمرين العرب؟", excerpt: "بعد ارتفاع نسبته 45% خلال الربع الأول، يتساءل المستثمرون عن الأفق القادم لسوق العملات الرقمية وما إذا كانت فرصة الشراء لا تزال قائمة.", date: "15 يونيو 2025", readTime: "8 دقائق", author: "م. فيصل العمري", hot: true },
  { slug: "gulf-stocks-q2", cat: "الأسهم الخليجية", title: "تحليل أداء أسواق الخليج في الربع الثاني — الفرص والمخاطر", excerpt: "يستعرض تقريرنا أداء أسواق الخليج في الربع الثاني مع التركيز على القطاعات الأكثر نمواً وتلك التي تُقدم فرصاً استثمارية واعدة.", date: "10 يونيو 2025", readTime: "12 دقائق", author: "د. سارة المطيري", hot: false },
  { slug: "gold-inflation-hedge", cat: "المعادن", title: "الذهب كسلاح ضد التضخم — هل حان وقت التراجع؟", excerpt: "مع بيانات التضخم المتذبذبة والتوقعات المتباينة حول قرارات الفائدة، نحلل دور الذهب في المحفظة الاستثمارية المتوازنة.", date: "5 يونيو 2025", readTime: "6 دقائق", author: "م. خالد الحربي", hot: false },
  { slug: "ai-stocks-2025", cat: "الأسهم العالمية", title: "أسهم الذكاء الاصطناعي في 2025 — بين الفرصة والمبالغة في التقييم", excerpt: "NVIDIA وMeta وGoogle تُسجل أرباحاً قياسية، لكن هل التقييمات الحالية مبررة؟ نقدم تحليلاً معمقاً لأبرز الأسهم التقنية.", date: "1 يونيو 2025", readTime: "10 دقائق", author: "م. أحمد الزهراني", hot: true },
  { slug: "oil-prices-opec", cat: "الطاقة", title: "أسعار النفط بعد قرارات أوبك+ — ماذا يتوقع المحللون؟", excerpt: "بعد قرار أوبك+ بتمديد خفض الإنتاج، نستعرض توقعات أسعار النفط حتى نهاية العام والقطاعات المستفيدة.", date: "25 مايو 2025", readTime: "7 دقائق", author: "م. هند القحطاني", hot: false },
  { slug: "portfolio-diversification", cat: "استراتيجية", title: "دليل تنويع المحفظة الاستثمارية للمستثمر العربي في 2025", excerpt: "كيف توزع أصولك بذكاء بين الأسهم والمعادن والعملات الرقمية؟ دليل عملي شامل مع أمثلة واقعية من السوق.", date: "20 مايو 2025", readTime: "15 دقائق", author: "د. سارة المطيري", hot: false },
];

const articlesEn = [
  { slug: "bitcoin-2025-outlook", cat: "Crypto", title: "Bitcoin Hits New Records — What Does It Mean for Arab Investors?", excerpt: "After a 45% surge in Q1, investors are asking about the crypto market outlook and whether the buying opportunity still exists.", date: "Jun 15, 2025", readTime: "8 min", author: "Faisal Al-Omari", hot: true },
  { slug: "gulf-stocks-q2", cat: "Gulf Stocks", title: "Gulf Markets Q2 Performance Analysis — Opportunities & Risks", excerpt: "Our report reviews Gulf market performance in Q2, focusing on the fastest-growing sectors and those offering promising investment opportunities.", date: "Jun 10, 2025", readTime: "12 min", author: "Dr. Sara Al-Mutairi", hot: false },
  { slug: "gold-inflation-hedge", cat: "Metals", title: "Gold as an Inflation Hedge — Is a Pullback Due?", excerpt: "With volatile inflation data and diverging interest rate expectations, we analyze gold's role in a balanced investment portfolio.", date: "Jun 5, 2025", readTime: "6 min", author: "Khalid Al-Harbi", hot: false },
  { slug: "ai-stocks-2025", cat: "Global Stocks", title: "AI Stocks in 2025 — Opportunity or Overvaluation?", excerpt: "NVIDIA, Meta, and Google post record earnings, but are current valuations justified? We present an in-depth analysis of top tech stocks.", date: "Jun 1, 2025", readTime: "10 min", author: "Ahmed Al-Zahrani", hot: true },
  { slug: "oil-prices-opec", cat: "Energy", title: "Oil Prices After OPEC+ Decisions — What Analysts Expect", excerpt: "After OPEC+'s decision to extend production cuts, we review oil price forecasts through year-end and the benefiting sectors.", date: "May 25, 2025", readTime: "7 min", author: "Hind Al-Qahtani", hot: false },
  { slug: "portfolio-diversification", cat: "Strategy", title: "The Arab Investor's Portfolio Diversification Guide for 2025", excerpt: "How to smartly allocate your assets across equities, metals, and crypto? A comprehensive practical guide with real market examples.", date: "May 20, 2025", readTime: "15 min", author: "Dr. Sara Al-Mutairi", hot: false },
];

function News() {
  const { t, lang } = useLang();
  const isAr = lang === 'ar';
  const [apiArticles, setApiArticles] = useState<typeof articlesAr | null>(null);
  useEffect(() => {
    fetch('/api/v1/articles?limit=20')
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d.articles) && d.articles.length > 0) {
          setApiArticles(d.articles.map((x: Record<string, unknown>) => ({
            slug: String(x.slug || x.id || ''),
            cat: isAr ? String(x.cat || x.category || '') : String(x.cat_en || x.category || x.cat || ''),
            title: isAr ? String(x.title || '') : String((x as Record<string,unknown>).title_en || x.title || ''),
            excerpt: isAr ? String(x.excerpt || x.body || '').slice(0, 200) : String((x as Record<string,unknown>).excerpt_en || x.excerpt || x.body || '').slice(0, 200),
            date: String(x.date || (x.created_at ? new Date(String(x.created_at)).toLocaleDateString(isAr ? 'ar-EG' : 'en-US') : '')),
            readTime: String(x.readTime || x.read_time || '5 min'),
            author: String(x.author || ''),
            hot: Boolean(x.hot),
          })));
        }
      })
      .catch(() => {});
  }, [isAr]);
  const articles = apiArticles ?? (isAr ? articlesAr : articlesEn);
  const cats = [t('news_cat_all'), ...Array.from(new Set(articles.map((a) => a.cat)))];
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  const [cat, setCat] = useState(t('news_cat_all'));
  const [search, setSearch] = useState("");

  const filtered = articles.filter((a) => {
    const matchCat = cat === t('news_cat_all') || a.cat === cat;
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const [featured, ...rest] = filtered;

  return (
    <div className="bg-background">
      <section className="relative py-28 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(oklch(0.55 0.25 300) 1px,transparent 1px),linear-gradient(90deg,oklch(0.55 0.25 300) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8 text-center">
          <span className="text-xs font-black tracking-[0.3em] text-gold uppercase">{t('news_page_label')}</span>
          <h1 className="mt-5 text-5xl md:text-6xl font-black text-foreground leading-tight">
            {t('news_page_heading')} <span className="text-gradient-gold">{t('news_page_heading_gold')}</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-text-muted leading-relaxed">{t('news_page_desc')}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="flex flex-wrap gap-2">
              {cats.map((c) => (
                <button key={c} onClick={() => { setCat(c); setSearch(""); }}
                  className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${cat === c ? "bg-gradient-gold text-white shadow-gold" : "border border-border bg-navy-mid text-text-muted hover:border-gold hover:text-gold"}`}>
                  {c}
                </button>
              ))}
            </div>
            <div className="relative sm:mr-auto">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-text-muted" />
              <input value={search} onChange={(e) => { setSearch(e.target.value); setCat(t('news_cat_all')); }}
                placeholder={t('news_search_placeholder')}
                className="rounded-xl border border-border bg-white py-2 pr-9 pl-4 text-sm focus:border-gold focus:outline-none w-56" />
            </div>
          </div>

          {/* Featured */}
          {featured && (
            <Link to={`/article/${featured.slug}` as any} className="block group mb-10">
              <div className="rounded-2xl border border-border bg-navy-mid overflow-hidden hover:border-gold hover:shadow-gold transition-all">
                <div className="h-56 bg-gradient-navy flex items-center justify-center">
                  <span className="text-7xl">📰</span>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    {featured.hot && <span className="text-[10px] font-black bg-down/10 text-down rounded-full px-2 py-0.5">🔥 {t('news_trending')}</span>}
                    <span className="text-[10px] font-black text-gold bg-gold/10 rounded-full px-2 py-0.5">{featured.cat}</span>
                    <span className="flex items-center gap-1 text-xs text-text-muted"><Calendar className="size-3" />{featured.date}</span>
                    <span className="flex items-center gap-1 text-xs text-text-muted"><Clock className="size-3" />{featured.readTime}</span>
                  </div>
                  <h2 className="text-2xl font-black text-foreground group-hover:text-gold transition-colors">{featured.title}</h2>
                  <p className="mt-3 text-text-muted leading-relaxed">{featured.excerpt}</p>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-xs text-text-muted">{t('news_by')} {featured.author}</span>
                    <span className="inline-flex items-center gap-2 text-sm font-bold text-gold group-hover:gap-3 transition-all">
                      {t('news_read_more')} <Arrow className="size-4" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((a) => (
              <Link key={a.slug} to={`/article/${a.slug}` as any} className="group block rounded-2xl border border-border bg-navy-mid overflow-hidden hover:border-gold hover:shadow-card transition-all hover:-translate-y-1">
                <div className="h-44 bg-gradient-navy flex items-center justify-center text-4xl">📄</div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    {a.hot && <span className="text-[10px] font-black bg-down/10 text-down rounded-full px-2 py-0.5">🔥</span>}
                    <span className="text-[10px] font-black text-gold bg-gold/10 rounded-full px-2 py-0.5">{a.cat}</span>
                    <span className="flex items-center gap-1 text-xs text-text-muted"><Clock className="size-3" />{a.readTime}</span>
                  </div>
                  <h3 className="font-bold text-foreground leading-snug group-hover:text-gold transition-colors line-clamp-2">{a.title}</h3>
                  <p className="mt-2 text-xs text-text-muted leading-relaxed line-clamp-3">{a.excerpt}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[10px] text-text-muted">{a.author} · {a.date}</span>
                    <Arrow className="size-4 text-gold" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-text-muted">
              <div className="text-4xl mb-4">📭</div>
              <p>{isAr ? "لا توجد مقالات مطابقة" : "No matching articles"}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
