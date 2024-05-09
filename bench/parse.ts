import { bench, group } from "mitata"
import { fromFile, parse } from ".."

const objwvalue = "[simple object]\n    hello = \"world\""
const assign = "hello = \"world\"\n"

const simpleData = {
    one: assign,
    ten: assign.repeat(10),
    fifty: assign.repeat(50),
    fivehundred: assign.repeat(500)
}

group("simple", () => {
    bench("1 assign", () => parse(simpleData.one))
    bench("10 assign", () => parse(simpleData.ten))
    bench("50 assign", () => parse(simpleData.fifty))
    bench("500 assign", () => parse(simpleData.fivehundred))
})

const objectData = {
    value: objwvalue,
    fiftyvalues: objwvalue.repeat(50),
    recursiveobject: "[simple object]\n    [another object]\n        hello = \"world\"",
    fiftyrecursive: new Array(50).map((_, i) => "    ".repeat(i)+"[recursive objects]").join("\n") + "\n" + "    ".repeat(50) + "hello = \"world\""
}

group("object", () => {
    bench("object with value", () => parse(objectData.value))
    bench("object with 50 values", () => parse(objectData.fiftyvalues))
    bench("recursive object with value",  () => parse(objectData.recursiveobject))
    bench("50 recursive objects",  () => parse(objectData.fiftyrecursive))
})

const examplesData = {
    helloworld: await Bun.file("../examples/helloworld.nudl").text(),
    showcase: await Bun.file("../examples/showcase.nudl").text(),
}

group("examples", () => {
    bench("hello world example", async () => await fromFile("../examples/helloworld.nudl"))
    bench("hello world example [preloaded]", () => parse(examplesData.helloworld))
    bench("showcase (a bit of everything)", async () => await fromFile("../examples/showcase.nudl"))
    bench("showcase (a bit of everything) [preloaded]", () => parse(examplesData.showcase))
})
