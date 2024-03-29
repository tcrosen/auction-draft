/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */

var fs = require('fs');

module.exports.bootstrap = function(cb) {

  // var users = [{
  //   name: 'Terry'
  // }, {
  //   name: 'Bobby'
  // }, {
  //   name: 'Jamie'
  // }, {
  //   name: 'Navid'
  // }, {
  //   name: 'Loreto'
  // }, {
  //   name: 'Dave'
  // }, {
  //   name: 'Mike'
  // }, {
  //   name: 'George'
  // }];
  //
  // User.create(users).then(function(createdUsers) {
  //   sails.log('Users created: ', createdUsers);
  //
  //   Pool.create({
  //     name: 'Auction 2014'
  //   }).then(function(createdPool) {
  //     sails.log('Pool created: ', createdPool);
  //
  //     var poolTeamsCreated = 0;
  //
  //     _.each(createdUsers, function(createdUser) {
  //
  //       PoolTeam.create({
  //         pool: createdPool.id,
  //         owner: createdUser.id,
  //         name: createdUser.name + '\'s Team'
  //       }).then(function(createdPoolTeam) {
  //         sails.log('Pool team created: ', createdPoolTeam);
  //         poolTeamsCreated++;
  //
  //         // createdUser.poolTeams.add(createdPoolTeam.id);
  //         // createdUser.save(function() {
  //         //   sails.log('Pool team ' + createdPoolTeam.name + ' added to user ' + createdUser.name);
  //         // });
  //         //
  //         // createdPool.teams.add(createdPoolTeam.id);
  //         // createdPool.save(function() {
  //         //   sails.log('Pool team ' + createdPoolTeam.name + ' added to pool ' + createdPool.name);
  //         // });
  //
  //         if (poolTeamsCreated >= createdUsers.length) {
  //           cb();
  //         }
  //       });
  //     });
  //   });
  // });

  // Player.find().exec(function(err, players) {
  //     var seedFile = __dirname + '/seed/players.json';
  //     if (!players || !players.length) {
  //       fs.readFile(seedFile, 'utf8', function (err, data) {
  //         var players = PlayerService.parseYahooJson(data);
  //         Player.create(players).exec(function(err, players) {
  //           sails.log(players.length + ' players created from seed file: ' + seedFile);
  //           cb();
  //         });
  //       });
  //     } else {
  //       cb();
  //     }
  //   })
  // });

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};
