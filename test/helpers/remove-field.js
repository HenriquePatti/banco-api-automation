function removeField(payload, field) {
  const body = { ...payload };
  delete body[field];
  return body;
};

module.exports = {
    removeField
}