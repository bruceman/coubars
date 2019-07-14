// import component from '../../lib/decorator/component';
import { component, Component } from "../../index";
import TodoList from "./TodoList";

@component({
    template: require('./App.hbs'),
    components: [TodoList]
})
export default class App extends Component {
}