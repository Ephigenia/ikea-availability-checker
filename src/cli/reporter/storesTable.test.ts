import { createStoresReportTable } from "./storesTable";

describe('createStoresReportTable', function () {
  it('returns an empty table when no data is provided', function() {
    const table = createStoresReportTable([]);
    expect(table).toHaveLength(0);
  });
  it('returns a valid table data', function() {
    const table = createStoresReportTable([
      { countryCode: 'de', country: 'Germany', buCode: '123', name: 'Berlin', coordinates: [0, 0] },
      { countryCode: 'de', country: 'Germany', buCode: '124', name: 'Dortmund', coordinates: [0, 1] },
    ]);
    expect(table).toHaveLength(2);
  });
});
