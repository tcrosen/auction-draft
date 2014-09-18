var YQL = require('yql');

var query = new YQL('SHOW TABLES');
query.exec(function (error, response) {
 console.log(error);
 console.log(response);
});
