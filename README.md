Sometimes there is a high demand for products that are unavailable in the IKEA online store and even in the locations. So here’s a script which makes it easy to check the availability of a list of products and locations.

[![MIT License](https://badges.frapsoft.com/os/mit/mit.svg?v=102)](https://github.com/ellerbrock/open-source-badge/)
[![NPM Package](https://badge.fury.io/js/ikea-availability-checker.svg)](https://www.npmjs.com/package/ikea-availability-checker)
[![NPM Downloads](https://img.shields.io/npm/dt/ikea-availability-checker.svg)](https://www.npmjs.com/package/ikea-availability-checker)
[![Known Vulnerabilities](https://snyk.io/test/github/ephigenia/ikea-availability-checker/badge.svg)](https://snyk.io/test/github/ephigenia/ikea-availability-checker)

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
- [Other Projects & Articles](#other-projects--articles)

Features
================================================================================

- list of 156 IKEA stores worldwide
- get product stock amount for a product from a whole country or single store in JSON, CSV and CLI-Table format
- support for many countries: ae, at, au, ca, ch, cn, cz, de, dk, es, fi, fr, gb
hk, hr, hu, ie, it, jo, jp, kr, kw, lt, my, nl, no, pl, pt, qa, ro, ru, sa, se, sg, sk, th, tw, us
- integrate the library into your node project

Command Line
================================================================================

## Install
### Global

A globally installed ikea-availability-checker can be used anywhere but there can only be one version of it.

    npm install -g ikea-availability-checker

After that the ikea-availability-checker should be callable from everywhere as there’s a link in your usr/bin directory:

    ikea-availability-checker

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

    npm run start -- stock --country at S69022537

    ┌──────────────────────────┬─────────────┬─────────┬───────────┬──────────────────┬────────────────┬───────┬─────────────┐
    │ date                     │ countryCode │ country │ product   │ storeId (buCode) │ store          │ stock │ probability │
    ├──────────────────────────┼─────────────┼─────────┼───────────┼──────────────────┼────────────────┼───────┼─────────────┤
    │ 2020-02-14T10:02:16.036Z │ at          │ Austria │ S69022537 │ 387              │ Graz           │     8 │        HIGH │
    ├──────────────────────────┼─────────────┼─────────┼───────────┼──────────────────┼────────────────┼───────┼─────────────┤
    │ 2020-02-14T10:02:15.986Z │ at          │ Austria │ S69022537 │ 388              │ Haid           │    16 │        HIGH │
    ├──────────────────────────┼─────────────┼─────────┼───────────┼──────────────────┼────────────────┼───────┼─────────────┤
    │ 2020-02-14T10:02:16.081Z │ at          │ Austria │ S69022537 │ 273              │ Innsbruck      │    12 │        HIGH │
    ├──────────────────────────┼─────────────┼─────────┼───────────┼──────────────────┼────────────────┼───────┼─────────────┤
    │ 2020-02-14T10:02:15.988Z │ at          │ Austria │ S69022537 │ 155              │ Klagenfurt     │    13 │        HIGH │
    ├──────────────────────────┼─────────────┼─────────┼───────────┼──────────────────┼────────────────┼───────┼─────────────┤
    │ 2020-02-14T10:02:16.092Z │ at          │ Austria │ S69022537 │ 386              │ Salzburg       │    18 │        HIGH │
    ├──────────────────────────┼─────────────┼─────────┼───────────┼──────────────────┼────────────────┼───────┼─────────────┤
    │ 2020-02-14T10:02:16.092Z │ at          │ Austria │ S69022537 │ 090              │ Wien Nord      │    12 │        HIGH │
    ├──────────────────────────┼─────────────┼─────────┼───────────┼──────────────────┼────────────────┼───────┼─────────────┤
    │ 2020-02-14T10:02:16.095Z │ at          │ Austria │ S69022537 │ 085              │ Wien Vösendorf │    23 │        HIGH │
    └──────────────────────────┴─────────────┴─────────┴───────────┴──────────────────┴────────────────┴───────┴─────────────┘


#### Product Stock Information for a specific store

##### with BU-Code (Store-Id)
    npm run start -- stock --store=155 S69022537

    ┌─────────────┬─────────┬───────────┬──────────────────┬────────────┬───────┬─────────────┐
    │ countryCode │ country │ product   │ storeId (buCode) │ store      │ stock │ probability │
    ├─────────────┼─────────┼───────────┼──────────────────┼────────────┼───────┼─────────────┤
    │ at          │ Austria │ S69022537 │ 155              │ Klagenfurt │    10 │        HIGH │
    └─────────────┴─────────┴───────────┴──────────────────┴────────────┴───────┴─────────────┘

##### Store-Name / Location / City-Name

The "store" option also accepts strings which match on the location’s name:

    npm run start -- stock --store=Berlin 40413131


#### Multiple Stores and Product Ids

The list of bu-codes can also contain bu-codes from different countries.

    npm run start -- stock --store=224,069,063 S69022537 40313075 40299687

    ┌─────────────┬─────────┬──────────┬──────────────────┬────────────────┬───────┬─────────────┐
    │ countryCode │ country │ product  │ storeId (buCode) │ store          │ stock │ probability │
    ├─────────────┼─────────┼──────────┼──────────────────┼────────────────┼───────┼─────────────┤
    │ de          │ Germany │ 40313075 │ 063              │ München-Eching │     9 │        HIGH │
    ├─────────────┼─────────┼──────────┼──────────────────┼────────────────┼───────┼─────────────┤
    │ de          │ Germany │ 40313075 │ 069              │ Oldenburg      │     6 │        HIGH │
    ├─────────────┼─────────┼──────────┼──────────────────┼────────────────┼───────┼─────────────┤
    │ de          │ Germany │ 40313075 │ 224              │ Sindelfingen   │    10 │        HIGH │
    └─────────────┴─────────┴──────────┴──────────────────┴────────────────┴───────┴─────────────┘
    ┌─────────────┬─────────┬──────────┬──────────────────┬────────────────┬───────┬─────────────┐
    │ countryCode │ country │ product  │ storeId (buCode) │ store          │ stock │ probability │
    ├─────────────┼─────────┼──────────┼──────────────────┼────────────────┼───────┼─────────────┤
    │ de          │ Germany │ 40299687 │ 063              │ München-Eching │     9 │        HIGH │
    ├─────────────┼─────────┼──────────┼──────────────────┼────────────────┼───────┼─────────────┤
    │ de          │ Germany │ 40299687 │ 069              │ Oldenburg      │    32 │        HIGH │
    ├─────────────┼─────────┼──────────┼──────────────────┼────────────────┼───────┼─────────────┤
    │ de          │ Germany │ 40299687 │ 224              │ Sindelfingen   │    39 │        HIGH │
    └─────────────┴─────────┴──────────┴──────────────────┴────────────────┴───────┴─────────────┘
    ┌─────────────┬─────────┬───────────┬──────────────────┬────────────────┬───────┬─────────────┐
    │ countryCode │ country │ product   │ storeId (buCode) │ store          │ stock │ probability │
    ├─────────────┼─────────┼───────────┼──────────────────┼────────────────┼───────┼─────────────┤
    │ de          │ Germany │ S69022537 │ 063              │ München-Eching │    19 │        HIGH │
    ├─────────────┼─────────┼───────────┼──────────────────┼────────────────┼───────┼─────────────┤
    │ de          │ Germany │ S69022537 │ 069              │ Oldenburg      │     9 │        HIGH │
    ├─────────────┼─────────┼───────────┼──────────────────┼────────────────┼───────┼─────────────┤
    │ de          │ Germany │ S69022537 │ 224              │ Sindelfingen   │     9 │        HIGH │
    └─────────────┴─────────┴───────────┴──────────────────┴────────────────┴───────┴─────────────┘


API 
================================================================================

The API interface which helps you including the check into your library is kind of new. If you have suggestions for improvements feel free to [open an issue](https://github.com/Ephigenia/ikea-availability-checker/issues).

```javascript
const checker = require('ikea-availability-checker');

(async function() {
    const result = await checker.availability('394', 'S69022537');
    console.log('RESULT', result);
})();
```

Development
================================================================================

## Requirements

- [nodejs](https://nodejs.org) for version info check [.nvmrc](./.nvmrc).
*it is strongly recommended to use either nvm and the exact same node version or the docker container as development environment*


## Debug

    DEBUG=ikea* npm run start


## Testing

The project has a preconfigured test runner [mocha](https://mochajs.org/). Test coverage is not good.

Running all tests will also create coverage reports shown after the test results.

    npm run test

### TDD

    npm run tdd

### Run Specific tests

    run test -- --grep="stock reporter"


## Release

    npm version minor
    npm publish


Other Projects & Articles
================================================================================

* npm package [ikea-stock-checker](https://www.npmjs.com/package/ikea-stock-checker)
* [API of the Day: Checking IKEA Availability and Warehouse Locations]( https://medium.com/@JoshuaAJung/api-of-the-day-ikea-availability-checks-8678794a9b52) by Joshua Jung

