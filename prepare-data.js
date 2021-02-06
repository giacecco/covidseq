global.XMLHttpRequest = require('xhr2');
var _ = require("underscore")
var Papa = require("papaparse")

// Find more data from https://data.rivm.nl/covid-19/
const URL = "https://data.rivm.nl/covid-19/COVID-19_aantallen_gemeente_cumulatief.csv"
let deathsByMunicipality = { }

Papa.parse(URL, {
	download: true,
	header: true,
	step: function(row) {
		if (row.data.Municipality_name && (row.data.Municipality_name !== '')) deathsByMunicipality[row.data.Municipality_name] = Math.max((deathsByMunicipality[row.data.Municipality_name] || 0), parseInt(row.data.Deceased))
	},
	complete: function() {
		let configuration = {
			octaves: 4,
			municipalitiesByDeathsNormalised: { }
		}
		// reorganises the data by number of deaths
		let municipalitiesByDeaths = { }
		_.each(_.keys(deathsByMunicipality), function (municipalityName) {
			municipalitiesByDeaths[deathsByMunicipality[municipalityName]] =
				(municipalitiesByDeaths[deathsByMunicipality[municipalityName]] ? municipalitiesByDeaths[deathsByMunicipality[municipalityName]] : [ ]).concat(municipalityName)
		})
		// removes the cities with no deaths
		delete municipalitiesByDeaths["0"]
		// sorts the municipalities' names
		_.each(_.keys(municipalitiesByDeaths), function (x) { municipalitiesByDeaths[x] = municipalitiesByDeaths[x].sort() })
    // creates the normalised data and the display messages
		let maxDeaths = Math.max(..._.map(_.keys(municipalitiesByDeaths), function (x) { return parseInt(x) }))
		_.each(_.keys(municipalitiesByDeaths), function (x) {
			configuration.municipalitiesByDeathsNormalised[x / maxDeaths * configuration.octaves] =	x + ": " + (
				 	municipalitiesByDeaths[x].length > 1 ? _.initial(municipalitiesByDeaths[x]).join(", ") + " en " : ""
				) + _.last(municipalitiesByDeaths[x])
		})
		console.log("Copy and paste the code between the stars (*) overwriting the pre-existing equivalent code.")
		console.log("********")
		console.log("const CONFIGURATION = " + JSON.stringify(configuration))
		console.log("********")
	}
})
