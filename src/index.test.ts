import * as checker from "./index";
import { BASE_URL_DEFAULT } from "./lib/ingka";
import nock from "nock";

describe("API", function () {
  const BU_CODE = "063";
  const PRODUCT_ID = "50411990";

  afterEach(() => {
    nock.isDone();
  });

  describe("availability", function () {
    it("parses the reply to an stock item info", async function () {
      nock(BASE_URL_DEFAULT)
        .get((uri) => uri.includes("availabilities"))
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
  });

  test.todo("availability");

  test.todo("findByCountryCode");
});
