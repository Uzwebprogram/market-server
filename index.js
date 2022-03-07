const express = require("express")
const path = require("path")
const app = express()
const port = process.env.PORT || 9000
const cors = require("cors")
const { read , write } = require("./lib/FS")

app.use(express.json())
app.use(cors())
const options = {
    'Access-Control-Allow-Origin': '*',
    "Content-Type" : "application/json"
}

app.get("/" , (req , res) =>{
    res.writeHead(200 , options)
    res.end(JSON.stringify(read(path.resolve("./model/markets.json"))))
})
app.get("/:id" , (req, res) =>{
    const { id } = req.params
    const marketFilter = read(path.resolve("./model/markets.json")).find(e => e.id == id)
    const products =  read(path.resolve("./model/product.json")).filter(e => e.marketId == id)
      if (!marketFilter) {
                res.writeHead(400, options)
                return res.end(JSON.stringify({message: "market does not exist"}))
            }
    const fullMarket = {
        id : marketFilter.id,
        title : marketFilter.title,
        Img : marketFilter.Img,
        description : marketFilter.description,
        data  : marketFilter.data,
        products : products
    }
    
    res.writeHead(200, options);
    res.end(JSON.stringify(fullMarket))

})
app.post("/newMarkets", (req , res) =>{
    const { title , description , data , Img } = req.body
    
    const MarketDate = read(path.resolve("./model/markets.json"))

    MarketDate.push({id : MarketDate.length + 1 , title , description , Img, data })

    write(path.resolve('./model/markets.json'), MarketDate)

    res.send("market add")
})

app.post("/newProduct", (req , res) =>{
    const { product , sum , description , Img , marketId } = req.body
    
    const ProductDate = read(path.resolve("./model/product.json"))

    ProductDate.push({id : ProductDate.length + 1 , product , sum, description , Img , marketId})

    write(path.resolve('./model/product.json'), ProductDate)

    res.send("product add")
})


app.put('/editMarket', (req, res) => {
    const { id, title , description , data , Img } = req.body

    const arr = read(path.resolve('./model/markets.json'))

    const found = arr.findIndex(e => e.id == id)
    const find = arr.find(e => e.id == id)

    find.title = title ? title : find.title
    find.description = description ? description : find.description
    find.Img = Img ? Img : find.Img
    find.data = data ? data : find.data
    arr.splice(found, 1, find)

    write(path.resolve('./model/markets.json'), arr)
    
    res.send("OK")
})

app.put('/editProduct', (req, res) => {
    const {product , sum , description , Img , marketId , id} = req.body

    const arr = read(path.resolve('./model/product.json'))

    const found = arr.findIndex(e => e.id == id)
    const find = arr.find(e => e.marketId == marketId)

    find.product = product ? product : find.product
    find.description = description ? description : find.description
    find.Img = Img ? Img : find.Img
    find.sum = sum ? sum : find.sum
    find.marketId = marketId ? marketId : find.marketId
    find.id = id ? id : find.id
    arr.splice(found, 1, find)

    write(path.resolve('./model/product.json'), arr)
    
    res.send("OK")
})

app.delete('/deletMarket', (req, res) => {
    const { id } = req.body

    const arr = read(path.resolve('./model/markets.json'))

    const found = arr.findIndex(e => e.id == id)

    arr.splice(found, 1)

    write(path.resolve('./model/markets.json'), arr)

    res.send("OK")
})
app.delete(`/deletMarket`, (req, res) => {
    const { id } = req.body

    const arr = read(path.resolve('./model/markets.json'))

    const found = arr.findIndex(e => e.id == id)

    arr.splice(found, 1)

    write(path.resolve('./model/markets.json'), arr)

    res.send("OK")
})
app.delete('/deletProduct', (req, res) => {
    const { id } = req.body

    const arr = read(path.resolve('./model/product.json'))

    const found = arr.findIndex(e => e.id == id)

    arr.splice(found, 1)

    write(path.resolve('./model/product.json'), arr)
    res.send("OK")
})
app.listen(port ,console.log(port))