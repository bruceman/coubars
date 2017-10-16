import handlebars from './lib/handlebars';
var str = '<span>{{msg}}</span>';
var output = handlebars.parse(str);
console.log(output);
console.log('=======================');
output = handlebars.compile(str);
console.log(output.toString());
console.log('=======================');
output = output({msg: 'hello'});
console.log(output);
// console.log('=======================');
// output = handlebars.compile(str);
// console.log(output);

