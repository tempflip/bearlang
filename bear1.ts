import { throws } from "assert";
import { type } from "os";
var fs = require('fs');



class TreeItem {
    fun : string;
    args : Arg[];
}

class Arg {
    type : string;
    val : string;
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
            args : this.args.map(argMapper)
        }
    }
}

let argMapper  = (arg) => {
    let val = arg;
    let type = 'const';

    if (isNaN(arg)) {
        type = 'var';
    }

    return {
        type : type,
        val : val
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

    vars = {x : "7"}

    eval() : void {
        this.tree.forEach(ln => {
            // console.log(ln);
            if (this.funs[ln.fun]) {
                
                let args = ln.args.map(el => this.argEval(el));

                let retVal = this.funs[ln.fun](args);
                console.log(retVal);
            } else {
                console.log('### Cant fint the function: ', ln.fun);
            }
        });
    }

    argEval(arg : Arg) : string {
        let retVal;
        switch (arg.type) {
            case 'const':
                retVal = arg.val;
                break;
            case 'var':
                if (!this.vars[arg.val]) console.log('### Cant fint the variable: ', arg.val);
                retVal = this.vars[arg.val];
                break;
        }

        return retVal;
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
console.log(JSON.stringify(progTree, null, 2));
let runner = new Runner(progTree);
runner.eval()



