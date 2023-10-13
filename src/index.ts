import { generate } from "./generate/generate";
import { tokenize } from "./lexing/lexer";
import { ParseOptions, parse as parseSource } from "./parse/parse";
import type { PathLike, OpenMode } from "fs";
import { readFile, FileHandle } from "fs/promises";
import { EventEmitter } from "node:events"

export async function fromFile(path: PathLike | FileHandle, fileOptions?: ({
    encoding?: null | undefined;
    flag?: OpenMode | undefined;
} & EventEmitter.Abortable), parseOptions?: ParseOptions) {
    return parse((await readFile(path, fileOptions)).toString(), parseOptions)
}

export function parse(source: string, parseOptions?: ParseOptions): Object {
    const tokens = [...tokenize(source)];
    return parseSource(source, tokens, parseOptions)
}

export default parse;

export {
    generate
};
