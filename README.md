Sometimes there is a high demand for products that are unavailable in the IKEA online store and even in the locations. So here’s a script which makes it easy to check the availability of a list of products and locations.

[![MIT License](https://badges.frapsoft.com/os/mit/mit.svg?v=102)](https://github.com/ellerbrock/open-source-badge/)
[![NPM Package](https://badge.fury.io/js/ikea-availability-checker.svg)](https://www.npmjs.com/package/ikea-availability-checker)
[![NPM Downloads](https://img.shields.io/npm/dt/ikea-availability-checker.svg)](https://www.npmjs.com/package/ikea-availability-checker)
[![Known Vulnerabilities](https://snyk.io/test/github/ephigenia/ikea-availability-checker/badge.svg)](https://snyk.io/test/github/ephigenia/ikea-availability-checker)
[![Rate on Openbase](https://badges.openbase.com/js/rating/ikea-availability-checker.svg)](https://openbase.com/js/ikea-availability-checker?utm_source=embedded&utm_medium=badge&utm_campaign=rate-badge)

- [Features](#features)
- [Command Line](#command-line)
    - [Install](#install)
        - [Global](#global)
        - [Local](#local)
        - [NPX](#npx)
    - [Use](#use)
        - [Stores](#stores)
        - [Stock](#stock)
            - [Product Stock Information for a whole country](#product-stock-information-for-a-whole-country)
            - [Product Stock Information for a specific store](#product-stock-information-for-a-specific-store)
                - [with BU-Code (Store-Id)](#with-bu-code-store-id)
                - [Store-Name / Location / City-Name](#store-name--location--city-name)
            - [Multiple Stores and Product Ids](#multiple-stores-and-product-ids)
- [API](#api)
- [Development](#development)
    - [Requirements](#requirements)
    - [Debug](#debug)
    - [Testing](#testing)
        - [TDD](#tdd)
        - [Run Specific tests](#run-specific-tests)
    - [Release](#release)
    - [Trouble Shooting](#trouble-shooting)
- [Other Projects & Articles](#other-projects--articles)
    - [Articles & Resources](#articles--resources)
    - [Packages](#packages)
    - [Services](#services)

Features
================================================================================

- list of 380 IKEA stores worldwide
- get product stock amount for a whole country or single store in JSON, CSV and CLI-Table format including forecast (when available)
- support for many countries: at, au, be, ca, ch, cn, cz, de, dk, es, fi, fr, gb, hk, hr, hu, ie, it, jo, jp, kr, kw, lt, my, nl, no, pl, pt, qa, ro, ru, sa, se, sg, sk, th, tw, us
- integrate/use the library into your node project

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

    npm run start -- stores at

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

    npm run start -- stock --country at 80213074

    ┌──────────────────────────┬─────────────┬─────────┬──────────┬──────────────────┬─────────────────────┬───────┬─────────────┬─────────────────────┬────────────────────────────────────────────┐
    │ date                     │ countryCode │ country │ product  │ storeId (buCode) │ store               │ stock │ probability │ restockDate         │ forecast                                   │
    ├──────────────────────────┼─────────────┼─────────┼──────────┼──────────────────┼─────────────────────┼───────┼─────────────┼─────────────────────┼────────────────────────────────────────────┤
    │ 2020-09-29T10:44:53.556Z │ at          │ Austria │ 80213074 │ 387              │ IKEA Graz           │    26 │        HIGH │                     │ 09-30: 54, 10-01: 54, 10-02: 48, 10-03: 37 │
    ├──────────────────────────┼─────────────┼─────────┼──────────┼──────────────────┼─────────────────────┼───────┼─────────────┼─────────────────────┼────────────────────────────────────────────┤
    │ 2020-09-29T10:44:53.614Z │ at          │ Austria │ 80213074 │ 388              │ IKEA Haid           │     0 │         LOW │ in 1d (2020-10-01)  │ 09-30: 0, 10-01: 45, 10-02: 39, 10-03: 33  │
    ├──────────────────────────┼─────────────┼─────────┼──────────┼──────────────────┼─────────────────────┼───────┼─────────────┼─────────────────────┼────────────────────────────────────────────┤
    │ 2020-09-29T10:44:53.607Z │ at          │ Austria │ 80213074 │ 273              │ IKEA Innsbruck      │     1 │         LOW │ in 3d (2020-10-03)  │ 09-30: 0, 10-01: 0, 10-02: 0, 10-03: 36    │
    ├──────────────────────────┼─────────────┼─────────┼──────────┼──────────────────┼─────────────────────┼───────┼─────────────┼─────────────────────┼────────────────────────────────────────────┤
    │ 2020-09-29T10:44:53.643Z │ at          │ Austria │ 80213074 │ 155              │ IKEA Klagenfurt     │    25 │        HIGH │                     │ 09-30: 32, 10-01: 32, 10-02: 28, 10-03: 22 │
    ├──────────────────────────┼─────────────┼─────────┼──────────┼──────────────────┼─────────────────────┼───────┼─────────────┼─────────────────────┼────────────────────────────────────────────┤
    │ 2020-09-29T10:44:53.676Z │ at          │ Austria │ 80213074 │ 386              │ IKEA Salzburg       │    22 │        HIGH │                     │ 09-30: 22, 10-01: 22, 10-02: 22, 10-03: 17 │
    ├──────────────────────────┼─────────────┼─────────┼──────────┼──────────────────┼─────────────────────┼───────┼─────────────┼─────────────────────┼────────────────────────────────────────────┤
    │ 2020-09-29T10:44:53.610Z │ at          │ Austria │ 80213074 │ 090              │ IKEA Wien Nord      │     0 │         LOW │ in 13d (2020-10-13) │ 09-30: 0, 10-01: 0, 10-02: 0, 10-03: 0     │
    ├──────────────────────────┼─────────────┼─────────┼──────────┼──────────────────┼─────────────────────┼───────┼─────────────┼─────────────────────┼────────────────────────────────────────────┤
    │ 2020-09-29T10:44:53.559Z │ at          │ Austria │ 80213074 │ 085              │ IKEA Wien Vösendorf │    26 │        HIGH │                     │ 09-30: 34, 10-01: 32, 10-02: 20, 10-03: 7  │
    └──────────────────────────┴─────────────┴─────────┴──────────┴──────────────────┴─────────────────────┴───────┴─────────────┴─────────────────────┴────────────────────────────────────────────┘


#### Product Stock Information for a specific store

##### with BU-Code (Store-Id)
    npm run start -- stock --store=155 S69022537

    ┌──────────────────────────┬─────────────┬─────────┬──────────┬──────────────────┬─────────────────┬───────┬─────────────┬─────────────┬────────────────────────────────────────────┐
    │ date                     │ countryCode │ country │ product  │ storeId (buCode) │ store           │ stock │ probability │ restockDate │ forecast                                   │
    ├──────────────────────────┼─────────────┼─────────┼──────────┼──────────────────┼─────────────────┼───────┼─────────────┼─────────────┼────────────────────────────────────────────┤
    │ 2020-09-29T10:45:24.219Z │ at          │ Austria │ 80213074 │ 155              │ IKEA Klagenfurt │    25 │        HIGH │             │ 09-30: 32, 10-01: 32, 10-02: 28, 10-03: 22 │
    └──────────────────────────┴─────────────┴─────────┴──────────┴──────────────────┴─────────────────┴───────┴─────────────┴─────────────┴────────────────────────────────────────────┘

##### Store-Name / Location / City-Name

The "store" option also accepts strings which match on the location’s name:

    npm run start -- stock --store=Berlin 40413131


#### Multiple Stores and Product Ids

The list of bu-codes can also contain bu-codes from different countries.

    npm run start -- stock --store=224,069,063 S69022537 40299687

    ┌──────────────────────────┬─────────────┬─────────┬───────────┬──────────────────┬─────────────────────┬───────┬─────────────┬────────────────────┬────────────────────────────────────────────┐
    │ date                     │ countryCode │ country │ product   │ storeId (buCode) │ store               │ stock │ probability │ restockDate        │ forecast                                   │
    ├──────────────────────────┼─────────────┼─────────┼───────────┼──────────────────┼─────────────────────┼───────┼─────────────┼────────────────────┼────────────────────────────────────────────┤
    │ 2020-09-29T10:46:06.682Z │ de          │ Germany │ S69022537 │ 063              │ IKEA München-Eching │     8 │        HIGH │                    │ 09-30: 5, 10-01: 32, 10-02: 29, 10-03: 26  │
    ├──────────────────────────┼─────────────┼─────────┼───────────┼──────────────────┼─────────────────────┼───────┼─────────────┼────────────────────┼────────────────────────────────────────────┤
    │ 2020-09-29T10:46:06.682Z │ de          │ Germany │ S69022537 │ 069              │ IKEA Oldenburg      │    19 │        HIGH │                    │ 09-30: 17, 10-01: 20, 10-02: 20, 10-03: 19 │
    ├──────────────────────────┼─────────────┼─────────┼───────────┼──────────────────┼─────────────────────┼───────┼─────────────┼────────────────────┼────────────────────────────────────────────┤
    │ 2020-09-29T10:46:06.683Z │ de          │ Germany │ S69022537 │ 224              │ IKEA Sindelfingen   │    11 │        HIGH │                    │ 09-30: 19, 10-01: 16, 10-02: 12, 10-03: 9  │
    ├──────────────────────────┼─────────────┼─────────┼───────────┼──────────────────┼─────────────────────┼───────┼─────────────┼────────────────────┼────────────────────────────────────────────┤
    │ 2020-09-29T10:46:06.684Z │ de          │ Germany │ 40299687  │ 063              │ IKEA München-Eching │    15 │        HIGH │                    │ 09-30: 14, 10-01: 12, 10-02: 10, 10-03: 8  │
    ├──────────────────────────┼─────────────┼─────────┼───────────┼──────────────────┼─────────────────────┼───────┼─────────────┼────────────────────┼────────────────────────────────────────────┤
    │ 2020-09-29T10:46:06.684Z │ de          │ Germany │ 40299687  │ 069              │ IKEA Oldenburg      │     0 │         LOW │ in 3d (2020-10-03) │ 09-30: 0, 10-01: 0, 10-02: 0, 10-03: 36    │
    ├──────────────────────────┼─────────────┼─────────┼───────────┼──────────────────┼─────────────────────┼───────┼─────────────┼────────────────────┼────────────────────────────────────────────┤
    │ 2020-09-29T10:46:06.685Z │ de          │ Germany │ 40299687  │ 224              │ IKEA Sindelfingen   │     1 │         LOW │ in 4d (2020-10-04) │ 09-30: 0, 10-01: 0, 10-02: 0, 10-03: 0     │
    └──────────────────────────┴─────────────┴─────────┴───────────┴──────────────────┴─────────────────────┴───────┴─────────────┴────────────────────┴────────────────────────────────────────────┘


API 
================================================================================

The API interface which helps you including the check into your library is kind of new. If you have suggestions for improvements feel free to [open an issue](https://github.com/Ephigenia/ikea-availability-checker/issues).

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
*it is strongly recommended to use either nvm and the exact same node version or the docker container as development environment*


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


## Release

Releases are automated and created by CI managed by [semantic-release](https://github.com/semantic-release/semantic-release).

## Trouble Shooting

- `DEPRECATED`
    You’re trying to check the availability for a product which may not be available in the country/store. Read more about in the [Discussions](https://github.com/Ephigenia/ikea-availability-checker/discussions/83)


Other Projects & Articles
================================================================================

## Articles & Resources

* npm package [ikea-stock-checker](https://www.npmjs.com/package/ikea-stock-checker)
* [API of the Day: Checking IKEA Availability and Warehouse Locations](https://medium.com/@JoshuaAJung/api-of-the-day-ikea-availability-checks-8678794a9b52) by Joshua Jung
* [IKEA Reddit](https://www.reddit.com/r/IKEA/)
* [IKEA Mobile api description](https://del.dog/ikeamobileapi.md)

## Packages

* [ikea stock checker](https://github.com/lovegandhi/ikea-stock-checker)
* [ikea stock finder](https://github.com/sasasoni/ikea_stock_finder) japanese ruby
* [ikea scraper](https://github.com/LordBonzi/ikea-scraper) python stock scraper
* [ikea bot](https://github.com/xorik/ikea-bot) telegram notification bot

## Services

* [Stock Hound](https://github.com/spgill/stock-hound) [website](http://stockhound.spgill.me/)
* [IKEA Click & Collect Availability](https://ikea-status.dong.st/) website for us-stores
* [ikea-availability-web](https://github.com/anditosl/ikea-availability-web)

* [ikeaprices](https://github.com/mnazarov/ikeaprices) browser snippet for comparing prices in different countries

<hr>
<small>
† This website is not run by or affiliated with Inter-IKEA Systems B.V. or its related business entities.

IKEA® is a registered trademark of Inter-IKEA Systems B.V. in the U.S. and other countries.
</small>
