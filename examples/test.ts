import { renderComponent } from "../index";
import App from './components/App';

function init() {
    const app = new App();
    renderComponent('app', app);
    console.log(app);
}

init();
