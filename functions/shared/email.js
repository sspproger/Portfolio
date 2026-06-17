async function sendEmailNotification(payload, typeLabel) {
  if (process.env.EMAIL_ENABLED !== 'true') {
    return {
      skipped: true,
      reason: 'Email notifications are disabled',
    };
  }

  return {
    skipped: true,
    reason:
      'Email is marked as enabled, but SMTP sender is not implemented in this stage',
    payloadPreview: {
      typeLabel,
      pageUrl: payload.pageUrl,
      createdAt: payload.createdAt,
    },
  };
}

module.exports = {
  sendEmailNotification,
};