# Vibra Bolivia — Visual Redesign Spec

**Date:** 2026-05-15
**Status:** Approved

---

## Objetivo

Rediseño visual de la landing page para mejorar branding, coherencia entre secciones, motion graphics y posicionamiento de assets decorativos. Sin cambios funcionales (Supabase, formulario, embeds siguen igual).

---

## Cambios de Estructura

### page.tsx — nuevo orden
```
Hero → Stats → Aftermovie → Timeline → SpotifyPlayer → EmailRegister
```
Eliminar del código: `<SocialMedia />`, `<Teaser2027 />` y sus imports.

---

## Hero — Corrección de animación

**Problema actual:** `vibra-texture` está dentro del `motion.div` que hace zoom, por lo que el fondo también se achica. El overlay violeta opaca el video.

**Solución:**
- `fondo.jpg` como fondo estático de la sección (fuera del `motion.div`)
- `motion.div` contiene SOLO el `<video>` — anima `scale: 0.3→1` + `opacity: 0→1` simultáneamente
- Overlay semi-transparente más suave (máx 40% opacidad) para preservar colores del video
- Agregar 3 nubes extra al Hero (5 total): top-left grande, top-right mediana, mid-left chica, mid-right chica, bottom-left sutil — todas con `animate-float` a distintas velocidades
- Nubes solo en `md:` y superiores

---

## SectionWrapper — Nuevo componente

`src/components/SectionWrapper.tsx`

Props:
```ts
interface SectionWrapperProps {
  children: React.ReactNode
  className?: string
  clouds?: boolean          // nubes flotantes en esquinas
  grassBottom?: boolean     // IMG_3494 pegado al borde inferior
  mountainsBottom?: boolean // IMG_3496 debajo del pasto
  parallax?: boolean        // activa parallax en nubes con useScroll
}
```

Comportamiento:
- Fondo siempre: `vibra-texture` (fondo.jpg) con overlay `bg-vibra-purple/30`
- Assets decorativos siempre `absolute bottom-0 w-full` — nunca flotan en el aire
- Cuando `grassBottom + mountainsBottom`: montañas al fondo, pasto encima
- Clouds: posicionadas en `%` del ancho del contenedor (no `px` fijos) para ser responsivas
- Parallax (`parallax={true}`): las nubes usan `useScroll` + `useTransform` para moverse `-20px → +20px` en Y mientras la sección entra/sale del viewport. El pasto y montañas NO hacen parallax.
- En mobile (`< md`): clouds se ocultan, pasto/montañas se mantienen

---

## Secciones actualizadas

| Sección | SectionWrapper props | Notas |
|---------|---------------------|-------|
| Stats | `clouds grassBottom parallax` | Chiru decorativo se mantiene |
| Aftermovie | `clouds mountainsBottom parallax` | Reemplaza `bg-black` |
| Timeline | `grassBottom` | Reemplaza `bg-black/90`. Sin clouds para no distraer de las fotos |
| SpotifyPlayer | `clouds grassBottom parallax` | Reemplaza `vibra-texture` standalone |
| EmailRegister | `clouds grassBottom mountainsBottom parallax` | Cierre impactante de página |

---

## Consideraciones técnicas

- `useScroll` de framer-motion: no re-renderiza React, mueve DOM directo — no impacta performance
- `will-change: transform` solo en elementos que hacen parallax
- Nubes limitadas a 2-3 por sección en desktop, ocultas en mobile
- Assets decorativos bottom siempre `pointer-events-none`
- Los componentes `SocialMedia.tsx` y `Teaser2027.tsx` se conservan en disco pero se eliminan de `page.tsx`

---

## Plan de implementación (subagentes en paralelo)

**Wave 1 (paralelo):**
- Agente A: Hero.tsx — corrección animación + nubes extra
- Agente B: SectionWrapper.tsx — crear componente base

**Wave 2 (paralelo, después de Wave 1):**
- Agente C: Aftermovie.tsx + Timeline.tsx — usar SectionWrapper
- Agente D: Stats.tsx + SpotifyPlayer.tsx + EmailRegister.tsx — usar SectionWrapper
- Agente E: page.tsx — nuevo orden + eliminar SocialMedia/Teaser2027
