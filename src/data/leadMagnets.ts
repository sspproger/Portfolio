export type LeadMagnet = {
  title: string;
  slug: string;
  description: string;
  buttonLabel: string;
  href: string;
  goal: string;
  type: string;
};

export const leadMagnets: LeadMagnet[] = [
  {
    title: 'PDF-кейс konkursbstu.ru',
    slug: 'pdf-case-konkursbstu',
    description:
      'Разбор реализованной цифровой системы для конкурса, конференции, заявок, файлов, документов и рассылок.',
    buttonLabel: 'Скачать PDF-кейс',
    href: '/pdf/konkursbstu-case.pdf',
    goal: 'pdf_case_download',
    type: 'pdf',
  },
  {
    title: 'Бесплатный разбор процесса',
    slug: 'free-process-review',
    description:
      'Короткий разбор: что можно автоматизировать, с чего начать и какой MVP можно сделать первым.',
    buttonLabel: 'Получить разбор',
    href: '/request',
    goal: 'cta_process_review_click',
    type: 'consultation',
  },
  {
    title: 'Предварительная оценка MVP',
    slug: 'mvp-estimate',
    description:
      'Оценка состава первого MVP: формы, база данных, админ-панель, документы, уведомления и сроки.',
    buttonLabel: 'Оценить MVP',
    href: '/request',
    goal: 'lead_magnet_submit',
    type: 'estimate',
  },
  {
    title: 'Чек-лист автоматизации',
    slug: 'automation-checklist',
    description:
      'Список признаков, по которым можно понять, что процесс пора переносить в цифровую систему.',
    buttonLabel: 'Получить чек-лист',
    href: '/request',
    goal: 'lead_magnet_submit',
    type: 'checklist',
  },
  {
    title: 'Демо похожей системы',
    slug: 'similar-system-demo',
    description:
      'Демонстрация логики похожей системы: формы, статусы, админ-панель, документы и рассылки.',
    buttonLabel: 'Посмотреть демо',
    href: '/demo',
    goal: 'demo_view',
    type: 'demo',
  },
];