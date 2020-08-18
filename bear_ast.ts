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

function parseLine(tokens : string[]) : FunCall {
    console.log('INPU', tokens);
    let i = 0;
    let myFunCall;
    let parOpen = 0;
    let tokenBuffer = [];
    while (i < tokens.length) {
        
        let currentToken = tokens[i];
        console.log(currentToken, parOpen, tokenBuffer);
        if (parOpen == 0) {
            if (i == 0) {
                myFunCall = new FunCall(currentToken);
            } else {
                if (currentToken == '(') {
                    parOpen++;
                } else if (currentToken == ')') {

                } else if (isNaN(parseInt(currentToken))) {
                    myFunCall.argList.push(new Ref(currentToken));
                } else {
                    myFunCall.argList.push(new Const(currentToken));
                }
            }
        } else {
            tokenBuffer.push(currentToken);
            if (currentToken == ')') {
                parOpen--;
                myFunCall.argList.push(parseLine(tokenBuffer));
                tokenBuffer = [];
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
        this.body.split(/\n+/g).forEach(ln => {
            let tokens : string[] = ln.split(',');
            this.ast.progItemList.push(parseLine(tokens))
        });
    }

    getAst() : Program {
        return this.ast;
    }

}

let pr = new ProgFile('prog2.br');
console.log(JSON.stringify(pr.getAst(), null, 2));
