import Handlebars from 'handlebars/runtime';
import { appendId, generateCid, generateFunctionName, isEmpty} from "./utils";

const DATA_KEY = '__DATA-KEY';

// track current component render tree
let renderStacks = [];

// all registered event handlers
let eventHandlers = {};

// show debug info
let debug = true;

// just return empty string
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
    // keep all registered listeners of component
    if (!context.__listeners) {
        context.__listeners = [];
    }
    context.__listeners.push(funcName);

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
    instance.cid = generateCid(componentName);
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
 * a decorator that enhance class as a componnet
 *
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
        const prototype = target.prototype;
        prototype.template = config.template;
        prototype.children = children;

        // render component 
        prototype.render = function () {
            const template = this.template || noop;
            const name = this[DATA_KEY] || 'props';
            const ctx = typeof this[name] === 'function' ? this[name]() : this[name];
            return template(ctx || {});
        }

        // get DOM node of componnet
        prototype.getElement = function () {
            return document.getElementById(this.cid);
        }

        // call this to re-render component
        prototype.updateComponent = function (force: boolean) {
            // notify children componnets to clear resources
            unmountComponent(this);
            renderComponent(this.cid, this, true);
        }
    }
}

// recursive call all children's componentWillUnmount
// TODO: clear event listenrs
function unmountComponent(component) {
    if (component.children) {
        component.children.forEach(child => {
            umountComponent(child);
        });
    }
    if (debug) {
        console.log(`call ${component.constructor.name}.componentWillUnmount:${component.cid}`);
    }
    component.componentWillUnmount && component.componentWillUnmount();

    // remove all registered listenres of components
    if (component.__listeners) {
        component.__listeners.forEach(funcName => {
            if (debug) {
                console.log(`remove event listener for ${component.constructor.name}:${component.cid} -> ${funcName}`);
            }
            delete eventHandlers[funcName];
        });
    }

    component.__listeners = null;
}

/**
 * mark a method/property that will be used to get data for rendering template
 * @data decorator
 */
export function data(target: any, name: string) {
    if (debug) {
        console.log(`@data -> ${target.constructor.name}.${name}`);
    }
    target[DATA_KEY] = name;
};

/**
 * render component in given selector
 */
export function renderComponent(selector: string, componentInstance: any, replace: boolean): void {
    // reset render stack for each root componnet 
    renderStacks = [];
    // render componet into document
    const html = componentLoop(componentInstance);
    const el = document.getElementById(selector);
    if (replace) {
        // replace exists node
        el.parentElement.replaceChild(createElement(appendId(html, componentInstance.cid)), el);
    } else {
        el.innerHTML = html;
    }
    const children = componentInstance.children || [];
    // trigger componentDidMount for all children
    children.forEach(child => {
        if (debug) {
            console.log(`call ${child.constructor.name}.componentDidMount:${child.cid}`);
        }
        child.componentDidMount && child.componentDidMount();
    });

    // triggle root component componentDidMount
    if (debug) {
        console.log(`call ${componentInstance.constructor.name}.componentDidMount:${componentInstance.cid}`);
    }
    componentInstance.componentDidMount && componentInstance.componentDidMount();
}

function createElement(html: string) {
  const div = document.createElement('div');
  div.innerHTML = html.trim();
  // Change this to div.childNodes to support multiple top-level nodes
  return div.firstChild; 
}