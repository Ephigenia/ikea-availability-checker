Sometimes there is a high demand for products that are unavailable in the IKEA online store and even in the locations. So here’s a script that makes it easy to check the availability of a list of products and locations.

[![MIT License](https://badges.frapsoft.com/os/mit/mit.svg?v=102)](https://github.com/ellerbrock/open-source-badge/)
[![NPM Package](https://badge.fury.io/js/ikea-availability-checker.svg)](https://www.npmjs.com/package/ikea-availability-checker)
[![NPM Downloads](https://img.shields.io/npm/dt/ikea-availability-checker.svg)](https://www.npmjs.com/package/ikea-availability-checker)
[![Known Vulnerabilities](https://snyk.io/test/github/ephigenia/ikea-availability-checker/badge.svg)](https://snyk.io/test/github/ephigenia/ikea-availability-checker)
[![Rate on Openbase](https://badges.openbase.com/js/rating/ikea-availability-checker.svg)](https://openbase.com/js/ikea-availability-checker?utm_source=embedded&utm_medium=badge&utm_campaign=rate-badge)
[![default](https://github.com/Ephigenia/ikea-availability-checker/actions/workflows/default.yml/badge.svg?branch=master)](https://github.com/Ephigenia/ikea-availability-checker/actions/workflows/default.yml)
[![smokey](https://github.com/Ephigenia/ikea-availability-checker/actions/workflows/smokey.yml/badge.svg)](https://github.com/Ephigenia/ikea-availability-checker/actions/workflows/smokey.yml)

Please report any bugs related to this alpha in the issues: https://github.com/Ephigenia/ikea-availability-checker/issues

Features
================================================================================

- supports listings from >400 IKEA stores worldwide
- get product stock amount for a whole country or single store in JSON, Text and CLI-Table format
- support for many countries:
    - at, au, be, ca, ch, cn, cz, de, dk, es, fi, fr, gb, hk, hu, hr, ie, it, jo, jp, kr, kw, lt, lv, my, nl, no, pl, pt, qa, ro, sa, se, sg, sk, th, tw, us - [![smokey](https://github.com/Ephigenia/ikea-availability-checker/actions/workflows/smokey.yml/badge.svg?branch=alpha)](https://github.com/Ephigenia/ikea-availability-checker/actions/workflows/smokey.yml)
    - Russia (ru) is closed down
- [javascript API](#api) for easy integration in your library or project

Command Line
================================================================================

## Install

### Global

A globally installed ikea-availability-checker can be used anywhere but there can only be one version of it.

    npm install -g ikea-availability-checker

After you can run the ikea-availability-checker directly:

    ikea-availability

### Local

A locally installed ikea-availability-checker will be placed in `./node_modules/ikea-availability-checker` and can be called using the binary link:

    npm install ikea-availability-checker;
    node_modules/.bin/ikea-availability-checker --help;

### NPX

Or call it directly using [npx](https://www.npmjs.com/package/npx):

    npx ikea-availability-checker --help

## Use
### Stores

    npx ikea-availability-checker stores at

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


### Stock

#### Product Stock Information for a whole country

    npx ikea-availability-checker stock --country at 80213074

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

##### with BU-Code (Store-Id)

    npx ikea-availability-checker stock --store=155 S69022537

    ┌──────────────────────────┬─────────────┬─────────┬───────────┬──────────────────┬────────────┬───────┬───────────────┐
    │ date                     │ countryCode │ country │ product   │ storeId (buCode) │ store      │ stock │ probability   │
    ├──────────────────────────┼─────────────┼─────────┼───────────┼──────────────────┼────────────┼───────┼───────────────┤
    │ 2022-09-11T04:06:00.066Z │ at          │ Austria │ S69022537 │ 155              │ Klagenfurt │    23 │ HIGH_IN_STOCK │
    └──────────────────────────┴─────────────┴─────────┴───────────┴──────────────────┴────────────┴───────┴───────────────┘


##### Store-Name / Location / City-Name

The "store" option also accepts strings that match on the location’s name:

    npx ikea-availability-checker stock --store=Berlin 40413131


#### Multiple Stores and Product Ids

The list of bu-codes can also contain bu-codes from different countries.

    npx ikea-availability-checker stock --store=224,069,063 S69022537 40299687

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



API 
================================================================================

The API interface which helps you include the check into your library is kind of new. If you have suggestions for improvements feel free to [open an issue](https://github.com/Ephigenia/ikea-availability-checker/issues).

```javascript
const checker = require('ikea-availability-checker');

(async function() {
    const result = await checker.availability('394', '00501436');
    console.log('RESULT', result);
})();
```

Checkout more examples in the [examples](./examples) directory.

Development
================================================================================

## Requirements

- [nodejs](https://nodejs.org) for version info check [.nvmrc](./.nvmrc).
*it is strongly recommended to use either nvm and the same node version or the docker container as a development environment*


## Debug

Node provides a simple way to debug all HTTP-related requests and responses using `NODE_DEBUG`:

    NODE_DEBUG=http npm run start


## Testing

The project has a preconfigured test runner [mocha](https://mochajs.org/). Test coverage is not good.

Running all tests will also create coverage reports shown after the test results.

    npm run test

### TDD

    npm run tdd

### Run Specific tests

    run test -- --grep="stock reporter"

### Smoke Testing

Two shell scripts can be used for testing the different output formats and all or some countries in the "/scripts" directory.

### Request Testing

There’s a public postman collection: [IKEA Workspace](https://www.postman.com/crimson-rocket-271330/workspace/ikea/overview) for you to access which is also linked with this repository: /postman/collection

## Release

Releases are automated and created by CI managed by [semantic-release](https://github.com/semantic-release/semantic-release).

## Trouble Shooting

- I want to deactivate colored output
    Colored output can be disabled by setting the `FORCE_COLOR=1` before running a command: `FORCE_COLOR=0 npx ikea-availability-checker stores de`


Other Projects & Articles
================================================================================

## Articles & Resources

- npm package [ikea-stock-checker](https://www.npmjs.com/package/ikea-stock-checker)
- [API of the Day: Checking IKEA Availability and Warehouse Locations](https://medium.com/@JoshuaAJung/api-of-the-day-ikea-availability-checks-8678794a9b52) by Joshua Jung
- [IKEA Reddit](https://www.reddit.com/r/IKEA/)
- [IKEA Mobile api description](https://del.dog/ikeamobileapi.md)

## Packages

- [vrslev/ikea-api-client](https://github.com/vrslev/ikea-api-client) alternate IKEA API Client
- [ikea stock checker](https://github.com/lovegandhi/ikea-stock-checker)
- [ikea stock finder](https://github.com/sasasoni/ikea_stock_finder) Japanese ruby
- [ikea scraper](https://github.com/LordBonzi/ikea-scraper) python stock scraper
- [ikea bot](https://github.com/xorik/ikea-bot) telegram notification bot

## Services

- [Stock Hound](https://github.com/spgill/stock-hound) [website](http://stockhound.spgill.me/)
- [IKEA Click & Collect Availability](https://ikea-status.dong.st/) website for us-stores
- [ikea-availability-web](https://github.com/anditosl/ikea-availability-web)

- [ikeaprices](https://github.com/mnazarov/ikeaprices) browser snippet for comparing prices in different countries

<hr>
<small>
† This website is not run by or affiliated with Inter-IKEA Systems B.V. or its related business entities.

IKEA® is a registered trademark of Inter-IKEA Systems B.V. in the U.S. and other countries.
</small>
