(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const root = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) { } } };
let LANG = store.get('aqua-lang') === 'ar' ? 'ar' : 'en';
const T = (en, ar) => (LANG === 'ar' ? ar : en);
const fmt = v => (typeof v === 'number' ? v.toLocaleString('en-US') : v);
const IMG = id => `assets/img/products/${id}.webp`;
const ICON = {
  plus: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 5v14M5 12h14"/></svg>',
  check: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
  x: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 12h15M13 6l6 6-6 6"/></svg>'
};

/* ------------------------------------------------------------------
   Data — Aqua Premium catalogue (pack sizes, units per carton,
   cartons and pallets per 20ft / 40ft container)
   row: [size EN, size AR, units/carton, cartons/20ft, pallets/20ft, cartons/40ft, pallets/40ft]
------------------------------------------------------------------ */
const SIZES = {
  tuna: [['185 g', '185 جم', 48, 1430, '10–12', 2300, '32'], ['160 g', '160 جم', 48, 1690, '10–12', 2700, '32'], ['140 g', '140 جم', 48, 1690, '10–12', 2800, '32']],
  sardine: [['125 g', '125 جم', 50, 1690, '10–12', 2600, '32']],
  canned: [['400 g', '400 جم', 24, 2090, '10–12', 2500, '22–24'], ['800 g', '800 جم', 12, 1800, '10–12', 2100, '22–24'], ['3 kg', '3 كجم', 6, 900, '10–12', 1420, '22–24']],
  frozen: [['400 g', '400 جم', 20, 1118, '10–12', 2650, '22–24']],
  fries: [['2.5 kg', '2.5 كجم', 4, 1100, '10–12', 2500, '22–24'], ['1 kg', '1 كجم', 10, 1100, '10–12', 2500, '22–24']],
  box: [['1 kg', '1 كجم', 10, 1000, '10–12', 1800, '22–24']],
  oil: [['1 kg', '1 كجم', 12, 1608, '10–12', 2400, '22–24']],
  sauce: [['320 g', '320 جم', 12, 3500, '10–12', 4000, '22–24'], ['800 g', '800 جم', 12, 1815, '10–12', 2100, '22–24'], ['3 kg', '3 كجم', 4, 1600, '10–12', 1420, '22–24']],
  pulse: [['400 g', '400 جم', 20, 1118, '10–12', 2650, '22–24'], ['500 g', '500 جم', 20, 1120, '10–12', 2400, '22–24'], ['1 kg', '1 كجم', 10, 1120, '10–12', 2400, '22–24'], ['5 kg', '5 كجم', 1, 4000, '10–12', 5000, '22–24']],
  grain: [],
  honey: [['350 g', '350 جم', 12, 4000, '10–12', 6000, '22–24'], ['875 g', '875 جم', 6, 3400, '10–12', 5000, '22–24']],
  coffee: []
};
const SIZE_NOTE = { grain: ['Sizes on request', 'الأحجام عند الطلب'], coffee: ['1,000 g bag', 'كيس 1,000 جم'] };
const CAPTION = { tuna: ['Tuna', 'التونة'], sardine: ['Sardines', 'السردين'], oil: ['Oils', 'الزيوت'], sauce: ['Sauces', 'الصلصات'], pulse: ['Pulses', 'البقوليات'], grain: ['Rice & pasta', 'الأرز والمكرونة'] };

