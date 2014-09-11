/**
* Pool.js
*
* @description :: A fantasy pool
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    name: {
      type: 'string'
    },

    teams: {
      collection: 'PoolTeam',
      via: 'pool'
    },

    // The user who runs the pool
    owner: {
      model: 'User'
    }
  }
};
