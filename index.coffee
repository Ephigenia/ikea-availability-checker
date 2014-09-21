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

locations = 
  # Netherlands
  'nl/nl': [
    new IkeaLocation '415','Amersfoort'
    new IkeaLocation '088','Amsterdam'
    new IkeaLocation '274','Barendrecht (Rotterdam)'
    new IkeaLocation '403','Breda'
    new IkeaLocation '151','Delft'
    new IkeaLocation '272','Duiven'
    new IkeaLocation '087','Eindhoven'
    new IkeaLocation '404','Groningen'
    new IkeaLocation '378','Haarlem'
    new IkeaLocation '089','Heerlen'
    new IkeaLocation '312','Hengelo'
    new IkeaLocation '270','Utrecht'
  ]
  # Lithuania
  'lt/lt': [
    new IkeaLocation '235','Vilnius'
  ]
  # Czech Republic
  'cz/cs': [
    new IkeaLocation '278', 'Brno'
    new IkeaLocation '309', 'Ostrava'
    new IkeaLocation '408', 'Praha Černý Most'
    new IkeaLocation '178', 'Praha-Zličín'
  ]
  # Belgium
  'be/fr': [
    new IkeaLocation '482', 'Anderlecht'
    new IkeaLocation '483', 'Arlon'
    new IkeaLocation '169', 'Gent'
    new IkeaLocation '375', 'Hognoul'
    new IkeaLocation '179', 'Wilrijk'
    new IkeaLocation '376', 'Zaventem'
  ]
  # denmark
  'dk/da': [
    new IkeaLocation '121', 'Gentofte'
    new IkeaLocation '172', 'Odense'
    new IkeaLocation '094', 'Taastrup'
    new IkeaLocation '005', 'Aalborg'
    new IkeaLocation '298', 'Aarhus'
  ]
  # switzerland
  'ch/de': [
    new IkeaLocation '078', 'Aubonne VD (fr)'
    new IkeaLocation '291', 'Dietlikon ZH (de)'
    new IkeaLocation '101', 'Grancia TI (it)'
    new IkeaLocation '290', 'Lyssach BE (de)'
    new IkeaLocation '292', 'Pratteln BL (de)'
    new IkeaLocation '275', 'Rothenburg LU (de)'
    new IkeaLocation '079', 'Spreitenbach AG (de)'
    new IkeaLocation '917', 'St. Gallen SG (de)'
    new IkeaLocation '918', 'Vernier GE (fr)'
  ]
  # poland
  'pl/pl': [
    new IkeaLocation '203', 'Gdańsk'
    new IkeaLocation '306', 'Katowice'
    new IkeaLocation '204', 'Kraków'
    new IkeaLocation '329', 'Łódź'
    new IkeaLocation '205', 'Poznań'
    new IkeaLocation '188', 'Warszawa / Janki'
    new IkeaLocation '307', 'Warszawa / Targówek'
    new IkeaLocation '294', 'Wrocław'
  ]
  # Austria
  'at/de': [
    new IkeaLocation '387', 'Graz'
    new IkeaLocation '388', 'Haid'
    new IkeaLocation '273', 'Innsbruck'
    new IkeaLocation '155', 'Klagenfurt'
    new IkeaLocation '386', 'Salzburg'
    new IkeaLocation '090', 'Wien Nord'
    new IkeaLocation '085', 'Wien Vösendorf'
  ],
  'fr/fr': [
    new IkeaLocation '018', 'Avignon'
    new IkeaLocation '134', 'Bordeaux'
    new IkeaLocation '060', 'Brest'
    new IkeaLocation '199', 'Caen Fleury-sur-Orne'
    new IkeaLocation '345', 'Clermont-Ferrand'
    new IkeaLocation '086', 'Dijon'
    new IkeaLocation '435', 'Grenoble'
    new IkeaLocation '051', 'Hénin-Beaumont'
    new IkeaLocation '133', 'Lille'
    new IkeaLocation '433', 'Marseille - La Valentine'
    new IkeaLocation '130', 'Marseille - Vitrolles'
    new IkeaLocation '260', 'Metz'
    new IkeaLocation '402', 'Montpellier'
    new IkeaLocation '316', 'Nantes'
    new IkeaLocation '240', 'Paris Est, Villiers sur Marne'
    new IkeaLocation '389', 'Paris N-O, Franconville'
    new IkeaLocation '131', 'Paris Nord, Roissy'
    new IkeaLocation '083', 'Paris Ouest, Plaisir'
    new IkeaLocation '285', 'Paris Ouest, Vélizy'
    new IkeaLocation '082', 'Paris Sud, Evry'
    new IkeaLocation '432', 'Paris Sud,  Thiais'
    new IkeaLocation '198', 'Reims'
    new IkeaLocation '177', 'Rennes'
    new IkeaLocation '163', 'Rouen'
    new IkeaLocation '431', 'St Etienne'
    new IkeaLocation '132', 'St Priest'
    new IkeaLocation '239', 'Strasbourg'
    new IkeaLocation '315', 'Toulon'
    new IkeaLocation '242', 'Toulouse'
    new IkeaLocation '434', 'Tours'
  ],
  'de/de': [
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

iterateProdcut = (locationCode, product, locations) =>
  url = "http://www.ikea.com/#{locationCode}/iows/catalog/availability/#{product.id}"

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

    totalStock = 0
    for location in locations
      # parse response data and extract number of items available and the 
      # probability when it will be there again
      xmlDoc = libxmljs.parseXml(body)
      locationStockNode = xmlDoc.get("//localStore[@buCode=#{location.id}]/stock")
      availableStock = locationStockNode.get('availableStock').text()
      inStockProbabilityCode = locationStockNode.get('inStockProbabilityCode').text()

      totalStock += parseInt availableStock
      
      # color the availability
      if availableStock >= 4
        availableStock = availableStock.green
      else if availableStock >= 1
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

    console.log ("""
      #{product.id} #{product.name} (#{totalStock} total)
    """).bold
    console.log table.toString()



countryCode = 'de/de'

if process.argv[2]?
  if process.argv[2] is 'all'
    
  else
    countryCode = process.argv[2]
  locationsWhichShouldGetChecked = locations[countryCode]
else
  locationsWhichShouldGetChecked = [
    new IkeaLocation '324', 'Berlin-Lichtenberg'
    new IkeaLocation '394', 'Berlin-Spandau'
    new IkeaLocation '421', 'Berlin-Tempelhof'
    new IkeaLocation '129', 'Berlin-Waltersdorf'
  ]


# main logic
for product in products
  iterateProdcut(countryCode, product, locationsWhichShouldGetChecked)