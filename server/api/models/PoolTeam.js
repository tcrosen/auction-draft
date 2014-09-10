/**
* PoolTeam.js
*
* @description :: A pool entry (person)
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    name: {
      type: 'string'
    },

    pool: {
      model: 'Pool'
    },

    owner: {
      model: 'User'
    },

    players: {
      collection: 'Player',
      via: 'poolTeam'
    }
  },

  draftPlayer: function(options, cb) {
    Entry.findOne(options.entry.id).exec(function (err, entry) {
      if (err) { cb(err); }
      if (!entry) { cb(new Error('Entry not found.')); }

      Player.update(options.player.id, { owner: entry.id }).exec(function(err, player) {
        if (err) { cb(err); }

        cb(err, {
          player: player,
          entry: entry
        });
      });
    });
  }
};
