/**
* User.js
*
* @description :: A user of the app
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    name: {
      type: 'string'
    },

    email: {
      type: 'string'
    },

    poolTeams: {
      collection: 'PoolTeam',
      via: 'owner'
    }
  }
};
