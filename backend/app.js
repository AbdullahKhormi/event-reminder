const expores = require('express');
const app = expores()
const port = 5000

app.get("/", (req,res)=>{
    res.send("Server Running")
})
app.listen(port,()=>{
    console.log('server running on port',port)
})