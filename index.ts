import { generate } from "./src/generate/generate";
import { tokenize } from "./src/lexing/lexer";
import { ParseOptions, parse as parseSource } from "./src/parse/parse";
import { readFile } from "fs/promises";

export async function fromFile(path: string | URL, fileOptions?: BlobPropertyBag | undefined, parseOptions?: ParseOptions) {
    return parse(typeof Bun !== undefined ? await Bun.file(path, fileOptions).text() : (await readFile(path, fileOptions)).toString(), parseOptions)
}

export function parse(source: string, parseOptions?: ParseOptions): Object {
    const tokens = [...tokenize(source)];
    return parseSource(source, tokens, parseOptions)
}

export default parse;

export {
    generate
};
