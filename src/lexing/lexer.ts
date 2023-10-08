import { TokenType } from "./tokens";
import { report } from "../error/report";

export interface Token {
    type: TokenType,
    lexeme: string,
    position: number,
    line: number,
}

const DIGITS = "0123456789"
const LETTERS = "abcdefghijklmnopqrstuvwxyzæøå"

export function* tokenize(text: string, silenceErrors: boolean=false): Generator<Token> {
    let start = 0
    let current = 0
    let line = 1

    function makeToken(type: TokenType): Token {
        return {
            type: type,
            lexeme: text.slice(start, current),
            position: start,
            line: line
        }
    }

    function peek(): string | undefined {
        return text[current]
    }

    function advance(): number {
        if (peek() === "\n") line++;
        return current++
    }

    function consume(...only: string[]): string {
        if (only.length === 0) return text[advance()]
        if (peek() && only.includes(peek()!)) return consume()
        return ""
    }

    function skip({accept, reject}: {accept?: string[], reject?: string[]}) {
        while (
            (!accept || accept.includes(peek()?.toLowerCase() ?? "")) 
            && !reject?.includes(peek()?.toLowerCase() ?? "")
        ) advance();
    }

    function number() {
        skip({ accept: [...DIGITS, '_']} );
        if (consume('e', 'E')) {
            consume('+', '-')
            skip({ accept: [...DIGITS, '_']} );
        }
            
        return makeToken(TokenType.Number);
    }

    function string() {
        skip({ reject: ['"'] });
        advance()
        return makeToken(TokenType.String);
    }

    while (current < text.length) {
        start = current

        const c = consume()

        switch (c) {
            case '(': yield makeToken(TokenType.ArrayOpen); break;
            case ')': yield makeToken(TokenType.ArrayClose); break;
            case '=': yield makeToken(TokenType.Assign); break;
            case '\n':
                skip({ accept: [...' \t'] })
                yield makeToken(TokenType.Indent)
                break;
            case ',': yield makeToken(TokenType.Comma); break;
            case '+': yield makeToken(TokenType.Plus); break;
            case '-': yield makeToken(TokenType.Minus); break;

            case '#': 
                skip({ reject: ['\n'] })
                yield makeToken(TokenType.Comment)
                break;
            case '"':
                yield string();
                break;
            case '[':
                skip({reject: [']']})
                advance()
                yield makeToken(TokenType.Object)
                break;

            default:
                if (c === '0') {
                    const n = consume()
                    switch (n) {
                        case 'x':
                            skip({ accept: [...DIGITS, ...'abcdef_'] })
                            yield makeToken(TokenType.Hexadecimal)
                            break;
                        case 'b':
                            skip({ accept: '01_'.split('') })
                            yield makeToken(TokenType.Binary)
                            break;
                        default:
                            yield number()
                            break;
                    }
                } else if (DIGITS.includes(c)) {
                    yield number()
                } else if (LETTERS.includes(c)) {
                    if (c.toLowerCase() === "t" && consume("r") && consume("u") && consume("e") && (!peek() || ![...LETTERS, ...DIGITS, '_'].includes(peek() ?? ""))) yield makeToken(TokenType.True)
                    else if (c.toLowerCase() === "f" && consume("a") && consume("l") && consume("s") && consume("e") && (!peek() || ![...LETTERS, ...DIGITS, '_'].includes(peek() ?? ""))) yield makeToken(TokenType.False)
                    else if (c.toLowerCase() === "n" && consume("u") && consume("l") && consume("l") && (!peek() || ![...LETTERS, ...DIGITS, '_'].includes(peek() ?? ""))) yield makeToken(TokenType.Null)
                    else {
                        skip({ accept: [...LETTERS, ...DIGITS, ...'_ '] })
                        yield makeToken(TokenType.Identifier)
                    }
                } else if (c === ' ') {
                    
                } else {
                    if (!silenceErrors) report(text, line, start, 1, "Invalid character: "+c+" (hex: "+c.charCodeAt(0).toString(16)+")")
                    yield makeToken(TokenType.Invalid)
                }
        }
    }

    yield {
        type: TokenType.EoF,
        lexeme: "",
        position: current,
        line: line,
    }
}

