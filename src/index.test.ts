import nock from "nock";

import * as checker from "./index";
import { BASE_URL_DEFAULT } from "./lib/ingka";
import { IngkaAvailabilitiesResponseDataItem } from "./lib/ingkaResponse";

describe("API", function () {
  const BU_CODE = "063";
  const PRODUCT_ID = "50411990";

  afterEach(() => {
    nock.isDone();
  });

  describe("availability", function () {
    it('throws an error when API replies with a HTTP error', function() {
      nock(BASE_URL_DEFAULT)
        .get((uri) => uri.includes("availabilities"))
        .reply(500, 'Internal Server Error');
      return expect(checker.availability(BU_CODE, PRODUCT_ID)).rejects.toThrow();
    });
    it('throws an error when a store with the given id could not be found', function() {
      return expect(() => checker.availability('12391', '12312')).rejects.toThrow();
    });

    it("parses the reply to an stock item info", async function () {
      nock(BASE_URL_DEFAULT)
        .get((uri) => uri.includes('availabilities'))
        .reply(200, {
          data: [
            {
              availableStocks: [
                {
                  type: "CASHCARRY",
                  quantity: 122,
                  updateDateTime: "2022-11-06T05:34:08.207Z",
                  probabilities: [
                    {
                      communication: {
                        messageType: "HIGH_IN_STOCK",
                      },
                    },
                  ],
                },
              ],
              classUnitKey: {
                classUnitCode: BU_CODE,
                classUnitType: "STO",
              },
              itemKey: {
                itemNo: PRODUCT_ID,
                itemType: "ART",
              },
            },
          ],
        });

      const stockInfo = await checker.availability(BU_CODE, PRODUCT_ID);
      expect(stockInfo).toEqual(
        expect.objectContaining({
          buCode: BU_CODE,
          productId: PRODUCT_ID,
          store: expect.objectContaining({}),
          createdAt: new Date("2022-11-06T05:34:08.207Z"),
          probability: "HIGH_IN_STOCK",
        })
      );
    });
  }); // availability

  describe('availabilities', function() {
    it('returns results', async function() {
      nock(BASE_URL_DEFAULT)
        .get((uri) => uri.includes('availabilities'))
        .reply(200, {
          data: [
            {
              availableStocks: [
                {
                  type: "CASHCARRY",
                  quantity: 122,
                  updateDateTime: "2022-11-06T05:34:08.207Z",
                  probabilities: [
                    {
                      communication: {
                        messageType: "HIGH_IN_STOCK",
                      },
                    },
                  ],
                  restocks: [
                    {
                      type: 'DELIVERY',
                      quantity: 23,
                      earliestDate: '2021-12-13',
                      latestDate: '2021-12-12',
                      updateDateTime: '2023-12-12',
                      reliability: 'HIGH',
                    }
                  ]
                },
              ],
              classUnitKey: {
                classUnitCode: BU_CODE,
                classUnitType: "STO",
              },
              itemKey: {
                itemNo: PRODUCT_ID,
                itemType: "ART",
              },
            } as IngkaAvailabilitiesResponseDataItem
          ],
        });
      const stores = checker.stores.findById([BU_CODE, '343', '326']);
      const stockinfo = await checker.availabilities(stores, ['1238127']);
      // the mocked response doesn’t contain data for the second bu code
      // and therefor the result only contains data for 1 store.
      expect(stockinfo).toHaveLength(1);
      expect(stockinfo[0]).toEqual(
        expect.objectContaining({
          buCode: BU_CODE,
          productId: PRODUCT_ID,
          store: expect.objectContaining({}),
          createdAt: new Date("2022-11-06T05:34:08.207Z"),
          probability: "HIGH_IN_STOCK",
        })
      );
    });
  }); // availabilities
}); // suite
