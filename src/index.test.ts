import nock from "nock";

import * as checker from "./index";
import { BASE_URL_DEFAULT } from "./lib/ingka";
import { IngkaAvailabilitiesResponse } from "./lib/ingkaResponse";

describe("API", function () {
  const BU_CODE = "063";
  const PRODUCT_ID = "50411990";
  const UPDATE_DATE_TIME = "2025-04-09T14:25:41.818Z";

  const RESPONSE = {
    availabilities: [
      {
        availableForCashCarry: true,
        availableForClickCollect: true,
        buyingOption: {
          cashCarry: {
            availability: {
              probability: {
                thisDay: {
                  colour: {
                    rgbDec: "10,138,0",
                    rgbHex: "#0A8A00",
                    token: "colour-positive",
                  },
                  messageType: "HIGH_IN_STOCK",
                },
                updateDateTime: UPDATE_DATE_TIME,
              },
              quantity: 88,
              updateDateTime: UPDATE_DATE_TIME,
            },
            eligibleForStockNotification: false,
            range: {
              inRange: true,
            },
            unitOfMeasure: "PIECE",
            updateDateTime: UPDATE_DATE_TIME,
          },
          clickCollect: {
            range: {
              inRange: true,
            },
          },
          homeDelivery: {
            range: {
              inRange: true,
            },
            updateDateTime: UPDATE_DATE_TIME,
          },
        },
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
  } as IngkaAvailabilitiesResponse;

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
        .get((uri) => uri.includes("availabilities"))
        .reply(200, RESPONSE);

      const stockInfo = await checker.availability(BU_CODE, PRODUCT_ID);
      expect(stockInfo).toEqual(
        expect.objectContaining({
          buCode: BU_CODE,
          productId: PRODUCT_ID,
          store: expect.objectContaining({}),
          createdAt: new Date(UPDATE_DATE_TIME),
          probability: "HIGH_IN_STOCK",
        }),
      );
    });
  }); // availability

  describe('availabilities', function() {
    it('returns results', async function() {
      nock(BASE_URL_DEFAULT)
        .get((uri) => uri.includes("availabilities"))
        .reply(200, RESPONSE);
      const stores = checker.stores.findById([BU_CODE, "343", "326"]);
      const stockinfo = await checker.availabilities(stores, ["1238127"]);
      // the mocked response doesn’t contain data for the second bu code
      // and therefor the result only contains data for 1 store.
      expect(stockinfo).toHaveLength(1);
      expect(stockinfo[0]).toEqual(
        expect.objectContaining({
          buCode: BU_CODE,
          productId: PRODUCT_ID,
          store: expect.objectContaining({}),
          createdAt: new Date(UPDATE_DATE_TIME),
          probability: "HIGH_IN_STOCK",
        }),
      );
    });
  }); // availabilities
}); // suite
