const metrikaIdFromEnv = Number(import.meta.env.PUBLIC_YANDEX_METRIKA_ID || 0);

export const site = {
  name: 'Автоматизация процессов и цифровые системы',
  shortName: 'Автоматизация процессов',
  url: 'https://systechlab.ru',
  description:
    'Разработка цифровых систем для автоматизации заявок, документов, файлов, статусов, админ-панелей, личных кабинетов, рассылок и workflow-решений.',
  author: 'Николай Сергеевич Любимый',
  locale: 'ru_RU',
  language: 'ru',
  ogImage: '/og-image.svg',
  favicon: '/favicon.svg',
  metrikaId: Number.isFinite(metrikaIdFromEnv) ? metrikaIdFromEnv : 0,
  apiBaseUrl: import.meta.env.PUBLIC_API_BASE_URL || '',
  yandexVerification: '',
};