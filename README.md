# IKEA Availability Checker

Never miss out on your favorite IKEA products again! This powerful tool helps you check real-time product availability across 500+ IKEA stores worldwide. Whether you're hunting for that perfect Billy bookcase or tracking down a specific kitchen item, our availability checker saves you time and frustration by providing instant stock information.

Perfect for:
- **Furniture enthusiasts** tracking restocks
- **Developers** building IKEA-related applications  
- **Shoppers** planning store visits
- **Businesses** monitoring product availability

[![MIT License](https://badges.frapsoft.com/os/mit/mit.svg?v=102)](https://github.com/ellerbrock/open-source-badge/)
[![NPM Package](https://badge.fury.io/js/ikea-availability-checker.svg)](https://www.npmjs.com/package/ikea-availability-checker)
[![NPM Downloads](https://img.shields.io/npm/dt/ikea-availability-checker.svg)](https://www.npmjs.com/package/ikea-availability-checker)
[![Known Vulnerabilities](https://snyk.io/test/github/ephigenia/ikea-availability-checker/badge.svg)](https://snyk.io/test/github/ephigenia/ikea-availability-checker)
[![default](https://github.com/Ephigenia/ikea-availability-checker/actions/workflows/default.yml/badge.svg?branch=master)](https://github.com/Ephigenia/ikea-availability-checker/actions/workflows/default.yml)
[![smokey](https://github.com/Ephigenia/ikea-availability-checker/actions/workflows/smokey.yml/badge.svg)](https://github.com/Ephigenia/ikea-availability-checker/actions/workflows/smokey.yml)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://github.com/codespaces/new?hide_repo_select=true&ref=master&repo=Ephigenia/ikea-availability-checker)

## 🚀 Quick Start

**Get up and running in seconds with multiple options:**

1. **🌐 Try it online instantly:** Jump to the [Try It Online](#try-it-online) section and run interactive examples directly in your browser - no installation required!
2. **💻 GitHub Codespaces:** Click the "Code" button above and select "Codespaces" for a full cloud development environment
3. **📁 Run examples locally:** Follow the [Examples](#-examples) section for local setup and execution

> 💡 **New to the project?** Start with the online examples to see what's possible, then move to local development for advanced usage.

**Found a bug or have a suggestion?** We'd love to hear from you! Please report issues at: https://github.com/Ephigenia/ikea-availability-checker/issues

## ✨ Features

**🌍 Global Coverage**
- **500+ IKEA stores** worldwide with real-time availability data
- **55+ countries supported** including major markets across Europe, North America, Asia, and Oceania
- **Comprehensive store database** with detailed location information

**📊 Multiple Output Formats**
- **JSON** (`--json`) for programmatic integration and data processing
- **TSV** (`--plain`) for scripting with `awk`, `cut`, `column`, …
- **CLI Tables** (default, `--pretty`) for readable terminal output
- **Filters** like `--min-stock` to only show stores with enough stock

**🛒 Buying Options**
- See whether a product is **in stock**, **temporarily out of stock**, **order only** (home delivery) or **not sold** at a store

**🌐 Country Support**
- **Active countries:** ae, at, au, be, bh, ca, ch, cl, cn, co, cz, de, dk, ee, eg, es, fi, fr, gb, hk, hr, hu, ie, il, in, is, it, jo, jp, kr, kw, lt, lv, ma, mx, my, nl, no, nz, om, ph, pl, pt, qa, ro, rs, sa, se, sg, si, sk, th, tr, tw, ua, us - [![smokey](https://github.com/Ephigenia/ikea-availability-checker/actions/workflows/smokey.yml/badge.svg)](https://github.com/Ephigenia/ikea-availability-checker/actions/workflows/smokey.yml)
- **Automated testing** ensures data accuracy across all supported regions

**🔧 Developer-Friendly**
- **Clean JavaScript API** for easy integration into your projects
- **TypeScript support** with full type definitions
- **Comprehensive documentation** and interactive examples
- **Modular design** allowing flexible usage patterns

## 💻 Command Line Interface

**Powerful command-line tool for quick availability checks and automation**

### 📦 Installation Options

#### Global Installation
Install once, use anywhere on your system:

```bash
npm install -g ikea-availability-checker
```

After installation, run the tool directly from any directory:

```bash
ikea-availability --help
```

> ⚠️ **Note:** Global installation allows only one version at a time. Use local installation for project-specific versions.

#### Local Installation
Perfect for project-specific usage and version control:

```bash
npm install ikea-availability-checker
```

Run using the local binary:

```bash
node_modules/.bin/ikea-availability --help
```

#### NPX (No Installation Required)
Run instantly without installing anything:

```bash
npx ikea-availability-checker --help
```

### 🎯 Usage Examples

#### Store Discovery
Find all IKEA stores in a specific country:

```bash
npx ikea-availability-checker stores at
```

    ┌─────────────┬─────────┬────────┬───────────────────────┐
    │ countryCode │ country │ buCode │ name                  │
    ├─────────────┼─────────┼────────┼───────────────────────┤
    │ at          │ Austria │ 085    │ Vösendorf             │
    ├─────────────┼─────────┼────────┼───────────────────────┤
    │ at          │ Austria │ 090    │ Wien Nord             │
    ├─────────────┼─────────┼────────┼───────────────────────┤
    │ at          │ Austria │ 155    │ Klagenfurt            │
    ├─────────────┼─────────┼────────┼───────────────────────┤
    │ at          │ Austria │ 273    │ Innsbruck             │
    ├─────────────┼─────────┼────────┼───────────────────────┤
    │ at          │ Austria │ 386    │ Salzburg              │
    ├─────────────┼─────────┼────────┼───────────────────────┤
    │ at          │ Austria │ 387    │ Graz                  │
    ├─────────────┼─────────┼────────┼───────────────────────┤
    │ at          │ Austria │ 388    │ Linz Haid │ Linz-Haid │
    ├─────────────┼─────────┼────────┼───────────────────────┤
    │ at          │ Austria │ 587    │ Wien Westbahnhof      │
    └─────────────┴─────────┴────────┴───────────────────────┘


#### Product Stock Information for a whole country

Check availability across all stores in a country:

```bash
npx ikea-availability-checker stock --country at 80213074
```

    ┌──────────────────────────┬──────────┬─────────────┬─────────┬──────────────────┬───────────────────────┬───────┬───────────────┬─────────────────────┬──────────────┐
    │ date                     │ product  │ countryCode │ country │ storeId (buCode) │ store                 │ stock │   probability │         restockDate │ availability │
    ├──────────────────────────┼──────────┼─────────────┼─────────┼──────────────────┼───────────────────────┼───────┼───────────────┼─────────────────────┼──────────────┤
    │ 2026-11-08T05:43:38.161Z │ 80213074 │ at          │ Austria │ 085              │ Vösendorf             │ 24    │ HIGH_IN_STOCK │                     │ in stock     │
    ├──────────────────────────┼──────────┼─────────────┼─────────┼──────────────────┼───────────────────────┼───────┼───────────────┼─────────────────────┼──────────────┤
    │ 2026-11-08T05:39:25.666Z │ 80213074 │ at          │ Austria │ 090              │ Wien Nord             │ 7     │ HIGH_IN_STOCK │                     │ in stock     │
    ├──────────────────────────┼──────────┼─────────────┼─────────┼──────────────────┼───────────────────────┼───────┼───────────────┼─────────────────────┼──────────────┤
    │ 2026-11-08T05:29:32.556Z │ 80213074 │ at          │ Austria │ 155              │ Klagenfurt            │ 16    │ HIGH_IN_STOCK │                     │ in stock     │
    ├──────────────────────────┼──────────┼─────────────┼─────────┼──────────────────┼───────────────────────┼───────┼───────────────┼─────────────────────┼──────────────┤
    │ 2026-11-08T05:13:14.257Z │ 80213074 │ at          │ Austria │ 273              │ Innsbruck             │ 10    │ HIGH_IN_STOCK │                     │ in stock     │
    ├──────────────────────────┼──────────┼─────────────┼─────────┼──────────────────┼───────────────────────┼───────┼───────────────┼─────────────────────┼──────────────┤
    │ 2026-11-08T05:25:39.333Z │ 80213074 │ at          │ Austria │ 386              │ Salzburg              │ 2     │  LOW_IN_STOCK │                     │ in stock     │
    ├──────────────────────────┼──────────┼─────────────┼─────────┼──────────────────┼───────────────────────┼───────┼───────────────┼─────────────────────┼──────────────┤
    │ 2026-11-08T23:55:40.934Z │ 80213074 │ at          │ Austria │ 387              │ Graz                  │ 15    │ HIGH_IN_STOCK │                     │ in stock     │
    ├──────────────────────────┼──────────┼─────────────┼─────────┼──────────────────┼───────────────────────┼───────┼───────────────┼─────────────────────┼──────────────┤
    │ 2026-11-08T05:35:58.955Z │ 80213074 │ at          │ Austria │ 388              │ Linz Haid │ Linz-Haid │ 15    │ HIGH_IN_STOCK │                     │ in stock     │
    ├──────────────────────────┼──────────┼─────────────┼─────────┼──────────────────┼───────────────────────┼───────┼───────────────┼─────────────────────┼──────────────┤
    │                          │ 80213074 │ at          │ Austria │ 587              │ Wien Westbahnhof      │ 0     │               │                     │ order only   │
    └──────────────────────────┴──────────┴─────────────┴─────────┴──────────────────┴───────────────────────┴───────┴───────────────┴─────────────────────┴──────────────┘



#### Product Stock Information for a specific store

##### Using Store ID (BU-Code)

Check availability at a specific store using its unique identifier:

```bash
npx ikea-availability-checker stock --store=155 00263850
```

    ┌──────────────────────────┬──────────┬─────────────┬─────────┬──────────────────┬────────────┬───────┬───────────────┬─────────────┬──────────────┐
    │ date                     │ product  │ countryCode │ country │ storeId (buCode) │ store      │ stock │   probability │ restockDate │ availability │
    ├──────────────────────────┼──────────┼─────────────┼─────────┼──────────────────┼────────────┼───────┼───────────────┼─────────────┼──────────────┤
    │ 2026-11-08T23:55:51.278Z │ 00263850 │ at          │ Austria │ 155              │ Klagenfurt │ 39    │ HIGH_IN_STOCK │             │ in stock     │
    └──────────────────────────┴──────────┴─────────────┴─────────┴──────────────────┴────────────┴───────┴───────────────┴─────────────┴──────────────┘


##### Using Store Name or City

Search by store name, location, or city (partial matches supported):

```bash
npx ikea-availability-checker stock --store=Berlin 00263850
```

    ┌──────────────────────────┬──────────┬─────────────┬─────────┬──────────────────┬────────────────────┬───────┬───────────────┬─────────────┬──────────────┐
    │ date                     │ product  │ countryCode │ country │ storeId (buCode) │ store              │ stock │   probability │ restockDate │ availability │
    ├──────────────────────────┼──────────┼─────────────┼─────────┼──────────────────┼────────────────────┼───────┼───────────────┼─────────────┼──────────────┤
    │ 2026-11-09T00:20:09.442Z │ 00263850 │ de          │ Germany │ 129              │ Berlin-Waltersdorf │ 37    │ HIGH_IN_STOCK │             │ in stock     │
    ├──────────────────────────┼──────────┼─────────────┼─────────┼──────────────────┼────────────────────┼───────┼───────────────┼─────────────┼──────────────┤
    │ 2026-11-08T16:33:23.000Z │ 00263850 │ de          │ Germany │ 324              │ Berlin-Lichtenberg │ 72    │ HIGH_IN_STOCK │             │ in stock     │
    ├──────────────────────────┼──────────┼─────────────┼─────────┼──────────────────┼────────────────────┼───────┼───────────────┼─────────────┼──────────────┤
    │ 2026-11-08T11:14:33.000Z │ 00263850 │ de          │ Germany │ 394              │ Berlin-Spandau     │ 82    │ HIGH_IN_STOCK │             │ in stock     │
    ├──────────────────────────┼──────────┼─────────────┼─────────┼──────────────────┼────────────────────┼───────┼───────────────┼─────────────┼──────────────┤
    │ 2026-11-08T13:21:12.000Z │ 00263850 │ de          │ Germany │ 421              │ Berlin-Tempelhof   │ 22    │ HIGH_IN_STOCK │             │ in stock     │
    └──────────────────────────┴──────────┴─────────────┴─────────┴──────────────────┴────────────────────┴───────┴───────────────┴─────────────┴──────────────┘

> 💡 **Pro tip:** You can use partial names like "Berlin", "München", or "Wien" - the tool will find matching stores automatically!


#### Multiple Stores and Products

Check multiple products across multiple stores (supports cross-country queries):

```bash
npx ikea-availability-checker stock --store=224,155 00263850 10347171
```

> 🌍 **Cross-border shopping:** Mix store IDs from different countries to compare availability across regions!

    ┌──────────────────────────┬──────────┬─────────────┬─────────┬──────────────────┬──────────────┬───────┬───────────────┬─────────────┬──────────────┐
    │ date                     │ product  │ countryCode │ country │ storeId (buCode) │ store        │ stock │   probability │ restockDate │ availability │
    ├──────────────────────────┼──────────┼─────────────┼─────────┼──────────────────┼──────────────┼───────┼───────────────┼─────────────┼──────────────┤
    │ 2026-11-08T23:55:51.278Z │ 00263850 │ at          │ Austria │ 155              │ Klagenfurt   │ 39    │ HIGH_IN_STOCK │             │ in stock     │
    ├──────────────────────────┼──────────┼─────────────┼─────────┼──────────────────┼──────────────┼───────┼───────────────┼─────────────┼──────────────┤
    │ 2026-11-07T20:51:12.685Z │ 00263850 │ de          │ Germany │ 224              │ Sindelfingen │ 207   │ HIGH_IN_STOCK │             │ in stock     │
    ├──────────────────────────┼──────────┼─────────────┼─────────┼──────────────────┼──────────────┼───────┼───────────────┼─────────────┼──────────────┤
    │ 2026-11-08T05:30:28.320Z │ 10347171 │ at          │ Austria │ 155              │ Klagenfurt   │ 35    │ HIGH_IN_STOCK │             │ in stock     │
    ├──────────────────────────┼──────────┼─────────────┼─────────┼──────────────────┼──────────────┼───────┼───────────────┼─────────────┼──────────────┤
    │                          │ 10347171 │ de          │ Germany │ 224              │ Sindelfingen │ 0     │               │             │ order only   │
    └──────────────────────────┴──────────┴─────────────┴─────────┴──────────────────┴──────────────┴───────┴───────────────┴─────────────┴──────────────┘

The `availability` column summarizes how the product can be bought at each store:

| availability | Meaning |
|---|---|
| `in stock` | Sold in the store and currently in stock |
| `out of stock` | Sold in the store, but temporarily out of stock |
| `order only` | Not sold in the store, but can be ordered for home delivery |
| `not sold` | Neither sold in the store nor available for home delivery |

#### Output Formats and Filters

Print the results as JSON, e.g. to process them with `jq`:

```bash
npx ikea-availability-checker stock --store=224,155 --json 10347171
```

    [{"buCode":"155","productId":"10347171","stock":35,"store":{"buCode":"155","name":"Klagenfurt","coordinates":[14.3694,46.6394],"countryCode":"at","country":"Austria"},"inRange":true,"homeDeliveryInRange":true,"createdAt":"2026-11-08T05:30:28.320Z","probability":"HIGH_IN_STOCK"},{"buCode":"224","productId":"10347171","stock":0,"store":{"buCode":"224","name":"Sindelfingen","coordinates":[9.00545146,48.70144946],"countryCode":"de","country":"Germany"},"inRange":false,"homeDeliveryInRange":true}]

Print tab-separated values for scripting (the `availability` column is always last):

```bash
npx ikea-availability-checker stock --store=224,155 --plain 00263850 10347171
```

    2026-11-08T23:55:51.278Z	00263850	at	Austria	155	Klagenfurt	39	HIGH_IN_STOCK		in stock
    2026-11-07T20:51:12.685Z	00263850	de	Germany	224	Sindelfingen	207	HIGH_IN_STOCK		in stock
    2026-11-08T05:30:28.320Z	10347171	at	Austria	155	Klagenfurt	35	HIGH_IN_STOCK		in stock
    	10347171	de	Germany	224	Sindelfingen	0			order only

Only show stores with at least 10 items in stock:

```bash
npx ikea-availability-checker stock --country de --min-stock 10 00263850
```

The `stores` command supports the same output formats and accepts multiple country codes; without any country code it lists all stores:

```bash
npx ikea-availability-checker stores --plain de at
```

#### Command Reference

| Command | Option | Description |
|---|---|---|
| `stock <productIds...>` | `-c, --country <countryCode>` | Check all stores in a country |
| | `-s, --store <storeIds\|query>` | Comma-separated store IDs, or a store name / city to search for |
| | `--min-stock <amount>` | Only show stores with at least this many items in stock (default `0`) |
| | `--json`, `--plain`, `--pretty` | Output as JSON, TSV or table (default) |
| `stores [countryCodes...]` | `--json`, `--plain`, `--pretty` | List stores of one or more countries, or all stores |

Run `npx ikea-availability-checker stock --help` or `npx ikea-availability-checker stores --help` for more examples.

## 🔌 JavaScript API

Our clean, modern JavaScript API makes it easy to build powerful applications on top of IKEA's availability data. Whether you're creating a shopping assistant, inventory tracker, or custom dashboard, our API provides all the tools you need.

> 💡 **API Feedback:** This API is actively developed and we welcome your suggestions! [Open an issue](https://github.com/Ephigenia/ikea-availability-checker/issues) to share your ideas.

```javascript
const checker = require('ikea-availability-checker');

(async function() {
    // BILLY bookcase (00263850) in Berlin-Spandau (394)
    const result = await checker.availability('394', '00263850');
    console.log('RESULT', result);
})();
```

### API Reference

| Function | Returns | Description |
|---|---|---|
| `availability(buCode, productId, options?)` | `Promise<ItemStockInfo \| undefined>` | Availability of one product in one store. Throws if the store ID is unknown. |
| `availabilities(stores, productIds, options?)` | `Promise<ItemStockInfo[]>` | Availability of one or more products in one or more stores (stores can be from different countries). |
| `stores.stores` | `Store[]` | All known stores. |
| `stores.findByCountryCode(countryCodes)` | `Store[]` | Stores in one or more countries. |
| `stores.findById(buCodes)` | `Store[]` | Stores with the given IDs. |
| `stores.findOneById(buCode)` | `Store \| undefined` | A single store by ID. |
| `stores.findByQuery(query, countryCode?)` | `Store[]` | Stores whose name matches the string or RegExp. |
| `stores.getCountryCodes()` | `string[]` | All country codes with at least one store. |
| `errors` | – | Error classes thrown by the API client (`IngkaHttpError`, `IngkaParseError`, `IngkaResponseError`). |

`options` are passed on to [axios](https://axios-http.com/docs/req_config), e.g. to set a timeout or proxy.

Each `ItemStockInfo` result contains:

| Field | Type | Description |
|---|---|---|
| `buCode` | `string` | Store ID |
| `productId` | `string` | Product ID |
| `store` | `Store` | Store details (`buCode`, `name`, `coordinates`, `countryCode`, `country`) |
| `stock` | `number` | Items currently in stock |
| `probability` | `string?` | `HIGH_IN_STOCK`, `LOW_IN_STOCK` or `OUT_OF_STOCK` |
| `createdAt` | `Date?` | When the stock information was last updated |
| `restockDate` | `Date?` | Earliest expected restock date |
| `inRange` | `boolean` | The product is sold in the store (cash & carry) |
| `homeDeliveryInRange` | `boolean` | The product can be ordered for home delivery from this store |

Combined, `stock`, `inRange` and `homeDeliveryInRange` tell you how a product can be bought at a store:

| `inRange` | `homeDeliveryInRange` | `stock` | Meaning |
|---|---|---|---|
| `true` | – | `> 0` | In stock |
| `true` | – | `0` | Sold here, temporarily out of stock |
| `false` | `true` | `0` | Not sold in-store, order only |
| `false` | `false` | `0` | Not sold at this location |

## Try It Online

You can try out the package directly in your browser using Runkit! Click on any of the examples below to run them interactively.

### Basic Product Availability Check

Check the availability of a specific product in a single store:

```javascript
// @runkit
const checker = require('ikea-availability-checker');

(async function() {
    try {
        // Check availability of product 00263850 (BILLY bookcase) in store 394 (Berlin-Spandau)
        const result = await checker.availability('394', '00263850');
        console.log('Product Availability:', result);
    } catch (error) {
        console.error('Error:', error.message);
    }
})();
```

### Country-wide Availability Check

Find all stores in a country and check product availability across multiple locations:

```javascript
// @runkit
const checker = require('ikea-availability-checker');

(async function() {
    try {
        // Get all stores in Austria
        const stores = checker.stores.findByCountryCode('at');
        console.log(`Found ${stores.length} stores in Austria`);
        
        // Check availability of product 80213074 across all Austrian stores
        const availabilities = await checker.availabilities(stores, ['80213074']);
        
        console.log('\nAvailability across Austrian stores:');
        availabilities.forEach(availability => {
            if (availability) {
                console.log(`${availability.store.name}: ${availability.stock} units (${availability.probability})`);
            }
        });
    } catch (error) {
        console.error('Error:', error.message);
    }
})();
```

### Store Discovery

Find stores by country code and explore store information:

```javascript
// @runkit
const checker = require('ikea-availability-checker');

try {
    // Get all stores in Germany
    const stores = checker.stores.findByCountryCode('de');
    
    console.log(`Found ${stores.length} stores in Germany:`);
    stores.slice(0, 10).forEach(store => {
        console.log(`${store.buCode}: ${store.name} (${store.country})`);
    });
    
    if (stores.length > 10) {
        console.log(`... and ${stores.length - 10} more stores`);
    }
} catch (error) {
    console.error('Error:', error.message);
}
```

### Multiple Products Check

Check availability of multiple products across multiple stores:

```javascript
// @runkit
const checker = require('ikea-availability-checker');

(async function() {
    try {
        // Get stores from different countries
        const germanStores = checker.stores.findByCountryCode('de').slice(0, 3);
        const austrianStores = checker.stores.findByCountryCode('at').slice(0, 2);
        const allStores = [...germanStores, ...austrianStores];
        
        // Check multiple products
        const productIds = ['00263850', '80213074'];
        
        console.log(`Checking ${productIds.length} products across ${allStores.length} stores...`);
        
        const availabilities = await checker.availabilities(allStores, productIds);
        
        console.log('\nResults:');
        availabilities.forEach(availability => {
            if (availability) {
                console.log(`${availability.productId} at ${availability.store.name} (${availability.store.country}): ${availability.stock} units`);
            }
        });
    } catch (error) {
        console.error('Error:', error.message);
    }
})();
```

### Error Handling Example

Learn how to handle errors gracefully:

```javascript
// @runkit
const checker = require('ikea-availability-checker');

(async function() {
    try {
        // Try with an invalid store ID
        const result = await checker.availability('99999', '00263850');
        console.log('Result:', result);
    } catch (error) {
        console.log('Caught error as expected:', error.message);
    }
    
    try {
        // Try with a valid store but potentially invalid product
        const result = await checker.availability('394', 'invalid-product');
        console.log('Result:', result);
    } catch (error) {
        console.log('Product not found:', error.message);
    }
})();
```

## 📚 Examples

**Learn by doing with our comprehensive example collection**

The project includes several example scripts in the [`examples/`](./examples) directory that demonstrate real-world usage patterns. These examples are perfect for understanding how to integrate the availability checker into your own projects.

**Choose your preferred environment:**

### 🏠 Running Examples Locally

**Perfect for development and customization**

1. **Clone and setup:**
    ```bash
    git clone https://github.com/Ephigenia/ikea-availability-checker.git
    cd ikea-availability-checker
    npm install
    npm run build
    ```

2. **Run example scripts:**
    ```bash
    # Single store, single product check
    node examples/product-availability.js 394 00263850
    
    # Country-wide availability scan
    node examples/country-availability.js de 00263850
    
    # Store discovery by country
    node examples/stores.js at
    ```


### ☁️ Running Examples in GitHub Codespaces

**Zero-setup cloud development environment**

1. **Launch Codespace:**
    - Click the "Code" button on this repository
    - Select "Codespaces" tab
    - Click "Create codespace on [branch]"

2. **Run examples instantly:**
    ```bash
    # Everything is pre-configured - just run!
    npm install && npm run build
    
    # Try the examples
    node examples/product-availability.js 394 00263850
    node examples/country-availability.js de 00263850
    node examples/stores.js at
    ```

> ⚡ **Instant setup:** Codespaces provides a fully configured environment in seconds!

### 📋 Example Scripts Reference

| Script | Purpose | Usage |
|--------|---------|-------|
| **`product-availability.js`** | Single product, single store check | `node examples/product-availability.js [storeId] [productId]` |
| **`country-availability.js`** | Country-wide availability scan | `node examples/country-availability.js [countryCode] [productId]` |
| **`stores.js`** | Store discovery by country | `node examples/stores.js [countryCode]` |

**Output format:** All scripts output clean JSON data that's perfect for:
- **Piping to other tools** (jq, grep, etc.)
- **Integration with your applications**
- **Data processing and analysis**
- **Building custom dashboards**

## 🛠️ Development

**Contributing to the IKEA Availability Checker**

We welcome contributions! Whether you're fixing bugs, adding features, or improving documentation, your help makes this project better for everyone.

### 📋 Prerequisites

- **Node.js** - Check [.nvmrc](./.nvmrc) for the recommended version
- **npm** - Package manager for dependencies

> 💡 **Development Environment:** We strongly recommend using either nvm with the specified Node version or the [Dev Container](./.devcontainer) for consistent development experience.


### 🐛 Debugging

**Troubleshoot HTTP requests and responses**

Run the CLI from source with Node's HTTP debugging enabled:

```bash
NODE_DEBUG=http npm start -- stock --store 224 00263850
```

This logs Node's low-level HTTP activity (connections, sockets, incoming responses) to stderr. To inspect the raw API requests and responses, use the [Postman collection](#-api-testing).


### 🧪 Testing

**Comprehensive test suite with multiple testing approaches**

The project uses [Jest](https://jestjs.io/) as the test runner with comprehensive test coverage.

#### Running Tests

```bash
# Run all tests with coverage
npm run test

# Watch mode for development
npm run tdd

# Run only tests whose name matches a pattern
npm run test -- -t "createStockInfoReportTable"
```

#### Test Coverage

Running tests generates detailed coverage reports showing:
- **Line coverage** - Which lines are executed
- **Branch coverage** - Which code paths are tested
- **Function coverage** - Which functions are called

#### Smoke Testing

Comprehensive smoke tests validate functionality across different scenarios:

```bash
# Test all output formats and countries
./scripts/smokey.sh

# Test specific formats
./scripts/smokey-formats.sh
```

> 📊 **Coverage Goal:** We're continuously improving test coverage - contributions welcome!

### 🔍 API Testing

**Test the underlying IKEA API directly**

We provide a comprehensive Postman collection for testing the IKEA API endpoints:

- **Public Collection:** [IKEA Workspace](https://www.postman.com/crimson-rocket-271330/workspace/ikea/overview)
- **Local Files:** Available in `/postman/collections` directory
- **API Schema:** OpenAPI specification in `/postman/schemas/`

Perfect for:
- **API exploration** and understanding
- **Integration testing** before implementation
- **Debugging** API responses and errors

### 🚀 Release Process

Releases are automated with [release-please](https://github.com/googleapis/release-please):

1. Every push to `main` updates an open **release PR** with the next version and the [CHANGELOG.md](CHANGELOG.md) entries.
2. Merging the release PR creates a git tag and a **GitHub release**.
3. The new version is then **published to npm** automatically.

> 📝 **Commit Convention:** Use [conventional commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, …). `fix` bumps the patch version, `feat` the minor version and `feat!` / `BREAKING CHANGE` the major version. PR titles are checked for this format.

### 🔧 Troubleshooting

**Common issues and solutions**

#### Disable Colored Output

If you need to disable colored output (useful for logging or CI environments):

```bash
FORCE_COLOR=0 npx ikea-availability-checker stores de
```

#### Common Issues

- **Network timeouts:** Check your internet connection and try again
- **Invalid store IDs:** Use the `stores` command to find valid store codes
- **Product not found:** Verify the product ID exists in the IKEA catalog
- **Rate limiting:** The API has rate limits - add delays between requests if needed

#### Getting Help

- **GitHub Issues:** [Report bugs and request features](https://github.com/Ephigenia/ikea-availability-checker/issues)
- **Documentation:** Check this README and the examples directory
- **API Testing:** Use the Postman collection for debugging API issues


## 🌟 Community & Resources

**Discover related projects and helpful resources**

### 📚 Articles & Resources

- **npm package** [ikea-stock-checker](https://www.npmjs.com/package/ikea-stock-checker) - Alternative implementation
- **API of the Day:** [Checking IKEA Availability and Warehouse Locations](https://medium.com/@JoshuaAJung/api-of-the-day-ikea-availability-checks-8678794a9b52) by Joshua Jung
- **Community:** [IKEA Reddit](https://www.reddit.com/r/IKEA/) - Discussion and tips
- **API Documentation:** [IKEA Mobile API description](https://del.dog/ikeamobileapi.md) - Technical reference

### 📦 Related Packages

**Alternative implementations and complementary tools**

| Package | Language | Description |
|---------|----------|-------------|
| [vrslev/ikea-api-client](https://github.com/vrslev/ikea-api-client) | Python | Alternative IKEA API client (archived) |
| [ikea stock checker](https://github.com/lovegandhi/ikea-stock-checker) | Python | Stock checking utility |
| [ikea stock finder](https://github.com/sasasoni/ikea_stock_finder) | Ruby | Japanese market focused |
| [ikea scraper](https://github.com/LordBonzi/ikea-scraper) | Python | Stock scraping tool |
| [ikea bot](https://github.com/xorik/ikea-bot) | TypeScript | Telegram notification bot |

### 🌐 Web Services

**Ready-to-use web applications and services**

| Service | Description | Region |
|---------|-------------|--------|
| [ikea-availability-web](https://github.com/anditosl/ikea-availability-web) | Web interface | Global |
| [ikeaprices](https://github.com/mnazarov/ikeaprices) | Price comparison tool | Global |

<hr>
<small>
† This website is not run by or affiliated with Inter-IKEA Systems B.V. or its related business entities.

IKEA® is a registered trademark of Inter-IKEA Systems B.V. in the U.S. and other countries.
</small>
