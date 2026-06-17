import { contacts } from './contacts';
import { faq } from './faq';
import { site } from './site';
import { joinUrl } from '../utils/seo';

type BreadcrumbItem = {
  name: string;
  url: string;
};

type FAQItem = {
  question: string;
  answer: string;
};

export function createPersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: contacts.name,
    jobTitle: `${contacts.degree}, ${contacts.position}`,
    telephone: contacts.phone,
    affiliation: {
      '@type': 'Organization',
      name: contacts.organization,
    },
    url: site.url,
  };
}

export function createOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: site.url,
    founder: {
      '@type': 'Person',
      name: contacts.name,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: contacts.phone,
      contactType: 'customer support',
      areaServed: 'RU',
      availableLanguage: 'Russian',
    },
  };
}

export function createWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    alternateName: site.shortName,
    url: site.url,
    inLanguage: site.language,
    description: site.description,
  };
}

export function createServiceSchema(input?: {
  name?: string;
  description?: string;
  url?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: input?.name || 'Автоматизация процессов и разработка цифровых систем',
    description: input?.description || site.description,
    provider: {
      '@type': 'Person',
      name: contacts.name,
      telephone: contacts.phone,
    },
    areaServed: {
      '@type': 'Country',
      name: 'Russia',
    },
    serviceType: 'Разработка цифровых систем автоматизации',
    url: input?.url ? joinUrl(site.url, input.url) : site.url,
  };
}

export function createBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: joinUrl(site.url, item.url),
    })),
  };
}

export function createCaseStudySchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: 'Кейс konkursbstu.ru',
    headline:
      'Кейс konkursbstu.ru — автоматизация конкурсов, конференции, заявок и рассылок',
    description:
      'Кейс цифровой системы для автоматизации заявок, файлов, админ-панели, документов, приглашений и рассылок для конкурса и конференции.',
    url: joinUrl(site.url, '/projects/konkursbstu'),
    author: {
      '@type': 'Person',
      name: contacts.name,
    },
    inLanguage: site.language,
  };
}

export function createFAQSchema(faqItems: FAQItem[] = faq.slice(0, 6)) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}