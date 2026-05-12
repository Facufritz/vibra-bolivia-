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
| Fondo principal | Gradiente: durazno/naranja (arriba) → rosa/magenta (centro) → violeta/púrpura (abajo) |
| Color hex aprox. | `#F5A020` → `#E8498A` → `#5B2D8E` |
| Tipografía logo | Naranja/amarillo degradado con outline azul |
| Detalles / acentos | Azul claro (`#4FC3F7` aprox.) |
| Fondo tiene textura | Sí — efecto tela/papel arrugado sobre el gradiente |
| Mascota principal | **Chiru** — oso blanco 3D con máscara de carnaval boliviano (Morenada). Brazos abiertos. |
| Elementos decorativos | Nubes 3D blancas, montañas andinas low-poly grises, pasto/arbustos 3D verdes, personajes bailando (sticker con outline blanco), entrada 3D del estadio |
| Inspiración | Lollapalooza, Love the 90s LATAM |
| Estilo | Colorido, vibrante, 3D ilustrativo, cultura boliviana sin colores de bandera |

### Assets de Branding — `public/assets/branding/` (copiar desde `D:\Diseño\...\Branding\`)

| Archivo | Contenido |
|---------|-----------|
| `Chiru png .png` | Mascota principal, PNG con fondo transparente |
| `fondo.jpg` | Gradiente de marca con textura arrugada |
| `fondo sin patron.jpg` | Gradiente limpio sin textura |
| `estadio 3d.png` | Entrada 3D del estadio con banners "VIBRA", fondo transparente |
| `IMG_3494.PNG` | Pasto/arbustos 3D decorativos |
| `IMG_3495.PNG` | Nube 3D blanca |
| `IMG_3496.PNG` | Montañas andinas low-poly |
| `IMG_3503.PNG` | Personaje bailarín (sticker con outline blanco) |
| `IMG_3504–3514.PNG` | Más personajes y elementos decorativos |

### Assets Multimedia — `public/assets/multimedia/` (ya en `Public/assets/Multimedia/`)

| Archivo | Contenido | Uso |
|---------|-----------|-----|
| `Vibra Bolivia after movie.mp4` | Aftermovie 2025 | Hero video fullscreen |
| `vibra bolivia video vertical(1).mp4` | Video vertical | Hero en mobile |
| `Chiru_v02.mp4` | Chiru animado | Sección teaser 2027 |
| `DJI_0018.MP4` / `DJI_20250322185330_0009_D.MP4` | Footage de dron | Complemento visual |
| `vibra png.png` | Logo Vibra PNG | Header / Hero |

### Fotos por Artista — `public/assets/multimedia/Fotos-Vibra-Bolivia-2026/`

Subcarpetas disponibles: `Bailarines`, `Chila Jatun`, `Dj y Animador`, `Eclipse`, `Grupo Femenino Bolivia`, `Los Capos`, `Los Ronish`, `Munay`, `Proyeccion`, `Turromanticos`, `bonanza`, `publico`

---

## Estructura de Archivos del Proyecto

```
vibra-bolivia/
├── public/
│   └── assets/
│       ├── branding/      ← copiar todos los archivos de D:\Diseño\...\Branding aquí
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

Los assets se sirven desde `public/assets/` — Next.js los expone en `/assets/...` sin configuración adicional.

---

## Secciones de la Página

### 1. Hero — Video Fullscreen

- Video `Vibra Bolivia after movie.mp4` como fondo fullscreen (`<video autoplay muted loop playsinline>`)
- Animación de entrada: el video arranca pequeño al centro y hace zoom hasta cubrir la pantalla completa (framer-motion scale: 0.3 → 1)
- Overlay semitransparente del gradiente de marca (violeta oscuro ~60% opacidad)
- Logo "VIBRA BOLIVIA" (`vibra png.png`) centrado, tamaño grande
- Frase de impacto debajo: *"El festival que le devolvió la música a Bolivia"*
- Flecha animada (bounce) al pie invitando a hacer scroll
- Nubes 3D flotando en los laterales con animación CSS lenta (float)
- En mobile: usar `vibra bolivia video vertical(1).mp4` en lugar del video horizontal
- Fallback: si el video no carga, `fondo.jpg` como background estático

### 2. Números que Impactan

| Métrica | Valor |
|---------|-------|
| Asistentes | 15.000+ personas |
| Artistas | 10 artistas en vivo |
| Horas de música | 12 horas de música en vivo |
| Ediciones | 2 ediciones |

- Animación de conteo (`count-up`) al entrar en viewport
- Chiru aparece a un costado como elemento decorativo
- Pasto 3D en el borde inferior de la sección
- Fondo con gradiente de marca

### 3. Timeline Interactivo — Horario Oficial 2026

Línea horizontal de tiempo basada en el horario real de la 2da edición:

| Hora | Artista |
|------|---------|
| 15:00 | DJ Leo Balderrama |
| 15:20 | Adrián Deborah y los Dados Negros |
| 15:55 | Munay Llajta |
| 16:25 | Protección – La expresión del Folklore de Bolivia |
| 17:25 | Los Capos |
| 18:30 | Grupo Femenino Bolivia |
| 19:30 | Turbo Mantikos |
| 20:45 | Bonanza |
| 21:50 | Eclipse |
| 23:05 | Los chila jatun |
| 00:20 | Los Ronisch |

- Navegación con flechas del teclado (← →) y swipe en mobile
- Cada punto muestra: foto del artista o del evento en ese horario, hora, nombre
- Fondo oscuro para contraste con las fotos
- Fotos desde `public/assets/festival/`
- Los datos se definen en un array en el componente (fácil de actualizar para 2027)

### 4. Aftermovie — Ventana YouTube

- Embed de YouTube del aftermovie 2026
- **URL:** `https://youtu.be/FHAXjtf_iOA`
- Diseño tipo "pantalla de cine": fondo oscuro, borde con acento naranja/durazno
- Título: *"Reviví la 2da Edición"* o similar
- Responsivo: ancho completo en mobile

