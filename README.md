# מציאות מבצעית — דמו ממשק (Frontend Only)

מוקאפ אינטראקטיבי (UI בלבד, ללא backend אמיתי) של מסך "תמונת מצב גזרה" — כולל מפה, שכבות מידע, פאנל תובנות מבוסס AI עם צ'אט וגרפים, כרטיסי אירועים ותהליך דיווח. כל הנתונים הם נתוני דמו קבועים בקוד (`src/data.ts`) לצורכי פורטפוליו/הדגמה בלבד.

## הרצה מקומית

```bash
npm install
npm run dev
```

## בנייה לפרודקשן

```bash
npm run build
npm run preview
```

## מבנה הפרויקט

- `src/data.ts` — כל נתוני הדמו (אירועים, שכבות, גרפים, תשובות הצ'אט).
- `src/components/TopBar.tsx` — סרגל עליון.
- `src/components/MapView.tsx` — מפת Leaflet (Esri World Imagery עם נפילה ל-OpenStreetMap) ושכבות המידע.
- `src/components/FilterBar.tsx` — סרגל סינונים צף, פאנל תיעוד מבצעי ומקרא השכבות.
- `src/components/AiPanel.tsx` — פאנל "סוכן גזרה מבצעית": סיכום, אירועים, דיווח על אי־דיוק, גרפים וצ'אט.
- `src/components/EventListOverlay.tsx`, `src/components/EventCardModal.tsx` — רשימת אירועים וכרטיס אירוע בודד.

נבנה עם Vite + React + TypeScript.
