import { expect, test } from "bun:test";
import { tokenize } from "./lexer";
import { TokenType } from "./tokens";

const tokenSequence = (tokens: TokenType[]) => (value: unknown) => value instanceof Array ? value.every((v, i) => v?.type === tokens[i]) : false

test("small lexing", () => {
    expect([...tokenize(`value = "string"`)]).toSatisfy(tokenSequence([TokenType.Identifier, TokenType.Assign, TokenType.String, TokenType.EoF]))
    expect([...tokenize(`num = 1e-5\n[object name]\n    object property = true`)])
        .toSatisfy(tokenSequence(
            [
                TokenType.Identifier, TokenType.Assign, TokenType.Number,
                TokenType.Indent, TokenType.Object, TokenType.Indent, 
                TokenType.Identifier, TokenType.Assign, TokenType.True, TokenType.EoF
            ]
        ))
    expect([...tokenize(`value = "t" & 15`, true)])
        .toSatisfy(tokenSequence(
            [
                TokenType.Identifier, TokenType.Assign, TokenType.String, TokenType.Invalid, TokenType.Number, TokenType.EoF
            ]
        ))
})
