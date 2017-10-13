var Handlebars = require('handlebars');

var source = "<p>Hello, my name is {{name}}. I am from {{hometown}}. </p>";
var template = Handlebars.parse(source);
console.log(Handlebars.precompile(template))
// console.log(Handlebars.compile(source))
 
// var data = { "name": "Alan", "hometown": "Somewhere, TX",
//              "kids": [{"name": "Jimmy", "age": "12"}, {"name": "Sally", "age": "4"}]};
// var result = template(data);

// console.log(result);