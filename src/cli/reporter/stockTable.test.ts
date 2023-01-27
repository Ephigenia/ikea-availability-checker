import { ItemStockInfo, PRODUCT_AVAILABILITY } from "../../lib/ingka";
import { createStockInfoReportTable, daysUntil } from "./stockTable";

describe("daysUntil", function () {
  it("returns more than 1 day for days in the future", function () {
    const dates = [new Date("2030-01-08T15:14:49.634Z")];
    const result = daysUntil(dates[0]);
    expect(result).toBeGreaterThanOrEqual(1);
  });
  it("returns 1 for tomorrow date", function () {
    const dates = [
      new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() + 1,
        new Date().getHours() + 1
      ),
    ];
    const result = daysUntil(dates[0]);
    expect(result).toBe(1);
  });
});

describe('createStockInfoReportTable', function() {
  beforeEach(() => {
    jest
      .useFakeTimers()
      .setSystemTime(new Date('2023-01-20'));
  });
  const now = new Date('2023-01-19T11:18:06.774Z');
  const in2Days = new Date(now.getTime());
  in2Days.setDate(now.getDate() + 2);
  const exampleData: ItemStockInfo[] = [
    {
      buCode: '1',
      productId: '2',
      stock: 1,
      store: {
        buCode: '1',
        coordinates: [1, 2],
        country: 'Germany',
        countryCode: 'de',
        name: 'Berlin',
      },
      createdAt: now,
      probability: PRODUCT_AVAILABILITY.HIGH_IN_STOCK,
      restockDate: in2Days,
    },
    {
      buCode: '2',
      productId: '34',
      stock: 0,
      store: {
        buCode: '2',
        coordinates: [2, 3],
        country: 'Belgium',
        countryCode: 'be',
        name: 'Berlin',
      },
      createdAt: now,
      probability: PRODUCT_AVAILABILITY.OUT_OF_STOCK,
    },
    {
      buCode: '3',
      productId: '34',
      stock: 20,
      store: {
        buCode: '2',
        coordinates: [2, 3],
        country: 'Belgium',
        countryCode: 'be',
        name: 'Berlin',
      },
      createdAt: now,
      probability: PRODUCT_AVAILABILITY.LOW_IN_STOCK,
    },
  ];

  it('returns an empty table when no data is provided', function() {
    const table = createStockInfoReportTable([]);
    expect(table).toHaveLength(0);
  });
  it('returns valid table data', function() {
    const table = createStockInfoReportTable(exampleData);
    expect(table).toHaveLength(3);
    const str = table.toString().split(/\n/);
    expect(str).toHaveLength(9);
    expect(str[3]).toMatch(/2023-01-19T11:18:06.774Z/);
    expect(str[3]).toMatch(/HIGH_IN_STOCK/);
  });
  it('shows the restock date with relative days', function() {
    const table = createStockInfoReportTable(exampleData);
    const str = table.toString().split(/\n/);
    expect(str[3]).toMatch(/in 1d \(2023-01-21\)/);
  });
  it('renders all header fields', function() {
    const table = createStockInfoReportTable([]);
    const str = table.toString();
    expect(str).toMatch(/date/)
    expect(str).toMatch(/product/);
    expect(str).toMatch(/countryCode/);
    expect(str).toMatch(/country/);
    expect(str).toMatch(/storeId/);
    expect(str).toMatch(/store/);
    expect(str).toMatch(/stock/);
    expect(str).toMatch(/probability/);
    expect(str).toMatch(/restockDate/);
  });
});
