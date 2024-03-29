/**
* PoolTeam.js
*
* @description :: A pool entry (person)
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    // Pool team name
    name: {
      type: 'string'
    },

    // The pool this team belongs to
    pool: {
      model: 'Pool'
    },

    // The user who owns this team
    owner: {
      model: 'User'
    },

    // The players drafted for this team
    players: {
      collection: 'Player'
    }
  },

  draftPlayer: function(options, cb) {
    // Entry.findOne(options.entry.id).exec(function (err, entry) {
    //   if (err) { cb(err); }
    //   if (!entry) { cb(new Error('Entry not found.')); }
    //
    //   Player.update(options.player.id, { owner: entry.id }).exec(function(err, player) {
    //     if (err) { cb(err); }
    //
    //     cb(err, {
    //       player: player,
    //       entry: entry
    //     });
    //   });
    // });
  }
};
