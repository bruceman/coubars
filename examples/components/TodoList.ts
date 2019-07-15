import { component } from "../../index";

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

    /**
     * clickHandler
     */
    public clickHandler(params) {
        console.log('click handler');
        console.log(params);
    }
}
