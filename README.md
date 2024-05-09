# 🍜 `nudl`
A small data language originally made in bun. Also my attempt at making a language purely for data. 
> This is not actually ment to be used in any setting! It was purely a project to test out making a data representation format.

## About
While i was making this, i wanted to make it somewhat similar to (what i knew about) TOML. Upon looking up toml, i found that it did what i wanted to do, was extremely similar, and a lot more thought out. In other words: go use TOML instead!

## Installing
`nudl` can be installed with 
```sh
npm install nudl
```
and then imported as such
```ts
import nudl from "nudl";
```

## Syntax
> Look in the `./examples/` directory.

In essence, the `nudl` format consists of key-value pairs defined by an `=` in between:
```nudl
hello = "world"
spaces between = true
```
> the key of the second pair is parsed as "spaces between", inclusive of the space

It also has support for objects, and nested values:
```nudl
number = 547E-2 # this number has the value 5.47
[object]
    green = 0x00FF00
    [child object]
        id = (152037, "Childofacus Obbajekutus")
```
