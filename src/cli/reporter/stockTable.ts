import * as color from 'ansi-colors';
import CliTable3 from 'cli-table3';
import { ItemStockInfo, PRODUCT_AVAILABILITY } from '../../lib/ingka';

export function availabilityColor(val: number): color.StyleFunction {
  if (val >= 5) {
    return color.green;
  } else if (val >= 1) {
    return color.yellow;
  } else {
    return color.red;
  }
}

export function diffDays(date1: Date, date2: Date): number {
  return (date1.getTime() - date2.getTime()) / 60 / 60 / 24 / 1000;
}

function probabilityColor(val: PRODUCT_AVAILABILITY): color.StyleFunction {
  switch (val) {
    case PRODUCT_AVAILABILITY.HIGH_IN_STOCK:
      return color.green;
    case PRODUCT_AVAILABILITY.LOW_IN_STOCK:
      return color.yellow;
    case PRODUCT_AVAILABILITY.OUT_IN_STOCK:
        return color.yellow;
    default:
      return color.white;
  }
}


export function createStockInfoReportTable(data: ItemStockInfo[]): CliTable3.Table {
  const table = new CliTable3({
    head: [
      'date',
      'product',
      'countryCode',
      'country',
      'storeId (buCode)',
      'store',
      'stock',
      'probability',
      'restockDate',
    ],
    colAligns: [
      null,
      null,
      null,
      null,
      null,
      null,
      'right',
      'right',
    ],
  });

  // transform the data to the array of objects
  table.push(...data.map((stockInfo): string[] => [
    stockInfo.createdAt.toISOString(),
    stockInfo.productId,
    stockInfo.store.countryCode,
    stockInfo.store.country,
    stockInfo.store.buCode,
    stockInfo.store.name,
    availabilityColor(stockInfo.stock)(String(stockInfo.stock)),
    probabilityColor(stockInfo.probability)(stockInfo.probability),
    stockInfo.restockDate?.toISOString(),
  ]));

  return table;
}
