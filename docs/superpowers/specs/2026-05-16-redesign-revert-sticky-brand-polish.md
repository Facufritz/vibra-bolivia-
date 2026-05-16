# Redesign — Revert sticky + brand-faithful polish

**Fecha:** 2026-05-16
**Rama destino:** `feature/landing-page`
**Tipo:** redesign (revert + 4 bloques de polish)

---

## Resumen

Después de implementar y revisar el sticky scroll stacking (commits `7697d7c` + `3606385`), el efecto "secciones que se superponen al scrollear" no convence — se siente que la página se traba. Este spec **revierte el sticky** y reemplaza el movimiento con 3 capas suaves que NO superponen, mientras **aproxima el sitio a la estética de los posters** de marca (chunky typography, sparkles amarillos, Chiru recurrente, density visual con pills naranjas).

Conservamos: Hero copy 2027 (`99c9344`) + Stats Chiru responsive (`8abce07`).

## Motivación

- "Sticky stacking" rompió el flujo natural de scroll. Las secciones bajan trabadas en vez de fluir.
- El sitio actual usa los assets de marca de forma decorativa pero no replica la energía visual de los posters (`ya tenemos fecha.jpg`, `preventa 1440.jpg`).
- Necesitamos: scroll lineal natural + más vida (animaciones de entrada) + más marca (sparkles, pills, Chiru, typography chunky).

## Bloque 1 — Revert sticky + nueva capa de motion

### Revert

Los siguientes commits se revierten (vía nuevos commits que deshacen sus cambios, no `git reset`):
- `7697d7c` — feat(sections): sticky scroll stacking with progressive overlay
- `3606385` — feat(hero): make Hero sticky with progressive dark overlay

Resultado del revert: `SectionWrapper.tsx` vuelve a `position: relative`, sin overlay oscuro, sin rounded-t-3xl, sin -mt-6. `Hero.tsx` vuelve a `h-screen` con su layout actual.

Tests asociados al sticky se borran (`SectionWrapper.test.tsx` por completo; tests de sticky en `Hero.test.tsx` — los otros 3 de copy y posición se conservan).

### Nueva capa de motion (3 técnicas, sin superposición)

#### 1.1 Reveal-on-scroll en cada sección

`SectionWrapper` envuelve a sus children con un `<motion.div>` que aplica fade-up cuando entra al viewport.

```tsx
const inViewRef = useRef(null)
const isInView = useInView(inViewRef, { once: true, amount: 0.2 })

// ...

<motion.div
  ref={inViewRef}
  initial={{ opacity: 0, y: 30 }}
  animate={isInView ? { opacity: 1, y: 0 } : {}}
  transition={{ duration: 0.6, ease: 'easeOut' }}
>
  {children}
</motion.div>
```

- `once: true` — el reveal corre una sola vez por sección (no re-anima al scrollear hacia atrás)
- `amount: 0.2` — dispara cuando el 20% de la sección está visible
- Respeta `prefers-reduced-motion`: si `useReducedMotion()` es true, el wrapper renderiza children sin animación

#### 1.2 Parallax sutil de nubes (refuerzo)

Las nubes en `SectionWrapper` con `parallax` prop ya usan `useScroll` + `useTransform` para vertical drift. Lo reforzamos:

- Rango actual: `['-15px', '15px']` → mantener
- Verificar que aplique en todas las secciones que ya tienen `clouds parallax` (Stats, Aftermovie, Spotify, EmailRegister)

#### 1.3 Stagger interno

En Stats, los 4 `<StatItem>` aparecen escalonados:

```tsx
{STATS.map((stat, i) => (
  <motion.div
    key={stat.label}
    initial={{ opacity: 0, y: 20 }}
    animate={triggered ? { opacity: 1, y: 0 } : {}}
    transition={{ duration: 0.5, delay: i * 0.1 }}
  >
    <StatItem {...stat} trigger={triggered} />
  </motion.div>
))}
```

Delay: 0ms, 100ms, 200ms, 300ms. Trigger ya disparado por el `IntersectionObserver` existente.

En Timeline: los dots de navegación con stagger inicial (0.05s entre cada uno) al primer mount.

En EmailRegister: el form fade-up con delay 0.2s después del título.

## Bloque 2 — Tipografía + sparkles

### 2.1 Tratamiento de H2s de sección

**Estilo nuevo:**

```tsx
<h2 className="font-display text-4xl md:text-5xl text-white tracking-wider section-title">
  ...
</h2>
```

Con CSS custom en `globals.css`:

```css
.section-title {
  -webkit-text-stroke: 1.5px #4FC3F7;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}
```

Aplica a los H2s de: Stats, Aftermovie, Timeline, Spotify, EmailRegister.

