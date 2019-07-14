import Handlebars from 'handlebars/runtime';

/**
 * Define base component functions
 */
export class Component {
    private props: any;
    private state: any;

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
    if (config.components) {
        config.components.forEach(component => {
            // register helper
            console.log(`register helper -> ${component.name}`);
            Handlebars.registerHelper(component.name, function (options) {
                const instance = new component(options.hash || {});
                if (instance.componentWillMount) {
                    console.log(`componentWillMount -> ${component.name}`);
                    instance.componentWillMount();
                }
                console.log(`render -> ${component.name}`);
                console.log(options);
                return instance.render() + (options.fn ? options.fn(this) : '');
                // return component.name;
            });
        });
    }
    return function (target: Function) {
        // register new functions
        target.prototype.render = function () {
            return config.template(this.getState ? this.getState() : {});
        }
    }
}
