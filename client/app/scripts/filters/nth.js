angular.module('clientApp').filter('nth', function() {
  return function(input) {
    var suffix = '';

    if (input) {
      var i = _.parseInt(input);
      var t = (i % 100);

      if (t >= 10 && t <= 20) {
        return 'th';
      }

      switch (i % 10) {
        case 1:
          suffix = 'st';
          break;
        case 2:
          suffix = 'nd';
          break;
        case 3:
          suffix = 'rd';
          break;
        default:
          suffix = 'th';
          break;
      }

      return input + suffix;
    }

    return;
  };
});
