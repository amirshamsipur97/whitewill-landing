// UI microcopy for the Insights/blog section, per language. Article CONTENT
// lives in the Supabase `insights` table; this is only the page chrome.

export const INSIGHTS_UI = {
  en: {
    eyebrow: 'INSIGHTS',
    title: 'Insights & Market Notes',
    subtitle: 'Guides, analysis and updates on real estate, investment and doing business in Oman.',
    empty: 'No articles published yet. Check back soon.',
    readMore: 'Read article',
    minRead: 'min read',
    back: 'Back to Insights',
    by: 'By',
    notFound: 'Article not found',
    notFoundBody: 'This article may have been moved or is not available in this language.',
    moreReading: 'More insights',
  },
  ru: {
    eyebrow: 'АНАЛИТИКА',
    title: 'Аналитика и заметки о рынке',
    subtitle: 'Гайды, анализ и новости о недвижимости, инвестициях и бизнесе в Омане.',
    empty: 'Статьи пока не опубликованы. Загляните позже.',
    readMore: 'Читать статью',
    minRead: 'мин чтения',
    back: 'Назад к аналитике',
    by: 'Автор:',
    notFound: 'Статья не найдена',
    notFoundBody: 'Возможно, статья перемещена или недоступна на этом языке.',
    moreReading: 'Ещё материалы',
  },
  ar: {
    eyebrow: 'رؤى',
    title: 'رؤى وملاحظات السوق',
    subtitle: 'أدلة وتحليلات وتحديثات حول العقارات والاستثمار وممارسة الأعمال في عُمان.',
    empty: 'لا توجد مقالات منشورة بعد. عُد قريبًا.',
    readMore: 'اقرأ المقال',
    minRead: 'دقيقة قراءة',
    back: 'العودة إلى الرؤى',
    by: 'بقلم',
    notFound: 'المقال غير موجود',
    notFoundBody: 'ربما تم نقل المقال أو أنه غير متاح بهذه اللغة.',
    moreReading: 'مقالات أخرى',
  },
  fa: {
    eyebrow: 'بصیرت‌ها',
    title: 'بصیرت‌ها و یادداشت‌های بازار',
    subtitle: 'راهنماها، تحلیل‌ها و به‌روزرسانی‌ها دربارهٔ املاک، سرمایه‌گذاری و کسب‌وکار در عمان.',
    empty: 'هنوز مقاله‌ای منتشر نشده است. به‌زودی سر بزنید.',
    readMore: 'خواندن مقاله',
    minRead: 'دقیقه مطالعه',
    back: 'بازگشت به بصیرت‌ها',
    by: 'نویسنده:',
    notFound: 'مقاله یافت نشد',
    notFoundBody: 'ممکن است این مقاله جابه‌جا شده یا به این زبان در دسترس نباشد.',
    moreReading: 'مقالات بیشتر',
  },
}

const LOCALES = { en: 'en-US', ru: 'ru-RU', ar: 'ar', fa: 'fa-IR' }

export function formatDate(iso, lang) {
  if (!iso) return ''
  try {
    return new Intl.DateTimeFormat(LOCALES[lang] || 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(iso))
  } catch {
    return ''
  }
}

export const RTL_LANGS = new Set(['ar', 'fa'])
