ikea-availability-checker
=========================
[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/Ephigenia/ikea-availability-checker?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Sometimes there is a high demand on products which then are unavailable in the IKEA online store and even in the locations. So here’s a script which makes it easy to check the availability of a list of products and locations. The results are printed out in the command line like this:


```
60205918 KROKTORP Schubladenfront 60x40 elfenbeinweiss
┌────────────────────┬───────┬─────────────┐
│ Location           │ Stock │ Probability │
├────────────────────┼───────┼─────────────┤
│ Berlin Woltersdorf │     0 │         LOW │
├────────────────────┼───────┼─────────────┤
│ Berlin Lichtenberg │     9 │      MEDIUM │
├────────────────────┼───────┼─────────────┤
│ Berlin Tempelhof   │     0 │         LOW │
└────────────────────┴───────┴─────────────┘
60205918 KROKTORP Schubladenfront 60x40 elfenbeinweiss
┌────────────────────┬───────┬─────────────┐
│ Location           │ Stock │ Probability │
├────────────────────┼───────┼─────────────┤
│ Berlin Woltersdorf │    22 │        HIGH │
├────────────────────┼───────┼─────────────┤
│ Berlin Lichtenberg │     0 │         LOW │
├────────────────────┼───────┼─────────────┤
│ Berlin Tempelhof   │     0 │         LOW │
└────────────────────┴───────┴─────────────┘
```

## How it works

The script iterates over a (for now) fixed list of product ids and scrapes the availability service of IKEA germany to check the in-store stock for those items. After that it searches for a fixed list of location ids (for now only 4 of them in Berlin) and prints the results in a table per product.

## Usage

	coffee index [country-code]

List available country codes

	coffee index help

## Ideas

- [x] include all Germany IKEA Location ids
- [ ] include other countries like Austria (just with `at/de` instead of `de/de` in the uri)
- [ ] find out why some product ids need a "S" in front
- [ ] find out which errors could occor or if there are limits
- [ ] web interface instead of cli
- [ ] variable list of products
- [ ] one kind of notification (e-mail)
