Sometimes there is a high demand on products which then are unavailable in the IKEA online store and even in the locations. So here’s a script which makes it easy to check the availability of a list of products and locations.

[![MIT License](https://badges.frapsoft.com/os/mit/mit.svg?v=102)](https://github.com/ellerbrock/open-source-badge/)
[![NPM Package](https://badge.fury.io/js/ikea-availability-checker.svg)](https://www.npmjs.com/package/ikea-availability-checker)
[![NPM Downloads](https://img.shields.io/npm/dt/ikea-availability-checker.svg)](https://www.npmjs.com/package/ikea-availability-checker)
[![CircleCI](https://circleci.com/gh/Ephigenia/ikea-availability-checker.svg?style=svg&circle-token=1907356b3e852337a9e5f96d9b99ef1942c4ffa2)](https://circleci.com/gh/Ephigenia/ikea-availability-checker)
[![Code Climate](https://codeclimate.com/repos/589349c587faa17fe100582d/badges/3242f2d4075babd0dd9f/gpa.svg)](https://codeclimate.com/repos/589349c587faa17fe100582d/feed)
[![Issue Count](https://codeclimate.com/repos/589349c587faa17fe100582d/badges/3242f2d4075babd0dd9f/issue_count.svg)](https://codeclimate.com/repos/589349c587faa17fe100582d/feed)
[![Test Coverage](https://codeclimate.com/repos/589349c587faa17fe100582d/badges/3242f2d4075babd0dd9f/coverage.svg)](https://codeclimate.com/repos/589349c587faa17fe100582d/coverage)
[![Known Vulnerabilities](https://snyk.io/test/github/ephigenia/ikea-availability-checker/badge.svg)](https://snyk.io/test/github/ephigenia/ikea-availability-checker)

# Installation

    npm install ikea-availability-checker

# Usage Examples

The default reports prints the results as a human readable table.

## List stores in specific countries

    source/cli.js stores at

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
```

## Product Avaialability in a country

    source/cli.js stock --country at S69022537

```
┌─────────────┬─────────┬───────────┬──────────────────┬────────────────┬───────┬─────────────┐
│ countryCode │ country │ product   │ storeId (buCode) │ store          │ stock │ probability │
├─────────────┼─────────┼───────────┼──────────────────┼────────────────┼───────┼─────────────┤
│ at          │ Austria │ S69022537 │ 387              │ Graz           │    10 │        HIGH │
├─────────────┼─────────┼───────────┼──────────────────┼────────────────┼───────┼─────────────┤
│ at          │ Austria │ S69022537 │ 388              │ Haid           │     8 │        HIGH │
├─────────────┼─────────┼───────────┼──────────────────┼────────────────┼───────┼─────────────┤
│ at          │ Austria │ S69022537 │ 273              │ Innsbruck      │    13 │        HIGH │
├─────────────┼─────────┼───────────┼──────────────────┼────────────────┼───────┼─────────────┤
│ at          │ Austria │ S69022537 │ 155              │ Klagenfurt     │    10 │        HIGH │
├─────────────┼─────────┼───────────┼──────────────────┼────────────────┼───────┼─────────────┤
│ at          │ Austria │ S69022537 │ 386              │ Salzburg       │     4 │        HIGH │
├─────────────┼─────────┼───────────┼──────────────────┼────────────────┼───────┼─────────────┤
│ at          │ Austria │ S69022537 │ 090              │ Wien Nord      │    16 │        HIGH │
├─────────────┼─────────┼───────────┼──────────────────┼────────────────┼───────┼─────────────┤
│ at          │ Austria │ S69022537 │ 085              │ Wien Vösendorf │     6 │        HIGH │
└─────────────┴─────────┴───────────┴──────────────────┴────────────────┴───────┴─────────────┘
```

## Specific product, store & country

    source/cli.js stock --store=155 --country=at S69022537

```
┌─────────────┬─────────┬───────────┬──────────────────┬────────────┬───────┬─────────────┐
│ countryCode │ country │ product   │ storeId (buCode) │ store      │ stock │ probability │
├─────────────┼─────────┼───────────┼──────────────────┼────────────┼───────┼─────────────┤
│ at          │ Austria │ S69022537 │ 155              │ Klagenfurt │    10 │        HIGH │
└─────────────┴─────────┴───────────┴──────────────────┴────────────┴───────┴─────────────┘
```

## Multiple products & stores

    source/cli.js stock --country=de --store=224,069,063 S69022537 40313075 40299687

```
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
```

## Plans

- [x] include store names
- [X] include country names
- [x] add command for listing stores in countries
      `cli.js stores de`
- [ ] add command to list / search for products by id / name using http://www.ikea.com/de/de/catalog/productsaz/0/ where 0 = A and 25 = Z
- [ ] add command to show/list product details
      `cli.js product 90205912`

## Other Projects & Articles

* https://www.npmjs.com/package/ikea-stock-checker
* https://medium.com/@JoshuaAJung/api-of-the-day-ikea-availability-checks-8678794a9b52
