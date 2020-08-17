import { throws } from "assert";
import { type } from "os";
import { Interface } from "readline";
var fs = require('fs');

interface IEvaluable {
    type : string;
    eval() : string;
}

class FunCall implements IEvaluable {
    public functionName : string;
    public argList : IEvaluable[];
    public type = 'funCall';

    constructor(functionName : string) {
        this.functionName = functionName;
        this.argList = [];
    }

    public eval() : string {
        return 'in a funcall';
    }
}

class Const implements IEvaluable {
    public type = 'const';
    public  value : string;

    constructor(value : string) {
        this.value = value;
    }

    public eval() : string {
        return this.value;
    }    
}

class Ref implements IEvaluable {
    public type = 'ref';
    public name : string;

    constructor(name : string) {
        this.name = name;
    }

    public eval() : string {
        return 'im a ref';
    }    
}

class Program implements IEvaluable {
    public type = 'program';
    public progItemList : IEvaluable[];

    public constructor() {
        this.progItemList = [];
    }

    public eval() : string {
        return 'im a program';
    }    

}

function parseLine(progLine) : FunCall {

    let tokens : string[] = progLine.split(',');
    
    let i = 0;
    let myFunCall;
    while (i < tokens.length) {
        
        let currentToken = tokens[i];
        if (i == 0) {
            myFunCall = new FunCall(currentToken);
        } else {
            if (isNaN(parseInt(currentToken))) {
                myFunCall.argList.push(new Ref(currentToken));
            } else {
                myFunCall.argList.push(new Const(currentToken));
            }
        }
        i++
    }
    return myFunCall;
}

class ProgFile {
    body : string;
    ast : Program;
    constructor(fname: string) {
        this.body = fs.readFileSync(fname, 'utf8');
        this.ast = new Program();
        this.body.split(/\n+/g).forEach(ln => this.ast.progItemList.push(parseLine(ln)));
    }

    getAst() : Program {
        return this.ast;
    }

}

let pr = new ProgFile('prog1.br');
console.log(JSON.stringify(pr.getAst(), null, 2));