const LINES = [
  { k: 'fish', en: 'Canned fish', ar: 'أسماك معلبة', f: 0, dEn: 'Light-meat and yellowfin tuna, plain or spicy, with regular and spicy sardines.', dAr: 'تونة لحم فاتح وتونة يلوفين، عادية أو حارة، مع السردين العادي والحار.' },
  { k: 'canned', en: 'Canned legumes & vegetables', ar: 'بقوليات وخضروات معلبة', f: 0, dEn: 'Fava beans six ways, hummus with tahina, chickpeas, beans, mushrooms and vegetables.', dAr: 'فول مدمس بست طرق، حمص بالطحينة، حمص حب، فاصوليا، مشروم وخضروات.', onEn: 'On the tin: 100% Natural · Ready to eat · Egyptian Product 100%', onAr: 'على العلبة: طبيعي 100% · جاهز للأكل · منتج مصري 100%' },
  { k: 'frozen', en: 'Frozen vegetables & fruit', ar: 'خضروات وفواكه مجمدة', f: 1, dEn: 'Okra, molokhia, peas, green beans, mixed vegetables, strawberries and mango.', dAr: 'بامية، ملوخية، بسلة، فاصوليا خضراء، خضار مشكل، فراولة ومانجو.', onEn: 'On the pack: Egyptian Product 100%', onAr: 'على الكيس: منتج مصري 100%' },
  { k: 'fries', en: 'Pre-fried fries', ar: 'بطاطس نصف مقلية', f: 1, dEn: 'Pommes frites and allumettes, pre-fried and frozen, in 2.5 kg and 1 kg bags.', dAr: 'بوم فريت وألوميت، نصف مقلية ومجمدة، في أكياس 2.5 كجم و1 كجم.', onEn: 'On the pack: Egyptian Product 100%', onAr: 'على الكيس: منتج مصري 100%' },
  { k: 'pastry', en: 'Frozen pastries', ar: 'معجنات مجمدة', f: 1, dEn: 'Cheese and pepperoni pizza, and spring rolls, in 1 kg boxes.', dAr: 'بيتزا بالجبنة وبيتزا ببروني وسبرينج رولز في علب 1 كجم.' },
  { k: 'chicken', en: 'Ready-to-cook chicken', ar: 'دجاج جاهز للطهي', f: 1, dEn: 'Nuggets, strips and wings, plain or spicy, and fried chicken parts, in 1 kg boxes.', dAr: 'قطع وشرائح وأجنحة دجاج، عادية أو حارة، ودجاج مقلي، في علب 1 كجم.', onEn: 'On the pack: Egyptian Product 100%', onAr: 'على العلبة: منتج مصري 100%' },
  { k: 'sauces', en: 'Oils & sauces', ar: 'الزيوت والصلصات', f: 0, dEn: 'Sunflower, corn, olive and mixed oils; tomato sauce, ketchup and mayonnaise.', dAr: 'زيت عباد الشمس والذرة والزيتون والخليط؛ صلصة طماطم وكاتشب ومايونيز.' },
  { k: 'grains', en: 'Grains, pulses & pasta', ar: 'حبوب وبقوليات ومكرونة', f: 0, dEn: 'Beans, chickpeas and lentils up to 5 kg; basmati and white rice; penne and spaghetti.', dAr: 'فول وحمص وعدس وفاصوليا حتى 5 كجم؛ أرز بسمتي وأبيض؛ مكرونة قلم وإسباجيتي.', onEn: 'On the pack: Egyptian Product 100%', onAr: 'على الكيس: منتج مصري 100%' },
  { k: 'honey', en: 'Honey', ar: 'العسل', f: 0, dEn: 'Black honey and natural white honey, in 350 g and 875 g jars.', dAr: 'عسل أسود وعسل أبيض طبيعي في برطمانات 350 جم و875 جم.' },
  { k: 'coffee', en: 'Coffee (PURE Espresso)', ar: 'قهوة (بيور إسبريسو)', f: 0, dEn: 'Whole beans from our sister brand, PURE Espresso: Classico and single-origin Colombia, 1,000 g.', dAr: 'حبوب قهوة كاملة من علامتنا الشقيقة بيور إسبريسو: كلاسيكو وكولومبيا أحادية المصدر، 1,000 جم.', onEn: 'On the pack: Made in Italy', onAr: 'على الكيس: صُنع في إيطاليا' }
];

