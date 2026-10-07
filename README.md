# Naun Flores — Portafolio y CV

Sitio personal y CV de **Naun Flores**, consultor de tecnología y desarrollador de software. Developer Senior Odoo e implementador de sistemas de gestión e inventario, creador de LexOS.

- Inglés por defecto en `/`, español en `/es/`.
- Negro por defecto, con modo claro opcional (se recuerda la elección).
- Paleta de comandos con `Ctrl K` / `⌘K`: descargar el CV, cambiar idioma o tema e ir a cada sección.
- CV descargable en PDF y DOCX, en inglés y en español, listo para subir a plataformas como Outlier: Arial, una columna, sin tablas, encabezados ni pies de página, más de 300 palabras.

## Editar el contenido

Todo el contenido vive en [`src/data/cv.ts`](src/data/cv.ts). Cada texto tiene versión `en` y `es`; un campo vacío se oculta en el sitio y en el CV.

Después de cambiar los datos, regenera los CV y haz commit de los archivos en `public/cv/`:

```bash
npm run cv   # usa Google Chrome instalado; CV_BROWSER=msedge para Edge
```

## Desarrollo

Requiere Node 22.12 o superior.

```bash
npm install
npm run dev      # http://localhost:4321
npm run check    # verificación de tipos
npm run build    # sitio estático en dist/
```

## Estructura

```
src/data/cv.ts          contenido del CV (fuente única)
src/i18n/ui.ts          textos de interfaz, rutas de los CV y de la foto
public/images/          foto de perfil (webp y jpg)
src/components/         CvPage, CommandPalette, Icon
src/layouts/Layout.astro  <head>, SEO, hreflang y JSON-LD
scripts/build-cv.ts     genera public/cv/*.pdf y *.docx
```

## Despliegue

Vercel detecta Astro automáticamente: comando `astro build`, salida `dist/`. No requiere variables de entorno.

## Licencia

MIT
