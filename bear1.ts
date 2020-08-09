import { throws } from "assert";
var fs = require('fs');

class TreeItem {
    fun : string;
    args : string[]
}

class Line {
    tree : object;
    fun : string;
    args : string[]
    constructor(input: string) {
        let tokens = input.split(',');
        this.fun = tokens.shift();
        this.args = [];
        tokens.forEach(el => this.args.push(el));
        // console.log(this.fun, this.args);
    }

    getTree() : TreeItem {
        return {
            fun : this.fun,
            args : this.args
        }
    }
}

class Runner {
    tree : TreeItem[];

    constructor(tree : TreeItem[]) {
        this.tree = tree;
    }

    funs = {
        '+' : (args => {
            let x = 0;
            args.forEach(el => x += parseInt(el));
            return x;
        })
    }

    eval() : void {
        this.tree.forEach(ln => {
            console.log(ln);
            if (this.funs[ln.fun]) {
                let retVal = this.funs[ln.fun](ln.args);
                console.log(retVal);
            } else {
                console.log('### Cant fint the function: ', ln.fun);
            }
        });
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

    getTree() : TreeItem[] {
        let tree = [];
        this.lineList.forEach(el => tree.push(el.getTree()));
        return tree;
    }
}

// let code = '+,1,5'
// let l = new Line(code);

// console.log(l.getTree());

let pr = new ProgFile('prog1.br');
let progTree = pr.getTree();
let runner = new Runner(progTree);
runner.eval()



