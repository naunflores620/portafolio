// Generates the downloadable résumés in public/cv/ from src/data/cv.ts.
// Output follows common résumé-parser rules (e.g. Outlier): Arial, one column,
// no tables, text boxes, headers or footers, at least 300 words, one page,
// simple file names. The photo sits beside the name; parsers skip it and read
// the text in document order.
//
//   npm run cv            uses the installed Google Chrome
//   CV_BROWSER=msedge npm run cv

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright-core';
import {
  BorderStyle,
  Document,
  ExternalHyperlink,
  HeadingLevel,
  HorizontalPositionAlign,
  HorizontalPositionRelativeFrom,
  ImageRun,
  Packer,
  Paragraph,
  TabStopType,
  TextRun,
  TextWrappingSide,
  TextWrappingType,
  VerticalPositionAlign,
  VerticalPositionRelativeFrom,
} from 'docx';
import { cv, formatPeriod, t, type Lang } from '../src/data/cv';
import { cvFiles, photo, ui } from '../src/i18n/ui';

const MIN_WORDS = 300;
/** Photo size in points (72 pt = 1 inch). */
const PHOTO_PT = 76;

const INK = '111316';
const MUTED = '5F6773';
const RULE = 'D5DAE1';

/** A contact item; with `href` it becomes a clickable link in the PDF and DOCX. */
interface Contact {
  text: string;
  href?: string;
}

/** The résumé as structured blocks, shared by the PDF and DOCX renderers. */
type Block =
  | { kind: 'header'; name: string; headline: string; contact: Contact[] }
  | { kind: 'section'; title: string }
  | { kind: 'text'; text: string }
  | { kind: 'entry'; title: string; date: string; meta: string }
  | { kind: 'bullet'; text: string }
  | { kind: 'term'; term: string; text: string }
  | { kind: 'tags'; items: string[] };

function blocks(lang: Lang): Block[] {
  const s = ui[lang];
  const out: Block[] = [];

  out.push({
    kind: 'header',
    name: cv.name,
    headline: t(cv.headline, lang),
    contact: [
      { text: t(cv.location, lang) },
      ...(cv.email ? [{ text: cv.email, href: `mailto:${cv.email}` }] : []),
      { text: cv.website.label, href: cv.website.href },
      ...cv.links.map((link) => ({ text: link.label, href: link.href })),
    ],
  });

  out.push({ kind: 'section', title: s.profile });
  out.push({ kind: 'text', text: t(cv.summary, lang) });

  out.push({ kind: 'section', title: s.experience });
  for (const role of cv.experience) {
    out.push({
      kind: 'entry',
      title: t(role.title, lang),
      date: formatPeriod(role.start, role.end, lang),
      meta: [role.company, role.location && t(role.location, lang)].filter(Boolean).join(', '),
    });
    for (const item of role.highlights) out.push({ kind: 'bullet', text: t(item, lang) });
  }

  if (cv.projects.length) {
    out.push({ kind: 'section', title: s.projects });
    for (const project of cv.projects) {
      out.push({ kind: 'term', term: project.name, text: t(project.description, lang) });
    }
  }

  out.push({ kind: 'section', title: s.technicalSkills });
  for (const group of cv.skills) {
    out.push({
      kind: 'term',
      term: t(group.name, lang),
      text: `${group.items.map((item) => t(item, lang)).join(', ')}.`,
    });
  }

  out.push({ kind: 'section', title: s.expertise });
  out.push({ kind: 'text', text: t(cv.functionalSummary, lang) });
  out.push({
    kind: 'term',
    term: s.areas,
    text: `${cv.areas.map((area) => t(area.name, lang)).join(', ')}.`,
  });
  out.push({
    kind: 'term',
    term: s.sectors,
    text: `${cv.sectors.map((sector) => t(sector, lang)).join(', ')}.`,
  });

  out.push({ kind: 'section', title: s.education });
  for (const item of cv.education) {
    out.push({
      kind: 'entry',
      title: t(item.degree, lang),
      date: item.start ? `${item.start} – ${item.end}` : '',
      meta: `${item.school}, ${t(item.status, lang)}`,
    });
  }

  if (cv.certifications.length) {
    out.push({ kind: 'section', title: s.certifications });
    for (const item of cv.certifications) {
      out.push({ kind: 'entry', title: item.name, date: item.year, meta: item.issuer });
    }
  }

  out.push({ kind: 'section', title: s.languages });
  for (const item of cv.languages) {
    out.push({ kind: 'term', term: t(item.name, lang), text: `${t(item.level, lang)}.` });
  }

  return out;
}

const escape = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Escaped text where hyphenated words never break across lines (keeps them intact for parsers). */
const prose = (text: string) =>
  escape(text).replace(
    /[\p{L}\d]+(?:-[\p{L}\d]+)+/gu,
    (word) => `<span class="nowrap">${word}</span>`,
  );

