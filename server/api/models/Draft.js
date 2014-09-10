/**
* Draft.js
*
* @description :: A fantasy draft event
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    settings: {
      model: 'DraftSettings'
    },

    draft: {
      model: 'Draft'
    }
  }
};
