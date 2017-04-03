/**
* @name Hot Potato service
* @summary Hydra Express service entry point
* @description plays the hot potato game
*/
'use strict';

const version = require('./package.json').version;
const hydraExpress = require('hydra-express');
const hydra = hydraExpress.getHydra();
const player = require('./hot-potato-player');

let config = require('fwsp-config');

/**
* Load configuration file and initialize hydraExpress app.
*/
config.init('./config/config.json')
  .then(() => {
    config.version = version;
    hydraExpress.init(config.getObject(), version, () => {
      hydraExpress.registerRoutes({
        '/v1/hpp': require('./routes/hpp-v1-routes')
      });
    })
      .then((serviceInfo) => {
        console.log('serviceInfo', serviceInfo);
        hydra.on('message', (message) => {
          player.messageHandler(message);
        });
        player.init();
      })
      .catch((err) => {
        console.log('err', err);
      });
  });
