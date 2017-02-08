'use strict';

let data = require('./../data/stores.json');

module.exports = {
  findNameByBuCode: function(buCode) {
    let store = data.find(function(store) {
      return store.buCode === buCode;
    });
    if (store) {
      return store.name;
    }
    return null;
  },
};
