
/**
 * Generate a .nudl file from an object
 */
export function generate(source: Object, options?: GenerateOptions): string {
    return [...transform(source, 0, options)].join("").trimEnd()
}

export interface GenerateOptions {
    // The width of an indent in spaces (default: 4)
    indentLength?: number;
}

function* transform(object: Object, indentation: number, options?: GenerateOptions): Generator<string> {
    for (let [key, val] of Object.entries(object)) {
        yield " ".repeat((options?.indentLength ?? 4) * indentation)

        if (typeof val === "object" && !(val instanceof Array)) {
            yield `[${key}]\n`
            yield [...transform(val, indentation+1, options)].join("")
        }
        else yield `${key} = ${typeof val === "string" ? `"${val}"` : val instanceof Array ? `(${val.join(", ")})` : val}\n`
    }
}
