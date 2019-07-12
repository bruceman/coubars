// test helper
export default function hello(text: string, options: any) {
    return options.fn ? `<em>hello ${text}</em> ${options.fn(this)}` : `<em>hello ${text}</em>`;
}
