
export function report(source: string, line: number, position: number, width: number=1, message: string=""): void {
    if (process.env.SUPPRESS_NOODLE_ERRORS) return;
    
    const linepos = source.slice(0, position).split("\n").at(-1)?.length ?? 0
    const linecontent = source.split("\n")[line - 1]
    const errorplacelen = line.toString().length+linepos.toString().length

    console.error(`${message}`)
    console.error(`${line}:${linepos} ${linecontent}`)
    console.error(`${" ".repeat(errorplacelen+linepos+2)}${"^".repeat(width)}`)
}