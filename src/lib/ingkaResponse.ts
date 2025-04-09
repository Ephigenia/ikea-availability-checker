export interface  IngkaAvailabilitiesResponseBuyingOption {
  cashCarry: {
    availability?: {
      probability: {
        thisDay: {
          colour: {
            rgbDec: string
            rgbHex: string
            token: "colour-positive" | "colour-negative";
          };
          messageType: "HIGH_IN_STOCK" | "LOW_IN_STOCK" | "OUT_OF_STOCK";
        };
        /** Date-Time (RFC 3339, f.e. "2022-11-06T05:14:33.299Z") */
        updateDateTime: string
      };
      quantity: number
      /** Date-Time (RFC 3339, f.e. "2022-11-06T05:14:33.299Z") */
      updateDateTime: string
    };
    eligibleForStockNotification: boolean
    range: {
      inRange: boolean
    };
    unitOfMeasure: "PIECE"
    /** Date-Time (RFC 3339, f.e. "2022-11-06T05:14:33.299Z") */
    updateDateTime: string
  };
  clickCollect: {
    range: {
      inRange: boolean
    }
  };
  homeDelivery: {
    range: {
      inRange: boolean
    };
    /** Date-Time (RFC 3339, f.e. "2022-11-06T05:14:33.299Z") */
    updateDateTime: string
  }
  // restocks?: {
  //   type: "DELIVERY";
  //   quantity: number;
  //   /** Date (RFC 3339, f.e. "2022-11-01") */
  //   earliestDate: string;
  //   /** Date (RFC 3339, f.e. "2022-11-01") */
  //   latestDate: string;
  //   /** Date-Time (RFC 3339, f.e. "2022-11-06T05:14:33.299Z") */
  //   updateDateTime: string;
  //   reliability: "HIGH" | "LOW";
  // }[];
}

export interface IngkaAvailabilitiesResponseDataItem {
  availableForCashCarry: boolean;
  availableForClickCollect: boolean;
  buyingOption: IngkaAvailabilitiesResponseBuyingOption;
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
  availabilities: IngkaAvailabilitiesResponseDataItem[];
  /** contains one ore more errorrs if there has been any */
  errors?: Array<{
    code: number,
    details?: Record<string, string>
    message: string,
  }>;
  timestamp?: string;
  traceId?: string;
}
