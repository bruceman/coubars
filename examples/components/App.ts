// import component from '../../lib/decorator/component';
import { component, Component } from "../../index";
import TodoList from "./TodoList";

@component({
    template: require('./App.hbs'),
    components: [TodoList]
})
export default class App extends Component {
    state: any = {
        items: ["aaa", "bbb"],
        func: function () {
            alert('app function called');
        }
    }
}