// [id, line, EN, AR, size key, has pack shot, description EN, description AR]
const RAW = [
  ['fish-solid', 'fish', 'Solid Tuna', 'تونة قطعة واحدة', 'tuna'],
  ['tuna-solid', 'fish', 'Solid Gold Yellowfin Tuna', 'تونة سوليد جولد يلوفين', 'tuna', 1, 'Yellowfin tuna packed as one solid piece and labelled premium white meat.', 'تونة يلوفين قطعة واحدة، لحم أبيض فاخر كما هو مدوّن على العلبة.'],
  ['tuna-chunk', 'fish', 'Chunk Tuna', 'تونة قطع', 'tuna', 1, 'Light-meat tuna in chunks, for salads, pasta and sandwiches.', 'تونة لحم فاتح قطع، للسلطات والمكرونة والسندوتشات.'],
  ['fish-chunk-spicy', 'fish', 'Chunk Tuna, spicy', 'تونة قطع حارة', 'tuna'],
  ['tuna-shredded', 'fish', 'Shredded Tuna', 'تونة مفتتة', 'tuna', 1, 'Light-meat tuna, shredded for fillings and spreads.', 'تونة لحم فاتح مفتتة، للحشوات والسندوتشات.'],
  ['fish-shredded-spicy', 'fish', 'Shredded Tuna, spicy', 'تونة مفتتة حارة', 'tuna'],
  ['fish-sardine', 'fish', 'Sardines', 'سردين', 'sardine'],
  ['fish-sardine-spicy', 'fish', 'Sardines, spicy', 'سردين حار', 'sardine'],
  ['fava-plain', 'canned', 'Plain Fava Beans', 'فول مدمس سادة', 'canned', 1, 'Egyptian ful medames, plain, ready to heat and dress your way.', 'فول مدمس سادة على الطريقة المصرية، جاهز للتسخين والتتبيل.'],
  ['fava-chili', 'canned', 'Fava Beans with Chilli', 'فول مدمس بالشطة', 'canned', 1, 'Fava beans with a chilli kick.', 'فول مدمس بلمسة حارة.'],
  ['fava-olive', 'canned', 'Fava Beans with Olive Oil', 'فول مدمس بزيت الزيتون', 'canned', 1, 'Fava beans finished with olive oil.', 'فول مدمس بزيت الزيتون.'],
  ['fava-salsa', 'canned', 'Fava Beans with Salsa', 'فول مدمس بالصلصة', 'canned'],
  ['fava-cumin', 'canned', 'Fava Beans with Cumin', 'فول مدمس بالكمون', 'canned'],
  ['fava-chickpeas', 'canned', 'Fava Beans with Chickpeas', 'فول مدمس بالحمص', 'canned', 1, 'Fava beans and chickpeas in one tin.', 'فول وحمص معًا في علبة واحدة.'],
  ['chickpeas', 'canned', 'Chickpeas', 'حمص حب', 'canned', 1, 'Whole chickpeas for salads, stews and hummus.', 'حمص حب للسلطات واليخنات والحمص.'],
  ['hummus-tahini', 'canned', 'Hummus with Tahina', 'حمص بالطحينة', 'canned', 1, 'Hummus with tahina, ready to serve as a dip.', 'حمص بالطحينة، جاهز للتقديم كغموس.'],
  ['mushroom-whole', 'canned', 'Whole Mushrooms', 'مشروم كامل', 'canned', 1, 'Whole button mushrooms for sauces, pizza and sautés.', 'مشروم كامل للصوصات والبيتزا والأطباق السوتيه.'],
  ['mushroom-pieces', 'canned', 'Mushrooms, pieces & stems', 'مشروم قطع وشرائح', 'canned', 1, 'Mushroom pieces and stems, kitchen-ready.', 'قطع وشرائح مشروم جاهزة للمطبخ.'],
  ['kidney-beans', 'canned', 'Red Kidney Beans', 'فاصوليا حمراء', 'canned', 1, 'Red kidney beans for stews, salads and rice dishes.', 'فاصوليا حمراء لليخنات والسلطات وأطباق الأرز.'],
  ['can-white-beans', 'canned', 'White Beans', 'فاصوليا بيضاء', 'canned'],
  ['mixed-veg', 'canned', 'Mixed Vegetables', 'خضار مشكل', 'canned', 1, 'Peas, carrots and corn, ready for rice and soups.', 'بسلة وجزر وذرة، جاهزة للأرز والشوربات.'],
  ['sweet-corn', 'canned', 'Sweet Corn', 'ذرة حلوة', 'canned', 1, 'Whole-kernel sweet corn.', 'حبوب ذرة حلوة كاملة.'],
  ['green-peas', 'canned', 'Green Peas', 'بسلة', 'canned', 1, 'Green peas, cooked and ready.', 'بسلة خضراء مطهية وجاهزة.'],
  ['black-eyed', 'canned', 'Black-Eyed Peas', 'لوبيا', 'canned', 1, 'Plain black-eyed peas, cooked and ready.', 'لوبيا سادة مطهية وجاهزة.'],
  ['fz-okra', 'frozen', 'Okra Zero', 'بامية زيرو', 'frozen', 1, 'Okra Zero: the small grade Egyptian kitchens ask for.', 'بامية زيرو: الحجم الصغير الذي تفضّله المطابخ المصرية.'],
  ['fz-okra-2', 'frozen', 'Okra', 'بامية', 'frozen'],
  ['fz-molokhia', 'frozen', 'Molokhia', 'ملوخية', 'frozen'],
  ['fz-green-beans', 'frozen', 'Green Beans', 'فاصوليا خضراء', 'frozen', 1, 'Cut green beans, frozen.', 'فاصوليا خضراء مقطعة ومجمدة.'],
  ['fz-green-peas', 'frozen', 'Peas', 'بسلة', 'frozen', 1, 'Frozen green peas.', 'بسلة خضراء مجمدة.'],
  ['fz-mixed-veg', 'frozen', 'Mixed Vegetables', 'خضار مشكل', 'frozen', 1, 'A frozen blend for sides, soups and rice.', 'خلطة خضار مجمدة للأطباق الجانبية والشوربات والأرز.'],
  ['fz-strawberry', 'frozen', 'Strawberries', 'فراولة', 'frozen', 1, 'Frozen strawberries for juices, desserts and bakery.', 'فراولة مجمدة للعصائر والحلويات والمخبوزات.'],
  ['fz-mango', 'frozen', 'Mango', 'مانجو', 'frozen', 1, 'Frozen mango for juices and desserts.', 'مانجو مجمدة للعصائر والحلويات.'],
  ['fz-fries-classic', 'fries', 'Pommes Frites (classic cut)', 'بطاطس بوم فريت', 'fries', 1, 'Pre-fried classic-cut fries.', 'بطاطس نصف مقلية بالقطع الكلاسيكي.'],
  ['fz-fries-thin', 'fries', 'Allumettes (thin cut)', 'بطاطس ألوميت', 'fries', 1, 'Pre-fried thin-cut fries.', 'بطاطس نصف مقلية بالقطع الرفيع.'],
  ['pz-cheese', 'pastry', 'Cheese Pizza', 'بيتزا بالجبنة', 'box'],
  ['pz-pepperoni', 'pastry', 'Pepperoni Pizza', 'بيتزا ببروني', 'box'],
  ['spring-rolls', 'pastry', 'Spring Rolls', 'سبرينج رولز', 'box'],
  ['ck-nuggets', 'chicken', 'Chicken Nuggets', 'قطع دجاج', 'box'],
  ['ck-nuggets-s', 'chicken', 'Chicken Nuggets, spicy', 'قطع دجاج حارة', 'box'],
  ['ck-strips', 'chicken', 'Chicken Strips', 'شرائح دجاج', 'box'],
  ['ck-strips-s', 'chicken', 'Chicken Strips, spicy', 'شرائح دجاج حارة', 'box'],
  ['ck-wings', 'chicken', 'Chicken Wings', 'أجنحة دجاج', 'box'],
  ['ck-wings-s', 'chicken', 'Chicken Wings, spicy', 'أجنحة دجاج حارة', 'box'],
  ['ck-fried', 'chicken', 'Fried Chicken Parts', 'دجاج مقلي', 'box'],
  ['oil-mix', 'sauces', 'Mixed Oil', 'زيت خليط', 'oil'],
  ['oil-sunflower', 'sauces', 'Sunflower Oil', 'زيت عباد الشمس', 'oil'],
  ['oil-corn', 'sauces', 'Corn Oil', 'زيت الذرة', 'oil'],
  ['oil-olive', 'sauces', 'Olive Oil', 'زيت الزيتون', 'oil'],
  ['sc-tomato-jar', 'sauces', 'Tomato Sauce, jar', 'صلصة طماطم (برطمان)', 'sauce'],
  ['sc-tomato-tin', 'sauces', 'Tomato Sauce, tin', 'صلصة طماطم (علبة)', 'sauce'],
  ['sc-ketchup', 'sauces', 'Ketchup', 'كاتشب', 'sauce'],
  ['sc-mayo', 'sauces', 'Mayonnaise', 'مايونيز', 'sauce'],
  ['gr-white-beans', 'grains', 'White Beans', 'فاصوليا بيضاء', 'pulse'],
  ['gr-chickpeas', 'grains', 'Chickpeas', 'حمص', 'pulse'],
  ['gr-brown-lentils', 'grains', 'Brown Lentils', 'عدس بني', 'pulse'],
  ['gr-yellow-lentils', 'grains', 'Yellow Lentils', 'عدس أصفر', 'pulse'],
  ['gr-fava', 'grains', 'Fava Beans', 'فول', 'pulse'],
  ['gr-basmati', 'grains', 'Basmati Rice', 'أرز بسمتي', 'grain'],
  ['gr-white-rice', 'grains', 'White Rice', 'أرز أبيض', 'grain'],
  ['gr-penne', 'grains', 'Penne Rigate', 'مكرونة قلم', 'grain'],
  ['gr-spaghetti', 'grains', 'Spaghetti', 'إسباجيتي', 'grain'],
  ['hn-black', 'honey', 'Black Honey', 'عسل أسود', 'honey'],
  ['hn-white', 'honey', 'White Honey', 'عسل أبيض', 'honey'],
  ['cf-classico', 'coffee', 'Classico, intensità 8/10', 'كلاسيكو، شدة 8/10', 'coffee'],
  ['cf-colombia', 'coffee', 'Colombia, single origin', 'كولومبيا، أحادية المصدر', 'coffee']
];
const P = RAW.map(([id, line, en, ar, size, img, dEn, dAr]) => ({ id, line, en, ar, size, img: !!img, dEn, dAr }));
const byId = id => P.find(p => p.id === id);
const lineOf = k => LINES.find(l => l.k === k);
const inLine = k => P.filter(p => p.line === k);

