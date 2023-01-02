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

    it('non 200 status codes throw IngkaResponseError', function() {
      expect.hasAssertions();
      nock(BASE_URL_DEFAULT)
        .get(() => true)
        .reply(401, 'unauthorized');
      return createClient().getAvailabilities('de', '1231231').catch(e => {
        expect(e).toBeInstanceOf(IngkaResponseError);
        expect(e.message).toMatch('status code 401')
      });
    });

    it('404 throws IngkaNotFoundError', function() {
      expect.hasAssertions();
      nock(BASE_URL_DEFAULT)
        .get(() => true)
        .reply(404, 'not found');
        return createClient().getAvailabilities('de', '1231231').catch(e => {
        expect(e).toBeInstanceOf(IngkaNotFoundError);
        expect(e.message).toMatch('status code 404')
      });
    });

    it('invalid data structure throws an IngkaParseError', function() {
      expect.hasAssertions();
      nock(BASE_URL_DEFAULT)
        .get(() => true)
        .reply(200, {});
      return createClient().getAvailabilities('de', '1231231').catch(e => {
        expect(e).toBeInstanceOf(IngkaParseError);
        expect(e.message).toMatch('data structure')
      });
    });

    it('200 with 404 content error throws a', function() {
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
      return createClient().getAvailabilities('de', '1231231').catch(e => {
        expect(e).toBeInstanceOf(IngkaNotFoundError);
        expect(e.message).toMatch('Not found')
      });
    });

    it('returns an empty array when response is empty', async function() {
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
