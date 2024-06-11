const fs = require("fs");
const http = require("http");
const url = require("url");
//blocking synchronus way
/*
const textin = fs.readFileSync("./txt/input.txt","utf-8");
console.log(textin);

const textout = `This is what we know about avacado : ${textin}`;
fs.writeFileSync("./txt/output.txt",textout);

const finaltext = fs.readFileSync("./txt/output.txt","utf-8");
console.log(`file saved and content in the file is:\n ${finaltext}`);

//non-blocking asynchronus way

fs.readFile("./txt/start.txt","utf-8",(err,data1)=>{
    if(err) return console.log("error ***");
    fs.readFile(`./txt/${data1}.txt`,"utf-8",(err,data2)=>{
        console.log(data2);
        fs.readFile(`./txt/append.txt`,"utf-8",(err,data3)=>{
            console.log(data3);
            fs.writeFile('./txt/final.txt',`${data2}\n${data3}`,'utf-8',err=>{
                console.log("your file is written!");
            });
        });

    });
});
console.log("will read file!");

*/
//SERVER
const replaceTemplate = (temp , product)=>{
    let output = temp.replace(/{%PRODUCTNAME%}/g , product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%PLACE%}/g, product.from);
    output = output.replace(/{%ID%}/g, product.id);
    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g,'not-organic');
    return output;
}
const tempview = fs.readFileSync(`${__dirname}/templates/overview.html`,'utf-8');
const tempcard = fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');
const tempproduct = fs.readFileSync(`${__dirname}/templates/product.html`,'utf-8');
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const dataobj = JSON.parse(data);

const server = http.createServer((req,res)=>{

    
    const {query , pathname } = url.parse(req.url,true);
    
  
    //overview page
   if(pathname === '/' || pathname === '/overview'){
    res.writeHead(200,{'Content-type':'text/html'});
    const cardshtml = dataobj.map(el => replaceTemplate(tempcard ,el)).join('');
    const output = tempview.replace('{%PRODUCT_CARDS%}',cardshtml);
    res.end(output);
   }
   //product page
   else if(pathname === '/product'){
    res.writeHead(200,{'Content-type':'text/html'});
    const product = dataobj[query.id];
    const output = replaceTemplate(tempproduct , product);
    res.end(output);
   }
   //api part
   else if(pathname === '/api'){  
        res.writeHead(200 , {'Content-type':'application/json'});
        res.end(data);
   }
   //not found
   else{
    res.writeHead(404,{
        'COntent-type' : 'text/html',
        'my-own-header':'hello-world'
    });
    res.end("<h1>page not found</h1>");
   }
});

server.listen(8000 , ()=>{
    console.log("server started on port 8000");
});

