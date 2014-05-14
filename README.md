# kraken-scorecard

"ESPNcricinfo live scorecard with Kraken.js"

## Objective:
Replicate Live scorecard app with Kraken.js using Dust.js and compare performance.

### The Stack:
* Node.js 0.10.26
* Kraken.js 0.7.1
* Dust.js 2.0.2
* PM2 0.7.8 (For clustering)

#### Notes:
* Added a route in Kraken to make proxy requests to make cross domain.
* Tweaked clone function in Dust.js parser for improving rendering performance for partials.!critical.

#### TODO:
* Reuse templates on client and explore more options for code sharing.