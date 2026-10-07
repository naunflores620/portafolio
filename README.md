# Naun Flores — Portafolio y CV

Sitio personal y CV de **Naun Flores**, Developer Senior Odoo (versiones 11 a 19) y consultor funcional de contabilidad y nómina.

- Inglés por defecto en `/`, español en `/es/`.
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
src/i18n/ui.ts          textos de interfaz y rutas de los CV
src/components/         CvPage, VersionRail, Icon
src/layouts/Layout.astro  <head>, SEO, hreflang y JSON-LD
scripts/build-cv.ts     genera public/cv/*.pdf y *.docx
```

## Despliegue

Vercel detecta Astro automáticamente: comando `astro build`, salida `dist/`. No requiere variables de entorno.

## Licencia

MIT
