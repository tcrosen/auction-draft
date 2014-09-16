angular.module('clientApp').constant('ENV', {

  firebaseRoot: 'https://auction-draft.firebaseio.com',
  firebaseRef: new Firebase('https://auction-draft.firebaseio.com'),

  positions: [{
    label: 'C',
    name: 'Center'
  }, {
    label: 'RW',
    name: 'Right Wing'
  }, {
    label: 'LW',
    name: 'Left Wing'
  }, {
    label: 'D',
    name: 'Defense'
  }, {
    label: 'G',
    name: 'Goalie'
  }, {
    label: 'B',
    name: 'Bench'
  }, {
    label: 'Util',
    name: 'Utility'
  }]
});
