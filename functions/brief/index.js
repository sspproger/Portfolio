const crypto = require('crypto');

const {
  success,
  badRequest,
  serverError,
  handleOptions,
} = require('../shared/response');

const { validateBriefPayload } = require('../shared/validate');

const {
  formatTelegramMessage,
  sendTelegramMessage,
} = require('../shared/telegram');

const { sendEmailNotification } = require('../shared/email');
const { saveLead } = require('../shared/storage');

function getOrigin(event) {
  const headers = event.headers || {};
  return headers.origin || headers.Origin || '';
}

function getHttpMethod(event) {
  return event.httpMethod || event.method || '';
}

function parseBody(event) {
  if (!event.body) {
    return {};
  }

  const body = event.isBase64Encoded
    ? Buffer.from(event.body, 'base64').toString('utf8')
    : event.body;

  if (typeof body === 'object') {
    return body;
  }

  return JSON.parse(body);
}

module.exports.handler = async function handler(event) {
  const origin = getOrigin(event);

  try {
    if (getHttpMethod(event).toUpperCase() === 'OPTIONS') {
      return handleOptions(origin);
    }

    const rawPayload = parseBody(event);
    const payload = validateBriefPayload(rawPayload);
    const requestId = crypto.randomUUID();

    payload.demoMode = false;
    payload.requestId = requestId;

    const typeLabel = 'Подробный brief';
    const telegramText = formatTelegramMessage(payload, typeLabel);

    const telegramResult = await sendTelegramMessage(telegramText);
    const emailResult = await sendEmailNotification(payload, typeLabel);
    const storageResult = await saveLead(payload, typeLabel);

    return success(
      {
        message: 'Заявка успешно отправлена',
        requestId,
        notifications: {
          telegram: telegramResult,
          email: emailResult,
          storage: storageResult,
        },
      },
      origin
    );
  } catch (error) {
    console.error('[brief function error]', error);

    if (error.isValidationError) {
      return badRequest(error.message, origin);
    }

    if (error instanceof SyntaxError) {
      return badRequest('Некорректный JSON в теле запроса', origin);
    }

    return serverError('Не удалось отправить заявку', origin);
  }
};