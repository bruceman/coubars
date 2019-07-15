import Handlebars from 'handlebars/runtime';
import { appendId, generateId, generateFunctionName} from "./utils";

// track current component render tree
let renderStacks = [];

let handlers = {};

window.$$handler = function (key) {
    if (handlers[key]) {
        console.log(`call event handler -> ${key}`);
        handlers[key]();
    }
}

interface ComponentConfig {
    template?: any;
    style?: any;
    components?: any;
}

/**
 * @componnet decorator 
 */
export function component(config: ComponentConfig) {
    Handlebars.registerHelper('handler', (handler, options) => {
        console.log(`onClick --------- ${handler}`);
        console.log(options);
        console.log(renderStacks[renderStacks.length-1]);
        const funcName = generateFunctionName();
        const context = renderStacks[renderStacks.length-1] || {};
        handlers[funcName] = function () {
            context[handler].call(context,options.hash);
        }

        return `$$handler("${funcName}")`;
    });

    let children = [];
    if (config.components) {
        config.components.forEach(component => {
            // register helper
            console.log(`register helper -> ${component.name}`);
            Handlebars.registerHelper(component.name, (options) => {
                const instance = new component(options.hash || {});
                renderStacks.push(instance);
                // componnet id
                instance.cid = generateId(component.name);
                children.push(instance);
                console.log(`componentWillMount -> ${component.name}`);
                console.log(options);
                const html = instance.render() + (options.fn ? options.fn(this) : '');
                renderStacks.pop();
                // insert componnet id
                return appendId(html, instance.cid);
            });
        });
    }

    return function (target: any) {
        target.prototype.children = children;

        if (config.template) {
            // register new functions
            target.prototype.render = function () {
                console.log(`render -> ${target.name}`);
                return config.template(Object.assign({}, this.props, this.state));
            }

            target.prototype.getElement = function () {
                return document.getElementById(this.cid);
            }
        }

    }
}

/**
 * render component in given selector
 */
export function renderComponent(selector: string, component: any) {
    renderStacks = [];
    console.log(`componentWillMount -> ${component.constructor.name}`);
    document.getElementById('app').innerHTML = component.render();
    renderStacks.pop();

    if(component.children) {
        component.children.forEach(child => {
            console.log(`componentDidMount -> ${child.constructor.name}`);
            child.componentDidMount && child.componentDidMount();
        });
    }
    console.log(`componentDidMount -> ${component.constructor.name}`);
    component.componentDidMount && component.componentDidMount();
}