# IKEA Availability Checker

Never miss out on your favorite IKEA products again! This powerful tool helps you check real-time product availability across 400+ IKEA stores worldwide. Whether you're hunting for that perfect Billy bookcase or tracking down a specific kitchen item, our availability checker saves you time and frustration by providing instant stock information.

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
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://github.com/codespaces/new?hide_repo_select=true&ref=master&repo=ephigenia%2Fikea-availability-checker)

## 🚀 Quick Start

**Get up and running in seconds with multiple options:**

1. **🌐 Try it online instantly:** Jump to the [Try It Online](#try-it-online) section and run interactive examples directly in your browser - no installation required!
2. **💻 GitHub Codespaces:** Click the "Code" button above and select "Codespaces" for a full cloud development environment
3. **📁 Run examples locally:** Follow the [Examples](#examples) section for local setup and execution

> 💡 **New to the project?** Start with the online examples to see what's possible, then move to local development for advanced usage.

**Found a bug or have a suggestion?** We'd love to hear from you! Please report issues at: https://github.com/Ephigenia/ikea-availability-checker/issues

## ✨ Features

**🌍 Global Coverage**
- **400+ IKEA stores** worldwide with real-time availability data
- **40+ countries supported** including major markets across Europe, North America, Asia, and Oceania
- **Comprehensive store database** with detailed location information

**📊 Multiple Output Formats**
- **JSON** for programmatic integration and data processing
- **Text** for simple command-line usage and scripting
- **CLI Tables** for beautiful, readable terminal output
- **Customizable** formatting options for different use cases

**🌐 Country Support**
- **Active countries:** at, au, be, ca, ch, cn, cz, de, dk, es, fi, fr, gb, hk, hu, hr, ie, it, jo, jp, kr, kw, lt, lv, my, nl, no, pl, pt, qa, ro, sa, se, sg, sk, th, tw, us - [![smokey](https://github.com/Ephigenia/ikea-availability-checker/actions/workflows/smokey.yml/badge.svg)](https://github.com/Ephigenia/ikea-availability-checker/actions/workflows/smokey.yml)
- **Note:** Russia (ru) operations are currently suspended
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
node_modules/.bin/ikea-availability-checker --help
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

    ┌─────────────┬─────────┬────────┬────────────────┐
    │ countryCode │ country │ buCode │ name           │
    ├─────────────┼─────────┼────────┼────────────────┤
    │ at          │ Austria │ 085    │ Wien Vösendorf │
    ├─────────────┼─────────┼────────┼────────────────┤
    │ at          │ Austria │ 090    │ Wien Nord      │
    ├─────────────┼─────────┼────────┼────────────────┤
    │ at          │ Austria │ 155    │ Klagenfurt     │
    ├─────────────┼─────────┼────────┼────────────────┤
    │ at          │ Austria │ 273    │ Innsbruck      │
    ├─────────────┼─────────┼────────┼────────────────┤
    │ at          │ Austria │ 386    │ Salzburg       │
    ├─────────────┼─────────┼────────┼────────────────┤
    │ at          │ Austria │ 387    │ Graz           │
    ├─────────────┼─────────┼────────┼────────────────┤
    │ at          │ Austria │ 388    │ Haid           │
    └─────────────┴─────────┴────────┴────────────────┘


#### Product Stock Information for a whole country

Check availability across all stores in a country:

```bash
npx ikea-availability-checker stock --country at 80213074
```

    ┌──────────────────────────┬─────────────┬─────────┬──────────┬──────────────────┬────────────────┬───────┬───────────────┐
    │ date                     │ countryCode │ country │ product  │ storeId (buCode) │ store          │ stock │ probability   │
    ├──────────────────────────┼─────────────┼─────────┼──────────┼──────────────────┼────────────────┼───────┼───────────────┤
    │ 2022-09-11T04:14:05.302Z │ at          │ Austria │ 80213074 │ 387              │ Graz           │    55 │ HIGH_IN_STOCK │
    ├──────────────────────────┼─────────────┼─────────┼──────────┼──────────────────┼────────────────┼───────┼───────────────┤
    │ 2022-09-11T09:53:08.594Z │ at          │ Austria │ 80213074 │ 388              │ Haid           │    54 │ HIGH_IN_STOCK │
    ├──────────────────────────┼─────────────┼─────────┼──────────┼──────────────────┼────────────────┼───────┼───────────────┤
    │ 2022-09-11T04:16:10.187Z │ at          │ Austria │ 80213074 │ 273              │ Innsbruck      │    86 │ HIGH_IN_STOCK │
    ├──────────────────────────┼─────────────┼─────────┼──────────┼──────────────────┼────────────────┼───────┼───────────────┤
    │ 2022-09-11T04:05:41.339Z │ at          │ Austria │ 80213074 │ 155              │ Klagenfurt     │    64 │ HIGH_IN_STOCK │
    ├──────────────────────────┼─────────────┼─────────┼──────────┼──────────────────┼────────────────┼───────┼───────────────┤
    │ 2022-09-11T04:02:42.000Z │ at          │ Austria │ 80213074 │ 386              │ Salzburg       │    69 │ HIGH_IN_STOCK │
    ├──────────────────────────┼─────────────┼─────────┼──────────┼──────────────────┼────────────────┼───────┼───────────────┤
    │ 2022-09-11T04:20:21.286Z │ at          │ Austria │ 80213074 │ 090              │ Wien Nord      │    85 │ HIGH_IN_STOCK │
    ├──────────────────────────┼─────────────┼─────────┼──────────┼──────────────────┼────────────────┼───────┼───────────────┤
    │ 2022-09-11T13:03:37.274Z │ at          │ Austria │ 80213074 │ 085              │ Wien Vösendorf │    94 │ HIGH_IN_STOCK │
    └──────────────────────────┴─────────────┴─────────┴──────────┴──────────────────┴────────────────┴───────┴───────────────┘



#### Product Stock Information for a specific store

##### Using Store ID (BU-Code)

Check availability at a specific store using its unique identifier:

```bash
npx ikea-availability-checker stock --store=155 S69022537
```

    ┌──────────────────────────┬─────────────┬─────────┬───────────┬──────────────────┬────────────┬───────┬───────────────┐
    │ date                     │ countryCode │ country │ product   │ storeId (buCode) │ store      │ stock │ probability   │
    ├──────────────────────────┼─────────────┼─────────┼───────────┼──────────────────┼────────────┼───────┼───────────────┤
    │ 2022-09-11T04:06:00.066Z │ at          │ Austria │ S69022537 │ 155              │ Klagenfurt │    23 │ HIGH_IN_STOCK │
    └──────────────────────────┴─────────────┴─────────┴───────────┴──────────────────┴────────────┴───────┴───────────────┘


##### Using Store Name or City

Search by store name, location, or city (partial matches supported):

```bash
npx ikea-availability-checker stock --store=Berlin 40413131
```

> 💡 **Pro tip:** You can use partial names like "Berlin", "München", or "Wien" - the tool will find matching stores automatically!


#### Multiple Stores and Products

Check multiple products across multiple stores (supports cross-country queries):

```bash
npx ikea-availability-checker stock --store=224,069,063 S69022537 40299687
```

> 🌍 **Cross-border shopping:** Mix store IDs from different countries to compare availability across regions!

    ┌──────────────────────────┬─────────────┬─────────┬───────────┬──────────────────┬────────────────┬───────┬───────────────┐
    │ date                     │ countryCode │ country │ product   │ storeId (buCode) │ store          │ stock │ probability   │
    ├──────────────────────────┼─────────────┼─────────┼───────────┼──────────────────┼────────────────┼───────┼───────────────┤
    │ 2022-09-11T04:23:06.064Z │ de          │ Germany │ S69022537 │ 063              │ München-Eching │    30 │ HIGH_IN_STOCK │
    ├──────────────────────────┼─────────────┼─────────┼───────────┼──────────────────┼────────────────┼───────┼───────────────┤
    │ 2022-09-11T03:20:08.203Z │ de          │ Germany │ S69022537 │ 069              │ Oldenburg      │     8 │ HIGH_IN_STOCK │
    ├──────────────────────────┼─────────────┼─────────┼───────────┼──────────────────┼────────────────┼───────┼───────────────┤
    │ 2022-09-11T12:24:09.811Z │ de          │ Germany │ S69022537 │ 224              │ Sindelfingen   │    14 │ HIGH_IN_STOCK │
    ├──────────────────────────┼─────────────┼─────────┼───────────┼──────────────────┼────────────────┼───────┼───────────────┤
    │ 2022-09-11T04:20:27.278Z │ de          │ Germany │ 40299687  │ 063              │ München-Eching │    27 │ HIGH_IN_STOCK │
    ├──────────────────────────┼─────────────┼─────────┼───────────┼──────────────────┼────────────────┼───────┼───────────────┤
    │ 2022-09-11T03:08:49.874Z │ de          │ Germany │ 40299687  │ 069              │ Oldenburg      │    11 │ HIGH_IN_STOCK │
    ├──────────────────────────┼─────────────┼─────────┼───────────┼──────────────────┼────────────────┼───────┼───────────────┤
    │ 2022-09-11T04:39:05.053Z │ de          │ Germany │ 40299687  │ 224              │ Sindelfingen   │    16 │ HIGH_IN_STOCK │
    └──────────────────────────┴─────────────┴─────────┴───────────┴──────────────────┴────────────────┴───────┴───────────────┘



## 🔌 JavaScript API

Our clean, modern JavaScript API makes it easy to build powerful applications on top of IKEA's availability data. Whether you're creating a shopping assistant, inventory tracker, or custom dashboard, our API provides all the tools you need.

> 💡 **API Feedback:** This API is actively developed and we welcome your suggestions! [Open an issue](https://github.com/Ephigenia/ikea-availability-checker/issues) to share your ideas.

```javascript
const checker = require('ikea-availability-checker');

(async function() {
    const result = await checker.availability('394', '00501436');
    console.log('RESULT', result);
})();
```

## Try It Online

You can try out the package directly in your browser using Runkit! Click on any of the examples below to run them interactively.

### Basic Product Availability Check

Check the availability of a specific product in a single store:

```javascript
// @runkit
const checker = require('ikea-availability-checker');

(async function() {
    try {
        // Check availability of product 00501436 (Billy bookcase) in store 394 (Berlin)
        const result = await checker.availability('394', '00501436');
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
                console.log(`${availability.store}: ${availability.stock} units (${availability.probability})`);
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
        const productIds = ['00501436', '80213074'];
        
        console.log(`Checking ${productIds.length} products across ${allStores.length} stores...`);
        
        const availabilities = await checker.availabilities(allStores, productIds);
        
        console.log('\nResults:');
        availabilities.forEach(availability => {
            if (availability) {
                console.log(`${availability.product} at ${availability.store} (${availability.country}): ${availability.stock} units`);
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
        const result = await checker.availability('99999', '00501436');
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
   node examples/product-availability.js 394 00501436
   
   # Country-wide availability scan
   node examples/country-availability.js de 00501436
   
   # Store discovery by country
   node examples/stores.js at
   ```


### ☁️ Running Examples in GitHub Codespaces

**Zero-setup cloud development environment**

1. **Launch Codespace:**
   - Click the "Code" button on this repository
   - Select "Codespaces" tab
   - Click "Create codespace on [branch]"
   - *💡 The `devcontainer` branch includes enhanced development environment configuration*

2. **Run examples instantly:**
   ```bash
   # Everything is pre-configured - just run!
   npm install && npm run build
   
   # Try the examples
   node examples/product-availability.js 394 00501436
   node examples/country-availability.js de 00501436
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

> 💡 **Development Environment:** We strongly recommend using either nvm with the specified Node version or the Docker container for consistent development experience.


### 🐛 Debugging

**Troubleshoot HTTP requests and responses**

Enable detailed HTTP debugging to see all network requests:

```bash
NODE_DEBUG=http npm run start
```

This will show you:
- **Request details** (URLs, headers, parameters)
- **Response data** (status codes, response bodies)
- **Timing information** (request duration, retries)


### 🧪 Testing

**Comprehensive test suite with multiple testing approaches**

The project uses [Jest](https://jestjs.io/) as the test runner with comprehensive test coverage.

#### Running Tests

```bash
# Run all tests with coverage
npm run test

# Watch mode for development
npm run tdd

# Run specific test suites
npm run test -- --grep="stock reporter"
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
- **Local Files:** Available in `/postman/collection` directory
- **API Schema:** OpenAPI specification in `/postman/schemas/`

Perfect for:
- **API exploration** and understanding
- **Integration testing** before implementation
- **Debugging** API responses and errors

### 🚀 Release Process

**Automated, semantic versioning with CI/CD**

Releases are fully automated using [semantic-release](https://github.com/semantic-release/semantic-release):

- **Automatic versioning** based on conventional commits
- **Changelog generation** from commit messages
- **NPM publishing** on successful builds
- **GitHub releases** with detailed notes

> 📝 **Commit Convention:** Use conventional commits (feat:, fix:, docs:, etc.) for automatic version bumping

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
| [vrslev/ikea-api-client](https://github.com/vrslev/ikea-api-client) | JavaScript | Alternative IKEA API client |
| [ikea stock checker](https://github.com/lovegandhi/ikea-stock-checker) | JavaScript | Stock checking utility |
| [ikea stock finder](https://github.com/sasasoni/ikea_stock_finder) | Ruby | Japanese market focused |
| [ikea scraper](https://github.com/LordBonzi/ikea-scraper) | Python | Stock scraping tool |
| [ikea bot](https://github.com/xorik/ikea-bot) | JavaScript | Telegram notification bot |

### 🌐 Web Services

**Ready-to-use web applications and services**

| Service | Description | Region |
|---------|-------------|--------|
| [Stock Hound](http://stockhound.spgill.me/) | Web-based stock checker | Global |
| [IKEA Click & Collect](https://ikea-status.dong.st/) | US store availability | US |
| [ikea-availability-web](https://github.com/anditosl/ikea-availability-web) | Web interface | Global |
| [ikeaprices](https://github.com/mnazarov/ikeaprices) | Price comparison tool | Global |

<hr>
<small>
† This website is not run by or affiliated with Inter-IKEA Systems B.V. or its related business entities.

IKEA® is a registered trademark of Inter-IKEA Systems B.V. in the U.S. and other countries.
</small>