/* ---------- state ---------- */
let curLine = 'fish', query = '';
const quote = new Set((store.get('aqua-quote') || '').split(',').filter(id => byId(id)));
const saveQuote = () => store.set('aqua-quote', [...quote].join(','));

/* ---------- language ---------- */
const TITLE = ['Aqua Premium Foods | Premium Food. Global Supply.', 'أكوا بريميوم فودز | غذاء فاخر. توريد عالمي.'];
function swapAttr(el, attr, key) { const k = 'en' + key; if (el.dataset[k] === undefined) el.dataset[k] = el.getAttribute(attr) || ''; el.setAttribute(attr, LANG === 'ar' ? el.dataset['ar' + key] : el.dataset[k]); }
function applyLang(l, animate) {
  const run = () => {
    LANG = l; store.set('aqua-lang', l);
    root.lang = l; root.dir = l === 'ar' ? 'rtl' : 'ltr';
    $$('[data-ar]').forEach(el => { if (el.dataset.en === undefined) el.dataset.en = el.innerHTML; el.innerHTML = l === 'ar' ? el.dataset.ar : el.dataset.en; });
    $$('[data-ar-ph]').forEach(el => swapAttr(el, 'placeholder', 'Ph'));
    $$('[data-ar-label]').forEach(el => swapAttr(el, 'aria-label', 'Label'));
    $$('[data-ar-alt]').forEach(el => swapAttr(el, 'alt', 'Alt'));
    $$('.lang button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.l === l)));
    document.title = T(TITLE[0], TITLE[1]);
    renderAll();
  };
  if (animate && document.startViewTransition && !reduce) document.startViewTransition(run); else run();
}
$$('.lang button').forEach(b => b.addEventListener('click', () => { if (b.dataset.l !== LANG) applyLang(b.dataset.l, true); }));

/* ---------- header, menu, active section ---------- */
const hdr = $('#hdr'), burger = $('#burger'), mnav = $('#mnav');
const onScroll = () => hdr.classList.toggle('solid', scrollY > 8);
addEventListener('scroll', onScroll, { passive: true }); onScroll();
function setMenu(open) {
  mnav.classList.toggle('open', open); hdr.classList.toggle('menu-open', open);
  burger.setAttribute('aria-expanded', String(open)); mnav.inert = !open;
  document.body.style.overflow = open ? 'hidden' : '';
  if (open) mnav.querySelector('a').focus({ preventScroll: true });
}
burger.addEventListener('click', () => setMenu(!mnav.classList.contains('open')));
mnav.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
matchMedia('(min-width: 1181px)').addEventListener('change', e => { if (e.matches) setMenu(false); });
const links = $$('#menu a');
const secIO = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  links.forEach(a => a.setAttribute('aria-current', String(a.getAttribute('href') === '#' + e.target.id)));
}), { rootMargin: '-45% 0px -50% 0px' });
['range', 'catalogue', 'services', 'quality', 'offices'].forEach(id => { const s = document.getElementById(id); if (s) secIO.observe(s); });
new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(a => a.setAttribute('aria-current', 'false')); }), { rootMargin: '0px 0px -60% 0px' }).observe($('#top'));

