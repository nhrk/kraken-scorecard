# kraken-scorecard

"ESPNcricinfo scorecard with Kraken.js"

#######

Objective
	-Build an app with Kraken.js using Dust.js for templates. (Clustering with PM2, spawns processes based on number of cores)

The Stack
	-Node.js 0.10.26
	-Kraken.js 0.7.1
	-Dust.js 2.0.2
	-PM2 0.7.8

Existing scorecard uses 2 endpoints, viz: Live Scorecard and Photos, while the initial rendering happens server side.

Added one more endpoint to pull initial data required for rendering scorecard and added JSONP support for all to support cross domain requests.

Setup a route in Kraken to make proxy requests to make cross domain, jQuery does not cache JSONP requests and uses a timestamp, which hampers performance.

Tweaked clone function in Dust.js parser for improving rendering performance for partials.!critical.
