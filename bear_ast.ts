let bear = require('./bearlang.ts'); 

// let pr = new bear.ProgFile('prog2.br');
// console.log(JSON.stringify(pr.getAst(), null, 2));

// let pr1 = new bear.Program('+,1,2,(,+,3,4,),5');
// let pr1 = new bear.Program('set,x,16');

let pr1 = new bear.ProgFile('pr3.br');
console.log('#', pr1.getProgram().eval());



