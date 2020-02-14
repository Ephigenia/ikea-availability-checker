Sometimes there is a high demand on products which then are unavailable in the IKEA online store and even in the locations. So here’s a script which makes it easy to check the availability of a list of products and locations.

[![MIT License](https://badges.frapsoft.com/os/mit/mit.svg?v=102)](https://github.com/ellerbrock/open-source-badge/)
[![NPM Package](https://badge.fury.io/js/ikea-availability-checker.svg)](https://www.npmjs.com/package/ikea-availability-checker)
[![NPM Downloads](https://img.shields.io/npm/dt/ikea-availability-checker.svg)](https://www.npmjs.com/package/ikea-availability-checker)
[![CircleCI](https://circleci.com/gh/Ephigenia/ikea-availability-checker.svg?style=svg&circle-token=1907356b3e852337a9e5f96d9b99ef1942c4ffa2)](https://circleci.com/gh/Ephigenia/ikea-availability-checker)
[![Known Vulnerabilities](https://snyk.io/test/github/ephigenia/ikea-availability-checker/badge.svg)](https://snyk.io/test/github/ephigenia/ikea-availability-checker)


Installation
================================================================================

    npm install ikea-availability-checker


Usage Examples
================================================================================
The default reports prints the results as a human readable table.

## List stores in specific countries

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


## Product Avaialability in a country

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


## Specific product, store & country

    npm run start -- stock --store=155 --country=at S69022537

    ┌─────────────┬─────────┬───────────┬──────────────────┬────────────┬───────┬─────────────┐
    │ countryCode │ country │ product   │ storeId (buCode) │ store      │ stock │ probability │
    ├─────────────┼─────────┼───────────┼──────────────────┼────────────┼───────┼─────────────┤
    │ at          │ Austria │ S69022537 │ 155              │ Klagenfurt │    10 │        HIGH │
    └─────────────┴─────────┴───────────┴──────────────────┴────────────┴───────┴─────────────┘


## Multiple products & stores

    npm run start -- stock --country=de --store=224,069,063 S69022537 40313075 40299687

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

Other Projects & Articles
================================================================================

* npm package [ikea-stock-checker](https://www.npmjs.com/package/ikea-stock-checker)
* [API of the Day: Checking IKEA Availability and Warehouse Locations]( https://medium.com/@JoshuaAJung/api-of-the-day-ikea-availability-checks-8678794a9b52) by Joshua Jung


Development
================================================================================

## Requirements

- [nodejs](https://nodejs.org) for version info check [.nvmrc](./.nvmrc).
*it is strongly recommended to use either nvm and the exact same node version or the docker container as development environment*


Debugging
================================================================================

    DEBUG=ikea* npm run start


Testing
================================================================================

The project has a preconfigured test runner [moch](https://mochajs.org/).

## Run Tests

Running all tests will also create coverage reports shown after the test results.

    npm run test

## TDD

    npm run tdd
