/**
 * Define base component functions
 */
export default class Component {
    private props: any;

    public constructor(props = {}) {
        this.props = props;
    }

    /**
     * The container that include the component, can be override
     */
    public getContainer() {
        const { container } = this.props;
        return container;
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
    public getData(): any {
        const { data } = this.props;
        return data;
    }

    /**
     * Render the component in container
     */
    public render() {
        const container = this.getContainer();
        const tpl = this.getTemplate();

        if (container && tpl) {
            container.insertAdjacentHTML('beforeEnd', tpl(this.getData()));
            return true;
        }

        return false;
    }
}
