import { BASE_URL_DEFAULT, IngkaApi } from './ingka';
import nock from 'nock';
import { IngkaNotFoundError, IngkaParseError, IngkaResponseError } from './ingkaErrors';

describe('INGKA API', function() {

  function createClient() {
    return new IngkaApi('my-client-id');
  }

  afterEach(() => {
    nock.cleanAll();
    nock.isDone();
  })

  describe('getAvailabilities', function() {

    it('non 200 status codes throw IngkaResponseError', async function() {
      expect.hasAssertions();
      nock(BASE_URL_DEFAULT)
        .get(() => true)
        .reply(401, 'unauthorized');
      try {
        await createClient().getAvailabilities('de', '1231231');
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(IngkaResponseError);
        expect(error).toEqual(expect.objectContaining({
          message: expect.stringMatching(/status code 401/i),
        }))
      }
    });

    it('404 throws IngkaNotFoundError', async function() {
      expect.hasAssertions();
      nock(BASE_URL_DEFAULT)
        .get(() => true)
        .reply(404, 'not found');
      try {
        await createClient().getAvailabilities('de', '1231231');
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(IngkaNotFoundError);
        expect(error).toEqual(expect.objectContaining({
          message: expect.stringMatching(/status code 404/i),
        }))
      }
    });

    it('invalid data structure throws an IngkaParseError', async function() {
      expect.hasAssertions();
      nock(BASE_URL_DEFAULT)
        .get(() => true)
        .reply(200, {});
      try {
        await createClient().getAvailabilities('de', '1231231');
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(IngkaParseError);
        expect(error).toEqual(expect.objectContaining({
          message: expect.stringMatching(/data structure/i),
        }))
      }
    });

    it('200 with 404 content error throws a', async function() {
      expect.hasAssertions();
      nock(BASE_URL_DEFAULT)
        .get(() => true)
        .reply(200, {
          "availabilities": null,
          "data": [],
          "errors": [
            {
              "code": 404,
              "details": {
                  "classUnitCode": "DE",
                  "classUnitType": "RU",
                  "itemNo": "12313123"
              },
              "message": "Not found"
            }
          ],
          "timestamp": "2023-01-02T17:40:22.760Z",
          "traceId": "12140262290630891232"
        });
      try {
        await createClient().getAvailabilities('de', '1231231');
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(IngkaNotFoundError);
        expect(error).toEqual(expect.objectContaining({
          message: expect.stringMatching(/not found/i),
        }))
      }
    });

    it('returns an empty array when response is empty', async function() {
      expect.hasAssertions();
      nock(BASE_URL_DEFAULT)
        .get((uri) => uri.includes('234'))
        .query({
          expand: 'StoresList,Restocks',
          itemNos: '123123'
        })
        .reply(200, { data: [] });
      const stockInfo = await createClient().getAvailabilities('234', '123123');
      expect(stockInfo).toBeInstanceOf(Array);
      expect(stockInfo).toHaveLength(0);
    });

    it('uses the given options correctly', async function() {
      expect.hasAssertions();
      nock(BASE_URL_DEFAULT)
        .get((uri) => uri.includes('982'))
        .query({
          expand: 'StoresList',
          itemNos: '0982',
          custom: 'value',
        })
        .reply(200, { data: [] });
      const stockInfo = await createClient().getAvailabilities('982', '0982', ['StoresList'], {
        params: {
          custom: 'value'
        }
      });
      expect(stockInfo).toBeInstanceOf(Array);
      expect(stockInfo).toHaveLength(0);
    });
  }); // getAvailabilities
}); // suite
