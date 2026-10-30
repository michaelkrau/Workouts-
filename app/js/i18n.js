/**
 * Interface strings. Copy follows the brand voice: neutral, third person or
 * verbal nouns — never addressed to a man or a woman.
 */

export const LANGUAGES = [
  { code: 'he', native: 'עברית', dir: 'rtl', available: true },
  { code: 'en', native: 'English', dir: 'ltr', available: false },
  { code: 'ru', native: 'Русский', dir: 'ltr', available: false },
  { code: 'ar', native: 'العربية', dir: 'rtl', available: false },
];

const he = {
  tagline: 'כוח שנבנה בשקט.',
  welcomeLead: 'אימונים שנבנו מראש על ידי המאמן האישי — מותאמים לאביזר אחד ולזמן שיש.',
  chooseLanguage: 'בחירת שפת הממשק',
  comingSoon: 'בקרוב',
  continue: 'המשך',
  languageNote: 'הממשק, ההנחיות ותיאורי התרגילים יוצגו בשפה שנבחרה. ניתן לשנות בכל עת.',

  greetingMorning: 'בוקר טוב.',
  greetingNoon: 'צהריים טובים.',
  greetingEvening: 'ערב טוב.',
  greetingQuestion: 'מה בונים היום?',
  todaysWorkout: 'האימון של היום',
  byGoal: 'לפי מטרה',
  byMethod: 'לפי שיטה',
  all: 'הכול',
  noResults: 'אין אימונים שמתאימים לסינון הזה.',
  weekStreak: (n) => (n === 1 ? 'אימון אחד השבוע' : `${n} אימונים השבוע`),

  back: 'ספרייה',
  minutes: 'דקות',
  minShort: (n) => `${n} דק׳`,
  workRest: 'עבודה/מנוחה',
  rounds: 'סבבים',
  sets: 'סטים',
  equipment: 'אביזר',
  structure: 'מבנה האימון',
  exercises: 'תרגילים',
  exerciseCount: (n) => `${n} תרגילים`,
  includeWarmup: 'כולל חימום ושחרור',
  warmupNote: (w, c) => `+${w} דק׳ חימום, +${c} דק׳ שחרור`,
  easier: 'גרסה קלה',
  harder: 'גרסה מאתגרת',
  start: 'התחלת אימון',

  phase: {
    warmup: 'חימום',
    work: 'עבודה',
    rest: 'מנוחה',
    roundRest: 'מנוחה בין סבבים',
    set: 'סט',
    cooldown: 'שחרור',
  },
  breathe: 'נשימה',
  breatheCue: 'שאיפה דרך האף, נשיפה ארוכה דרך הפה. הכתפיים משוחררות.',
  roundOf: (r, t) => `סבב ${r} מתוך ${t}`,
  blockOf: (b, t) => `בלוק ${b} מתוך ${t}`,
  setOf: (s, t) => `סט ${s} מתוך ${t}`,
  secondsOf: (n) => `מתוך ${n} שניות`,
  repsLabel: (r) => (typeof r === 'number' ? `${r} חזרות` : r),
  nextUp: 'הבא בתור',
  lastOne: 'התרגיל האחרון',
  setDone: 'הסט הושלם',
  pause: 'השהיה',
  resume: 'המשך',
  previous: 'הקודם',
  skip: 'הבא',
  close: 'יציאה מהאימון',
  confirmExit: 'לצאת מהאימון? ההתקדמות לא תישמר.',
  stepOf: (i, t) => `שלב ${i} מתוך ${t}`,

  completeTitle: 'האימון הושלם.',
  completeLead: 'הגוף זוכר כל אימון.',
  workoutTime: 'זמן אימון',
  exercisesDone: 'תרגילים',
  effortQuestion: 'מה הייתה רמת המאמץ?',
  effortLow: 'קל מאוד',
  effortHigh: 'מקסימלי',
  notePlaceholder: 'הערה לאימון הבא (לא חובה)',
  saveFinish: 'שמירה וסיום',
};

const dictionaries = { he };

let current = he;

export function setLanguage(code) {
  current = dictionaries[code] ?? he;
}

export function t(key, ...args) {
  const path = key.split('.');
  let value = current;
  for (const p of path) value = value?.[p];
  if (typeof value === 'function') return value(...args);
  return value ?? key;
}
