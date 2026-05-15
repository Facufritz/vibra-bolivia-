# Hero 2027 + sticky scroll stacking — design spec

**Fecha:** 2026-05-15
**Rama destino:** `feature/landing-page`
**Tipo:** mejora estética (polish, no redesign)

---

## Resumen

Dos cambios coordinados a la landing de Vibra Bolivia:

1. **Hero pivota a anunciar 2027.** El copy cambia para teasear la 3ra edición (sin fecha). Layout, video, nubes y posición quedan exactamente igual a hoy.
2. **Sticky scroll stacking entre secciones.** Cada sección queda fija en la parte de arriba mientras la siguiente sube por encima con esquinas redondeadas, sombra sutil y un overlay oscuro progresivo. Reemplaza el scroll plano actual sin tocar fondos ni paleta.

El fondo de cada sección (textura andina `fondo.jpg` + overlay `bg-vibra-purple/30`) **se mantiene igual**. La variedad visual entre secciones la aporta el movimiento, no el color.

## Motivación

- El Hero actual ("El festival que le devolvió la música a Bolivia") apunta al pasado. La landing es de hype para 2027, debe anunciarlo.
- Las 6 secciones del scroll actual se ven idénticas (mismo fondo, mismo overlay), generando monotonía. Sticky stacking rompe esa sensación sin tocar la paleta que el cliente quiere conservar.

## Cambio 1 — Hero copy + layout mobile

### Cambio de copy

**Antes:**
```tsx
<p className="font-display text-2xl md:text-4xl lg:text-5xl text-white tracking-wide drop-shadow-lg leading-tight">
  El festival que le devolvió<br className="hidden md:block" /> la música a Bolivia
</p>
```

**Después:**
```tsx
<p className="font-display text-2xl md:text-4xl lg:text-5xl text-white tracking-wide drop-shadow-lg leading-tight">
  <span className="text-vibra-orange">2027</span> viene con todo<br />
  Algo grande se está armando
</p>
```

