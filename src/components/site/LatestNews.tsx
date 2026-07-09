import { useEffect, useState } from "react";
import { Calendar, ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useLang } from "../../contexts/LanguageContext";

const newsAr = [
  { slug: "bitcoin-2025-outlook", cat: "عملات رقمية", title: "بيتكوين يسجل مستويات قياسية — ماذا يعني للمستثمر العربي؟", excerpt: "بعد ارتفاع 45% في الربع الأول، نحلل أفق سوق العملات الرقمية وما إذا كانت فرصة الشراء لا تزال قائمة.", date: "15 يونيو 2025", readTime: "8 دق", hot: true },
  { slug: "gulf-stocks-q2", cat: "الأسهم الخليجية", title: "تحليل أداء أسواق الخليج في الربع الثاني", excerpt: "الفرص والمخاطر في أسواق السعودية وأبوظبي ودبي خلال الأشهر القادمة مع توقعات فريقنا.", date: "10 يونيو 2025", readTime: "12 دق", hot: false },
  { slug: "gold-inflation-hedge", cat: "المعادن", title: "الذهب كسلاح ضد التضخم — هل حان وقت التراجع؟", excerpt: "نحلل دور الذهب في المحفظة الاستثمارية المتوازنة في ضوء بيانات التضخم الأخيرة.", date: "5 يونيو 2025", readTime: "6 دق", hot: false },
];

const newsEn = [
  { slug: "bitcoin-2025-outlook", cat: "Crypto", title: "Bitcoin Hits Record Highs — What Does It Mean for Arab Investors?", excerpt: "After a 45% surge in Q1, we analyze the crypto market outlook and whether the buying opportunity still exists.", date: "Jun 15, 2025", readTime: "8 min", hot: true },
  { slug: "gulf-stocks-q2", cat: "Gulf Stocks", title: "Gulf Markets Performance Analysis — Q2", excerpt: "Opportunities and risks in Saudi Arabia, Abu Dhabi, and Dubai markets over the coming months with our team's forecasts.", date: "Jun 10, 2025", readTime: "12 min", hot: false },
  { slug: "gold-inflation-hedge", cat: "Metals", title: "Gold as an Inflation Hedge — Is a Pullback Due?", excerpt: "We analyze the role of gold in a balanced investment portfolio in light of the latest inflation data.", date: "Jun 5, 2025", readTime: "6 min", hot: false },
];

interface NewsItem {
  id?: string | number;
  slug?: string;
  cat?: string;
  category?: string;
  title?: string;
  title_en?: string;
  excerpt?: string;
  excerpt_en?: string;
  body?: string;
  date?: string;
  created_at?: string;
  readTime?: string;
  read_time?: string;
  hot?: boolean;
  [key: string]: unknown;
}

function toNewsItem(a: NewsItem, isAr: boolean) {
  return {
    slug: a.slug || String(a.id || ''),
    cat: isAr ? (a.cat || a.category || '') : (a.category || a.cat || ''),
    title: isAr ? (a.title || '') : (a.title_en || a.title || ''),
    excerpt: isAr ? (a.excerpt || '') : (a.excerpt_en || a.excerpt || a.body?.slice(0, 120) || ''),
    date: a.date || (a.created_at ? new Date(a.created_at).toLocaleDateString(isAr ? 'ar-EG' : 'en-US') : ''),
    readTime: a.readTime || a.read_time || '5 min',
    hot: a.hot ?? false,
  };
}

export function LatestNews() {
  const { t, lang } = useLang();
  const isAr = lang === 'ar';
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  const [apiNews, setApiNews] = useState<NewsItem[] | null>(null);

  useEffect(() => {
    fetch('/api/v1/articles?limit=3&status=published')
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d.articles) && d.articles.length > 0) setApiNews(d.articles);
      })
      .catch(() => {});
  }, []);

  const staticNews = isAr ? newsAr : newsEn;
  const news = apiNews && apiNews.length > 0
    ? apiNews.slice(0, 3).map(a => toNewsItem(a, isAr))
    : staticNews;

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-xs font-black tracking-[0.3em] text-gold uppercase">{t('news_label')}</span>
            <h2 className="mt-2 text-4xl font-black text-foreground">
              {t('news_heading')} <span className="text-gradient-gold">{t('news_heading_gold')}</span>
            </h2>
          </div>
          <Link to="/news" className="inline-flex items-center gap-2 text-sm font-bold text-gold hover:gap-3 transition-all">
            {t('news_all_articles')} <Arrow className="size-4" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {news.map((n, idx) => (
            <Link
              key={n.slug || idx}
              to={`/article/${n.slug}` as any}
              className="group block rounded-2xl border border-border bg-navy-mid overflow-hidden hover:border-gold hover:shadow-card transition-all hover:-translate-y-1"
            >
              <div className="h-44 bg-gradient-navy flex items-center justify-center text-5xl">📰</div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  {n.hot && <span className="text-[10px] font-black bg-down/10 text-down rounded-full px-2 py-0.5">🔥 {t('news_trending')}</span>}
                  <span className="text-[10px] font-black text-gold bg-gold/10 rounded-full px-2 py-0.5">{n.cat}</span>
                </div>
                <h3 className="font-bold text-foreground line-clamp-2 group-hover:text-gold transition-colors">{n.title}</h3>
                <p className="mt-2 text-xs text-text-muted leading-relaxed line-clamp-2">{n.excerpt}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-text-muted">
                  <span className="flex items-center gap-1"><Calendar className="size-3" />{n.date}</span>
                  <span className="flex items-center gap-1"><Clock className="size-3" />{n.readTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
