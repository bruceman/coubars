import Text from './components/Text';


const container = document.getElementById('app');

function test() {
    const txt = new Text({container});
    console.log(txt.render());
}

test();
