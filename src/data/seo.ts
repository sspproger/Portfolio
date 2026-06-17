import { site } from './site';

export type SEOItem = {
  title: string;
  description: string;
  h1: string;
  url: string;
  ogImage: string;
  noindex?: boolean;
};

export const seo: Record<string, SEOItem> = {
  '/': {
    title: 'Автоматизация процессов и цифровые системы для организаций',
    description:
      'Разработка цифровых систем для автоматизации заявок, документов, файлов, статусов, админ-панелей, личных кабинетов, рассылок и workflow-решений.',
    h1: 'Если процесс можно описать — его можно автоматизировать',
    url: '/',
    ogImage: site.ogImage,
  },

  '/services': {
    title: 'Услуги по автоматизации процессов и разработке цифровых систем',
    description:
      'Автоматизация бизнес-процессов, заявок, документов, файлов, админ-панелей, личных кабинетов, рассылок и workflow-систем.',
    h1: 'Услуги по автоматизации процессов',
    url: '/services',
    ogImage: site.ogImage,
  },

  '/projects': {
    title: 'Реализованные проекты цифровых систем и автоматизации',
    description:
      'Примеры реализованных цифровых систем для автоматизации заявок, файлов, документов, админ-панелей, статусов и рассылок.',
    h1: 'Реализованные проекты',
    url: '/projects',
    ogImage: site.ogImage,
  },

  '/projects/konkursbstu': {
    title:
      'Кейс konkursbstu.ru — автоматизация конкурсов, конференции, заявок и рассылок',
    description:
      'Кейс цифровой системы для автоматизации заявок, файлов, админ-панели, документов, приглашений и рассылок для конкурса и конференции.',
    h1: 'Кейс konkursbstu.ru',
    url: '/projects/konkursbstu',
    ogImage: site.ogImage,
  },

  '/request': {
    title: 'Заявка на автоматизацию процесса',
    description:
      'Опишите процесс, который нужно автоматизировать: заявки, документы, файлы, статусы, админ-панели, рассылки или workflow.',
    h1: 'Заявка на автоматизацию процесса',
    url: '/request',
    ogImage: site.ogImage,
  },

  '/contacts': {
    title: 'Контакты для обсуждения автоматизации процесса',
    description:
      'Контакты для связи и обсуждения разработки цифровой системы автоматизации: заявки, документы, файлы, админ-панели и workflow.',
    h1: 'Контакты',
    url: '/contacts',
    ogImage: site.ogImage,
  },

  '/demo': {
    title: 'Демо цифровой системы автоматизации',
    description:
      'Демонстрация логики цифровой системы: форма, заявка, админ-панель, статусы, документы и уведомления.',
    h1: 'Демо цифровой системы автоматизации',
    url: '/demo',
    ogImage: site.ogImage,
  },

  '/process': {
    title: 'Как проходит работа над системой автоматизации',
    description:
      'Этапы разработки цифровой системы: разбор процесса, MVP, интерфейсы, база данных, документы, уведомления и запуск.',
    h1: 'Как проходит работа',
    url: '/process',
    ogImage: site.ogImage,
  },

  '/about': {
    title: 'О разработчике цифровых систем автоматизации',
    description:
      'Информация о разработчике цифровых систем для автоматизации заявок, документов, файлов, админ-панелей, личных кабинетов и workflow.',
    h1: 'О разработчике',
    url: '/about',
    ogImage: site.ogImage,
  },

  '/services/business-process-automation': {
    title: 'Автоматизация бизнес-процессов для организаций',
    description:
      'Разработка цифровых систем для автоматизации повторяющихся бизнес-процессов: заявки, документы, статусы, админ-панели и workflow.',
    h1: 'Автоматизация бизнес-процессов',
    url: '/services/business-process-automation',
    ogImage: site.ogImage,
  },

  '/services/application-automation': {
    title: 'Автоматизация приёма и обработки заявок',
    description:
      'Системы для приёма заявок, хранения данных, загрузки файлов, управления статусами, уведомлений и админ-панелей.',
    h1: 'Автоматизация приёма заявок',
    url: '/services/application-automation',
    ogImage: site.ogImage,
  },

  '/services/custom-web-systems': {
    title: 'Индивидуальные веб-системы для автоматизации процессов',
    description:
      'Разработка индивидуальных цифровых систем под процессы организации: формы, базы данных, личные кабинеты, документы и интеграции.',
    h1: 'Индивидуальные веб-системы',
    url: '/services/custom-web-systems',
    ogImage: site.ogImage,
  },

  '/services/admin-panels': {
    title: 'Разработка административных панелей для заявок и данных',
    description:
      'Админ-панели для управления заявками, файлами, пользователями, статусами, документами и внутренними процессами.',
    h1: 'Административные панели',
    url: '/services/admin-panels',
    ogImage: site.ogImage,
  },

  '/services/document-generation': {
    title: 'Автоматическая генерация документов по данным',
    description:
      'Генерация документов, приглашений, справок, PDF и DOCX по данным из форм, заявок и цифровых систем.',
    h1: 'Генерация документов',
    url: '/services/document-generation',
    ogImage: site.ogImage,
  },

  '/services/event-portal': {
    title: 'Портал конкурса или конференции с автоматизацией заявок',
    description:
      'Разработка порталов для конкурсов, конференций и мероприятий: заявки, файлы, участники, документы, статусы, рассылки и админ-панель.',
    h1: 'Портал конкурса или конференции',
    url: '/services/event-portal',
    ogImage: site.ogImage,
  },
};

export function getSEO(path: string): SEOItem | undefined {
  const normalizedPath = path.split('?')[0].replace(/\/$/, '') || '/';

  return seo[normalizedPath];
}