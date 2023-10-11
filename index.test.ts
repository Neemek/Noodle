import { test, expect } from "@jest/globals"
import parse, { fromFile } from ".";

test("simple values", () => {
    expect(parse(`hello = "world"`)).toMatchObject({ hello: "world" })
    expect(parse(`number = 26387`)).toMatchObject({ number: 26387 })
    expect(parse(`extended number = 2e6`)).toMatchObject({ "extended number": 2000000 })
    expect(parse(`boolean = true`)).toMatchObject({ boolean: true })
    expect(parse(`other boolean = false`)).toMatchObject({ "other boolean": false })
    expect(parse(`hexadecimal = 0xF0`)).toMatchObject({ hexadecimal: 240 })
    expect(parse(`binary = 0b0100`)).toMatchObject({ binary: 4 })
    expect(parse(`array = ()`)).toMatchObject({ array: [] })
    expect(parse(`array = ("item", 50, false, 15E-4)`)).toMatchObject({ array: ["item", 50, false, 0.0015] })
})

test("objects", () => {
    expect(parse(`
[object]
    hello = "world"
    `)).toMatchObject({ object: { hello: "world" } })

    expect(parse(`
[object]
    [sub-object]
        value = "something"
        other = 15
    otters = "cute"
    money = 1e4`)).toMatchObject({
        object: {
            "sub-object": {
                value: "something",
                other: 15
            },
            otters: "cute",
            money: 10000
        }
    })
})

test("empty", () => {
    expect(parse(``)).toMatchObject({})
    expect(parse(`[woah]`)).toMatchObject({ woah: {} })
    expect(parse(`empty array = ()`)).toMatchObject({ "empty array": [] })
})

test("example files", async () => {
    expect(await fromFile("./examples/showcase.nudl")).toMatchObject({
        hello: "world",
        number: 15,
        hex: 241,
        "child object": {
            value_a: "WOW",
            wvalue_b: 14,
            "child objects child object": {
                info: [4, "This child object is the coolest thing since 2001: a space odyssey"]
            }
        },
        "top level again": true,
        expanded_number: 0.000000000000000000000001,
        binary: 150,
        array: [],
        "no value": null
    })

    expect(await fromFile("./examples/helloworld.nudl")).toMatchObject({
        hello: "world"
    })
})

test("configurable", () => {
    expect(parse(`hex = 0xF1`, { preserveHex: true })).toMatchObject({ hex: "0xF1" })
    expect(parse(`binary = 0b11001011`, { preserveBinary: true })).toMatchObject({ binary: "0b11001011" })
})
