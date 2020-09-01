import { throws } from "assert";
import { type } from "os";
import { Interface } from "readline";
let fs = require('fs');

let coreFunList = {
    '+' : (scope : Scope, argList : IEvaluable[]) => {
        let retVal = 0;
        argList.forEach(arg => retVal += parseInt(arg.eval(scope)));
        return '' + retVal;
    },

    'set' : (scope : Scope, argList : IEvaluable[]) => {
        let varRef = <Ref> argList[0];
        let varValue = argList[1];
        scope.setVal(varRef.getName(), varValue );
    },

    'if' : (scope : Scope, argList : IEvaluable[]) => {
        if (argList[0].eval(scope) == 'TRUE') {
            return argList[1].eval(scope);
        } else {
            return argList[2].eval(scope);
        }
    }
}


interface IEvaluable {
    type : string;
    eval(scope : Scope) : string;
}

class FunCall implements IEvaluable {
    public functionName : string;
    public argList : IEvaluable[];
    public type = 'funCall';

    constructor(functionName : string) {
        this.functionName = functionName;
        this.argList = [];
    }

    public eval(thisScope : Scope) : string {
        if (coreFunList[this.functionName]) {
            return coreFunList[this.functionName](thisScope, this.argList)
        } else {
            throw('I dont know this function: ' + this.functionName);
        }
    }
}

class Const implements IEvaluable {
    public type = 'const';
    public value : string;

    constructor(value : string) {
        this.value = value;
    }

    public eval(thisScope : Scope) : string {
        return this.value;
    }    
}

class Ref implements IEvaluable {
    public type = 'ref';
    public name : string;

    constructor(name : string) {
        this.name = name;
    }

    public eval(thisScope : Scope) : string {
        return thisScope.getVal(this.name);
    }
    
    public getName() : string {
        return this.name;
    }
}

class Scope {
    private var;

    constructor() {
        this.var = {};
    }

    public setVal(name : string, val : IEvaluable) {
        this.var[name] = val.eval(this);
        // console.log('scope: ', this);
    }

    public getVal(name : string) {
        return this.var[name];
    }
}

export class Program implements IEvaluable {
    public type = 'program';
    public progItemList : IEvaluable[] = [];
    private body : string;
    private scope : Scope;

    public constructor(body : string) {
        this.scope = new Scope();
        this.body = body;
        this.body.split(/\n+/g).forEach(ln => {
            let tokens : string[] = ln.split(',');
            this.progItemList.push(parseLine(tokens))
        });
    }


    public eval(thisScope : Scope) : string {
        this.progItemList.forEach(progLine => {
            console.log('> ', progLine.eval(this.scope));
        });
        return 'done';
    }    

}

function parseLine(tokens : string[]) : FunCall {
    // console.log('INPUT', tokens);
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

        // console.log(currentToken, parOpen, tokenBuffer);

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

    getProgram() : Program {
        return this.ast;
    }
}
