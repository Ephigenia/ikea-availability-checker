import nock from "nock";

import { BASE_URL_DEFAULT, IngkaApi } from "./ingka";

describe("INGKA API", function () {
  function createClient() {
    return new IngkaApi("my-client-id");
  }

  afterEach(() => {
    nock.cleanAll();
    nock.isDone();
  });

  describe('constructor', function() {
    it('sets serveral defaults', function() {
      const client = new IngkaApi();
      expect(client.client.defaults.headers).toHaveProperty('x-client-id');
      expect(client.client.defaults.headers['x-client-id']).toMatch(/[a-f0-9-]{32}/);
      expect(client.client.defaults.headers).toHaveProperty('accept', 'application/json;version=1');
    });
    it('merges the given options on top of the defaults', function() {
      const client = new IngkaApi('my-client-id', {
        baseURL: 'http://localhost:8080',
        timeout: 1000,
      });
      expect(client.client.defaults.timeout).toBe(1000);
      expect(client.client.defaults.baseURL).toBe('http://localhost:8080');
    });
  });

  describe("getAvailabilities", function () {
    describe('error handling', function() {
      it("non 200 status codes throw IngkaHttpError", async function () {
        expect.hasAssertions();
        nock(BASE_URL_DEFAULT)
          .get(() => true)
          .reply(401, "unauthorized");

        return expect(
          createClient().getAvailabilities("de", "1231231")
        ).rejects.toThrow(/unknown Response error/i);
      });

      it("throws a unknown errors", async function () {
        expect.hasAssertions();
        nock(BASE_URL_DEFAULT)
          .get(() => true)
          .reply(200, {
            errors: [
              {
                code: 300,
                message: 'made up error',
              }
            ]
          });

        return expect(
          createClient().getAvailabilities("de", "1231231")
        ).rejects.toThrow(/made up error/i);
      });

      it('throws a 422 error on invalid request params', async function() {
        expect.hasAssertions();
        nock(BASE_URL_DEFAULT)
          .get(() => true)
          .reply(422, {
            "code": 604,
            "message": "itemNos.0 in query should be at least 8 chars long"
          });
        return expect(
          createClient().getAvailabilities("de", "1")
        ).rejects.toThrow(/itemNos.0 in query/i);
      });

      it("invalid data structure throws an IngkaParseError", async function () {
        expect.hasAssertions();
        nock(BASE_URL_DEFAULT)
          .get(() => true)
          .reply(200, {});
        return expect(
          createClient().getAvailabilities("de", "1231231")
        ).rejects.toThrow(/data structure/i);
      });

      it("200 with 404 content error throws an error", async function () {
        expect.hasAssertions();
        nock(BASE_URL_DEFAULT)
          .get(() => true)
          .reply(200, {
            availabilities: null,
            data: [],
            errors: [
              {
                code: 404,
                details: {
                  classUnitCode: "DE",
                  classUnitType: "RU",
                  itemNo: "12313123",
                },
                message: "Not found",
              },
            ],
            timestamp: "2023-01-02T17:40:22.760Z",
            traceId: "12140262290630891232",
          });
        return expect(
          createClient().getAvailabilities("de", "1231231")
        ).rejects.toThrow(/not found/i);
      });
    }); // error handling

    it("returns an empty array when response is empty", async function () {
      expect.hasAssertions();
      nock(BASE_URL_DEFAULT)
        .get((uri) => uri.includes("234"))
        .query({
          expand: "StoresList,Restocks",
          itemNos: "123123",
        })
        .reply(200, { availabilities: [] });
      const stockInfo = await createClient().getAvailabilities("234", "123123");
      expect(stockInfo).toBeInstanceOf(Array);
      expect(stockInfo).toHaveLength(0);
    });

    it("uses the given options correctly", async function () {
      expect.hasAssertions();
      const client = await createClient();
      jest.spyOn(client.client, 'get').mockResolvedValueOnce({ data: { availabilities: [] }});
      await client.getAvailabilities(
        "982",
        "0982",
        ["StoresList"],
        {
          params: {
            custom: "value",
          },
        }
      );
      expect(client.client.get).toHaveBeenCalledTimes(1);
      expect(client.client.get as jest.Mock).toHaveBeenCalledWith('cia/availabilities/ru/982', {
        params: {
          expand: 'StoresList',
          itemNos: '0982',
          custom: 'value',
        }
      })
    });
  }); // getAvailabilities

  describe("multi-retail-unit fan-out (Spain)", function () {
    // A minimal-but-valid availability entry for the given store buCode,
    // so it survives validateResponseStructure / parseAvailabilitiesResponse
    // and is enriched with the Store record from src/data/stores.json.
    function storeEntry(buCode: string) {
      return {
        availableForCashCarry: true,
        buyingOption: {
          cashCarry: {
            availability: {
              probability: {
                thisDay: {
                  colour: { rgbDec: "", rgbHex: "", token: "" },
                  messageType: "HIGH_IN_STOCK",
                },
                updateDateTime: "2026-01-01T00:00:00Z",
              },
              quantity: 5,
              updateDateTime: "2026-01-01T00:00:00Z",
            },
            range: { inRange: true },
          },
          homeDelivery: { range: { inRange: true } },
        },
        classUnitKey: { classUnitCode: buCode, classUnitType: "STO" },
        itemKey: { itemNo: "11112222", itemType: "ART" },
      };
    }

    it("fans `--country es` out to ES + CE + SP and merges the results", async function () {
      expect.hasAssertions();
      nock(BASE_URL_DEFAULT)
        .get("/cia/availabilities/ru/ES")
        .query(true)
        .reply(200, { availabilities: [storeEntry("030")] }) // Valladolid
        .get("/cia/availabilities/ru/CE")
        .query(true)
        .reply(200, { availabilities: [storeEntry("023")] }) // Gran Canaria
        .get("/cia/availabilities/ru/SP")
        .query(true)
        .reply(200, { availabilities: [storeEntry("047")] }); // Mallorca

      const stockInfo = await createClient().getAvailabilities("es", "11112222");
      const buCodes = stockInfo.map((s) => s.buCode).sort();
      expect(buCodes).toEqual(["023", "030", "047"]);
      expect(nock.isDone()).toBe(true);
    });

    it("swallows a 404 from an extra retail unit", async function () {
      expect.hasAssertions();
      nock(BASE_URL_DEFAULT)
        .get("/cia/availabilities/ru/ES")
        .query(true)
        .reply(200, { availabilities: [storeEntry("030")] })
        .get("/cia/availabilities/ru/CE")
        .query(true)
        .reply(404, { message: "Not found" })
        .get("/cia/availabilities/ru/SP")
        .query(true)
        .reply(200, { availabilities: [storeEntry("047")] });

      const stockInfo = await createClient().getAvailabilities("es", "11112222");
      // mainland + the SP store survives; the 404 on CE is silently dropped.
      const buCodes = stockInfo.map((s) => s.buCode).sort();
      expect(buCodes).toEqual(["030", "047"]);
    });

    it("swallows a content-404 (HTTP 200 with errors[0].code=404) from an extra retail unit", async function () {
      // INGKA also represents "not found" as a 200 response with a 404
      // entry in `errors` (see the existing "200 with 404 content error
      // throws an error" test). The fan-out must accept this on extras
      // too, otherwise an item that the islands don't stock would break
      // the whole ES query.
      expect.hasAssertions();
      nock(BASE_URL_DEFAULT)
        .get("/cia/availabilities/ru/ES")
        .query(true)
        .reply(200, { availabilities: [storeEntry("030")] })
        .get("/cia/availabilities/ru/CE")
        .query(true)
        .reply(200, {
          availabilities: null,
          errors: [
            {
              code: 404,
              details: { classUnitCode: "CE", classUnitType: "RU", itemNo: "11112222" },
              message: "Not found",
            },
          ],
          timestamp: "2026-01-01T00:00:00Z",
          traceId: "trace-id",
        })
        .get("/cia/availabilities/ru/SP")
        .query(true)
        .reply(200, { availabilities: [storeEntry("047")] });

      const stockInfo = await createClient().getAvailabilities("es", "11112222");
      const buCodes = stockInfo.map((s) => s.buCode).sort();
      expect(buCodes).toEqual(["030", "047"]);
    });

    it("propagates non-404 failures from extra retail units", async function () {
      expect.hasAssertions();
      nock(BASE_URL_DEFAULT)
        .get("/cia/availabilities/ru/ES")
        .query(true)
        .reply(200, { availabilities: [] })
        .get("/cia/availabilities/ru/CE")
        .query(true)
        .reply(500, "internal server error")
        .get("/cia/availabilities/ru/SP")
        .query(true)
        .reply(200, { availabilities: [] });

      await expect(
        createClient().getAvailabilities("es", "11112222")
      ).rejects.toThrow();
    });

    it("propagates a failure from the primary retail unit", async function () {
      expect.hasAssertions();
      nock(BASE_URL_DEFAULT)
        .get("/cia/availabilities/ru/ES")
        .query(true)
        .reply(500, "internal server error")
        .get("/cia/availabilities/ru/CE")
        .query(true)
        .reply(200, { availabilities: [] })
        .get("/cia/availabilities/ru/SP")
        .query(true)
        .reply(200, { availabilities: [] });

      await expect(
        createClient().getAvailabilities("es", "11112222")
      ).rejects.toThrow();
    });

    it("does not fan out for single-retail-unit countries", async function () {
      expect.hasAssertions();
      nock(BASE_URL_DEFAULT)
        .get("/cia/availabilities/ru/de")
        .query(true)
        .reply(200, { availabilities: [] });

      const stockInfo = await createClient().getAvailabilities("de", "11112222");
      expect(stockInfo).toHaveLength(0);
      expect(nock.isDone()).toBe(true); // no extra CE/SP requests
    });
  }); // multi-retail-unit fan-out
}); // suite
