export const siteConfig = {
  title: 'A-SEARCH - African Search Engine for Community Health Research',
  description:
    'A comprehensive health research data management platform for African community health research, providing analytics, data management, and research tools for population and health data.',
  /** Without additional '/' on the end, e.g. https://a-search.org */
  url: 'https://a-search.org',
  /** Organization details */
  organization: {
    name: 'A-SEARCH Team',
    email: 'contact@a-search.org',
    website: 'https://a-search.org',
  },
  /** Application features */
  features: {
    analytics: true,
    dataManagement: true,
    mapping: true,
    userManagement: true,
    siteManagement: true,
    healthAnalysis: true,
    populationData: true,
    householdData: true,
  },
  /** Default settings */
  defaults: {
    pageSize: 10,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    supportedImageFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    supportedDocumentFormats: ['pdf', 'doc', 'docx', 'xls', 'xlsx'],
  },
};
