import { Product } from '../types';
import { calculateComparePrice, calculateWholesalePrice } from '../utils/pricing';

export const INITIAL_CATEGORIES = [
  { id: 'all', name: 'جميع المنتجات', slug: 'all' },
  { id: 'clothing', name: 'الملابس', slug: 'clothing' },
  { id: 'accessories_gifts', name: 'إكسسوارات وهدايا', slug: 'accessories_gifts' },
  { id: 'electronics_home', name: 'إلكترونيات ومنزل', slug: 'electronics_home' },
  { id: 'health_beauty', name: 'الصحة والجمال', slug: 'health_beauty' },
  { id: 'deals', name: 'عروض وتخفيضات', slug: 'deals' },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'جلابة مغربية عصرية براند صولديا - قماش رفيع مع تطريز أصيل',
    category: 'الملابس',
    description: 'جلابة مغربية رجالية ونسائية بأحدث تفصيل عصري، قماش مليفة أصلي دافئ ومريح مناسب لجميع الفصول مع خياطة المعلم المتقونة.',
    features: [
      'ثوب مليفة كاشمير أصلي 100%',
      'خياطة المعلم المغربية باليد مع سفيفة حريرية',
      'قصة مريحة وعصرية متوفرة بجميع القياسات',
      'ألوان أنيقة تدوم ولا تبهت مع الغسيل'
    ],
    principalPrice: 299,
    comparePrice: calculateComparePrice(299),
    wholesalePrice: calculateWholesalePrice(299),
    media: [
      {
        id: 'm1-1',
        url: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=900&auto=format&fit=crop&q=80',
        type: 'image',
        title: 'جلابة صولديا - كحلي ملكي',
        colorHex: '#1e293b',
        colorName: 'كحلي ملكي'
      },
      {
        id: 'm1-2',
        url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&auto=format&fit=crop&q=80',
        type: 'image',
        title: 'جلابة صولديا - بيج صوف',
        colorHex: '#d4b996',
        colorName: 'بيج صوف'
      },
      {
        id: 'm1-3',
        url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&auto=format&fit=crop&q=80',
        type: 'image',
        title: 'جلابة صولديا - أخضر زمردي',
        colorHex: '#065f46',
        colorName: 'أخضر زمردي'
      }
    ],
    colors: [
      { name: 'كحلي ملكي', hex: '#1e293b', mediaIndex: 0 },
      { name: 'بيج صوف', hex: '#d4b996', mediaIndex: 1 },
      { name: 'أخضر زمردي', hex: '#065f46', mediaIndex: 2 }
    ],
    inventory: 35,
    rating: 4.9,
    reviewsCount: 84,
    inStock: true,
    tags: ['هميزات', 'الملابس', 'تقليدي عصري'],
    createdAt: '2026-03-01T10:00:00Z'
  },
  {
    id: 'prod-2',
    name: 'طقم هدية فاخر - ساعة كوارتز أصلية مقاومة للماء مع محفظة وحزام جلد',
    category: 'إكسسوارات وهدايا',
    description: 'بكج VIP مثالي للإهداء في علبة جلدية راقية! ساعة يد مقاومة للماء مع ماكينة يابانية، وسوار أنيق ومحفظة جلدية من الدرجة الأولى.',
    features: [
      'ساعة رجالية ستانلس ستيل مقاومة للماء 30 متر',
      'حزام ومحفظة من الجلد الطبيعي الممتاز',
      'علبة إهداء فاخرة جاهزة للتقديم فوراً',
      'ضمان لمدة سنة كاملة مع صولديا'
    ],
    principalPrice: 249,
    comparePrice: calculateComparePrice(249),
    wholesalePrice: calculateWholesalePrice(249),
    media: [
      {
        id: 'm2-1',
        url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900&auto=format&fit=crop&q=80',
        type: 'image',
        title: 'طقم ساعة أسود فاحم',
        colorHex: '#18181b',
        colorName: 'أسود فاحم'
      },
      {
        id: 'm2-2',
        url: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=900&auto=format&fit=crop&q=80',
        type: 'image',
        title: 'طقم ساعة بني عسلي',
        colorHex: '#78350f',
        colorName: 'بني عسلي'
      },
      {
        id: 'm2-3',
        url: 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=900&auto=format&fit=crop&q=80',
        type: 'image',
        title: 'طقم ساعة فضي لامع',
        colorHex: '#94a3b8',
        colorName: 'فضي لامع'
      }
    ],
    colors: [
      { name: 'أسود فاحم', hex: '#18181b', mediaIndex: 0 },
      { name: 'بني عسلي', hex: '#78350f', mediaIndex: 1 },
      { name: 'فضي لامع', hex: '#94a3b8', mediaIndex: 2 }
    ],
    inventory: 50,
    rating: 4.8,
    reviewsCount: 112,
    inStock: true,
    tags: ['هدايا', 'إكسسوارات', 'الأكثر طلباً'],
    createdAt: '2026-03-02T11:00:00Z'
  },
  {
    id: 'prod-3',
    name: 'قلاية هوائية ذكية بدون زيت 8 لتر - ماركة سوليد العالمية',
    category: 'إلكترونيات ومنزل',
    description: 'طيّب أشهى الأطباق المغربية الصحية بأقل من 90% دهون! سعة عائلية 8 لتر مع شاشة لمس رقمية و12 برنامج طهي مسبق لجميع أنواع اللحوم والخضار.',
    features: [
      'سعة عملاقة 8 لتر تكفي للعائلة كاملة',
      'قوة 1800 واط مع تدوير حراري 360 درجة 3D',
      'وعاء سيراميك غير لاصق سهل التنظيف',
      'اقتصادية في استهلاك الكهرباء وضمان سنتين'
    ],
    principalPrice: 449,
    comparePrice: calculateComparePrice(449),
    wholesalePrice: calculateWholesalePrice(449),
    media: [
      {
        id: 'm3-1',
        url: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=900&auto=format&fit=crop&q=80',
        type: 'image',
        title: 'قلاية هوائية - أسود بيانو',
        colorHex: '#0f172a',
        colorName: 'أسود بيانو'
      },
      {
        id: 'm3-2',
        url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=900&auto=format&fit=crop&q=80',
        type: 'image',
        title: 'قلاية هوائية - رمادي فضي مطفي',
        colorHex: '#64748b',
        colorName: 'رمادي فضي'
      }
    ],
    colors: [
      { name: 'أسود بيانو', hex: '#0f172a', mediaIndex: 0 },
      { name: 'رمادي فضي', hex: '#64748b', mediaIndex: 1 }
    ],
    inventory: 28,
    rating: 4.95,
    reviewsCount: 195,
    inStock: true,
    tags: ['المنزل', 'أجهزة ذكية', 'هميزة'],
    createdAt: '2026-03-03T12:00:00Z'
  },
  {
    id: 'prod-4',
    name: 'مصفف ومجفف الشعر الاحترافي 5 في 1 بالهواء الساخن السيراميكي',
    category: 'الصحة والجمال',
    description: 'صالون حلاقة وتصفيف متكامل بين يديك في الدار! 5 رؤوس قابلة للتغيير لتجفيف وتمليس وتجعيد الشعر بتقنية الأيونات السالبة التي تحمي الشعر من التقصف.',
    features: [
      '5 رؤوس مختلفة لجميع تسريحات الشعر',
      'تقنية الأيونات السالبة لمنع الهيشان والتلف',
      '3 مستويات للحرارة والسرعة مع حبل دوار 360 درجة',
      'سريعة التسخين ومناسبة لجميع أنواع الشعر'
    ],
    principalPrice: 199,
    comparePrice: calculateComparePrice(199),
    wholesalePrice: calculateWholesalePrice(199),
    media: [
      {
        id: 'm4-1',
        url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900&auto=format&fit=crop&q=80',
        type: 'image',
        title: 'مصفف الشعر - وردي غولد',
        colorHex: '#db2777',
        colorName: 'وردي غولد'
      },
      {
        id: 'm4-2',
        url: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=900&auto=format&fit=crop&q=80',
        type: 'image',
        title: 'مصفف الشعر - بنفسجي ليلكي',
        colorHex: '#7c3aed',
        colorName: 'بنفسجي ليلكي'
      }
    ],
    colors: [
      { name: 'وردي غولد', hex: '#db2777', mediaIndex: 0 },
      { name: 'بنفسجي ليلكي', hex: '#7c3aed', mediaIndex: 1 }
    ],
    inventory: 45,
    rating: 4.75,
    reviewsCount: 78,
    inStock: true,
    tags: ['تجميل', 'شعر', 'عرض خاص'],
    createdAt: '2026-03-04T14:00:00Z'
  },
  {
    id: 'prod-5',
    name: 'جاكيت جلدي رجالي أصلي عازل للرياح والمطر - ستايل بومبر أوروبي',
    category: 'الملابس',
    description: 'جاكيت جلد ناعم ومقاوم للخدوش مع بطانة داخلية مبطنة دافئة وسحاب متين. يعطيك هيبة وأناقة عالية في جميع المناسبات والخروجات.',
    features: [
      'جلد صناعي عالي الجودة بملمس طبيعي ناعم',
      'مقاوم للماء والرياح الباردة مع بطانة داخلية دافئة',
      'جيوب متعددة مع سحابات معدنية متينة',
      'قصة سبور أنيقة تناسب جميع الأعمار'
    ],
    principalPrice: 349,
    comparePrice: calculateComparePrice(349),
    wholesalePrice: calculateWholesalePrice(349),
    media: [
      {
        id: 'm5-1',
        url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=900&auto=format&fit=crop&q=80',
        type: 'image',
        title: 'جاكيت بومبر - بني محروق',
        colorHex: '#451a03',
        colorName: 'بني محروق'
      },
      {
        id: 'm5-2',
        url: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=900&auto=format&fit=crop&q=80',
        type: 'image',
        title: 'جاكيت بومبر - أسود كلاسيك',
        colorHex: '#18181b',
        colorName: 'أسود كلاسيك'
      }
    ],
    colors: [
      { name: 'بني محروق', hex: '#451a03', mediaIndex: 0 },
      { name: 'أسود كلاسيك', hex: '#18181b', mediaIndex: 1 }
    ],
    inventory: 22,
    rating: 4.88,
    reviewsCount: 63,
    inStock: true,
    tags: ['الملابس', 'شتاء', 'ستايل'],
    createdAt: '2026-03-05T09:30:00Z'
  },
  {
    id: 'prod-6',
    name: 'سماعات بلوتوث لاسلكية عازلة للضوضاء ANC مع علبة شحن ذكية',
    category: 'إلكترونيات ومنزل',
    description: 'استمتع بصوت نقي ونغمات باز قوية مع بطارية تدوم حتى 36 ساعة! عزل نشط للضوضاء وميكروفون مدمج عالي الوضوح للمكالمات والعمل.',
    features: [
      'عزل الضوضاء النشط ANC حتى 35 ديسيبل',
      'بلوتوث 5.4 سريع الاتصال بدون أي تأخير في الألعاب',
      'بطارية تدوم 8 ساعات متواصلة و36 ساعة بالعلبة',
      'مقاومة للعرق ورذاذ الماء IPX5'
    ],
    principalPrice: 179,
    comparePrice: calculateComparePrice(179),
    wholesalePrice: calculateWholesalePrice(179),
    media: [
      {
        id: 'm6-1',
        url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=900&auto=format&fit=crop&q=80',
        type: 'image',
        title: 'سماعات صولديا - أبيض لؤلؤي',
        colorHex: '#f8fafc',
        colorName: 'أبيض لؤلؤي'
      },
      {
        id: 'm6-2',
        url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=900&auto=format&fit=crop&q=80',
        type: 'image',
        title: 'سماعات صولديا - أسود مطفي',
        colorHex: '#09090b',
        colorName: 'أسود مطفي'
      }
    ],
    colors: [
      { name: 'أبيض لؤلؤي', hex: '#f8fafc', mediaIndex: 0 },
      { name: 'أسود مطفي', hex: '#09090b', mediaIndex: 1 }
    ],
    inventory: 40,
    rating: 4.82,
    reviewsCount: 147,
    inStock: true,
    tags: ['إلكترونيات', 'صوتيات', 'هميزة'],
    createdAt: '2026-03-06T15:10:00Z'
  }
];
