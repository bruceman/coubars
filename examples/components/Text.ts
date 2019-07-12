import Component from '../../lib/Component';
import Handlebars from 'handlebars/runtime';

declare function require(path: string): any;

Handlebars.registerHelper('pre-text', function (txt, options) {
    return options.fn ? `pre text = ${txt}! \n\n ${options.fn(this)}` : `pre text = ${txt}!`;
});


function sealed(arg) {

    return function (target) {
        // @ts-ignore
        const tpl = require('./Text.hbs');
        target.prototype.getTemplate = function () {
            return tpl;
        }
        console.log('sealed be called!');
    }
}

@sealed('./Text.hbs')
export default class Text extends Component {

}