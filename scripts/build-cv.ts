// Generates the downloadable résumés in public/cv/ from src/data/cv.ts.
// Output follows common résumé-parser rules (e.g. Outlier): Arial, one column,
// no tables, text boxes, headers or footers, at least 300 words, simple file names.
//
//   npm run cv            uses the installed Google Chrome
//   CV_BROWSER=msedge npm run cv

import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright-core';
import { Document, HeadingLevel, Packer, Paragraph, TextRun } from 'docx';
import { cv, formatPeriod, t, type Lang } from '../src/data/cv';
import { cvFiles, ui } from '../src/i18n/ui';

const MIN_WORDS = 300;

interface Block {
  kind: 'h1' | 'h2' | 'h3' | 'p' | 'meta' | 'li';
  text: string;
}

/** The résumé as a flat list of blocks, shared by the PDF and DOCX renderers. */
function blocks(lang: Lang): Block[] {
  const s = ui[lang];
  const out: Block[] = [];
  const contact = [
    t(cv.location, lang),
    cv.email,
    ...cv.links.map((link) => link.href.replace(/^https:\/\/(www\.)?/, '').replace(/\/$/, '')),
  ].filter(Boolean);

  out.push({ kind: 'h1', text: cv.name });
  out.push({ kind: 'p', text: `${t(cv.headline, lang)}. ${t(cv.tagline, lang)}` });
  out.push({ kind: 'meta', text: contact.join(' | ') });

  out.push({ kind: 'h2', text: s.profile });
  out.push({ kind: 'p', text: t(cv.summary, lang) });

  out.push({ kind: 'h2', text: s.experience });
  for (const role of cv.experience) {
    out.push({ kind: 'h3', text: t(role.title, lang) });
    const meta = [
      role.company,
      role.location && t(role.location, lang),
      formatPeriod(role.start, role.end, lang),
    ].filter(Boolean);
    out.push({ kind: 'meta', text: meta.join(' | ') });
    for (const item of role.highlights) out.push({ kind: 'li', text: t(item, lang) });
  }

  if (cv.projects.length) {
    out.push({ kind: 'h2', text: s.projects });
    for (const project of cv.projects) {
      out.push({ kind: 'li', text: `${project.name}: ${t(project.description, lang)}` });
    }
  }

  out.push({ kind: 'h2', text: s.expertise });
  for (const area of cv.areas) {
    out.push({ kind: 'li', text: `${t(area.name, lang)}: ${t(area.items, lang)}` });
  }
  out.push({ kind: 'h2', text: s.technicalSkills });
  out.push({ kind: 'p', text: `${cv.technical.join(', ')}.` });

  out.push({ kind: 'h2', text: s.education });
  for (const item of cv.education) {
    out.push({ kind: 'h3', text: t(item.degree, lang) });
    const meta = [item.school, item.start && `${item.start}–${item.end}`].filter(Boolean);
    if (meta.length) out.push({ kind: 'meta', text: meta.join(' | ') });
  }

  if (cv.certifications.length) {
    out.push({ kind: 'h2', text: s.certifications });
    for (const item of cv.certifications) {
      out.push({ kind: 'li', text: `${item.name}, ${item.issuer}, ${item.year}` });
    }
  }

  out.push({ kind: 'h2', text: s.languages });
  out.push({
    kind: 'p',
    text: cv.languages.map((item) => `${t(item.name, lang)}: ${t(item.level, lang)}`).join('. '),
  });

  return out;
}