**No aplica a:**
- Hero (tiene su propio tratamiento con el logo PNG y la frase)
- Stats numbers (tienen otro tratamiento — ver 2.3)

### 2.2 Subtitle "★ ★ ★ EDICIÓN ★ ★ ★"

Reemplaza algunos subtítulos genéricos por una eyebrow tipo poster:

```tsx
<p className="font-display text-sm md:text-base text-white/70 tracking-[0.3em] text-center mb-12">
  ★ ★ ★ SEGUNDA EDICIÓN ★ ★ ★
</p>
```

**Reglas explícitas por sección:**

| Sección | Acción | Resultado final (orden de elementos) |
|---|---|---|
| Stats | **Agregar** star eyebrow | pill → h2 → ★ ★ ★ SEGUNDA EDICIÓN ★ ★ ★ → grid |
| Aftermovie | **Reemplazar** "Vibra Bolivia 2026 — Aftermovie Oficial" con star eyebrow | pill → h2 → ★ ★ ★ AFTERMOVIE OFICIAL ★ ★ ★ → iframe |
| Timeline | **No agregar**; mantener "Usá ← → o tocá los puntos para navegar" como hint | pill → h2 → hint actual → slider |
| Spotify | **No agregar**; mantener "Escuchá la playlist oficial de Vibra Bolivia" | pill → h2 → subtitle actual → iframe |
| EmailRegister | **No agregar**; mantener "Dejá tu mail y te avisamos cuando abramos la preventa del 2027." | pill → h2 → subtitle actual → form |

Criterio: star eyebrow solo donde no hay un subtítulo descriptivo útil ya (Stats no tiene; Aftermovie tiene uno redundante con el pill). Las otras secciones tienen subtítulos que aportan info real (hints, CTA) — se mantienen.

### 2.3 Stats numbers — chunky 3D

```tsx
<p className="font-display text-5xl md:text-7xl text-vibra-orange chunky-3d">
  {value >= 1000 ? count.toLocaleString('es-AR') : count}{suffix}
</p>
```

Con CSS:

```css
.chunky-3d {
  text-shadow: 3px 3px 0 #000, 4px 4px 12px rgba(0, 0, 0, 0.3);
}
```

Reemplaza el `drop-shadow-lg` actual.

### 2.4 Sparkles flotantes en headers

