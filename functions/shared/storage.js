async function saveLead(payload, typeLabel) {
  return {
    skipped: true,
    reason: 'Storage is not connected yet',
    payloadPreview: {
      typeLabel,
      formType: payload.formType,
      pageUrl: payload.pageUrl,
      createdAt: payload.createdAt,
    },
  };
}

module.exports = {
  saveLead,
};