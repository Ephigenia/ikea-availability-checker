import * as stores from "./stores";

describe("stores", function () {
  describe("findByCountryCode", () => {
    it("returns a list of stores for a single country code", () => {
      expect(stores.findByCountryCode("de").length).toBeGreaterThanOrEqual(1);
    });
    it("normalizes and trims the country code", () => {
      expect(stores.findByCountryCode(" De").length).toBeGreaterThanOrEqual(1);
    });
    it("returns an empty array if nothing was found", () => {
      expect(stores.findByCountryCode("xx")).toHaveLength(0);
    });
  }); // findByCountryCode

  describe("findByQuery", () => {
    it("returns nothing if no stores are found", () => {
      expect(stores.findByQuery("xxxx")).toHaveLength(0);
    });
    it("returns stores where buCode matches", () => {
      expect(stores.findByQuery("039")).toHaveLength(1);
    });
    it("returns stores where buCode and country matches", () => {
      expect(stores.findByQuery("039", "ca")).toHaveLength(1);
      expect(stores.findByQuery("039", "de")).toHaveLength(0);
    });
    it("accepts RegExps", () => {
      expect(stores.findByQuery(/berlin|graz|bristol/i)).toHaveLength(6);
    });
    it("ignores the country code if not given", () => {
      expect(stores.findByQuery("berlin")).toHaveLength(4);
      expect(stores.findByQuery("graz")).toHaveLength(1);
    });
    it("returns only stores from the country", () => {
      expect(stores.findByQuery("berlin", "de")).toHaveLength(4);
      expect(stores.findByQuery("graz", "de")).toHaveLength(0);
      expect(stores.findByQuery("graz", "at")).toHaveLength(1);
      expect(stores.findByQuery("graz", "AT")).toHaveLength(1);
    });
  }); // findByQuery

  describe("findById", () => {
    it("accepts single string ids and returns the matching store", () => {
      expect(stores.findById("129")).toHaveLength(1);
    });
    it("accepts single numeric ids and returns the matching store", () => {
      expect(stores.findById("129")).toHaveLength(1);
    });
    it("returns an empty list when no stores found", () => {
      expect(stores.findById(["1", "2", "3", "4"])).toHaveLength(0);
      expect(stores.findById(["421", "394"])).toHaveLength(2);
      expect(stores.findById(["421", "18282"])).toHaveLength(1);
    });
  }); // findById

  describe("findOneById", () => {
    it("returns undefined when no store with id found", () => {
      expect(stores.findOneById("1282")).toBeUndefined();
    });
    it("returns the matching store", () => {
      const store = stores.findOneById("039");
      expect(store).toHaveProperty("name", "Montreal");
    });
    it("returns the matching store when number is given", () => {
      const store = stores.findOneById("139");
      expect(store).toHaveProperty("name", "Halle/Leipzig");
      expect(stores.findOneById("139")).toBe(store);
    });
  });

  describe("getLanguageCode", function () {
    it("returns the countryCode when it’s not in the mapping", () => {
      expect(stores.getLanguageCode("de")).toBe("de");
    });
    it('returns "de" for "at"', () => {
      expect(stores.getLanguageCode("at")).toBe("de");
    });
    it('returns "ko" for "kr"', () => {
      expect(stores.getLanguageCode("kr")).toBe("ko");
    });
  }); // getLanguageCode

  describe("getCountryCodes", function () {
    it("returns an array of ordered supported country codes", () => {
      const codes = stores.getCountryCodes();
      expect(codes.length).toBeGreaterThanOrEqual(1);
      expect(codes[0]).toBe("at");
      expect(codes[1]).toBe("au");
    });
  }); // getCountryCodes
}); // suite
