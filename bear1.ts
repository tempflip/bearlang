import { throws } from "assert";
var fs = require('fs');

class Line {
    tree : object;
    fun : string;
    args : string[]
    constructor(input: string) {
        let tokens = input.split(',');
        this.fun = tokens.shift();
        this.args = [];
        tokens.forEach(el => this.args.push(el));
        console.log(this.fun, this.args);
    }

    getTree() : Object {
        return {
            fun : this.fun,
            args : this.args
        }
    }
}

class ProgFile {
    body : string;
    lineList : Line[] = [];
    constructor(fname: string) {
        this.body = fs.readFileSync(fname, 'utf8');
        this.body.split(/\n+/g).forEach(ln => {
            this.lineList.push(new Line(ln));
        })
    }

    getTree() : object {
        let tree = [];
        this.lineList.forEach(el => tree.push(el.getTree()));
        return tree;
    }


}

// let code = '+,1,5'
// let l = new Line(code);

// console.log(l.getTree());

let pr = new ProgFile('prog1.br');
console.log(pr.getTree());



