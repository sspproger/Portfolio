export const utmFields = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
] as const;

export type UTMField = (typeof utmFields)[number];

export function emptyUtm() {
  return {
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    utm_content: '',
    utm_term: '',
  };
}