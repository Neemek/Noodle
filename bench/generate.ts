import { bench, group } from "mitata";
import { generate } from "..";
import { baseline } from "mitata";

const genSimpleData = (count: number): object => {
    let source = "{"

    for (let i = 0; i < count; i++) {
        source += `"hello${i}": "world${i}",`
    }

    source = source.slice(0, source.length - 1) + "}"

    return JSON.parse(source)
}

const simpleData = {
    one: { hello: "world" },
    ten: genSimpleData(10),
    hundred: genSimpleData(100),
    thousand: genSimpleData(1000),
}

group("simple gen", () => {
    baseline("empty", () => generate({}))
    bench("1 pair", () => generate(simpleData.one))
    bench("10 pairs", () => generate(simpleData.ten))
    bench("100 pairs", () => generate(simpleData.hundred))
    bench("100 pairs", () => generate(simpleData.thousand))
})

const genRecursiveObject = (count: number) => {
    if (count > 0) return { "object": genRecursiveObject(count-1) }
    else return {}
}

const objectData = {
    simpleObject: { object: {} },
    tenRecursive: genRecursiveObject(10),
    hundredRecursive: genRecursiveObject(100)
}

group("gen object", () => {
    baseline("empty", () => generate({}))
    bench("single empty object", () => generate(objectData.simpleObject))
    bench("10 recursive objects", () => generate(objectData.tenRecursive))
    bench("100 recursive objects", () => generate(objectData.hundredRecursive))
})
