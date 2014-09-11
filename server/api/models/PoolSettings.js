/**
* PoolSettings.js
*
* @description :: A fantasy pool settings object
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    // The pool these settings belong to
    pool: {
      model: 'Pool'
    },

    maxTeams: 'integer'
  }
};
