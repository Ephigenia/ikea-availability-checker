request = require 'request'
libxmljs = require "libxmljs"
colors = require 'colors'
Table = require 'cli-table'

class IkeaLocation 
  id: null
  name: null
  constructor: (id, name) ->
    @id = id
    @name = name

class IkeaProduct
  id: null
  name: null
  constructor: (id, name) ->
    @id = id
    @name = name

locations = [
  new IkeaLocation 129, 'Berlin Woltersdorf'
  new IkeaLocation 324, 'Berlin Lichtenberg'
  new IkeaLocation 394, 'Berlin Spandau'
  new IkeaLocation 421, 'Berlin Tempelhof'
]

products = [
  new IkeaProduct '20205897', 'KROKTORP Tür 60x80 elfenbeinweiss'
  new IkeaProduct '20205915', 'KROKTORP Tür 40x40 elfenbeinweiss'
  new IkeaProduct '40212444', 'KROKTORP Tür 40x80 elfenbeinweiss'
  new IkeaProduct '90205912', 'KROKTORP Schubladenfront 60x20 elfenbeinweiss'
  new IkeaProduct '60205918', 'KROKTORP Schubladenfront 60x40 elfenbeinweiss'
]

for product in products

  url = "http://www.ikea.com/de/de/iows/catalog/availability/#{product.id}"

  request url, (error, response, body) => 
    if error?
      console.log 'error occured'
      return

    table = new Table
      head: ['Location', 'Stock', 'Probability']
      colAligns: [null, 'right', 'right']
      style: {
        head: ['white']
      }
    console.log (product.id + ' ' + product.name).bold

    for location in locations

      # parse response data and extract number of items available and the 
      # probability when it will be there again
      xmlDoc = libxmljs.parseXml(body)
      locationStockNode = xmlDoc.get("//localStore[@buCode=#{location.id}]/stock")
      availableStock = locationStockNode.get('//availableStock').text()
      inStockProbabilityCode = locationStockNode.get('//inStockProbabilityCode').text()
      
      # color the availability
      if availableStock > 10
        availableStock = availableStock.green
      else if availableStock > 5
        availableStock = availableStock.white
      else if availableStock > 0
        availableStock = availableStock.red
      else
        availableStock = availableStock.red

      # color the probability
      switch inStockProbabilityCode
        when 'HIGH'
          inStockProbabilityCode = inStockProbabilityCode.green
        when 'MEDIUM'
          inStockProbabilityCode = inStockProbabilityCode.orange
        when 'LOW'
          inStockProbabilityCode = inStockProbabilityCode.red

      table.push [
        location.name,
        availableStock,
        inStockProbabilityCode
      ]
    
    console.log table.toString()