
angular.module('clientApp').factory('Pool', function(ENV) {
  return function(name, settings) {
    var defaults = {
      start: new Date(),
      rosterPositions: {}
    };

    _.each(ENV.positions, function(position) {
      defaults.rosterPositions[position.label] = 2;
    });

    this.name = name || 'New Pool';
    this.settings = settings ? angular.extend(defaults, settings) : defaults;

  };
});
