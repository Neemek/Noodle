import { report } from "../error/report"
import { Token } from "../lexing/lexer"
import { TokenType } from "../lexing/tokens"

export type Value = string | number | boolean | null | Value[]

export interface ParseOptions {
    // Preserve hexadecimal values as strings
    preserveHex?: boolean;
    // Preserve binary values as strings
    preserveBinary?: boolean;
    // Spaces per level of indentation (default: 4)
    spacesPerIndent?: number;
    // Suppress all errors
    suppressErrors?: boolean;
}

export function parse(source: string, tokens: Token[], options: ParseOptions={ spacesPerIndent: 4, suppressErrors: false }) {
    let hadError = false
    let errorCausingTokens: number[] = [] // To prevent mass spam over same error, same token

    let current = 1
    let prev = tokens[0]
    let token = tokens[0]

    const spacesPerIndent = (options.spacesPerIndent ?? 4) // Default spaces per indent is 4
    let expectedIndentation: number = 0

    // Report error with current token, unless something else is specified
    function error(message: string, t: Token=token) {
        hadError = true;
        
        if (!options.suppressErrors && !errorCausingTokens.includes(t.position)) {
            report(source, t.line, t.position, t.lexeme.length, message)
            errorCausingTokens.push(t.position)
        }
        advance()
    }
    
    function peek(): Token {
        return tokens[current]
    }

    function advance() {
        prev = token
        token = tokens[current++]
    }

    function accept(type: TokenType) {
        if (token.type === type) {
            advance()
            return true
        }
        return false
    }

    function expect(type: TokenType) {
        if (!accept(type)) {
            error("Unexpected token: "+token.lexeme)
        }
    }

    function value(): Value | undefined {
        if (accept(TokenType.String)) {
            return prev.lexeme.slice(1, prev.lexeme.length-1)
        } else if (accept(TokenType.Number)) {
            if (prev.lexeme.toLowerCase().includes("e")) {
                const [number, exponent] = prev.lexeme.toLowerCase().split("e").map(parseFloat)
                return number * Math.pow(10, exponent)
            }
            return parseInt(prev.lexeme)
        } else if (accept(TokenType.Hexadecimal)) {
            return options.preserveHex ? prev.lexeme : parseInt(prev.lexeme)
        } else if (accept(TokenType.Binary)) {
            return options.preserveBinary ? prev.lexeme : parseInt(prev.lexeme.slice(2), 2)
        } else if (accept(TokenType.True) || accept(TokenType.False)) {
            return prev.type === TokenType.True
        } else if (accept(TokenType.Null)) {
            return null
        } else if (accept(TokenType.ArrayOpen)) {
            let contents: Value[] = []
            if (!accept(TokenType.ArrayClose)) {
                do {
                    contents.push(value()!)
                } while (accept(TokenType.Comma))
                expect(TokenType.ArrayClose)
            }
            return contents
        } else {
            error("Invalid value: " + token.lexeme)
        }
    }

    function statement(): [string, Value | Object] | undefined {
        accept(TokenType.Comment)
        if (token.type === TokenType.Indent && peek().type !== TokenType.Indent) { // If the current token is an indent, and the line has content
            const actualIndentation = (token.lexeme.length - 1) / spacesPerIndent

            if (actualIndentation % 1 !== 0) {
                error("Invalid indentation")
            } else if (actualIndentation > expectedIndentation) {
                error("Unexpected indentation: indent too large")
            } else if (actualIndentation === expectedIndentation) {
                expect(TokenType.Indent)
            } else {
                expectedIndentation = actualIndentation
                return; // Return if the current block is exited
            }
        }

        if (accept(TokenType.Identifier)) {
            const identifier = prev.lexeme.trim()
            expect(TokenType.Assign)
            const v = value()

            return [identifier, v!]
        } else if (accept(TokenType.Object)) {
            const identifier = prev.lexeme.slice(1, prev.lexeme.length - 1).trim()
            expectedIndentation++; // entering block
            return [identifier, block()]
        }
    }

    function block(): Object {
        const indentationLevel = expectedIndentation
        const obj = {}

        while (token && token.type !== TokenType.EoF && expectedIndentation === indentationLevel) {
            let s = statement()

            if (s) Object.defineProperty(obj, s?.[0] ?? "", {
                value: s?.[1],
                writable: true,
            })
            else advance() // Keep the loop from continuing endlessly
        }
        
        return obj
    }

    if (hadError) throw new Error("Error parsing"); // Notify about the error
    return block()
}