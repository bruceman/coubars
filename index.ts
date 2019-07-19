import Handlebars from 'handlebars/runtime';
import { appendId, generateCid, generateFunctionName, isEmpty} from "./utils";

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

const logger = {
    log: function (msg: string) {
        if (debug) {
            console.log(message);
        }
    },
    warn: function (msg: string) {
        if (debug) {
            console.warn(msg);
        }
    }
}

// glodbal entry point of event handler 
window.$$handler = function (key) {
    if (eventHandlers[key]) {
        logger.log(`call event handler -> ${key}`);
        eventHandlers[key]();
    } else {
        logger.warn(`can't find event handler -> ${key}`);
    }
}

// event handler helper
Handlebars.registerHelper('handler', function (handler, options) {
    const funcName = generateFunctionName();
    const context = renderStacks.length > 0 ? renderStacks[renderStacks.length - 1] : {};
    // register new function delegator
    eventHandlers[funcName] = function () {
        // don't pass hash if no params
        if (isEmpty(options.hash)) {
            context[handler].call(context, window.event);
        } else {
            context[handler].call(context, options.hash, window.event);
        }
    }
    // keep all registered listeners of component
    if (!context.listeners) {
        context.listeners = [];
    }
    context.listeners.push(funcName);
    logger.log(`add new event handler "${funcName}" for "${context.constructor.name}.${handler}"`);
    return `$$handler("${funcName}")`;
});

// config of component
interface ComponentConfig {
    template?: any;
    style?: any;
    use?: any;
}

/** 
 * a decorator that enhance class as a componnet
 * 
 * @componnet decorator 
 */
export function component(config: ComponentConfig) {
    // all child component instances
    let children = [];
    // used/dependent components
    let components = config.use || [];

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
            return componentLoop(instance, options);
        });
    });

    // enhance raw class
    return function (target: any) {
        const prototype = target.prototype;
        // component's template
        if (config.template) {
            prototype.template = config.template;
        }
        // component's style
        if (config.style) {
            prototype.style = config.style;
        }
        // set children references
        prototype.children = children;
    }
}

// common component loop of generate html
function componentLoop(instance: any, options: any): void {
    const componentName = instance.constructor.name;
    // set a unique componnet id
    instance.cid = generateCid(componentName);
    // save current render context
    renderStacks.push(instance);
    
    if (instance.componentWillMount) {
        logger.log(`call ${componentName}.componentWillMount:${instance.cid}`);
        instance.componentWillMount();
    }

    logger.log(`call ${componentName}.render:${instance.cid}`);
    const render = instance.render || defaultRender(instance);
    const html = render() + (options && options.fn ? options.fn(this) : '');
    // quit current context
    renderStacks.pop();

    return appendId(html, instance.cid);
}

// default render
function defaultRender(instance) {
    return function () {
         if (typeof instance.template === 'function') {
            return instance.template();
        }
        return instance.template || '';
    } 
}

// recursive call all children's componentWillUnmount
function unmountComponent(component) {
    if (component.children) {
        component.children.forEach(child => {
            umountComponent(child);
        });
    }
   
    if (component.componentWillUnmount) {
        logger.log(`call ${component.constructor.name}.componentWillUnmount:${component.cid}`);
        component.componentWillUnmount();
    }
    
    // remove all registered listenres of components
    if (component.listeners) {
        component.listeners.forEach(funcName => {
            logger.log(`remove event listener for ${component.constructor.name}:${component.cid} -> ${funcName}`);
            delete eventHandlers[funcName];
        });
    }

    component.listeners = null;
}

enum RenderType {
    DEFAULT,
    REPLACE,
    APPEND
}

/**
 * render component in given selector
 */
export function renderComponent(selector: string, componentInstance: any, renderType:RenderType): void {
    // reset render stack for each root componnet 
    // renderStacks = [];
    const el = document.querySelector(selector);
    if (!el) {
        throw new Error(`can't find selector -> ${selector}`);
    }

    // render componet into document
    const html = componentLoop(componentInstance);
    if (renderType === RenderType.REPLACE) {
        el.parentElement.replaceChild(createElement(html), el);
    } else if (renderType === RenderType.APPEND)) {
        el.parentElement.appendChild(createElement(html), el);
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