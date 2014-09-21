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
  new IkeaLocation '066', 'Augsburg'
  new IkeaLocation '324', 'Berlin-Lichtenberg'
  new IkeaLocation '394', 'Berlin-Spandau'
  new IkeaLocation '421', 'Berlin-Tempelhof'
  new IkeaLocation '129', 'Berlin-Waltersdorf'
  new IkeaLocation '119', 'Bielefeld'
  new IkeaLocation '117', 'Braunschweig'
  new IkeaLocation '228', 'Brinkum'
  new IkeaLocation '118', 'Chemnitz'
  new IkeaLocation '223', 'Dortmund'
  new IkeaLocation '221', 'Dresden'
  new IkeaLocation '425', 'Duisburg'
  new IkeaLocation '321', 'Düsseldorf'
  new IkeaLocation '396', 'Erfurt'
  new IkeaLocation '148', 'Essen'
  new IkeaLocation '393', 'Frankfurt'
  new IkeaLocation '320', 'Freiburg'
  new IkeaLocation '226', 'Großburgwedel'
  new IkeaLocation '139', 'Halle/Leipzig'
  new IkeaLocation '245', 'Hamburg-Altona'
  new IkeaLocation '325', 'Hamburg-Moorfleet'
  new IkeaLocation '146', 'Hamburg-Schnelsen'
  new IkeaLocation '222', 'Hanau'
  new IkeaLocation '187', 'Hannover EXPO-Park'
  new IkeaLocation '073', 'Kaarst'
  new IkeaLocation '323', 'Kamen'
  new IkeaLocation '174', 'Kassel'
  new IkeaLocation '333', 'Kiel'
  new IkeaLocation '332', 'Koblenz'
  new IkeaLocation '102', 'Köln-Butzweilerhof'
  new IkeaLocation '147', 'Köln-Godorf'
  new IkeaLocation '289', 'Lübeck'
  new IkeaLocation '225', 'Ludwigsburg'
  new IkeaLocation '397', 'Mannheim'
  new IkeaLocation '343', 'München-Brunnthal'
  new IkeaLocation '063', 'München-Eching'
  new IkeaLocation '326', 'Nürnberg/Fürth'
  new IkeaLocation '069', 'Oldenburg'
  new IkeaLocation '184', 'Osnabrück'
  new IkeaLocation '229', 'Regensburg'
  new IkeaLocation '092', 'Rostock'
  new IkeaLocation '227', 'Saarlouis'
  new IkeaLocation '369', 'Siegen'
  new IkeaLocation '224', 'Sindelfingen'
  new IkeaLocation '328', 'Ulm'
  new IkeaLocation '322', 'Wallau'
  new IkeaLocation '075', 'Walldorf'
  new IkeaLocation '124', 'Würzburg'
]

products = [
  new IkeaProduct '20205897', 'KROKTORP Tür 60x80 elfenbeinweiss'
  new IkeaProduct '20205915', 'KROKTORP Tür 40x40 elfenbeinweiss'
  new IkeaProduct '40212444', 'KROKTORP Tür 40x80 elfenbeinweiss'
  new IkeaProduct '90205912', 'KROKTORP Schubladenfront 60x20 elfenbeinweiss'
  new IkeaProduct '60205918', 'KROKTORP Schubladenfront 60x40 elfenbeinweiss'
]

locationsWhichShouldGetChecked = [
  new IkeaLocation '324', 'Berlin-Lichtenberg'
  new IkeaLocation '394', 'Berlin-Spandau'
  new IkeaLocation '421', 'Berlin-Tempelhof'
  new IkeaLocation '129', 'Berlin-Waltersdorf'
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

    for location in locationsWhichShouldGetChecked

      # parse response data and extract number of items available and the 
      # probability when it will be there again
      xmlDoc = libxmljs.parseXml(body)
      locationStockNode = xmlDoc.get("//localStore[@buCode=#{location.id}]/stock")
      availableStock = locationStockNode.get('availableStock').text()
      inStockProbabilityCode = locationStockNode.get('inStockProbabilityCode').text()
      
      # color the availability
      if availableStock >= 10
        availableStock = availableStock.green
      else if availableStock >= 4
        availableStock = availableStock.white
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