const escape = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function toHtml(lang: Lang, content: Block[]) {
  let body = '';
  let inList = false;
  for (const block of content) {
    if (block.kind !== 'li' && inList) {
      body += '</ul>';
      inList = false;
    }
    if (block.kind === 'li' && !inList) {
      body += '<ul>';
      inList = true;
    }
    const tag = block.kind === 'meta' ? 'p class="meta"' : block.kind;
    body += `<${tag}>${escape(block.text)}</${block.kind === 'meta' ? 'p' : block.kind}>`;
  }
  if (inList) body += '</ul>';

  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><title>${escape(cv.name)}</title>
<style>
  body { font-family: Arial, sans-serif; font-size: 10pt; line-height: 1.35; color: #000; margin: 0; }
  h1 { font-size: 20pt; margin: 0 0 4pt; }
  h2 { font-size: 12pt; margin: 12pt 0 4pt; padding-bottom: 2pt; border-bottom: 1px solid #000; break-after: avoid; }
  h3 { break-after: avoid; }
  h3 { font-size: 10pt; margin: 8pt 0 0; }
  p { margin: 0 0 4pt; }
  .meta { color: #333; }
  ul { margin: 2pt 0 4pt; padding-left: 14pt; }
  li { margin: 0 0 2pt; }
</style></head><body>${body}</body></html>`;
}

function toDocx(content: Block[]) {
  const children = content.map((block) => {
    switch (block.kind) {
      case 'h1':
        return new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun(block.text)] });
      case 'h2':
        return new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun(block.text)],
        });
      case 'h3':
        return new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun(block.text)],
        });
      case 'li':
        return new Paragraph({ bullet: { level: 0 }, children: [new TextRun(block.text)] });
      case 'meta':
        return new Paragraph({ children: [new TextRun({ text: block.text, color: '333333' })] });
      default:
        return new Paragraph({ children: [new TextRun(block.text)] });
    }
  });

  const font = 'Arial';
  return new Document({
    creator: cv.name,
    title: cv.name,
    styles: {
      default: { document: { run: { font, size: 21 }, paragraph: { spacing: { after: 80 } } } },
      paragraphStyles: [
        {
          id: 'Title',
          name: 'Title',
          basedOn: 'Normal',
          run: { font, size: 40, bold: true, color: '000000' },
          paragraph: { spacing: { after: 80 } },
        },
        {
          id: 'Heading1',
          name: 'Heading 1',
          basedOn: 'Normal',
          next: 'Normal',
          run: { font, size: 24, bold: true, color: '000000' },
          paragraph: { spacing: { before: 280, after: 80 } },
        },
        {
          id: 'Heading2',
          name: 'Heading 2',
          basedOn: 'Normal',
          next: 'Normal',
          run: { font, size: 21, bold: true, color: '000000' },
          paragraph: { spacing: { before: 160, after: 0 } },
        },
      ],
    },
    sections: [
      {
        properties: { page: { margin: { top: 1080, bottom: 1080, left: 1080, right: 1080 } } },
        children,
      },
    ],
  });
}

const countWords = (content: Block[]) =>
  content.reduce((total, block) => total + block.text.split(/\s+/).filter(Boolean).length, 0);

async function main() {
  await mkdir('public/cv', { recursive: true });
  const channel = process.env.CV_BROWSER ?? 'chrome';
  const browser = await chromium.launch({ channel });

  try {
    for (const lang of ['en', 'es'] as Lang[]) {
      const content = blocks(lang);
      const words = countWords(content);
      if (words < MIN_WORDS) {
        throw new Error(`${lang}: ${words} words, résumé parsers expect at least ${MIN_WORDS}.`);
      }

      const page = await browser.newPage();
      await page.setContent(toHtml(lang, content), { waitUntil: 'load' });
      const pdf = await page.pdf({
        format: 'Letter',
        margin: { top: '0.6in', bottom: '0.6in', left: '0.7in', right: '0.7in' },
        displayHeaderFooter: false,
        printBackground: false,
      });
      await page.close();

      const docx = await Packer.toBuffer(toDocx(content));
      const files = cvFiles[lang];
      await writeFile(`public${files.pdf}`, pdf);
      await writeFile(`public${files.docx}`, docx);
      console.log(`${lang}: ${words} words -> ${files.pdf}, ${files.docx}`);
    }
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
