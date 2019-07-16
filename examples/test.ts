import { renderComponent } from "../index";
import App from './components/App';

function init() {
    renderComponent('app', new App());
    // renderComponent('app2', new App());
}

init();
