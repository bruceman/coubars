// test helper
export default function hello(text: string, options: any) {
    return `hello <em>${text}</em> ${options.fn(this)}`;
}
