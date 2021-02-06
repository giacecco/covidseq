global.XMLHttpRequest = require('xhr2');
var _ = require("underscore")
var Papa = require("papaparse")

// Find more data from https://data.rivm.nl/covid-19/
const URL = "https://data.rivm.nl/covid-19/COVID-19_aantallen_gemeente_cumulatief.csv"
let deathsByMunicipality = { }
let latestDate = null

Papa.parse(URL, {
	download: true,
	header: true,
	step: function(row) {
		if (row.data.Date_of_report) latestDate = Math.max(Date.parse(row.data.Date_of_report + "+01:00"), latestDate)
		if (row.data.Municipality_name && (row.data.Municipality_name !== '')) deathsByMunicipality[row.data.Municipality_name] = Math.max((deathsByMunicipality[row.data.Municipality_name] || 0.), parseFloat(row.data.Deceased))
	},
	complete: function() {
		let configuration = {
			octaves: 3.,
		}
		// delete the municipalities without deaths
		_.each(_.keys(deathsByMunicipality), function (municipalityName) { if (deathsByMunicipality[municipalityName] === 0) { delete deathsByMunicipality[municipalityName] }})
		let maxDeaths = parseFloat(Math.max(..._.values(deathsByMunicipality)))
		let totalDeaths = parseFloat(_.values(deathsByMunicipality).reduce((a, b) => a + b, 0))
		// group by number of deaths
		let municipalitiesByDeaths = { }
		_.values(deathsByMunicipality).forEach(function (deaths) {
				municipalitiesByDeaths[deaths] = _.filter(_.keys(deathsByMunicipality), municipalityName => deathsByMunicipality[municipalityName] === deaths)
		})
		let deathsPerNote = Math.floor(totalDeaths / configuration.octaves / 12.)
		let currentNote = 0
		let currentDeathCount = 0
		let municipalitiesByNote = Array()
		_.keys(municipalitiesByDeaths).map(parseFloat).forEach(deaths => {
				let ratio = parseFloat(deaths) * municipalitiesByDeaths[deaths].length
				municipalitiesByNote[currentNote] = (municipalitiesByNote[currentNote] || [ ]).concat(municipalitiesByDeaths[deaths].map(x => { return { "m": x, "d": deaths } }))
				currentDeathCount += ratio
				if (currentDeathCount > deathsPerNote) {
					currentNote++
					currentDeathCount -= deathsPerNote
				}
		})
		_.range(currentNote, configuration.octaves * 12).forEach(note => { municipalitiesByNote[note] = municipalitiesByNote[note - 1] })
		configuration.municipalitiesByNote = municipalitiesByNote

		console.log("Copy and paste the code between the stars (*) overwriting the pre-existing equivalent code.")
		console.log("********")
		console.log("// Data from RIVM at https://data.rivm.nl/covid-19/COVID-19_aantallen_gemeente_cumulatief.csv")
		console.log("// Last updated: " + new Date(latestDate))
		console.log("const CONFIGURATION = " + JSON.stringify(configuration))
		console.log("********")

	}
})
