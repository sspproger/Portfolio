const metrikaIdFromEnv = Number(import.meta.env.PUBLIC_YANDEX_METRIKA_ID || 0);

export const site = {
  name: 'Автоматизация процессов и цифровые системы',
  url: 'https://systechlab.ru',
  description:
    'Разработка цифровых систем для автоматизации заявок, документов, файлов, статусов, админ-панелей, личных кабинетов, рассылок и workflow-решений.',
  metrikaId: Number.isFinite(metrikaIdFromEnv) ? metrikaIdFromEnv : 0,
  apiBaseUrl: import.meta.env.PUBLIC_API_BASE_URL || '',
};