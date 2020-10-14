import { throws } from "assert";
///// hello
var fs = require('fs');

class AppClass {
    path: string;
    body: string;
    words: string[];
    //lines: string[];
    wc: object;

    constructor(path: string) {
        this.path = path;
        this.body = fs.readFileSync(this.path, 'utf8');
        this.words = this.body.split(/ +|\n+/g);

        let wc = {};
        this.words.forEach(word => {
            if (wc[word]) {
                wc[word]++;
            } else {
                wc[word] = 1;
            }
        });
        this.wc = wc;
    }

    
}


//let myFile = new Fl(process.argv[2]);
let dir = process.argv[2];
let files = fs.readdirSync(dir)
                .filter(fname => fname.match(/\.cls$/) )
                .map(fname => dir + '/' + fname )
                ;

let appClassList = files.map(fname => new AppClass(fname));
// console.log(appClassList[0].path);
// console.log(appClassList[0].wc);

let bigWc = {};
appClassList.forEach(appClass => {
    Object.keys(appClass.wc).forEach(word => {
        if (!bigWc[word]) {
            bigWc[word] = appClass.wc[word];
        } else {
            bigWc[word] = bigWc[word] + appClass.wc[word];
        }
    })
});

console.log(
    Object.keys(bigWc).filter(el => {
        return bigWc[el] > 20;
    })

);

