import { green, yellow, white, red } from "ansis";
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

export enum AVAILABILITY_STATUS {
  IN_STOCK = "in stock",
  OUT_OF_STOCK = "out of stock",
  ORDER_ONLY = "order only",
  NOT_SOLD = "not sold",
}

/**
 * Summarizes how a product can be bought at a store, combining the stock
 * with the cash & carry and home delivery range flags.
 */
export function availabilityStatus(
  stockInfo: Pick<ItemStockInfo, "stock" | "inRange" | "homeDeliveryInRange">
): AVAILABILITY_STATUS {
  if (stockInfo.stock > 0) return AVAILABILITY_STATUS.IN_STOCK;
  if (stockInfo.inRange) return AVAILABILITY_STATUS.OUT_OF_STOCK;
  if (stockInfo.homeDeliveryInRange) return AVAILABILITY_STATUS.ORDER_ONLY;
  return AVAILABILITY_STATUS.NOT_SOLD;
}

function availabilityStatusColor(val: AVAILABILITY_STATUS): string {
  switch (val) {
    case AVAILABILITY_STATUS.IN_STOCK:
      return green(val);
    case AVAILABILITY_STATUS.OUT_OF_STOCK:
    case AVAILABILITY_STATUS.ORDER_ONLY:
      return yellow(val);
    default:
      return red(val);
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
      "availability",
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
      "left",
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
      availabilityStatusColor(availabilityStatus(stockInfo)),
    ])
  );

  return table;
}