### 5. La Música — Ventana Spotify

- Embed oficial de Spotify (`<iframe>` con `open.spotify.com/embed/playlist/...`)
- **Playlist:** `https://open.spotify.com/playlist/5HIpNO8FbzDDGhHdyRLvib`
- Muestra portada, tracks scrolleables, reproducción de previews (30s sin login, completa con login)
- Misma estética de "ventana" que la sección YouTube

### 6. Comunidad — Redes Sociales

- **Instagram:** Embed de 2 reels recientes. Fallback: grilla estática + link al perfil
  - Reel 1: `https://www.instagram.com/reel/DWKREqyEfF3/`
  - Reel 2: `https://www.instagram.com/reel/DWLPeq4jGrN/`
  - Perfil: `https://www.instagram.com/vibra.bolivia`
- **TikTok:** Embed de 2 videos recientes. Fallback: grilla estática + link al perfil
  - Video 1: `https://www.tiktok.com/@vibra.bolivia/video/7620189048388193557`
  - Video 2: `https://www.tiktok.com/@vibra.bolivia/video/7619917081307286805`
  - Perfil: `https://www.tiktok.com/@vibra.bolivia`
- Dos columnas en desktop, apiladas en mobile
- Botones CTA grandes: *"Seguinos en Instagram"* / *"Seguinos en TikTok"*

### 7. Próximamente 2027 — Teaser

- Chiru grande en el centro con animación suave de respiración/float
- Montañas andinas y pasto en los bordes inferiores
- Nubes 3D flotando
- Texto principal: *"2027 se viene"*
- Subtexto: *"Sé el primero en enterarte"* → flecha hacia el formulario
- Fondo con gradiente completo de marca + textura de `fondo.jpg`

### 8. Registro de Email

- Campo de email + botón CTA: *"Quiero enterarme primero"*
- Fondo: gradiente de marca (puede reutilizar `fondo.jpg` o `fondo sin patron.jpg`)
- Validación de email en el cliente (formato básico)
- Submit a **Supabase** — tabla `subscribers`: `id`, `email`, `created_at`, `source`
- La misma tabla servirá para la ticketera futura
- Texto de privacidad: *"Sin spam. Solo Vibra."*
- Mensaje de confirmación en pantalla tras enviar

---

## Arquitectura para Escalar

La ticketera futura se agrega como:
- `/tickets` — nueva ruta en Next.js, sin tocar la landing
- Supabase ya instalado: solo se agregan tablas `tickets`, `orders`, `payments`
- La tabla `subscribers` ya existente sirve de base para notificar a los registrados

---

## Consideraciones Técnicas

| Tema | Decisión |
|------|----------|
| Deploy | Vercel (free tier, conectado a GitHub) |
| Base de datos | Supabase (free tier, PostgreSQL) |
| Video hero | `<video>` local si <50MB, URL de streaming si es más grande |
| Imágenes | Next.js `<Image>` para optimización automática (WebP automático) |
| Animaciones | `framer-motion` para timeline, float de personajes y count-up |
| Responsivo | Mobile-first con Tailwind (`sm`, `md`, `lg`) |
| Fuentes | Google Fonts — fuente display bold para títulos + sans-serif para cuerpo |
| Textura de fondo | `fondo.jpg` como `background-image` con `background-size: cover` |

---

## Pendientes del Cliente

| Item | Estado |
|------|--------|
| Video aftermovie 2025 (hero) | ✅ Disponible en `Public/assets/Multimedia/Vibra Bolivia after movie.mp4` |
| URL playlist Spotify | ✅ `https://open.spotify.com/playlist/5HIpNO8FbzDDGhHdyRLvib` |
| URLs perfiles IG y TikTok | ✅ Incorporadas en la sección 6 |
| Fotos del festival para el timeline | ✅ En `Public/assets/Multimedia/Fotos-Vibra-Bolivia-2026/` (subcarpeta por banda) |
| Frase definitiva para teaser 2027 | Usar *"2027 se viene"* — confirmar antes del deploy |
