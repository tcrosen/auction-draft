/**
 * EntryController
 *
 * @description :: Server-side logic for managing entries
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  findWithOwners: function(req, res) {
    PoolTeam.find().populate('owner').then(function(team) {
      return res.json(team);
    });
  }
};
