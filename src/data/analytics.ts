export const analyticsGoals = {
  short_form_submit: 'short_form_submit',
  brief_form_submit: 'brief_form_submit',
  lead_magnet_submit: 'lead_magnet_submit',

  phone_click: 'phone_click',
  telegram_click: 'telegram_click',

  pdf_case_download: 'pdf_case_download',
  case_view: 'case_view',
  demo_view: 'demo_view',
  request_page_view: 'request_page_view',
  contacts_page_view: 'contacts_page_view',
  about_page_view: 'about_page_view',
  process_page_view: 'process_page_view',

  cta_process_review_click: 'cta_process_review_click',
  service_to_request_click: 'service_to_request_click',
  project_case_click: 'project_case_click',
  external_case_open: 'external_case_open',
  service_card_click: 'service_card_click',
  demo_request_click: 'demo_request_click',
} as const;

export type AnalyticsGoal = keyof typeof analyticsGoals;

const metrikaIdFromEnv = Number(import.meta.env.PUBLIC_YANDEX_METRIKA_ID || 0);

export const metrikaConfig = {
  enabled: true,
  id: Number.isFinite(metrikaIdFromEnv) ? metrikaIdFromEnv : 0,
};