/**
* Player.js
*
* @description :: A fantasy player
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    sport: {
      model: 'Sport'
    },

    poolTeam: {
      model: 'PoolTeam'
    }
  }
};
