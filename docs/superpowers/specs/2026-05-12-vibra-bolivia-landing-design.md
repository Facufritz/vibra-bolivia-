# Vibra Bolivia — Landing Page Design Spec

**Date:** 2026-05-12  
**Stack:** Next.js 14 + Tailwind CSS + Vercel  
**Status:** Approved

---

## Objetivo

Landing page para el festival Vibra Bolivia que:
- Genera hype para la edición 2027 usando contenido de ediciones pasadas (2025 y 2026)
- Captura emails de potenciales asistentes
- Está arquitectada para escalar: la ticketera se puede agregar como una ruta `/tickets` sin rehacer la página

---

## Identidad Visual

| Elemento | Valor |
|----------|-------|
| Fondo principal | Gradiente: `violeta/púrpura → rosa → durazno` |
| Tipografía logo | Naranja |
| Detalles / acentos | Azul claro |
| Mascota | Chiru (personaje principal) + personajes secundarios (nubes, pastos, extras) |
| Inspiración | Lollapalooza, Love the 90s LATAM |
| Estilo | Colorido, vibrante, cultura boliviana sin usar colores de la bandera |

---

## Estructura de Archivos del Proyecto

```
vibra-bolivia/
├── public/
│   └── assets/
│       ├── branding/      ← logos, fuentes, personajes (Chiru, PNG/SVG)
│       └── festival/      ← fotos y videos del evento (2025, 2026)
├── src/
│   ├── app/
│   │   └── page.tsx       ← página principal (home)
│   └── components/
│       ├── Hero.tsx
│       ├── Stats.tsx
│       ├── Timeline.tsx
│       ├── Aftermovie.tsx
│       ├── SpotifyPlayer.tsx
│       ├── SocialMedia.tsx
│       ├── Teaser2027.tsx
│       └── EmailRegister.tsx
├── docs/
└── ...config files
```

Los assets se sirven directamente desde `public/assets/` — Next.js los expone en `/assets/...` sin configuración adicional.

---

## Secciones de la Página

### 1. Hero — Video Fullscreen

- Video del aftermovie 2025 como fondo completo (`<video>` con `autoplay muted loop`)
- Overlay semitransparente con el gradiente de marca (violeta con opacidad ~60%)
- Logo de Vibra Bolivia centrado, tamaño grande
- Frase de impacto debajo del logo (ej: *"El festival que le devolvió la música a Bolivia"*)
- Flecha animada (bounce) al pie invitando a hacer scroll
- Fallback: si el video no carga, el gradiente de fondo solo funciona igual

### 2. Números que Impactan

- Fila de 4 métricas grandes sobre el gradiente de marca
- Ejemplos: asistentes, artistas, escenarios, horas de música
- Animación de conteo (`count-up`) al entrar en el viewport
- Chiru aparece como elemento decorativo en este bloque (PNG con transparencia)

### 3. Timeline Interactivo

- Línea horizontal de tiempo con puntos clickeables
- Navegación con flechas del teclado (← →) y arrastre/swipe
- Cada punto muestra: foto del evento, hora del día, descripción breve
- Fondo oscuro para contraste con las fotos
- Las fotos se cargan desde `public/assets/festival/`
- Datos del timeline se definen en un array de objetos en el componente (fácil de editar)

### 4. Aftermovie — Ventana YouTube

- Embed de YouTube (`<iframe>`) del aftermovie 2026
- Diseño tipo "pantalla de cine": fondo oscuro, bordes con acento naranja
- Título grande arriba de la ventana
- Responsivo: en mobile ocupa el ancho completo

### 5. La Música — Ventana Spotify

- Embed oficial de Spotify (`<iframe>` con el endpoint `open.spotify.com/embed/playlist/...`)
- Muestra la playlist del festival: portada, lista de tracks scrolleable, reproducción de previews
- Misma estética que la sección YouTube
- **Nota:** Reproducción completa requiere que el usuario esté logueado en Spotify. Los previews de 30s funcionan sin login.

### 6. Comunidad — Redes Sociales

- **Instagram:** Feed de últimas publicaciones vía embed oficial. Si Meta no aprueba el embed, se usa una grilla estática de fotos con link al perfil.
- **TikTok:** Últimos videos embebidos con `<blockquote>` + script de TikTok, o grilla estática con link.
- Dos bloques lado a lado (en desktop), apilados en mobile
- Botones grandes debajo con links directos a los perfiles de IG y TikTok

### 7. Próximamente 2027 — Teaser

- Sección de cierre antes del registro
- Chiru y personajes secundarios en tamaño grande, con animaciones CSS suaves
- Texto: *"2027 se viene"* o similar (a definir con el equipo)
- Opcionalmente: cuenta regresiva si se tiene la fecha del próximo evento
- Fondo con el gradiente completo de la marca

### 8. Registro de Email

- Campo de email + botón CTA (ej: *"Quiero enterarme primero"*)
- Fondo: gradiente completo violeta → rosa → durazno
- Validación de email en el cliente (formato básico)
- Los datos se envían a **Supabase** (base de datos PostgreSQL gratuita)
- Tabla `subscribers` con campos: `email`, `created_at`, `source`
- La misma tabla sirve para la futura ticketera (se agrega `ticket_id` cuando corresponda)
- Texto de privacidad debajo: *"No spam. Solo Vibra."*
- Mensaje de éxito/error en pantalla tras enviar

---

## Arquitectura para Escalar

La ticketera futura se agrega como:
- `/tickets` — nueva ruta en Next.js
- Supabase ya instalado, solo se agregan tablas (`tickets`, `orders`, `payments`)
- Ninguna sección de la landing necesita modificarse

---

## Consideraciones Técnicas

| Tema | Decisión |
|------|----------|
| Deploy | Vercel (free tier, conectado a GitHub) |
| Base de datos | Supabase (free tier, PostgreSQL) |
| Video hero | `<video>` local desde `public/assets/` o URL externa si el archivo es muy grande (+50MB → usar URL) |
| Imágenes | Next.js `<Image>` component para optimización automática |
| Animaciones | Tailwind + `framer-motion` para el timeline y count-up |
| Responsivo | Mobile-first con Tailwind breakpoints (`sm`, `md`, `lg`) |
| Fuentes | Google Fonts o fuente propia del branding (si está en `public/assets/branding/`) |

---

## Restricciones y Notas

- La página no debe ser muy larga: el objetivo es que la mayoría llegue al registro de email al final
- No hay sistema de login/auth en esta fase
- Los embeds de Instagram/TikTok tienen limitaciones de la plataforma que pueden requerir aprobación
- El video del aftermovie 2025 (hero) está pendiente de subir — se usa un placeholder hasta tenerlo
