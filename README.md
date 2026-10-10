# Yaan — Landing Page

**Yaan** — Sanskrit for *vehicle*, from Chandrayaan and Mangalyaan.
Landing page for Yaan: the bridge between upcoming vehicle technology and the cars already on the road.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in /dist
```

Requires Node 18+.

## Page flow

| Section | Idea | Vehicle-tech element |
|---|---|---|
| Loader | Ignition | RPM gauge revs up → "ENGINE ON" |
| Nav | Sections | Automatic gear selector **P · R · N · D** |
| Hero | Title slide + why "Yaan" | "YAAN" drawn stroke-by-stroke with three satellites orbiting it (Chandrayaan → Moon, Mangalyaan → Mars, the car = Yaan), then Chandra + Yaan → Mangal + Yaan → Yaan explanation cards |
| 02 The Bridge | Old cars ↔ new innovation | Scroll-driven bridge builds itself, car drives across, headlights switch on |
| 03 Modules | 5 features | HUD instrument panels |
| 04 Orbit Raising | Cars first → every vehicle | Mangalyaan-style orbit-raising spiral |
| 05 Launch | Waitlist | Push-button **ENGINE START** |
| Always on | Scroll progress | Speedometer bottom-right (0–180 km/h) |

### The five modules
1. **Yaan Tag** — QR sticker; public reaches the owner via WhatsApp / SMS / masked call.
2. **Yaan Spark** — making non-tech cars smart. Shown as **CLASSIFIED** — the page never says how it works.
3. **Yaan Price** — fuel, service and spare-part prices; fair-price quote check.
4. **Yaan Care** — primary health care: diagnosis, health score, alerts.
5. **Yaan Passbook** — RC, insurance, PUC, tolls, fuel and service bills in one ledger.

## Editing

- Copy for each module: `src/components/Modules.jsx` (`MODULES` array)
- Module graphics: `src/components/ModuleVisuals.jsx`
- Colours & fonts: top of `src/styles.css` (`:root`)
- Prices shown in Yaan Price are **illustrative** — update `ROWS` in `ModuleVisuals.jsx`.

## Waitlist form

`src/components/Launch.jsx` → `submit()` currently only shows a success state. Connect it to Supabase, a Google Form, or any API to actually store sign-ups.

## Stack
React 18 · Vite 5 · Framer Motion · hand-drawn SVG (no image assets)