function toHtml(lang: Lang, content: Block[], photoUri: string) {
  let body = '';
  let inList = false;

  for (const block of content) {
    if (block.kind !== 'bullet' && inList) {
      body += '</ul>';
      inList = false;
    }

    switch (block.kind) {
      case 'header':
        body += `<header>
          <div class="who">
            <h1>${escape(block.name)}</h1>
            <p class="headline">${prose(block.headline)}</p>
            <p class="contact">${block.contact
              .map((item) =>
                item.href
                  ? `<a href="${escape(item.href)}">${escape(item.text)}</a>`
                  : escape(item.text),
              )
              .join('<span class="sep"> | </span>')}</p>
          </div>
          <img src="${photoUri}" alt="${escape(block.name)}">
        </header>`;
        break;
      case 'section':
        body += `<h2>${escape(block.title)}</h2>`;
        break;
      case 'text':
        body += `<p class="text">${prose(block.text)}</p>`;
        break;
      case 'entry':
        body += `<div class="entry"><h3>${escape(block.title)}</h3><span class="date">${escape(block.date)}</span></div>`;
        if (block.meta) body += `<p class="meta">${escape(block.meta)}</p>`;
        break;
      case 'bullet':
        if (!inList) {
          body += '<ul>';
          inList = true;
        }
        body += `<li>${prose(block.text)}</li>`;
        break;
      case 'term':
        body += `<p class="term"><strong>${escape(block.term)}.</strong> ${prose(block.text)}</p>`;
        break;
      case 'tags':
        // The commas are invisible but keep the list readable when parsers extract the text.
        body += `<p class="tags">${block.items.map((item) => `<span>${escape(item)}</span>`).join('<b class="comma">, </b>')}</p>`;
        break;
    }
  }
  if (inList) body += '</ul>';

  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><title>${escape(cv.name)}</title>
<style>
  body { font-family: Arial, Helvetica, sans-serif; font-size: 9.6pt; line-height: 1.34; color: #${INK}; margin: 0; }
  p, h1, h2, h3, ul { margin: 0; }

  header { display: flex; align-items: center; justify-content: space-between; gap: 20pt;
           padding-bottom: 10pt; border-bottom: 2pt solid #${INK}; }
  h1 { font-size: 26pt; line-height: 1.05; letter-spacing: -0.6pt; }
  .headline { margin-top: 5pt; font-size: 12pt; font-weight: bold; }
  .contact { margin-top: 7pt; font-size: 9.2pt; color: #${MUTED}; }
  .contact a { color: #${INK}; text-decoration: none; }
  .nowrap { white-space: nowrap; }
  .sep { color: #${RULE}; }
  header img { width: ${PHOTO_PT}pt; height: ${PHOTO_PT}pt; border-radius: 12pt; object-fit: cover; flex: none; }

  h2 { margin: 9pt 0 4pt; padding-bottom: 2pt; border-bottom: 0.75pt solid #${RULE};
       font-size: 10.5pt; letter-spacing: 0.2pt; break-after: avoid; }
  .text { color: #222; }

  .entry { display: flex; justify-content: space-between; align-items: baseline; gap: 12pt; break-after: avoid; }
  h3 { font-size: 10pt; }
  .date { flex: none; font-size: 9pt; color: #${MUTED}; }
  .meta { margin-bottom: 3pt; font-size: 9pt; color: #${MUTED}; }

  ul { padding-left: 12pt; }
  li { margin-bottom: 1pt; padding-left: 2pt; }
  li::marker { color: #${MUTED}; }

  .term { margin-bottom: 1pt; }
  .term strong { font-weight: bold; }

  .tags { line-height: 2; }
  .tags span { padding: 1.5pt 6pt; border: 0.75pt solid #${RULE}; border-radius: 4pt; white-space: nowrap; }
  .comma { font-size: 1pt; color: transparent; }
  .tags span + .comma, .comma + span { margin-left: 3pt; }
</style></head><body>${body}</body></html>`;
}

function toDocx(content: Block[], photoJpg: Buffer) {
  const font = 'Arial';
  const px = (pt: number) => (pt * 96) / 72;
  const rightTab = [{ type: TabStopType.RIGHT, position: 9360 }];

  // Anchored to the top-right margin with text wrapping, so it is a picture, not a text box.
  const picture = new ImageRun({
    type: 'jpg',
    data: photoJpg,
    transformation: { width: px(PHOTO_PT), height: px(PHOTO_PT) },
    altText: { name: cv.name, title: cv.name, description: cv.name },
    floating: {
      horizontalPosition: {
        relative: HorizontalPositionRelativeFrom.MARGIN,
        align: HorizontalPositionAlign.RIGHT,
      },
      verticalPosition: {
        relative: VerticalPositionRelativeFrom.MARGIN,
        align: VerticalPositionAlign.TOP,
      },
      wrap: { type: TextWrappingType.SQUARE, side: TextWrappingSide.LEFT },
      margins: { left: 182880 },
    },
  });

  const children: Paragraph[] = [];
  for (const block of content) {
    switch (block.kind) {
      case 'header':
        children.push(
          new Paragraph({
            heading: HeadingLevel.TITLE,
            children: [picture, new TextRun(block.name)],
          }),
          new Paragraph({
            spacing: { after: 100 },
            children: [new TextRun({ text: block.headline, bold: true, size: 24 })],
          }),
          new Paragraph({
            spacing: { after: 160 },
            border: { bottom: { style: BorderStyle.SINGLE, size: 16, color: INK, space: 8 } },
            children: block.contact.flatMap((item, index) => {
              const separator = index ? [new TextRun({ text: ' | ', color: RULE, size: 18 })] : [];
              const run = new TextRun({
                text: item.text,
                color: item.href ? INK : MUTED,
                size: 18,
              });
              return [
                ...separator,
                item.href ? new ExternalHyperlink({ link: item.href, children: [run] }) : run,
              ];
            }),
          }),
        );
        break;
      case 'section':
        children.push(
          new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(block.title)] }),
        );
        break;
      case 'text':
        children.push(new Paragraph({ children: [new TextRun(block.text)] }));
        break;
      case 'entry':
        children.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            tabStops: rightTab,
            children: [
              new TextRun(block.title),
              new TextRun({ text: `\t${block.date}`, bold: false, color: MUTED, size: 18 }),
            ],
          }),
        );
        if (block.meta) {
          children.push(
            new Paragraph({
              children: [new TextRun({ text: block.meta, color: MUTED, size: 18 })],
            }),
          );
        }
        break;
      case 'bullet':
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 30 },
            children: [new TextRun(block.text)],
          }),
        );
        break;
      case 'term':
        children.push(
          new Paragraph({
            spacing: { after: 40 },
            children: [
              new TextRun({ text: `${block.term}. `, bold: true }),
              new TextRun(block.text),
            ],
          }),
        );
        break;
      case 'tags':
        children.push(new Paragraph({ children: [new TextRun(block.items.join('  ·  '))] }));
        break;
    }
  }

  return new Document({
    creator: cv.name,
    title: cv.name,
    styles: {
      default: {
        document: { run: { font, size: 19, color: INK }, paragraph: { spacing: { after: 60 } } },
      },
      paragraphStyles: [
        {
          id: 'Title',
          name: 'Title',
          basedOn: 'Normal',
          run: { font, size: 52, bold: true, color: INK },
          paragraph: { spacing: { after: 60 } },
        },
        {
          id: 'Heading1',
          name: 'Heading 1',
          basedOn: 'Normal',
          next: 'Normal',
          run: { font, size: 21, bold: true, color: INK },
          paragraph: {
            spacing: { before: 220, after: 80 },
            border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: RULE, space: 2 } },
          },
        },
        {
          id: 'Heading2',
          name: 'Heading 2',
          basedOn: 'Normal',
          next: 'Normal',
          run: { font, size: 20, bold: true, color: INK },
          paragraph: { spacing: { before: 80, after: 0 } },
        },
      ],
    },
    sections: [
      {
        properties: { page: { margin: { top: 720, bottom: 720, left: 1008, right: 1008 } } },
        children,
      },
    ],
  });
}

function countWords(content: Block[]) {
  const text = content
    .map((block) => {
      switch (block.kind) {
        case 'header':
          return [block.name, block.headline, ...block.contact.map((item) => item.text)].join(' ');
        case 'section':
          return block.title;
        case 'entry':
          return [block.title, block.date, block.meta].join(' ');
        case 'term':
          return `${block.term} ${block.text}`;
        case 'tags':
          return block.items.join(' ');
        default:
          return block.text;
      }
    })
    .join(' ');
  return text.split(/\s+/).filter(Boolean).length;
}

async function main() {
  await mkdir('public/cv', { recursive: true });
  const channel = process.env.CV_BROWSER ?? 'chrome';
  const browser = await chromium.launch({ channel });
  const photoJpg = await readFile(`public${photo.fallback}`);
  const photoUri = `data:image/jpeg;base64,${photoJpg.toString('base64')}`;

  try {
    for (const lang of ['en', 'es'] as Lang[]) {
      const content = blocks(lang);
      const words = countWords(content);
      if (words < MIN_WORDS) {
        throw new Error(`${lang}: ${words} words, résumé parsers expect at least ${MIN_WORDS}.`);
      }

      const page = await browser.newPage();
      await page.setContent(toHtml(lang, content, photoUri), { waitUntil: 'load' });
      const pdf = await page.pdf({
        format: 'Letter',
        margin: { top: '0.5in', bottom: '0.5in', left: '0.7in', right: '0.7in' },
        displayHeaderFooter: false,
        printBackground: true,
      });
      await page.close();

      const pages = (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) ?? []).length;
      if (pages !== 1) throw new Error(`${lang}: the PDF has ${pages} pages, it must fit on one.`);

      const docx = await Packer.toBuffer(toDocx(content, photoJpg));
      const files = cvFiles[lang];
      await writeFile(`public${files.pdf}`, pdf);
      await writeFile(`public${files.docx}`, docx);
      console.log(`${lang}: ${words} words, 1 page -> ${files.pdf}, ${files.docx}`);
    }
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
