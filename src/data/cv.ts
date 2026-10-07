// Single source of truth for the website, the PDF and the DOCX résumé.
// Every string is bilingual. Leave a field empty ('' or []) to hide it everywhere.
// Only facts Naun has confirmed go here: no invented figures, dates or promotions.

export type Lang = 'en' | 'es';
export type Localized = Record<Lang, string>;

export interface Role {
  title: Localized;
  company: string;
  location?: Localized;
  /** ISO-like 'YYYY' or 'YYYY-MM'. Empty start hides the dates. */
  start: string;
  /** Empty means "present". */
  end: string;
  /** Five or six strongest achievements: action + scope + verifiable result. */
  highlights: Localized[];
  /** Short labels shown as chips on the website. */
  tags: Localized[];
}

export interface Project {
  name: string;
  description: Localized;
  tags: Localized[];
  /** Empty hides the link. */
  href: string;
}

export interface SkillGroup {
  name: Localized;
  items: Localized[];
}

export interface Area {
  name: Localized;
  items: Localized;
}

export interface Education {
  degree: Localized;
  status: Localized;
  school: string;
  start: string;
  end: string;
}

export interface Language {
  name: Localized;
  level: Localized;
}

export interface Link {
  label: string;
  href: string;
}

/** Same text in both languages (technology names). */
const same = (text: string): Localized => ({ en: text, es: text });

