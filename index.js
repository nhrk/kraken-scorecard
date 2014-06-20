'use strict';


var kraken = require('kraken-js'),
    app = require('express')(),
    options = {
        onconfig: function (config, next) {
            //any config overriders here
            next(null, config);
        }
    },
    port = process.env.PORT || 1377,
    compression = require('compression');


app.use(kraken(options));

app.use(compression());

app.listen(port, function (err) {
    console.log('[%s] Listening on http://localhost:%d', app.settings.env, port);
});