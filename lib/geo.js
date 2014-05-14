/*jshint maxcomplexity:24, maxstatements:38, white: false*/
'use strict';
var geoip = require('geoip-lite'),
	yaml = require('js-yaml'),
	fs = require('fs'),
	doc = yaml.safeLoad(fs.readFileSync('./lib/country_cluster.yaml', 'utf8')),
	countryCodes = {
		'uk': 1,
		'au': 2,
		'za': 3,
		'bs': 4,
		'wi': 4,
		'nz': 5,
		'in': 6,
		'pk': 7,
		'lk': 8,
		'zw': 9,
		'us': 11,
		'nl': 15,
		'ca': 17,
		'bd': 25,
		'ke': 26,
		'ie': 29,
		'af': 40
	},
	geo,
	json = {},
	edition = 'unknown',
	cluster = 'unknown',
	country = 'unknown',
	clusterObj,
	countryId = 0;

function parse(ip) {

	ip = ip || '27.4.80.197';

	geo = geoip.lookup(ip);

	country = geo.country.toLowerCase();

	try {
		if (doc && doc[country] && doc[country].cricinfo) {
			cluster = doc[country].cricinfo;
		}
	} catch (e) {

	}

	json.cluster = cluster;

	json.country = country;

	switch (country) {
		case 'uk':
			edition = 'uk';
			break;
		case 'au':
			edition = 'aus';
			break;
		case 'in':
			edition = 'ind';
			break;
		case 'pk':
			edition = 'pak';
			break;
		case 'za':
			edition = 'rsa';
			break;
		case 'nz':
			cluster = 'nz';
			break;
		case 'lk':
			cluster = 'sl';
			break;
		case 'wi':
			cluster = 'wi';
			break;
	}

	json.headline = edition;

	json.user_ip = ip;

	if (countryCodes[country]) {
		countryId = countryCodes[country];
		json.countryId = countryId;
	}

	return json;
}

module.exports = {
	parse: parse
};