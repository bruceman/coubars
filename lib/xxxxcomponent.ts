import Handlebars from 'handlebars/runtime';
// decorator @component

interface ComponentConfig {
    template?: any;
    style?: any;
    components?: array;
}

export default function component(config: ComponentConfig) {
    if (config.components) {
        config.components.forEach(component => {
            // register helper
            console.log(`register helper -> ${component.name}`);
            Handlebars.registerHelper(component.name, function (options) {
                const instance = new component(options.hash);
                console.log(`call helper -> ${component.name}`);
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
