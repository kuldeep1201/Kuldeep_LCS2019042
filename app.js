const express = require('express');
const app= express();
const fs= require('fs');
const port=3000


app.use(express.static('public'));
const postPath = './posts.json'
const commentPath = './comments.json'

const getComment =(id) =>{
    const rawcomments=fs.readFileSync(commentPath);
    comments=
    JSON.parse(rawcomments);
    let data;
    comments.forEach(comment=>{
        if(comment.id==id)
        data = comment;
    })
    return data;
}

const getComments = (ids) =>{
    for(let i=0;i<ids.length;i++)
    {
        var comment=
        getComment(ids[i]);
        console.log(comment);
        if(comment && comment.replies && comment.replies.length>0){
            comment.replies=
            getComments(comment.replies);
        }
        ids[i] = comment;
    }
    return ids;
}

const getPostData = () =>{
    const postData=
    fs.readFileSync(postPath);
    const parsedPostData =
    JSON.parse(postData);
    parsedPostData.forEach(post => {
        post.comments=
        getComments(post.comments);
    });
    console.log(parsedPostData);
    return parsedPostData
}

app.get('/post-data',(req,res)=>{
    getPostData();
    res.send(getPostData());
})

app.get('/',(req,res)=>{
    res.send('hello world');
})

app.get('/comments',(req,res)=>{
    res.send('sending data');
})
app.listen(port,()=>console.log("server is running on port" + port));