Componente nuevo: `src/components/Sparkles.tsx`. Renderiza 4-5 sparkles SVG amarillos (#FFD700) posicionados absolute dentro de un contenedor. Cada uno con su propio delay de animación "twinkle".

```tsx
'use client'
import { motion } from 'framer-motion'

const SPARKLES = [
  { size: 14, top: '0%', left: '5%', delay: 0 },
  { size: 10, top: '20%', right: '8%', delay: 0.4 },
  { size: 16, bottom: '10%', left: '15%', delay: 0.8 },
  { size: 8, bottom: '0%', right: '20%', delay: 1.2 },
  { size: 12, top: '50%', left: '90%', delay: 1.6 },
]

export default function Sparkles() {
  return (
    <>
      {SPARKLES.map((s, i) => (
        <motion.svg
          key={i}
          viewBox="0 0 24 24"
          width={s.size}
          height={s.size}
          fill="#FFD700"
          style={{ position: 'absolute', ...s }}
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: s.delay, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          <path d="M12 2l1.5 6.5L20 10l-6.5 1.5L12 18l-1.5-6.5L4 10l6.5-1.5L12 2z" />
        </motion.svg>
      ))}
    </>
  )
}
```

Se usa envolviendo el bloque del título de cada sección en un wrapper `relative` para que los sparkles posicionen contra ese contenedor.

Aplica a: Stats, Aftermovie, Timeline, Spotify, EmailRegister (no Hero).

## Bloque 3 — Chiru placements

Tres apariciones de Chiru:

### 3.1 Hero — entre las nubes (nuevo)

En `Hero.tsx`, agregar al lado de las 5 nubes existentes:

```tsx
<Image
  src="/assets/branding/Chiru%20png%20.png"
  alt=""
  width={144}
  height={144}
  className="absolute top-12 right-12 md:right-24 z-35 w-24 md:w-36 opacity-85 animate-float hidden md:block"
  aria-hidden="true"
/>
```

- Solo desktop (`hidden md:block`). En mobile, el Hero ya está cargado.
- Z-index 35 (entre nubes z-30 y content z-40)
- `animate-float` (ya existe en Tailwind config)

### 3.2 Stats — actual (sin cambios)

Mantener exactamente como quedó tras Task 2 (`8abce07`): desktop esquina inferior derecha (`hidden md:block absolute bottom-16 right-16 w-48 ...`), mobile centrado debajo de la grilla (`md:hidden flex justify-center mt-12 w-32 ...`).

### 3.3 EmailRegister — guardián del mail (nuevo)

Dos `<Image>` con visibilidad responsive (mismo patrón que Stats):

```tsx
{/* Chiru desktop — al lado del form */}
<div className="hidden lg:block absolute left-4 top-1/2 -translate-y-1/2 w-40 lg:w-52 pointer-events-none">
  <Image
    src="/assets/branding/Chiru%20png%20.png"
    alt=""
    width={208}
    height={208}
    className="animate-float"
    aria-hidden="true"
  />
</div>

{/* Chiru mobile — arriba del título */}
<div className="lg:hidden flex justify-center mb-6 pointer-events-none">
  <Image
    src="/assets/branding/Chiru%20png%20.png"
    alt=""
    width={128}
    height={128}
    className="w-32 animate-float"
    aria-hidden="true"
  />
</div>
```

- Desktop: `lg:` breakpoint (no `md:`) para tener más espacio horizontal antes de mostrarlo
- Mobile: arriba del logo Vibra Bolivia que ya hay en EmailRegister, no abajo

## Bloque 4 — Visual density

### 4.1 Pill badges naranjas sobre cada H2

Componente nuevo: `src/components/SectionPill.tsx`.

```tsx
interface SectionPillProps {
  children: React.ReactNode
}

export default function SectionPill({ children }: SectionPillProps) {
  return (
    <div className="inline-block bg-vibra-orange text-black font-display text-xs md:text-sm tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-4">
      {children}
    </div>
  )
}
```

Aplicado por sección:

| Sección | Pill text |
|---|---|
| Stats | `★ 2DA EDICIÓN ★` |
| Aftermovie | `★ AFTERMOVIE OFICIAL ★` |
| Timeline | `★ LINE UP 2026 ★` |
| Spotify | `★ PLAYLIST OFICIAL ★` |
| EmailRegister | `★ PREVENTA 2027 ★` |

Se renderiza antes del `<h2>` en cada sección. **Sin emojis** (las estrellas Unicode son más consistentes entre SO).

### 4.2 Refuerzo de borders en bloques destacados

- **Aftermovie** iframe wrapper: `border-2 border-vibra-orange/80` (era `/60`) + `shadow-[0_0_50px_rgba(245,160,32,0.3)]` (era `0.25`)
- **Spotify** iframe wrapper: `border-2 border-vibra-blue/70` (era `/50`) + `shadow-[0_0_50px_rgba(79,195,247,0.25)]` (era `0.2`)
- **Timeline** cover de artista: agregar `border-2 border-vibra-orange/40` (hoy es `border border-white/10`)

### 4.3 Divisor decorativo entre secciones

Componente nuevo: `src/components/SectionDivider.tsx`.

```tsx
export default function SectionDivider() {
  return (
    <div className="flex items-center justify-center py-6 text-white/30 text-sm tracking-[0.5em]">
      ★ ✦ ★ ✦ ★
    </div>
  )
}
```

Se inserta en `page.tsx` entre cada par de secciones (Hero→Stats, Stats→Aftermovie, Aftermovie→Timeline, Timeline→Spotify, Spotify→EmailRegister). No entre el último y nada.

Si visualmente queda "ruidoso", se puede sacar — es el más opcional del Bloque 4.

### 4.4 EmailRegister form — branding más fuerte

```tsx
<input
  className="flex-1 px-6 py-4 rounded-full bg-white/10 border-2 border-vibra-orange/60 text-white placeholder-white/40 focus:outline-none focus:border-vibra-orange focus:shadow-[0_0_20px_rgba(245,160,32,0.4)] text-lg transition-all"
  ...
/>

<button
  className="px-8 py-4 bg-vibra-orange text-white font-display text-xl tracking-wider rounded-full hover:opacity-90 disabled:opacity-60 transition whitespace-nowrap chunky-3d"
  ...
>
  ...
</button>
```

- Input: border subido a `border-2 border-vibra-orange/60`, focus con glow naranja
- Button: agrega clase `chunky-3d` (la del Bloque 2.3) al texto del button

### 4.5 Stats — frame contenedor opcional

Envolver la grilla de 4 stats en una "tarjeta de logros":

```tsx
<div className="rounded-3xl bg-black/10 backdrop-blur-sm p-8 md:p-12 border border-white/10">
  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
    {STATS.map(...)}
  </div>
</div>
```

Si visualmente queda demasiado "boxy", se puede sacar el `bg-black/10 backdrop-blur-sm` y dejar solo el `rounded-3xl border border-white/10`. Decisión visual en QA.

## Lo que NO cambia

- Paleta de marca (orange/pink/purple/blue)
- Estructura y orden de las secciones (Hero → Stats → Aftermovie → Timeline → Spotify → EmailRegister)
- API de Supabase, route.ts
- Lógica interna de cada componente (count-up, slider, iframes, form submit)
- Fondo `vibra-texture` + overlay `bg-vibra-purple/30`
- Hero copy "2027 viene con todo / Algo grande se está armando" — se conserva del Task 1
- Stats Chiru responsive — se conserva del Task 2
- Reduced-motion fallback (las nuevas animaciones también lo respetan)

## Archivos afectados

| Archivo | Acción |
|---|---|
| `src/components/SectionWrapper.tsx` | Revertir sticky + agregar reveal-on-scroll wrapper |
| `src/components/Hero.tsx` | Revertir sticky/overlay + agregar Chiru entre nubes |
| `src/components/Stats.tsx` | Agregar pill + sparkles + stagger + chunky-3d en números + frame opcional |
| `src/components/Aftermovie.tsx` | Agregar pill + sparkles + reforzar border |
| `src/components/Timeline.tsx` | Agregar pill + sparkles + border en cover + stagger en dots |
| `src/components/SpotifyPlayer.tsx` | Agregar pill + sparkles + reforzar border |
| `src/components/EmailRegister.tsx` | Agregar pill + sparkles + Chiru responsive + form branding |
| `src/components/Sparkles.tsx` | **Nuevo** — componente decorativo |
| `src/components/SectionPill.tsx` | **Nuevo** — componente pill |
| `src/components/SectionDivider.tsx` | **Nuevo** — divisor decorativo entre secciones |
| `src/app/globals.css` | Agregar clases `.section-title` y `.chunky-3d` |
| `src/app/page.tsx` | Insertar `<SectionDivider />` entre secciones |
| `__tests__/components/Hero.test.tsx` | Eliminar tests de sticky/overlay (mantener 3 de copy/posición) |
| `__tests__/components/SectionWrapper.test.tsx` | Eliminar (o reescribir con tests del reveal wrapper) |
| `__tests__/components/Stats.test.tsx` | Mantener (sigue probando Chiru responsive) |

## Accesibilidad

- `prefers-reduced-motion: reduce` → todas las animaciones nuevas (reveal, stagger, sparkles, parallax) se desactivan. Componentes renderean sin movimiento, las decoraciones (sparkles) quedan estáticas.
- Sparkles tienen `aria-hidden="true"` (decorativos)
- Chirus nuevos tienen `alt=""` + `aria-hidden="true"` (decorativos, no informativos)
- Pills tienen texto leíble, no requieren `role="badge"` (son visuales, el `<h2>` adjacente comunica la sección al AT)

## Plan de verificación

Tras implementar:

1. `npm run dev` y navegar la landing en desktop + mobile (DevTools responsive)
2. Confirmar revert: scroll fluye lineal, no hay superposición de secciones
3. Confirmar reveal-on-scroll: cada sección hace fade-up al entrar al viewport
4. Confirmar parallax sutil: nubes drift al scrollear
5. Confirmar stagger: Stats numbers aparecen escalonados, Timeline dots también
6. Confirmar typography: H2s con stroke cyan + drop-shadow, stats numbers chunky 3D
7. Confirmar sparkles: 4-5 estrellitas amarillas titilando alrededor de cada H2 (no Hero)
8. Confirmar pills: badge naranja antes de cada H2 con texto correcto
9. Confirmar Chirus: 3 apariciones (Hero entre nubes, Stats como está, EmailRegister responsive)
10. Confirmar borders reforzados en Aftermovie/Spotify/Timeline cover
11. Confirmar divisores ★ ✦ ★ ✦ ★ entre secciones (5 divisores)
12. Confirmar EmailRegister: input border naranja, focus con glow, button chunky-3d
13. Confirmar reduced-motion: activar en DevTools, todas las animaciones se quietan
14. `npm test` — tests verdes (algunos eliminados, algunos nuevos)
15. `npm run build` — compila sin errores

## Riesgos

- **Sparkles performance**: 5 sparkles × 5 secciones = 25 animaciones simultáneas con framer-motion. Cada una es ligera (transform: scale + opacity), debería estar OK. Si hay jank, reducir a 3 sparkles por sección.
- **SectionDivider visual**: puede sentirse ruidoso si hay muchos. Decisión final en QA — fácil de sacar.
- **Stats frame opcional**: si queda "boxy", se saca el bg/blur y queda solo el border.
- **Chiru en Hero ente nubes**: si tapa el video o se mezcla raro con las 5 nubes existentes, mover de posición o sacar.

## Salida esperada

- Scroll lineal natural (cada sección entera, bajando junto con la página)
- Cada sección con su propia "entrada" sutil (reveal + stagger)
- Estética cercana a los posters: cyan stroke en títulos, sparkles amarillos, pills naranjas, Chiru recurrente, chunky 3D en números
- Cero sticky stacking
- Accesibilidad preservada
