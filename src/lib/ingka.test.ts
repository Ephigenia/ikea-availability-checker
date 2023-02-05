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
      it.only("non 200 status codes throw IngkaResponseError", async function () {
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
        .reply(200, { data: [] });
      const stockInfo = await createClient().getAvailabilities("234", "123123");
      expect(stockInfo).toBeInstanceOf(Array);
      expect(stockInfo).toHaveLength(0);
    });

    it("uses the given options correctly", async function () {
      expect.hasAssertions();
      const client = await createClient();
      jest.spyOn(client.client, 'get').mockResolvedValueOnce({ data: { data: [] }});
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
}); // suite
