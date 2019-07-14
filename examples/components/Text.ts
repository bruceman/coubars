// import Component from '../../lib/OldComponent';
// import Handlebars from 'handlebars/runtime';
import component from '../../lib/component';

declare function require(path: string): any;

// Handlebars.registerHelper('pre-text', function (options) {
//     return options.fn ? `pre text ! \n\n ${options.fn(this)}` : `pre text!`;
// });


// function sealed(arg) {

//     return function (target) {
//         // @ts-ignore
//         const tpl = require('./Text.hbs');
//         target.prototype.getTemplate = function () {
//             return tpl;
//         }
//         console.log('sealed be called!');
//         console.log(target);
//     }
// }

// @sealed('./Text.hbs')
@component({
    selector: '#app',
    template: require('./Text.hbs')
})
export default class Text {
}