import { expect, test } from "bun:test";
import { generate } from "./generate";
import parse from "../..";

const data = {
    kvPair: { hello: "world" },
    emptyObject: { object: {} },
    deepObject: { object: { "deep object": { "deeper object": { "deepest object": {} } } } },
    moreAdvanced: { // Taken from to examples/showcase.nudl, except null and "child objects child object"
        hello: "world",
        number: 15,
        hex: 241,
        "child object": {
            value_a: "WOW",
            wvalue_b: 14,
        },
        "top level again": true,
        expanded_number: 0.000000000000000000000001,
        binary: 150,
        array: [],
    }
}

const matchRecreated = (obj: object) => expect(parse(generate(obj))).toMatchObject(obj)
test("small", () => {
    matchRecreated(data.kvPair)
    matchRecreated(data.emptyObject)
})

test("all", () => {
    matchRecreated(data.moreAdvanced)
})
