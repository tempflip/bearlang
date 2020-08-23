import { throws } from "assert";
import { type } from "os";
import { Interface } from "readline";
let fs = require('fs');


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

export class Program implements IEvaluable {
    public type = 'program';
    public progItemList : IEvaluable[] = [];
    private body : string;

    public constructor(body : string) {
        this.body = body;
        this.body.split(/\n+/g).forEach(ln => {
            let tokens : string[] = ln.split(',');
            this.progItemList.push(parseLine(tokens))
        });
    }


    public eval() : string {
        return 'im a program';
    }    

}

function parseLine(tokens : string[]) : FunCall {
    console.log('INPUT', tokens);
    let i = 0;
    let myFunCall;
    let parOpen = 0;
    let tokenBuffer = [];

    while (i < tokens.length) {
        
        let currentToken = tokens[i];

        if (currentToken == '(') {
            parOpen++;
        } else if (currentToken == ')') {
            parOpen--;
        }

        console.log(currentToken, parOpen, tokenBuffer);

        if (parOpen == 0) {
            if (i == 0) {
                myFunCall = new FunCall(currentToken);
            } else {
                if (currentToken == ')') {
                    myFunCall.argList.push(parseLine(tokenBuffer));
                    tokenBuffer = [];
                } else if (isNaN(parseInt(currentToken))) {
                    myFunCall.argList.push(new Ref(currentToken));
                } else {
                    myFunCall.argList.push(new Const(currentToken));
                }
            }
        } else {
            if (currentToken != '(' || parOpen != 1) {
                tokenBuffer.push(currentToken);           
            }
        }
        i++
    }

    return myFunCall;
}

export class ProgFile {
    body : string;
    ast : Program;
    constructor(fname: string) {
        this.body = fs.readFileSync(fname, 'utf8');
        this.ast = new Program(this.body);
    }

    getAst() : Program {
        return this.ast;
    }
}
