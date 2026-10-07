// Single source of truth for the website, the PDF and the DOCX résumé.
// Every string is bilingual. Leave a field empty ('' or []) to hide it everywhere.

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
  summary: Localized;
  highlights: Localized[];
}

export interface Area {
  name: Localized;
  items: Localized;
}

export interface Education {
  degree: Localized;
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

export const cv = {
  name: 'Naun Flores',
  headline: {
    en: 'Senior Odoo Developer and Functional Consultant',
    es: 'Developer Senior Odoo y Consultor Funcional',
  },
  profession: {
    en: 'Systems Engineer',
    es: 'Ingeniero de Sistemas Informáticos',
  },
  location: { en: 'El Salvador', es: 'El Salvador' } as Localized,
  // TODO: confirm whether the email should be public.
  email: '',
  links: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/naun-flores-485051174/' },
    { label: 'GitHub', href: 'https://github.com/naunflores620' },
  ] as Link[],

  summary: {
    en: 'Systems engineer who designs, builds and rolls out Odoo ERP solutions end to end. Since 2020 I have worked with every Odoo release from version 11 to version 19, writing custom modules, migrating databases between versions and connecting Odoo to external systems with Python and FastAPI. On the functional side I specialise in accounting and payroll, and I also configure sales, inventory and purchasing flows. Today I lead the development and implementation team at GRUPO SOLUTECNO, where I turn business requirements into working software and guide clients from analysis to go-live.',
    es: 'Ingeniero de sistemas que diseña, desarrolla e implementa soluciones ERP con Odoo de principio a fin. Desde 2020 he trabajado con todas las versiones de Odoo, de la 11 a la 19, escribiendo módulos a medida, migrando bases de datos entre versiones e integrando Odoo con sistemas externos con Python y FastAPI. En lo funcional me especializo en contabilidad y nómina, y también configuro flujos de ventas, inventario y compras. Actualmente lidero el equipo de desarrollo e implementación en GRUPO SOLUTECNO, donde convierto requerimientos de negocio en software funcionando y acompaño a los clientes desde el análisis hasta la puesta en marcha.',
  },

  /** Odoo releases worked with, oldest first. */
  odooVersions: [11, 12, 13, 14, 15, 16, 17, 18, 19],

  experience: [
    {
      title: {
        en: 'Senior Odoo Developer, Development and Implementation Lead',
        es: 'Developer Senior Odoo, Líder de Desarrollo e Implementación',
      },
      company: 'GRUPO SOLUTECNO, S.A. DE C.V.',
      location: { en: 'El Salvador, full-time', es: 'El Salvador, jornada completa' },
      start: '2020-01',
      end: '',
      summary: {
        en: 'Build Odoo modules across versions 11 to 19 and lead the team that implements them for client companies, acting as functional consultant for accounting and payroll.',
        es: 'Desarrollo módulos de Odoo en las versiones 11 a 19 y lidero el equipo que los implementa en empresas cliente, como consultor funcional de contabilidad y nómina.',
      },
      highlights: [
        {
          en: 'Lead the development and implementation team, planning the work and keeping projects on schedule.',
          es: 'Lidero el equipo de desarrollo e implementación, planificando el trabajo y cuidando los tiempos de cada proyecto.',
        },
        {
          en: 'Coordinate functional and technical consultants from requirements analysis to go-live.',
          es: 'Coordino consultores funcionales y técnicos desde el análisis de requerimientos hasta la puesta en marcha.',
        },
        {
          en: 'Map each client’s accounting and payroll processes onto Odoo as functional consultant.',
          es: 'Llevo a Odoo los procesos contables y de nómina de cada cliente como consultor funcional.',
        },
        {
          en: 'Develop custom modules in Python, XML/QWeb and JavaScript (OWL) on top of the Odoo ORM.',
          es: 'Desarrollo módulos a medida en Python, XML/QWeb y JavaScript (OWL) sobre el ORM de Odoo.',
        },
        {
          en: 'Migrate modules and databases between Odoo versions while preserving business data.',
          es: 'Migro módulos y bases de datos entre versiones de Odoo conservando la información del negocio.',
        },
        {
          en: 'Optimise the performance of views, reports and scheduled jobs on PostgreSQL.',
          es: 'Optimizo el rendimiento de vistas, reportes y tareas programadas sobre PostgreSQL.',
        },
        {
          en: 'Integrate Odoo with external systems through its APIs and services built with FastAPI.',
          es: 'Integro Odoo con sistemas externos mediante sus APIs y servicios construidos con FastAPI.',
        },
      ],
    },
  ] as Role[],

  areas: [
    {
      name: { en: 'Accounting', es: 'Contabilidad' },
      items: {
        en: 'Chart of accounts, tax localisation, bank reconciliation, financial statements and reports.',
        es: 'Plan de cuentas, localización fiscal, conciliación bancaria, estados financieros y reportes.',
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
      name: { en: 'Sales', es: 'Ventas' },
      items: {
        en: 'CRM pipeline, quotations, sales orders and electronic invoicing.',
        es: 'Embudo de CRM, cotizaciones, órdenes de venta y facturación electrónica.',
      },
    },
    {
      name: { en: 'Inventory', es: 'Inventario' },
      items: {
        en: 'Stock control, inventory valuation, lots and serial-number traceability.',
        es: 'Control de existencias, valoración de inventario, trazabilidad por lotes y números de serie.',
      },
    },
    {
      name: { en: 'Purchasing', es: 'Compras' },
      items: {
        en: 'Purchase requisitions, purchase orders and goods receipts.',
        es: 'Requisiciones, órdenes de compra y recepciones de mercancía.',
      },
    },
  ] as Area[],

  technical: [
    'Python',
    'Odoo ORM',
    'OWL',
    'JavaScript',
    'XML / QWeb',
    'FastAPI',
    'PostgreSQL',
    'Git',
  ],

  education: [
    {
      degree: {
        en: 'Systems Engineering (Ingeniería de Sistemas Informáticos)',
        es: 'Ingeniería de Sistemas Informáticos',
      },
      school: 'Universidad de El Salvador',
      start: '2016',
      end: '2021',
    },
  ] as Education[],

  // Add only certifications you actually hold (name, issuer, year).
  certifications: [] as { name: string; issuer: string; year: string }[],

  languages: [
    { name: { en: 'Spanish', es: 'Español' }, level: { en: 'Native', es: 'Nativo' } },
    { name: { en: 'English', es: 'Inglés' }, level: { en: 'Intermediate', es: 'Intermedio' } },
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