export const cv = {
  name: 'Naun Flores',
  headline: {
    en: 'Senior Odoo Developer · Technical-Functional Consultant',
    es: 'Desarrollador sénior Odoo · Consultor técnico-funcional',
  },
  location: { en: 'El Salvador', es: 'El Salvador' } as Localized,
  email: 'naunflores620@gmail.com',
  website: { label: 'naunflores.com', href: 'https://naunflores.com' } as Link,
  links: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/naun-flores-485051174/' },
    { label: 'GitHub', href: 'https://github.com/naunflores620' },
  ] as Link[],

  summary: {
    en: 'Senior Odoo developer and technical-functional consultant, working with Odoo since 2020. I lead end-to-end ERP implementations that integrate every area of a company, from accounting, payroll and inventory to sales, purchasing and production, for businesses in El Salvador in manufacturing, import and distribution, restaurants and seafood import. My edge is combining hands-on development with functional knowledge of how those businesses really operate.',
    es: 'Desarrollador sénior Odoo y consultor técnico-funcional, trabajando con Odoo desde 2020. Lidero implementaciones de ERP de principio a fin que integran todas las áreas de la empresa, desde contabilidad, nómina e inventario hasta ventas, compras y producción, para empresas de El Salvador en fabricación, importación y venta, restaurantes e importación de mariscos. Mi diferencial es combinar el desarrollo con conocimiento funcional de cómo operan realmente esos negocios.',
  },

  functionalSummary: {
    en: 'End-to-end integration of every business area in a single ERP, for companies in El Salvador.',
    es: 'Integración completa de todas las áreas de la empresa en un solo ERP, para empresas de El Salvador.',
  },

  sectors: [
    { en: 'Manufacturing', es: 'Fabricación' },
    { en: 'Import and distribution', es: 'Importación y venta' },
    { en: 'Restaurants', es: 'Restaurantes' },
    { en: 'Seafood import', es: 'Importación de mariscos' },
  ] as Localized[],

  experience: [
    {
      title: {
        en: 'Senior Odoo Developer, Development and Implementation Lead',
        es: 'Desarrollador sénior Odoo, Líder de Desarrollo e Implementación',
      },
      company: 'GRUPO SOLUTECNO, S.A. DE C.V.',
      location: { en: 'El Salvador, full-time', es: 'El Salvador, jornada completa' },
      start: '2020-01',
      end: '',
      highlights: [
        {
          en: 'Lead a team of 3 developers and 2 IT support specialists, coordinating development, implementation and support from requirements analysis to go-live.',
          es: 'Dirijo un equipo de 3 desarrolladores y 2 especialistas de soporte TI, coordinando desarrollo, implementación y soporte desde el análisis de requerimientos hasta la puesta en marcha.',
        },
        {
          en: 'Deliver end-to-end ERP implementations that integrate every business area for companies in manufacturing, import and distribution, restaurants and seafood import.',
          es: 'Implemento ERP de principio a fin que integran todas las áreas del negocio, en empresas de fabricación, importación y venta, restaurantes e importación de mariscos.',
        },
        {
          en: 'Translate each client’s processes, from accounting and payroll to inventory and sales, into Odoo configuration and custom functionality as technical-functional consultant.',
          es: 'Traduzco los procesos de cada cliente, de contabilidad y nómina a inventario y ventas, a configuración y funcionalidad a medida en Odoo como consultor técnico-funcional.',
        },
        {
          en: 'Develop custom modules with the Odoo ORM, Python, XML/QWeb and OWL, and optimise slow views, reports and scheduled jobs on PostgreSQL.',
          es: 'Desarrollo módulos a medida con el ORM de Odoo, Python, XML/QWeb y OWL, y optimizo vistas, reportes y tareas programadas lentas sobre PostgreSQL.',
        },
        {
          en: 'Migrate modules and databases between Odoo versions, from 11 to 19, preserving business data.',
          es: 'Migro módulos y bases de datos entre versiones de Odoo, de la 11 a la 19, conservando la información del negocio.',
        },
        {
          en: 'Integrate Odoo with external systems through its APIs and services built with FastAPI.',
          es: 'Integro Odoo con sistemas externos mediante sus APIs y servicios construidos con FastAPI.',
        },
      ],
      tags: [
        same('Odoo 11–19'),
        { en: 'Full ERP', es: 'ERP completo' },
        { en: 'Team of 5', es: 'Equipo de 5' },
        { en: 'Multi-sector', es: 'Multisector' },
      ],
    },
  ] as Role[],

  projects: [
    {
      name: 'LexOS',
      description: {
        en: 'Own product: a virtual legal assistant built on case law from El Salvador.',
        es: 'Producto propio: un asistente legal virtual construido sobre jurisprudencia de El Salvador.',
      },
      tags: [same('Legal tech'), { en: 'Own product', es: 'Producto propio' }],
      href: '',
    },
  ] as Project[],

  skills: [
    {
      name: { en: 'Odoo development', es: 'Desarrollo Odoo' },
      items: [
        same('Odoo ORM'),
        { en: 'Custom modules', es: 'Módulos a medida' },
        same('XML / QWeb'),
        same('OWL'),
      ],
    },
    {
      name: { en: 'Backend and integrations', es: 'Backend e integraciones' },
      items: [same('Python'), same('FastAPI'), same('APIs')],
    },
    {
      name: { en: 'Frontend', es: 'Frontend' },
      items: [same('JavaScript'), same('OWL')],
    },
    {
      name: { en: 'Data and tools', es: 'Datos y herramientas' },
      items: [same('PostgreSQL'), same('Git')],
    },
  ] as SkillGroup[],

  areas: [
    {
      name: { en: 'Accounting', es: 'Contabilidad' },
      items: {
        en: 'Chart of accounts, journals, bank reconciliation, financial statements and accounting reports.',
        es: 'Plan de cuentas, diarios, conciliación bancaria, estados financieros y reportes contables.',
      },
    },
    {
      name: { en: 'Payroll', es: 'Nómina' },
      items: {
        en: 'Salary rules, earnings and deductions, benefits, social security contributions and payslips.',
        es: 'Reglas salariales, percepciones y deducciones, prestaciones, seguridad social y recibos de pago.',
      },
    },
    {
      name: { en: 'Inventory', es: 'Inventario' },
      items: {
        en: 'Stock control and valuation, lot and serial-number traceability, large product catalogues.',
        es: 'Control y valoración de existencias, trazabilidad por lote y número de serie, catálogos grandes.',
      },
    },
    {
      name: { en: 'Manufacturing', es: 'Fabricación' },
      items: {
        en: 'Production processes integrated with inventory, purchasing and accounting.',
        es: 'Procesos de producción integrados con inventario, compras y contabilidad.',
      },
    },
    {
      name: { en: 'Sales', es: 'Ventas' },
      items: {
        en: 'CRM pipeline, quotations, sales orders and electronic invoicing.',
        es: 'Embudo de CRM, cotizaciones, órdenes de venta y facturación electrónica.',
      },
    },
    {
      name: { en: 'Purchasing', es: 'Compras' },
      items: {
        en: 'Purchase requisitions, purchase orders and goods receipts.',
        es: 'Requisiciones, órdenes de compra y recepción de mercancía.',
      },
    },
  ] as Area[],

  education: [
    {
      degree: {
        en: 'Systems Engineering (Ingeniería de Sistemas Informáticos)',
        es: 'Ingeniería de Sistemas Informáticos',
      },
      status: { en: 'Graduated', es: 'Graduado' },
      school: 'Universidad de El Salvador',
      start: '2016',
      end: '2021',
    },
  ] as Education[],

  // Add only certifications you actually hold (name, issuer, year).
  certifications: [] as { name: string; issuer: string; year: string }[],

  languages: [
    { name: { en: 'Spanish', es: 'Español' }, level: { en: 'Native', es: 'Nativo' } },
    {
      name: { en: 'English', es: 'Inglés' },
      level: {
        en: 'Intermediate, self-assessed: technical documentation and written communication',
        es: 'Intermedio, autoevaluado: documentación técnica y comunicación escrita',
      },
    },
  ] as Language[],
};

export const t = (value: Localized, lang: Lang) => value[lang];

const MONTHS: Record<Lang, string[]> = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  es: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
};

function formatDate(value: string, lang: Lang) {
  const [year, month] = value.split('-');
  return month ? `${MONTHS[lang][Number(month) - 1]} ${year}` : year;
}

/** "Mar 2019 – Present", or '' when the start date is unknown. */
export function formatPeriod(start: string, end: string, lang: Lang) {
  if (!start) return '';
  const to = end ? formatDate(end, lang) : lang === 'en' ? 'Present' : 'Actualidad';
  return `${formatDate(start, lang)} – ${to}`;
}
