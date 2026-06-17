function formatValue(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean).join(', ');
  }

  if (value && typeof value === 'object') {
    return JSON.stringify(value);
  }

  return value || '—';
}

function formatUtm(utm) {
  if (!utm || typeof utm !== 'object') {
    return '—';
  }

  const rows = [
    `source: ${utm.utm_source || '—'}`,
    `medium: ${utm.utm_medium || '—'}`,
    `campaign: ${utm.utm_campaign || '—'}`,
    `content: ${utm.utm_content || '—'}`,
    `term: ${utm.utm_term || '—'}`,
  ];

  return rows.join('\n');
}

function formatTelegramMessage(payload, typeLabel) {
  const fields = payload.fields || {};

  const rows = [
    `🆕 Новая заявка: ${typeLabel}`,
    '',
    `Имя: ${formatValue(fields.name)}`,
    `Телефон: ${formatValue(fields.phone)}`,
    `Контакт: ${formatValue(fields.contact)}`,
    `Email: ${formatValue(fields.email)}`,
    `Организация: ${formatValue(fields.company)}`,
    '',
    `Процесс / сообщение:`,
    `${formatValue(fields.process || fields.message || fields.comment)}`,
    '',
    `Модули: ${formatValue(fields.modules)}`,
    `Где сейчас ведётся: ${formatValue(fields.current_place)}`,
    `Срок: ${formatValue(fields.term)}`,
    `Лид-магнит: ${formatValue(fields.lead_magnet)}`,
    '',
    `Страница: ${payload.pageUrl || '—'}`,
    `Заголовок страницы: ${payload.pageTitle || '—'}`,
    `Client ID: ${payload.clientId || '—'}`,
    `Дата: ${payload.createdAt || new Date().toISOString()}`,
    '',
    `UTM:`,
    formatUtm(payload.utm),
  ];

  return rows.join('\n');
}

async function sendTelegramMessage(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return {
      skipped: true,
      reason: 'Telegram is not configured',
    };
  }

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: true,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.description || `Telegram API error: ${response.status}`
    );
  }

  return {
    ok: true,
    telegramMessageId: data.result && data.result.message_id,
  };
}

module.exports = {
  formatTelegramMessage,
  sendTelegramMessage,
};