// import {render} from "../lib/utils";
import { render } from "../index";
import App from './components/App';


function init() {
    const app = new App();
    render('app', app);
    console.log(app);
}

init();
