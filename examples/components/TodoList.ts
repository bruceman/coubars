import { component, data } from "../../index";

@component({
    template: require('./TodoList.hbs')
})
export default class TodoList {

    public constructor(props: any) {
        this.props = props;
    }
    /**
     * componentDidMount
     */
    public componentDidMount() {
        console.log('totolist ... init event');
        console.log(this.getElement());
        if (this.props.callback) {
            this.props.callback();
        }
    }

    @data
    public getData() {
        return Object.assign({}, this.props);
    }

    /**
     * clickHandler
     */
    public clickHandler(params) {
        console.log('click handler');
        console.log(params);
        // this.setState({name: 'dddd'});
        this.updateComponent(true);

        console.log(this.getData());
    }

    public noUpdate(event) {
        console.log('---no update --');
        console.log(event);
        this.updateComponent();
    }

    public componentShouldUpdate() {
        return false;
    }
}