/* ---------- parallax: packs drift against the page ---------- */
if (!reduce) {
  let raf = 0;
  const upd = () => {
    raf = 0;
    const wide = innerWidth > 980, vh = innerHeight;
    $$('[data-depth]').forEach(el => {
      if (!wide) { el.style.transform = ''; return; }
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      const c = (r.top + r.height / 2 - vh / 2) / vh;
      el.style.transform = `translate3d(0,${(c * -el.dataset.depth).toFixed(1)}px,0)`;
    });
  };
  const req = () => { if (!raf) raf = requestAnimationFrame(upd); };
  addEventListener('scroll', req, { passive: true }); addEventListener('resize', req); upd();
}

/* ---------- range index, shelf, frozen cluster ---------- */
function renderIndex() {
  $('#index').innerHTML = LINES.map(l => `<li><button type="button" data-goto="${l.k}"><b>${T(l.en, l.ar)}</b><small><span>${inLine(l.k).length} ${T('products', 'منتجًا')}</span>${ICON.arrow}</small></button></li>`).join('');
  $('#fLines').innerHTML = LINES.slice(0, 6).map(l => `<li><button type="button" data-goto="${l.k}">${T(l.en, l.ar)}</button></li>`).join('');
}
const SHELF = ['fava-plain', 'fava-olive', 'chickpeas', 'kidney-beans', 'black-eyed', 'mushroom-whole', 'mushroom-pieces', 'green-peas', 'sweet-corn', 'mixed-veg'];
function renderShelf() {
  const rest = inLine('canned').length - SHELF.length;
  $('#shelf').innerHTML = SHELF.map(id => { const p = byId(id); return `<button class="can" type="button" data-open="${id}"><img src="${IMG(id)}" alt="" width="440" height="720" loading="lazy"><span>${T(p.en, p.ar)}</span></button>`; }).join('') +
    `<button class="can more" type="button" data-goto="canned"><span><b>+${rest}</b>${T('more in the catalogue', 'أصناف أخرى في الكتالوج')}</span></button>`;
}
const CLUSTER = [['fz-fries-classic', 'b1', 519, 720, 30], ['fz-green-peas', 'b2', 698, 720, 60], ['fz-strawberry', 'b3', 692, 720, 44], ['fz-okra', 'b4', 693, 720, 76], ['fz-mango', 'b5', 694, 720, 96], ['fz-mixed-veg', 'b6', 693, 720, 64]];
function renderCluster() {
  $('#cluster').innerHTML = CLUSTER.map(([id, cls, w, h, d]) => { const p = byId(id); return `<button class="pk bag ${cls}" type="button" data-open="${id}" data-depth="${d}" aria-label="${T(p.en, p.ar)}"><img src="${IMG(id)}" alt="" width="${w}" height="${h}" loading="lazy"></button>`; }).join('');
}

