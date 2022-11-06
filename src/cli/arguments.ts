import { Argument } from 'commander';

export default {
  countryCode: new Argument('[countryCodes...]', 'list of country codes of which the stores should be shown'),
  productIds: new Argument('[productIds...]')
};
