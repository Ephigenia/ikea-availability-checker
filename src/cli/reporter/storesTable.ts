import CliTable3 from "cli-table3";
import { Store } from "../../lib/stores";

export function show(stores: Store[]) {
  const table = new CliTable3({
    head: [
      'countryCode',
      'country',
      'buCode',
      'name',
    ],
  });



  table.push(...stores.map((store) => [
    store.countryCode,
    store.country,
    store.buCode,
    store.name,
  ]))

  return table.toString();
}
