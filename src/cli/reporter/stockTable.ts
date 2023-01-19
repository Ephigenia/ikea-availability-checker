import { green, yellow, white, red } from "@colors/colors";
import CliTable3 from "cli-table3";
import { ItemStockInfo, PRODUCT_AVAILABILITY } from "../../lib/ingka";

export function daysUntil(to: Date = new Date()): number {
  return Math.floor(
    (to.getTime() - new Date().getTime()) / 60 / 60 / 24 / 1000
  );
}

export function availabilityColor(val: number): string {
  if (val >= 5) {
    return green(String(val));
  } else if (val >= 1) {
    return yellow(String(val));
  } else {
    return red(String(val || "0"));
  }
}

function probabilityColor(val: PRODUCT_AVAILABILITY | unknown): string {
  switch (val) {
    case PRODUCT_AVAILABILITY.HIGH_IN_STOCK:
      return green(val);
    case PRODUCT_AVAILABILITY.LOW_IN_STOCK:
      return yellow(val);
    case PRODUCT_AVAILABILITY.OUT_OF_STOCK:
      return red(val);
    default:
      return white(String(val || ""));
  }
}

export function createStockInfoReportTable(
  data: ItemStockInfo[]
): CliTable3.Table {
  const table = new CliTable3({
    head: [
      "date",
      "product",
      "countryCode",
      "country",
      "storeId (buCode)",
      "store",
      "stock",
      "probability",
      "restockDate",
    ],
    colAligns: [
      "left",
      "left",
      "left",
      "left",
      "left",
      "left",
      "left",
      "right",
      "right",
    ],
  });

  // transform the data to the array of objects
  table.push(
    ...data.map((stockInfo): string[] => [
      stockInfo.createdAt ? stockInfo.createdAt.toISOString() : "",
      stockInfo.productId,
      stockInfo.store.countryCode,
      stockInfo.store.country,
      stockInfo.store.buCode,
      stockInfo.store.name,
      availabilityColor(stockInfo.stock),
      probabilityColor(stockInfo.probability),
      stockInfo.restockDate
        ? `in ${daysUntil(stockInfo.restockDate)}d (${stockInfo.restockDate
            .toISOString()
            .substring(0, 10)})`
        : "",
    ])
  );

  return table;
}
