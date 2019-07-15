// match tag start part, for example: <div ...>...</div> => <div
const TAGSTART = /(<[a-zA-Z]+)\s*([^>]*>)/;

// add id attribute on the first tag
export function appendId(html:string, id:string): string {
    if (!html || !id) {
        return html;
    }

    return html.replace(TAGSTART, `$1 id="${id}" $2`);
}

let cid = 0;
// generate component id
export function generateCid(name:string): string {
    return `${name}-${cid++}`;
}


let funcId = 1;
export function generateFunctionName() {
    return `func${funcId++}-${new Date().getTime()}`
}

export function isEmpty(obj) {
    return obj ? Object.keys(obj).length === 0 && obj.constructor === Object : false;
}