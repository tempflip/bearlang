let bear = require('./bearlang.ts'); 

let pr = new bear.ProgFile('prog2.br');
console.log(JSON.stringify(pr.getAst(), null, 2));
