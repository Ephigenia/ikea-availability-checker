import Table from 'cli-table3';
import countries from 'i18n-iso-countries';

export default {
  sort(a, b, attribute) {
    if (a[attribute] > b[attribute]) {
      return 1;
    } else if (a[attribute] < b[attribute]) {
      return -1;
    }
    return 0;
  },
  show: function(stores) {
    let table = new Table({
      head: [
        'countryCode',
        'country',
        'buCode',
        'name',
      ],
    });

    // sort data by countryCode and buCode in ascending order
    stores.sort((a, b) => this.sort(a, b, 'countryCode'))
    stores.sort((a, b) => this.sort(a, b, 'buCode'));

    stores.forEach(function(item) {
      table.push([
        item.countryCode,
        countries.getName(item.countryCode, 'en'),
        item.buCode,
        item.name,
      ]);
    });

    return table.toString();
  },
};
