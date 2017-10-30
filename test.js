import handlebars from './lib/handlebars';
// var str = '<span>{{msg}}</span>';
// var output = handlebars.parse(str);
// console.log(output);
// console.log('=======================');
// output = handlebars.compile(str);
// console.log(output.toString());
// console.log('=======================');
// output = output({msg: 'hello'});
// console.log(output);
// console.log('=======================');
// output = handlebars.compile(str);
// console.log(output);

var source = "<p>Hello, my name is {{name}}. I am from {{hometown}}. I have " +
"{{kids.length}} kids:</p>" +
"<ul>{{#kids}}<li>{{name}} is {{age}}</li>{{/kids}}</ul>";
var template = handlebars.compile(source);

var data = { "name": "Alan", "hometown": "Somewhere, TX",
"kids": [{"name": "Jimmy", "age": "12"}, {"name": "Sally", "age": "4"}]};
var result = template(data);
console.log(result);