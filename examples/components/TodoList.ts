// import component from '../../lib/decorator/component';
// import Component from "../../lib/component";
import { component, Component } from "../../index";



@component({
    template: require('./TodoList.hbs')
})
export default class TodoList extends Component {
    
    /**
     * componentDidMount
     */
    public componentDidMount() {
        console.log('totolist ... init event');
        if (this.props.callback) {
            this.props.callback();
        }
    }
}