/* ---------- catalogue ---------- */
function sizeText(p) {
  const rows = SIZES[p.size];
  if (rows && rows.length) return rows.map(r => T(r[0], r[1])).join(' · ');
  const n = SIZE_NOTE[p.size]; return n ? T(n[0], n[1]) : '';
}
const addLabel = id => { const on = quote.has(id), p = byId(id); return (on ? T('Remove from quote: ', 'إزالة من عرض السعر: ') : T('Add to quote: ', 'أضف إلى عرض السعر: ')) + T(p.en, p.ar); };
const addInner = id => (quote.has(id) ? ICON.check + T('Added', 'مُضاف') : ICON.plus + T('Add', 'أضف'));
function addBtn(id) {
  return `<button class="add" type="button" data-add="${id}" aria-pressed="${quote.has(id)}" aria-label="${addLabel(id)}">${addInner(id)}</button>`;
}
function rowHTML(p) {
  const other = LANG === 'ar' ? 'en' : 'ar';
  return `<li class="prow"><button class="nm" type="button" data-open="${p.id}"><span>${T(p.en, p.ar)}</span><span class="alt" lang="${other}">${T(p.ar, p.en)}</span></button><span class="sz">${sizeText(p)}</span>${addBtn(p.id)}</li>`;
}
function specTable(key, withCaption) {
  const rows = SIZES[key], cap = withCaption && CAPTION[key];
  const head = cap ? `<h4>${T(cap[0], cap[1])}</h4>` : '';
  if (!rows || !rows.length) return `<div class="spec-b">${head}<p class="na">${T('Pack sizes and container loads on request.', 'الأحجام وأرقام التحميل عند الطلب.')}</p></div>`;
  const th = [T('Pack', 'العبوة'), T('Units per carton', 'عبوة / كرتونة'), T('Cartons per 20ft', 'كرتونة / 20 قدم'), T('Pallets per 20ft', 'باليت / 20 قدم'), T('Cartons per 40ft', 'كرتونة / 40 قدم'), T('Pallets per 40ft', 'باليت / 40 قدم')];
  return `<div class="spec-b">${head}<div class="tscroll" tabindex="0" role="region" aria-label="${T('Container figures', 'أرقام التحميل')}"><table class="stable"><thead><tr>${th.map(h => `<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr><th scope="row">${T(r[0], r[1])}</th>${r.slice(2).map((v, i) => `<td data-l="${th[i + 1]}">${fmt(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div>`;
}
function renderLines() {
  $('#lines').innerHTML = LINES.map(l => `<button type="button" role="tab" id="tab-${l.k}" data-line="${l.k}" aria-selected="${!query && l.k === curLine}" tabindex="${!query && l.k === curLine ? 0 : -1}"><span>${T(l.en, l.ar)}</span><small>${inLine(l.k).length}</small></button>`).join('');
  $('#panel').setAttribute('aria-labelledby', query ? 'q' : 'tab-' + curLine);
}
function renderPanel() {
  const panel = $('#panel');
  if (query) {
    const q = query.toLowerCase();
    const res = P.filter(p => { const l = lineOf(p.line); return (p.en + ' ' + p.ar + ' ' + l.en + ' ' + l.ar).toLowerCase().includes(q); });
    panel.innerHTML = `<div class="ph"><h3>${T('Search results', 'نتائج البحث')}</h3><p class="ph-meta">${res.length} ${T(res.length === 1 ? 'product' : 'products', 'منتج')}</p></div>` +
      (res.length ? `<ul class="plist">${res.map(rowHTML).join('')}</ul>` : `<p class="empty">${T('No product matches that name. Try another word, or send us your list and we will check.', 'لا يوجد منتج بهذا الاسم. جرّب كلمة أخرى، أو أرسل لنا قائمتك وسنراجعها.')}</p>`);
    return;
  }
  const l = lineOf(curLine), items = inLine(curLine), pics = items.filter(p => p.img);
  const keys = [...new Set(items.map(p => p.size))], multi = keys.length > 1;
  panel.innerHTML =
    `<div class="ph"><div><h3>${T(l.en, l.ar)}</h3><p class="ph-alt" lang="${LANG === 'ar' ? 'en' : 'ar'}">${T(l.ar, l.en)}</p></div><p class="ph-meta">${items.length} ${T('products', 'منتجًا')} · ${l.f ? T('Frozen', 'مجمد') : T('Ambient', 'حرارة الغرفة')}</p></div>` +
    `<p class="ph-note">${T(l.dEn, l.dAr)}</p>` +
    (pics.length ? `<div class="packs">${pics.map(p => `<button type="button" data-open="${p.id}"><span class="pf"><img src="${IMG(p.id)}" alt="" loading="lazy"></span><span>${T(p.en, p.ar)}</span></button>`).join('')}</div>` : '') +
    `<ul class="plist">${items.map(rowHTML).join('')}</ul>` +
    keys.map(k => specTable(k, multi)).join('') +
    (l.onEn ? `<p class="onpack">${T(l.onEn, l.onAr)}</p>` : '');
}
function selectLine(k, focusTab) {
  curLine = k; query = ''; const q = $('#q'); if (q) q.value = '';
  renderLines(); renderPanel();
  if (focusTab) $('#tab-' + k).focus();
}
$('#lines').addEventListener('click', e => { const b = e.target.closest('[data-line]'); if (b) selectLine(b.dataset.line); });
$('#lines').addEventListener('keydown', e => {
  const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
  if (!(e.key in keys) && e.key !== 'Home' && e.key !== 'End') return;
  e.preventDefault();
  let i = LINES.findIndex(l => l.k === curLine), d = keys[e.key] || 0;
  if (LANG === 'ar' && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) d = -d;
  i = e.key === 'Home' ? 0 : e.key === 'End' ? LINES.length - 1 : (i + d + LINES.length) % LINES.length;
  selectLine(LINES[i].k, true);
});
let qTimer;
$('#q').addEventListener('input', e => { clearTimeout(qTimer); qTimer = setTimeout(() => { query = e.target.value.trim(); renderLines(); renderPanel(); }, 120); });

/* ---------- jump to a line ---------- */
document.addEventListener('click', e => {
  const g = e.target.closest('[data-goto]'); if (!g) return;
  if (g.dataset.goto) selectLine(g.dataset.goto);
  $('#catalogue').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
});

/* ---------- quote list ---------- */
function toggleQuote(id, force) {
  const on = force !== undefined ? force : !quote.has(id);
  on ? quote.add(id) : quote.delete(id); saveQuote();
  $$(`.add[data-add="${id}"]`).forEach(b => { b.setAttribute('aria-pressed', String(on)); b.setAttribute('aria-label', addLabel(id)); b.innerHTML = addInner(id); });
  renderQuote();
  if (drawerId === id) { const inFoot = $('#dFoot').contains(document.activeElement); renderDrawerFoot(); if (inFoot) $('#dFoot [data-add]').focus(); }
}
document.addEventListener('click', e => { const a = e.target.closest('[data-add]'); if (a) { e.stopPropagation(); toggleQuote(a.dataset.add); } });
function renderQuote() {
  const ids = [...quote], n = ids.length;
  $('#qlist').innerHTML = n ? ids.map(id => { const p = byId(id), l = lineOf(p.line); return `<li>${p.img ? `<img src="${IMG(id)}" alt="" loading="lazy">` : `<span class="qd" aria-hidden="true">${(T(p.en, p.ar)).charAt(0)}</span>`}<span><b>${T(p.en, p.ar)}</b><small>${T(l.en, l.ar)}</small></span><button type="button" data-rm="${id}" aria-label="${T('Remove', 'إزالة')}: ${T(p.en, p.ar)}">${ICON.x}</button></li>`; }).join('')
    : `<li class="q-empty">${T('Nothing added yet. Pick products from the catalogue, or describe what you need in the notes.', 'لم تُضف منتجات بعد. اختر من الكتالوج، أو اكتب ما تحتاجه في الملاحظات.')}</li>`;
  $('#trayTxt').textContent = T(`${n} ${n === 1 ? 'product' : 'products'} in your quote`, `${n} ${n === 1 ? 'منتج' : 'منتجات'} في عرض السعر`);
  $('#tray').classList.toggle('on', n > 0 && !inRequest);
}
$('#qlist').addEventListener('click', e => { const r = e.target.closest('[data-rm]'); if (r) toggleQuote(r.dataset.rm, false); });
let inRequest = false;
new IntersectionObserver(es => es.forEach(e => { inRequest = e.isIntersecting; $('#tray').classList.toggle('on', quote.size > 0 && !inRequest); }), { threshold: .15 }).observe($('#request'));

/* ---------- product drawer ---------- */
const drawer = $('#drawer'), scrim = $('#scrim');
let drawerId = null, lastFocus = null;
function renderDrawerFoot() {
  const on = quote.has(drawerId);
  $('#dFoot').innerHTML = `<button class="btn ${on ? 'ghost' : ''}" type="button" data-add="${drawerId}" aria-pressed="${on}">${on ? T('Remove from quote', 'إزالة من عرض السعر') : T('Add to quote', 'أضف إلى عرض السعر')}</button>${quote.size ? `<a class="btn ${on ? '' : 'ghost'}" href="#request" data-close>${T('Review request', 'راجع الطلب')} (${quote.size})</a>` : ''}`;
}
function openDrawer(id) {
  const p = byId(id); if (!p) return;
  const l = lineOf(p.line), other = LANG === 'ar' ? 'en' : 'ar';
  drawerId = id; lastFocus = document.activeElement;
  $('#dLine').textContent = T(l.en, l.ar);
  $('#dBody').innerHTML =
    (p.img ? `<figure class="d-fig"><img src="${IMG(id)}" alt="${T(p.en, p.ar)}"></figure>` : `<div class="d-plate" aria-hidden="true"><span lang="${other}">${T(p.ar, p.en)}</span></div>`) +
    `<h3 id="dTitle">${T(p.en, p.ar)}</h3><p class="d-alt" lang="${other}">${T(p.ar, p.en)}</p>` +
    (p.dEn ? `<p class="d-desc">${T(p.dEn, p.dAr)}</p>` : '') +
    `<dl class="d-facts"><div><dt>${T('Line', 'الخط')}</dt><dd>${T(l.en, l.ar)}</dd></div><div><dt>${T('Storage', 'التخزين')}</dt><dd>${l.f ? T('Frozen', 'مجمد') : T('Ambient', 'حرارة الغرفة')}</dd></div><div><dt>${T('Pack sizes', 'الأحجام')}</dt><dd>${sizeText(p)}</dd></div>${l.onEn ? `<div><dt>${T('On the pack', 'على العبوة')}</dt><dd>${T(l.onEn, l.onAr).replace(/^[^:]*:\s*/, '')}</dd></div>` : ''}<div><dt>${T('Brand', 'العلامة')}</dt><dd>${p.line === 'coffee' ? 'PURE Espresso' : T('Aqua Premium or private label', 'أكوا بريميوم أو علامة خاصة')}</dd></div></dl>` +
    specTable(p.size, false);
  renderDrawerFoot();
  drawer.inert = false; drawer.classList.add('on'); scrim.classList.add('on');
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => $('#dClose').focus({ preventScroll: true }));
}
function closeDrawer(keepFocus) {
  if (!drawerId) return;
  drawerId = null; drawer.classList.remove('on'); scrim.classList.remove('on'); drawer.inert = true;
  document.body.style.overflow = '';
  if (!keepFocus && lastFocus && lastFocus.isConnected) lastFocus.focus({ preventScroll: true });
}
document.addEventListener('click', e => {
  const o = e.target.closest('[data-open]'); if (o && !e.target.closest('[data-add]')) { openDrawer(o.dataset.open); return; }
  if (e.target.closest('[data-close]')) closeDrawer(true);
});
$('#dClose').addEventListener('click', () => closeDrawer()); scrim.addEventListener('click', () => closeDrawer());
addEventListener('keydown', e => {
  if (e.key === 'Escape') { if (drawerId) closeDrawer(); else if (mnav.classList.contains('open')) { setMenu(false); burger.focus(); } }
  if (e.key === 'Tab' && drawerId) {
    const f = $$('button, a[href], [tabindex="0"]', drawer).filter(el => el.offsetParent !== null);
    if (!f.length) return;
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  }
});

/* ---------- request form ---------- */
const COUNTRIES = ['United Arab Emirates', 'Egypt', 'Saudi Arabia', 'Kuwait', 'Qatar', 'Bahrain', 'Oman', 'Jordan', 'Lebanon', 'Iraq', 'Libya', 'Tunisia', 'Algeria', 'Morocco', 'Sudan', 'Kenya', 'Nigeria', 'South Africa', 'Turkey', 'United Kingdom', 'Germany', 'France', 'Netherlands', 'Italy', 'Spain', 'Greece', 'India', 'Pakistan', 'Malaysia', 'Singapore', 'China', 'Australia', 'United States', 'Canada'];
function renderCountries() {
  const s = $('#fCountry'), v = s.value;
  s.innerHTML = `<option value="">${T('Choose…', 'اختر…')}</option>` + COUNTRIES.map(c => `<option>${c}</option>`).join('') + `<option value="Other">${T('Other', 'أخرى')}</option>`;
  s.value = v;
}
const form = $('#form'), status = $('#status');
const REQ = ['fName', 'fCompany', 'fEmail', 'fCountry', 'fType'];
const bad = el => !el.value.trim() || (el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value.trim()));
form.addEventListener('submit', e => {
  e.preventDefault();
  let first = null;
  REQ.forEach(id => { const el = $('#' + id), b = bad(el); el.closest('.field').classList.toggle('err', b); el.setAttribute('aria-invalid', String(b)); if (b && !first) first = el; });
  if (first) { status.className = 'status show bad'; status.textContent = T('A few details are missing. Please check the highlighted fields.', 'بعض البيانات ناقصة. راجع الحقول المحددة.'); first.focus(); return; }
  const v = id => $('#' + id).value.trim() || '—';
  const items = [...quote].map(id => { const p = byId(id); return `- ${p.en} (${sizeText(p) || 'size on request'})`; }).join('\n') || '- (see notes)';
  const body = `QUOTE REQUEST — Aqua Premium Foods\n\nName: ${v('fName')}\nCompany: ${v('fCompany')}\nEmail: ${v('fEmail')}\nPhone: ${v('fPhone')}\nCountry: ${v('fCountry')}\nBusiness type: ${v('fType')}\nEstimated volume: ${v('fQty')}\nBrand: ${v('fBrand')}\n\nProducts:\n${items}\n\nNotes:\n${v('fMsg')}`;
  location.href = `mailto:info@pureibs.com?subject=${encodeURIComponent(`Quote request — ${v('fCompany')} (${v('fCountry')})`)}&body=${encodeURIComponent(body)}`;
  status.className = 'status show ok'; status.textContent = T('Your email app should now open with the request ready. If it does not, write to info@pureibs.com.', 'من المفترض أن يفتح تطبيق البريد الآن والطلب جاهز. إن لم يفتح، راسلنا على info@pureibs.com.');
});
REQ.forEach(id => $('#' + id).addEventListener('input', e => { if (!bad(e.target)) { e.target.closest('.field').classList.remove('err'); e.target.removeAttribute('aria-invalid'); } }));

/* ---------- boot ---------- */
function renderAll() {
  renderIndex(); renderShelf(); renderCluster(); renderLines(); renderPanel(); renderQuote(); renderCountries();
  if (drawerId) openDrawer(drawerId);
}
$('#yr').textContent = new Date().getFullYear();
applyLang(LANG, false);
})();
