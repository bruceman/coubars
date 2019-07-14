import Handlebars from 'handlebars/runtime';

/**
 * Define base component functions
 */
export class Component {
    public props: any;
    public state: any;

    public constructor(props = {}) {
        this.props = props;
    }

    public componentWillMount(): void {
    }

    public componentDidMount(): void {
    }

    public componentWillUpdate(): void {
    }

    public componentDidUpdate(): void {
    }

    public shouldComponentUpdate(): void {
    }

    /**
     * Handlebars template function, subclass should override this method.
     */
    public getTemplate(): any {
        return null;
    }

    /**
     * The data for rendering Handlebars template, can be override.
     */
    public getState(): any {
        return this.state;
    }

    /**
     * setState
     */
    public setState(newState: any) {
        this.state = newState;
    }

    /**
     * Render to string
     */
    public render() {
        console.log('adfaf render');
        const tpl = this.getTemplate();
        if (tpl) {
            return tpl(Object.assign({}, this.props, this.state));
        }

        return "";
    }
}

// decorator @component

interface ComponentConfig {
    template?: any;
    style?: any;
    components?: any;
}

export function component(config: ComponentConfig) {
    let children = [];
    if (config.components) {
        config.components.forEach(component => {
            // register helper
            console.log(`register helper -> ${component.name}`);
            Handlebars.registerHelper(component.name, (options) => {
                const instance = new component(options.hash || {});
                children.push(instance);

                if (instance.componentWillMount) {
                    console.log(`componentWillMount -> ${component.name}`);
                    instance.componentWillMount();
                }
                console.log(options);
                // generate a component id and append it to  html
                // instance.component_id = this id
                return instance.render() + (options.fn ? options.fn(this) : '');
            });
        });
    }

    return function (target: any) {
        target.prototype.children = children;
        console.log(`############ constructor `);
        console.log(target);
        console.log(target.constructor);
        

        if (config.template) {
            // register new functions
            target.prototype.render = function () {
                console.log(`render -> ${target.name}`);
                return config.template(Object.assign({}, this.props, this.state));
            }
        }

    }
}


export function render(selector: string, component: any) {
    if (component.componentWillMount) {
        console.log(`componentWillMount -> ${component.constructor.name}`);
        component.componentWillMount();
    }

    document.getElementById('app').innerHTML = component.render();

    if(component.componentDidMount) {
        if(component.children) {
            component.children.forEach(child => {
                console.log(`componentDidMount -> ${child.constructor.name}`);
                child.componentDidMount();
            });
        }
        console.log(`componentDidMount -> ${component.constructor.name}`);
        component.componentDidMount();
    }
}