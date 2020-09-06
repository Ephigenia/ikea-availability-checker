'use strict';

module.exports = {
  createReport: function(data) {
    return JSON.stringify(data, null, "\t");
  },
};
