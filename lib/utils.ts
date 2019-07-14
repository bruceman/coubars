
// render component in selector
export function render(selector: string, component: any) {
    document.getElementById('app').innerHTML = component.render();
}