- "2027" en `text-vibra-orange` (#F5A020).
- `<br />` **siempre visible** (mobile y desktop) para mantener dos líneas cortas en cualquier viewport. (Antes el `<br>` tenía `hidden md:block` y en mobile el texto era una sola línea larga.)

### Cambio de posición del logo en mobile

**Antes:** logo verticalmente centrado (`top-1/2 -translate-y-1/2`), tanto mobile como desktop.

**Después:** en mobile el contenido (logo + frase) va **arriba a la izquierda** (`top-24 left-4`), en desktop sigue centro-izquierda como hoy.

```tsx
<motion.div
  className="absolute top-24 left-4 md:top-1/2 md:-translate-y-1/2 md:left-16 lg:left-24 z-40 max-w-xl"
  ...
>
```

Esto saca el contenido del medio del video en mobile y deja más aire abajo (donde hay caras/acción del aftermovie que se ven mejor sin texto encima).

**Archivo afectado:** `src/components/Hero.tsx` (copy + posición). El mismo archivo también recibe cambios estructurales del Cambio 2 (sticky + overlay), pero esos son independientes.

## Cambio 2 — Sticky scroll stacking

### Comportamiento

Al hacer scroll, cada sección queda fija en `top: 0` mientras la siguiente sube por encima:

- Cada sección tiene `min-height: 100vh`
- Cada sección tiene `position: sticky; top: 0`
- Cada sección (excepto la primera) tiene `border-radius: 24px 24px 0 0` en su esquina superior
- Cada sección tiene `box-shadow: 0 -20px 40px rgba(0,0,0,.15)` (sombra sutil arriba)
- Cada sección (excepto la primera) tiene `margin-top: -24px` para que la siguiente arranque tapando un toque la anterior

### Overlay oscuro progresivo

A medida que la siguiente sección cubre a la anterior, la anterior se va oscureciendo:

- Cada sección renderiza un `<motion.div>` overlay negro (`bg-black`) posicionado `absolute inset-0` con `z-index` arriba del contenido pero debajo de la decoración pegada al borde
- La `opacity` del overlay se interpola de `0` a `0.35` usando `useScroll` con `offset: ['start start', 'end start']`:
  - `start start` = top de la sección toca top de viewport (sticky empieza, opacity 0)
  - `end start` = bottom de la sección toca top de viewport (sección totalmente cubierta, opacity 0.35)
- Implementado con `useTransform(scrollYProgress, [0, 1], [0, 0.35])`

### Reducción de movimiento

Si el usuario tiene `prefers-reduced-motion: reduce`, se desactiva el sticky (`position: relative`) y se omite el overlay oscuro. La página vuelve a scroll lineal sin animación. Accesibilidad estándar.

### Mobile

Mismo comportamiento que desktop. **No se atenúa.** Variant D queda activa: borde redondeado + sombra sutil + overlay oscuro progresivo. Probado en demo standalone que la experiencia es fluida.

### Archivos afectados

#### `src/components/SectionWrapper.tsx`
- Agregar `sticky top-0 min-h-screen` al `<section>` raíz
- Agregar `rounded-t-3xl shadow-[0_-20px_40px_rgba(0,0,0,0.15)] -mt-6` a la sección (con variante para la primera/Hero que no necesita radius ni margen negativo via prop `isFirst`)
- Agregar `<motion.div>` con overlay oscuro y `useTransform` mapeando `scrollYProgress` a opacity (0 → 0.35)
- Respetar `prefers-reduced-motion`: hook `useReducedMotion` de framer-motion, si true → desactivar sticky y overlay

#### `src/components/Hero.tsx`
- Hoy es un `<section>` standalone (no usa SectionWrapper) con `h-screen overflow-hidden`
- Cambiar a `sticky top-0 min-h-screen overflow-hidden`
- Agregar el mismo overlay oscuro progresivo via `motion.div` + `useScroll` + `useTransform`
- Respetar reduced motion igual que SectionWrapper
- NO necesita rounded-t ni margin-top negativo (es la primera)

#### `src/app/page.tsx`
- El `<main>` no puede tener `overflow-hidden` (rompería sticky). Verificar; hoy no lo tiene, OK.
- Agregar `position: relative` explícito al `<main>` por claridad.

#### `src/app/globals.css`
- `body` tiene `overflow-x: hidden`. Esto **no** rompe sticky (solo `overflow-y` lo rompería). Sin cambios.

## Cambio 3 — Reposicionar Chiru en Stats (mobile)

### Problema

Hoy Chiru en Stats está `absolute bottom-16 right-4 md:right-16 w-32 md:w-48`. En mobile se monta sobre el texto "EDICIONES" del 4to stat. Visible en screenshots actuales.

### Solución

Chiru cambia de comportamiento según viewport:

- **Mobile (`< md`):** sale del `absolute` y se renderiza como bloque **centrado debajo de la grilla de stats**. Tamaño chico-medio (`w-32`).
- **Desktop (`md+`):** queda donde está hoy (`absolute bottom-16 right-16 w-48`).

Esto requiere mover el `<Image>` de Chiru fuera del bloque `absolute` cuando el viewport es mobile. Dos opciones de implementación:

**Opción A (preferida):** renderizar Chiru dos veces con clases `hidden`/`block` responsivas — uno para mobile (block en flujo abajo), otro para desktop (absolute como hoy). Misma fuente de imagen.

**Opción B:** un solo `<Image>` con clases responsive que cambian de `absolute` a `static` y posición. Más concisa pero más frágil con Tailwind.

Implementación va con **Opción A** por claridad.

```tsx
{/* Chiru desktop — solo md+ */}
<div className="hidden md:block absolute bottom-16 right-16 w-48 pointer-events-none z-40">
  <Image src="..." width={192} height={192} className="animate-float" />
</div>

{/* Chiru mobile — centrado debajo de la grilla */}
<div className="md:hidden flex justify-center mt-12 w-32 mx-auto pointer-events-none">
  <Image src="..." width={128} height={128} className="animate-float" />
</div>
```

**Archivo afectado:** `src/components/Stats.tsx`.

## Lo que NO cambia

- Paleta de marca, fonts, textura de fondo, overlay morado base
- Estructura y orden de las secciones
- Lógica interna de Stats, Aftermovie, Timeline, Spotify, EmailRegister (count-up, slider, iframes, form)
- Assets decorativos (nubes, pasto, montañas)
- API de Supabase y `route.ts`
- Tests existentes en `__tests__/`

## Detalles técnicos

### Z-index dentro de cada sección

Hoy SectionWrapper usa:
- `z-0`: textura
- `z-10`: nubes + montañas decorativas
- `z-20`: pasto decorativo
- `z-30`: contenido (children)

Agregamos:
- `z-40`: overlay oscuro progresivo (sobre todo, incluso decoración)

### Padre sin overflow:hidden

Sticky positioning falla si cualquier ancestor tiene `overflow: hidden` (o `overflow: clip/auto/scroll`). Cadena actual:
- `<html>` — sin overflow rules
- `<body>` — `overflow-x: hidden` (solo X, no rompe sticky Y)
- `<main>` — sin overflow rules
- `<section>` (cada uno) — `overflow: hidden` (en el sticky element está OK, solo rompe si está en un ancestor)

Conclusión: la cadena es válida. No hay que tocar overflow en ningún lado.

### Casos edge

- **Anchor link al EmailRegister (`#registro`):** al hacer scroll programático con sticky stacking, el browser debería resolver bien la posición — pero conviene verificar. Si rompe, agregar `scroll-margin-top: 0` al `<div id="registro">`.
- **Aftermovie iframe (YouTube):** dentro de su sticky section, OK. Iframe no afecta sticky.
- **Timeline interno (slider de artistas):** está dentro de una sticky section. La animación de entrada/salida con `AnimatePresence` sigue funcionando porque el slider no usa scroll.
- **Stats useCountUp con IntersectionObserver:** el observer trigger es `threshold: 0.3`. Con sticky, la sección entra al viewport como siempre — debería funcionar igual. Verificar en QA.

## Plan de verificación

Después de implementar:

1. `npm run dev` y navegar por la landing
2. Confirmar Hero: copy nuevo visible, layout idéntico al anterior
3. Scrollear y confirmar efecto sticky stacking: cada sección queda fija, la siguiente sube con esquinas redondeadas, la anterior se oscurece progresivamente
4. Mobile: probar en viewport <768px (Chrome DevTools), confirmar mismo comportamiento
5. Reduced motion: activar en sistema (Windows: Settings → Accessibility → Visual effects → Animation effects off; o emular en DevTools), confirmar que el sticky desaparece y vuelve a scroll lineal
6. Stats count-up: confirmar que sigue disparándose al entrar la sección
7. Timeline navegación: confirmar que ← → y los dots funcionan
8. EmailRegister: confirmar que el form sigue enviando y mostrando estados
9. `npm test`: que no rompan tests existentes
10. `npm run build`: que compile sin errores

## Riesgos

- **Performance:** 6 secciones con `useScroll` cada una puede pesar en mobiles viejos. Mitigación: framer-motion ya optimiza con `useTransform`, y el overlay es un solo `<div>` por sección. Si hay jank, considerar `will-change: opacity` en el overlay.
- **Anchor scroll:** si rompe, fix simple con `scroll-margin-top`.
- **Variabilidad de altura de Stats:** Stats usa `py-24` en SectionWrapper. Con `min-h-screen`, el contenido queda centrado verticalmente — verificar que no quede demasiado aire arriba/abajo. Si pasa, ajustar padding.

## Salida esperada

Después de implementar y verificar:
- Hero comunica claramente que viene Vibra Bolivia 2027
- Scroll se siente moderno y con personalidad (cartas que se apilan)
- Cero cambios visibles en paleta, tipografía o estructura
- Accesibilidad preservada (reduced motion respetado)
