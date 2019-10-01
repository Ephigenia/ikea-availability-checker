Sometimes there is a high demand on products which then are unavailable in the IKEA online store and even in the locations. So here’s a script which makes it easy to check the availability of a list of products and locations.

[![MIT License](https://badges.frapsoft.com/os/mit/mit.svg?v=102)](https://github.com/ellerbrock/open-source-badge/)
[![NPM Package](https://badge.fury.io/js/ikea-availability-checker.svg)](https://www.npmjs.com/package/ikea-availability-checker)
[![NPM Downloads](https://img.shields.io/npm/dt/ikea-availability-checker.svg)](https://www.npmjs.com/package/ikea-availability-checker)
[![CircleCI](https://circleci.com/gh/Ephigenia/ikea-availability-checker.svg?style=svg&circle-token=1907356b3e852337a9e5f96d9b99ef1942c4ffa2)](https://circleci.com/gh/Ephigenia/ikea-availability-checker)
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

### Search for products / collections

    source/cli.js search --country=us charm

```
┌────────────────────────────────────────┬────────┬──────────┬───────────────────────────────────┬────────────────────────────────────┐
│ name                                   │  price │       id │ uri                               │ imageUri                           │
├────────────────────────────────────────┼────────┼──────────┼───────────────────────────────────┼────────────────────────────────────┤
│ HJÄRTEVÄN crib duvet cover/pillowcase  │  $4.99 │ 40290205 │ /us/en/catalog/products/40290205/ │ /PIAimages/0379199_PE554355_S3.JPG │
├────────────────────────────────────────┼────────┼──────────┼───────────────────────────────────┼────────────────────────────────────┤
│ CHARMTROLL crib duvet cover/pillowcase │  $7.99 │ 90289997 │ /us/en/catalog/products/90289997/ │ /PIAimages/0379195_PE554356_S3.JPG │
├────────────────────────────────────────┼────────┼──────────┼───────────────────────────────────┼────────────────────────────────────┤
│ ÄLSKAD 4-piece bedlinen set for crib   │ $24.99 │ 70290181 │ /us/en/catalog/products/70290181/ │ /PIAimages/0376277_PE553765_S3.JPG │
├────────────────────────────────────────┼────────┼──────────┼───────────────────────────────────┼────────────────────────────────────┤
│ CHARMTROLL bed canopy                  │ $16.99 │ 80303871 │ /us/en/catalog/products/80303871/ │ /PIAimages/0369813_PE553050_S3.JPG │
├────────────────────────────────────────┼────────┼──────────┼───────────────────────────────────┼────────────────────────────────────┤
│ CHARMTROLL wearable blanket            │ $14.99 │ 00290226 │ /us/en/catalog/products/00290226/ │ /PIAimages/0283609_PE421037_S3.JPG │
├────────────────────────────────────────┼────────┼──────────┼───────────────────────────────────┼────────────────────────────────────┤
│ CHARMTROLL wearable blanket            │ $19.99 │ 60290228 │ /us/en/catalog/products/60290228/ │ /PIAimages/0283610_PE421036_S3.JPG │
├────────────────────────────────────────┼────────┼──────────┼───────────────────────────────────┼────────────────────────────────────┤
│ CHARMTROLL comforter/blanket           │ $14.99 │ 80296088 │ /us/en/catalog/products/80296088/ │ /PIAimages/0283603_PE421028_S3.JPG │
├────────────────────────────────────────┼────────┼──────────┼───────────────────────────────────┼────────────────────────────────────┤
│ ÄLSKAD baby towel with hood            │  $7.99 │ 30290201 │ /us/en/catalog/products/30290201/ │ /PIAimages/0283475_PE420987_S3.JPG │
├────────────────────────────────────────┼────────┼──────────┼───────────────────────────────────┼────────────────────────────────────┤
│ CHARMTROLL squeaky toy                 │  $3.99 │ 60294660 │ /us/en/catalog/products/60294660/ │ /PIAimages/0292364_PE425193_S3.JPG │
├────────────────────────────────────────┼────────┼──────────┼───────────────────────────────────┼────────────────────────────────────┤
│ LEN crib skirt                         │  $6.99 │ 80295913 │ /us/en/catalog/products/80295913/ │ /PIAimages/0292469_PE425250_S3.JPG │
├────────────────────────────────────────┼────────┼──────────┼───────────────────────────────────┼────────────────────────────────────┤
│ ÄLSKAD baby blanket                    │  $9.99 │ 60290186 │ /us/en/catalog/products/60290186/ │ /PIAimages/0283473_PE420985_S3.JPG │
└────────────────────────────────────────┴────────┴──────────┴───────────────────────────────────┴────────────────────────────────────┘
```

## Plans

- [ ] more tests :D
- [ ] add command to show/list product details (f.e. `cli.js product 90205912`)

## DEBUG

Set the `DEBUG` environment variable to show more debugging output:

    DEBUG=iows* npm run start

## Other Projects & Articles

* npm package [ikea-stock-checker](https://www.npmjs.com/package/ikea-stock-checker)
* [API of the Day: Checking IKEA Availability and Warehouse Locations]( https://medium.com/@JoshuaAJung/api-of-the-day-ikea-availability-checks-8678794a9b52) by Joshua Jung
