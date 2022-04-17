module.exports = {

  /**
   * Normalize the buCode
   *
   * Note that the buCode "003" must keep the zeros
   *
   * @param {string} buCode
   * @returns {string}
   */
  normalizeBuCode(buCode) {
    return String(buCode || '').replace(/[^0-9]/g, '');
  },

  /**
   * @param {string} productId
   * @returns {string}
   */
  normalizeProductId(productId) {
    return String(productId || '').replace(/[^0-9]+/gi, '').trim();
  }
};
