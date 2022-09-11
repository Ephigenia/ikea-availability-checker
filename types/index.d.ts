import IngkaApi = require("./lib/ingka");
import stores = require("./lib/stores");
import errors = require("./lib/ingkaErrors");
export declare function availability(buCode: string, productId: string, options?: import("axios").AxiosRequestConfig<any>): Promise<IngkaApi.IngkaProductAvailability>;
export { stores, errors };
//# sourceMappingURL=index.d.ts.map