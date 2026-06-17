const MAX_PAYLOAD_SIZE = 100_000;

function safeString(value, maxLength = 1000) {
  if (value === null || value === undefined) {
    return '';
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => safeString(item, maxLength))
      .filter(Boolean)
      .join(', ')
      .slice(0, maxLength);
  }

  if (typeof value === 'object') {
    return JSON.stringify(value).slice(0, maxLength);
  }

  return String(value).trim().slice(0, maxLength);
}

function getRequiredField(fields, name, label) {
  const value = safeString(fields[name], 2000);

  if (!value) {
    const error = new Error(`Поле "${label}" обязательно для заполнения`);
    error.isValidationError = true;
    throw error;
  }

  return value;
}

function ensurePayloadSize(payload) {
  const raw = JSON.stringify(payload);

  if (raw.length > MAX_PAYLOAD_SIZE) {
    const error = new Error('Payload слишком большой');
    error.isValidationError = true;
    throw error;
  }
}

function sanitizeObject(value, maxLength = 2000) {
  if (!value || typeof value !== 'object') {
    return {};
  }

  const result = {};

  Object.entries(value).forEach(([key, item]) => {
    const safeKey = safeString(key, 100);

    if (!safeKey) {
      return;
    }

    if (Array.isArray(item)) {
      result[safeKey] = item.map((entry) => safeString(entry, maxLength));
      return;
    }

    if (item && typeof item === 'object') {
      result[safeKey] = sanitizeObject(item, maxLength);
      return;
    }

    result[safeKey] = safeString(item, maxLength);
  });

  return result;
}

function normalizePayload(payload) {
  ensurePayloadSize(payload);

  const normalized = {
    formType: safeString(payload.formType, 100),
    pageUrl: safeString(payload.pageUrl, 2000),
    pageTitle: safeString(payload.pageTitle, 500),
    utm: sanitizeObject(payload.utm || {}, 500),
    fields: sanitizeObject(payload.fields || {}, 3000),
    createdAt: safeString(payload.createdAt, 100),
    clientId: safeString(payload.clientId, 200),
    demoMode: false,
  };

  return normalized;
}

function validateLeadPayload(payload) {
  const normalized = normalizePayload(payload);
  const fields = normalized.fields;

  getRequiredField(fields, 'name', 'Имя');
  getRequiredField(fields, 'phone', 'Телефон');
  getRequiredField(fields, 'message', 'Краткое описание процесса');

  normalized.formType = 'lead';

  return normalized;
}

function validateBriefPayload(payload) {
  const normalized = normalizePayload(payload);
  const fields = normalized.fields;

  getRequiredField(fields, 'name', 'Имя');
  getRequiredField(fields, 'phone', 'Телефон');
  getRequiredField(fields, 'process', 'Какой процесс нужно автоматизировать');

  normalized.formType = 'brief';

  return normalized;
}

function validateLeadMagnetPayload(payload) {
  const normalized = normalizePayload(payload);
  const fields = normalized.fields;

  getRequiredField(fields, 'name', 'Имя');
  getRequiredField(fields, 'contact', 'Телефон или email');
  getRequiredField(fields, 'lead_magnet', 'Лид-магнит');

  normalized.formType = 'lead_magnet';

  return normalized;
}

module.exports = {
  safeString,
  getRequiredField,
  validateLeadPayload,
  validateBriefPayload,
  validateLeadMagnetPayload,
};