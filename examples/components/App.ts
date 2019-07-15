import { component } from "../../index";
import TodoList from "./TodoList";

@component({
    template: require('./App.hbs'),
    components: [TodoList]
})
export default class App {
    
    state: any = {
        items: ["aaa", "bbb"],
        func: function () {
            alert('app function called');
        }
    }
}