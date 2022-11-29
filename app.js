const express = require('express');
const app= express();
const fs= require('fs');
const port=3000

app.get('/',(req,res)=>{
    res.send('hello world');
})

app.get('/comments',(req,res)=>{
    res.send('sending data');
})
app.listen(port,()=>console.log("server is running on port" + port));
