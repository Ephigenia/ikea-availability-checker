export interface IngkaAvailabilitiesResponseAvailableStockItem {
  type: "CASHCARRY";
  quantity: number;
  /** Date-Time (RFC 3339, f.e. "2022-11-06T05:14:33.299Z") */
  updateDateTime: string;
  probabilities: {
    type: "THIS_DAY";
    /** Date-Time (RFC 3339, f.e. "2022-11-06T05:14:33.299Z") */
    updateDateTime: string;
    communication: {
      colour: {
        rgbDec: string;
        rgbHex: string;
        token: "colour-positive" | "colour-negative";
      };
      messageType: "HIGH_IN_STOCK" | "OUT_OF_STOCK";
    };
  }[];
  restocks?: {
    type: "DELIVERY";
    quantity: number;
    /** Date (RFC 3339, f.e. "2022-11-01") */
    earliestDate: string;
    /** Date (RFC 3339, f.e. "2022-11-01") */
    latestDate: string;
    /** Date-Time (RFC 3339, f.e. "2022-11-06T05:14:33.299Z") */
    updateDateTime: string;
    reliability: "HIGH" | "LOW";
  }[];
}

export interface IngkaAvailabilitiesResponseDataItem {
  isInCashAndCarryRange: boolean;
  isInHomeDeliveryRange: boolean;
  availableStocks: IngkaAvailabilitiesResponseAvailableStockItem[];
  classUnitKey: {
    /** 3-letter buCode of the store */
    classUnitCode: string;
    classUnitType: "STO";
  };
  itemKey: {
    /** productId */
    itemNo: string;
    itemType: "ART";
  };
}

export interface IngkaAvailabilitiesErrorResponse {
  code: string;
  message: string;
}

export interface IngkaAvailabilitiesResponse {
  availabilities: null;
  data: IngkaAvailabilitiesResponseDataItem[];
  /** contains one ore more errorrs if there has been any */
  errors?: Array<{
    code: number,
    details?: Record<string, string>
    message: string,
  }>;
  timestamp?: string;
  traceId?: string;
}
