const fs = require('fs');
const http = require('http')
const url = require('url')
const slugify = require('slugify')
const replaceTemplate = require('./modules/replaceTemplate.js')

////////////////////////////////////////////////////////
// Files

// Blocking, synchronous process
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8')
// console.log(textIn)
// const textOut = `Lorem Ipsome: ${textIn}.\nCreate on ${Date.now()}`
// fs.writeFileSync('./txt/output.txt', textOut)
// console.log('File written')

// Non-blocking, synchronous process
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2)
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//             console.log(data3)
//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`,'utf-8', err => {
//                 console.log('your file has been written')
//             })
//         })
//     })
// })
// console.log('Will read file!')

////////////////////////////////////////////////////////
// Server

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf8')
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf8')
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf8')

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf8' )
const dataObj = JSON.parse(data)

// console.log(slugify('Fresh Avo',{lower: true, replacement:'-'}))

const slugs = dataObj.map(el => slugify(el.productName, {lower: true}))
// console.log(slugs)

const server = http.createServer((req, res) => {
    // console.log(req.url)
    // const { query, pathname } = url.parse(req.url, true)
    // console.log(query, pathname)

    const { query, pathname } = url.parse(req.url, true)
    // console.log(query.id, pathname)

    // const pathname = req.url;
    // console.log(pathname)

    // Overview page
    if(pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {'Content-Type': 'text/html'})

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el))
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml)

        res.end(output)

    // Product page
    } else if (pathname === '/product') {
        res.writeHead(200, {'Content-Type': 'text/html'})
        const product = dataObj[query.id]
        // console.log(product)
        const output = replaceTemplate(tempProduct, product)
        res.end(output)

    // API
    } else if (pathname === '/api') {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(data);
    } else {
        res.writeHead(404, {
            'content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('<h1>Page Not Found!</h1>')
    }
})

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening on 8000');
})

