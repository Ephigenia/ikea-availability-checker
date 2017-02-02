Sometimes there is a high demand on products which then are unavailable in the IKEA online store and even in the locations. So here’s a script which makes it easy to check the availability of a list of products and locations.

[![CircleCI](https://circleci.com/gh/Ephigenia/ikea-availability-checker.svg?style=svg&circle-token=1907356b3e852337a9e5f96d9b99ef1942c4ffa2)](https://circleci.com/gh/Ephigenia/ikea-availability-checker)
[![Code Climate](https://codeclimate.com/repos/58920ec367bbb4005e0076bf/badges/e41dd44da970110ab426/gpa.svg)](https://codeclimate.com/repos/58920ec367bbb4005e0076bf/feed)
[![Issue Count](https://codeclimate.com/repos/58920ec367bbb4005e0076bf/badges/e41dd44da970110ab426/issue_count.svg)](https://codeclimate.com/repos/58920ec367bbb4005e0076bf/feed)
[![Test Coverage](https://codeclimate.com/repos/58920ec367bbb4005e0076bf/badges/e41dd44da970110ab426/coverage.svg)](https://codeclimate.com/repos/58920ec367bbb4005e0076bf/coverage)

# Installation

    npm install ikea-availability-checker

# Usage Examples

The default reports prints the results as a human readable table.

## Specific product, store & country

    source/cli.js stock --store=155 --country=at S49903093

```
┌─────────┬───────────┬──────────────────┬───────┬─────────────┐
│ country │ product   │ storeId (buCode) │ stock │ probability │
├─────────┼───────────┼──────────────────┼───────┼─────────────┤
│ at      │ S49903093 │              155 │     0 │        HIGH │
└─────────┴───────────┴──────────────────┴───────┴─────────────┘
```

## Multiple products & stores

    source/cli.js stock --country=de --store=224,069,063 S49903093 40313075 40299687

```
┌─────────┬───────────┬──────────────────┬───────┬─────────────┐
│ country │ product   │ storeId (buCode) │ stock │ probability │
├─────────┼───────────┼──────────────────┼───────┼─────────────┤
│ de      │ S49903093 │              063 │     0 │        HIGH │
├─────────┼───────────┼──────────────────┼───────┼─────────────┤
│ de      │ S49903093 │              069 │     4 │        HIGH │
├─────────┼───────────┼──────────────────┼───────┼─────────────┤
│ de      │ S49903093 │              224 │     0 │        HIGH │
└─────────┴───────────┴──────────────────┴───────┴─────────────┘
┌─────────┬──────────┬──────────────────┬───────┬─────────────┐
│ country │ product  │ storeId (buCode) │ stock │ probability │
├─────────┼──────────┼──────────────────┼───────┼─────────────┤
│ de      │ 40313075 │              063 │    10 │        HIGH │
├─────────┼──────────┼──────────────────┼───────┼─────────────┤
│ de      │ 40313075 │              069 │     6 │        HIGH │
├─────────┼──────────┼──────────────────┼───────┼─────────────┤
│ de      │ 40313075 │              224 │    10 │        HIGH │
└─────────┴──────────┴──────────────────┴───────┴─────────────┘
┌─────────┬──────────┬──────────────────┬───────┬─────────────┐
│ country │ product  │ storeId (buCode) │ stock │ probability │
├─────────┼──────────┼──────────────────┼───────┼─────────────┤
│ de      │ 40299687 │              063 │    22 │        HIGH │
├─────────┼──────────┼──────────────────┼───────┼─────────────┤
│ de      │ 40299687 │              069 │    33 │        HIGH │
├─────────┼──────────┼──────────────────┼───────┼─────────────┤
│ de      │ 40299687 │              224 │    45 │        HIGH │
└─────────┴──────────┴──────────────────┴───────┴─────────────┘
```

## Plans

- [ ] include store names
- [ ] include country names
- [ ] add command for listing stores in countries
      `cli.js stores de`
- [ ] add command to list / search for products by id / name using http://www.ikea.com/de/de/catalog/productsaz/0/ where 0 = A and 25 = Z
- [ ] add command to show/list product details
      `cli.js product 90205912`
