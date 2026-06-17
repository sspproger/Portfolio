function getAllowedOrigin(requestOrigin) {
  const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';

  if (allowedOrigin === '*') {
    return '*';
  }

  if (requestOrigin && requestOrigin === allowedOrigin) {
    return requestOrigin;
  }

  return allowedOrigin;
}

function getCorsHeaders(origin) {
  const allowedOrigin = getAllowedOrigin(origin);

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json; charset=utf-8',
  };
}

function jsonResponse(statusCode, body, origin) {
  return {
    statusCode,
    headers: getCorsHeaders(origin),
    body: JSON.stringify(body),
  };
}

function success(body, origin) {
  return jsonResponse(
    200,
    {
      ok: true,
      ...body,
    },
    origin
  );
}

function badRequest(message, origin) {
  return jsonResponse(
    400,
    {
      ok: false,
      message,
    },
    origin
  );
}

function serverError(message, origin) {
  return jsonResponse(
    500,
    {
      ok: false,
      message,
    },
    origin
  );
}

function handleOptions(origin) {
  return {
    statusCode: 204,
    headers: getCorsHeaders(origin),
    body: '',
  };
}

module.exports = {
  jsonResponse,
  success,
  badRequest,
  serverError,
  handleOptions,
};