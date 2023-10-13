import { expect, test } from "@jest/globals";
import { tokenize } from "./lexer";
import { TokenType } from "./tokens";


test("small lexing", () => {
    expect([...tokenize(`value = "string"`)].map(v => v.type)).toEqual([TokenType.Identifier, TokenType.Assign, TokenType.String, TokenType.EoF])
    expect([...tokenize(`num = 1e-5\n[object name]\n    object property = true`)].map(v => v.type))
        .toEqual([
                TokenType.Identifier, TokenType.Assign, TokenType.Number,
                TokenType.Indent, TokenType.Object, TokenType.Indent, 
                TokenType.Identifier, TokenType.Assign, TokenType.True, TokenType.EoF
            ])
    expect([...tokenize(`value = "t" & 15`, true)].map(v => v.type))
        .toEqual([
                TokenType.Identifier, TokenType.Assign, TokenType.String, TokenType.Invalid, TokenType.Number, TokenType.EoF
            ])
    expect([...tokenize(`array = ("string", 1e5)`, true)].map(v => v.type))
        .toEqual([
                TokenType.Identifier, TokenType.Assign, TokenType.ArrayOpen, TokenType.String, TokenType.Comma, TokenType.Number, TokenType.ArrayClose, TokenType.EoF
            ])
})
