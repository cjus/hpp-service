/**
 * @name hpp-v1-api
 * @description This module packages the hot potato game API.
 */
'use strict';
const hydraExpress = require('hydra-express');
const express = hydraExpress.getExpress();
const ServerResponse = require('fwsp-server-response');
const player = require('../hot-potato-player');

let serverResponse = new ServerResponse();

let api = express.Router();

api.get('/startgame', (req, res) => {
  player.init();
  player.startGame()
    .then(() => {
      serverResponse.sendOk(res, {
        result: {
          gameLog: player.getGameLog()
        }
      });
    });
});

module.exports = api;
