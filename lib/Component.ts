import Handlebars from 'handlebars/runtime';
import { appendId, generateId, generateFunctionName, isEmpty} from "./utils";

// track current component render tree
let renderStacks = [];

// all registered event handlers
let eventHandlers = {};

// show debug info
let debug = true;


function noop() {
    return '';
 }

// glodbal entry point of event handler 
window.$$handler = function (key) {
    if (eventHandlers[key]) {
        if (debug) {
            console.log(`call event handler -> ${key}`);
        }
        eventHandlers[key]();
    } else {
        if (debug) {
            console.warn(`can't find event handler -> ${key}`);
        }
    }
}

// event handler helper
Handlebars.registerHelper('handler', (handler, options) => {
    const funcName = generateFunctionName();
    const context = renderStacks.length > 0 ? renderStacks[renderStacks.length - 1] : {};
    // register new function
    eventHandlers[funcName] = function () {
        // don't pass hash if no params
        if (isEmpty(options.hash)) {
            context[handler].call(context, window.event);
        } else {
            context[handler].call(context, options.hash, window.event);
        }
    }

    if (debug) {
        console.log(`add new event handler "${funcName}" for "${context.constructor.name}.${handler}"`);
    }

    return `$$handler("${funcName}")`;
});

// config of component
interface ComponentConfig {
    template?: any;
    style?: any;
    components?: any;
}

// common component loop of generate html
function componentLoop(instance: any, options: any): void {
    const componentName = instance.constructor.name || 'Object';
    // set a unique componnet id
    instance.cid = generateId(componentName);
    // save current render context
    renderStacks.push(instance);

    if (debug) {
        console.log(`call ${instance.constructor.name}.componentWillMount:${instance.cid}`);
    }
    instance.componentWillMount && instance.componentWillMount();

    if (debug) {
        console.log(`call ${instance.constructor.name}.render:${instance.cid}`);
    }
    const html = instance.render() + (options && options.fn ? options.fn(this) : '');
    // quit current context
    renderStacks.pop();

    return html;
}

/**
 * @componnet decorator 
 */
export function component(config: ComponentConfig) {
    // all child components
    let children = [];
    let components = config.components || [];

    components.forEach(component => {
        if (debug) {
            console.log(`register helper for component -> ${component.name}`);
        }
        // register helper for componnet
        Handlebars.registerHelper(component.name, (options) => {
            const instance = new component(options.hash || {});
            // save child reference
            children.push(instance);
            // append id attribute of component
            return appendId(componentLoop(instance, options), instance.cid);
        });
    });

    // enhance component class
    return function (target: any) {
        // set children references
        target.prototype.children = children;

        // render component 
        target.prototype.render = function () {
            const template = config.template || noop;
            return template(Object.assign({}, this.props, this.state));
        }

        // get DOM node of componnet
        target.prototype.getElement = function () {
            return document.getElementById(this.cid);
        }
    }
}

/**
 * render component in given selector
 */
export function renderComponent(selector: string, component: any): void {
    // reset render stack for each root componnet 
    renderStacks = [];
    // render componet into document
    document.getElementById(selector).innerHTML = componentLoop(component);
    const children = component.children || [];
    // trigger componentDidMount for all children
    children.forEach(child => {
        if (debug) {
            console.log(`call ${child.constructor.name}.componentDidMount:${child.cid}`);
        }
        child.componentDidMount && child.componentDidMount();
    });

    // triggle root component componentDidMount
    if (debug) {
        console.log(`call ${component.constructor.name}.componentDidMount:${component.cid}`);
    }
    component.componentDidMount && component.componentDidMount();
}