const express = require('express');
const app= express();
const fs= require('fs');
const port=3000


app.use(express.static('public'));
app.use(express.json())
const postPath = './posts.json'
const commentPath = './comments.json'


const saveComment=(obj)=>{
    const rawcomments=fs.readFileSync(commentPath);
    let comments=JSON.parse(rawcomments);
    let id=comments.length+1;
    comments.push({id,comment:obj.content,replies:[]});
    if(obj.type=='comment')
    {
        for(let i=0;i<comments.length;i++)
        {
            if(comments[i].id==obj.id){
                comments[i].replies.push(id);
            }
        }
    }
    else{
        const rawposts=fs.readFileSync(postPath);
        let posts=JSON.parse(rawposts);
        for(let i=0;i<posts.length;i++)
        {
            if(posts[i].id==obj.id){
                posts[i].comments.push(id);
            }
        }
        const stringifyData = JSON.stringify(posts)
        fs.writeFileSync(postPath,stringifyData)
    }
    const stringifyData =JSON.stringify(comments)
    fs.writeFileSync(commentPath,stringifyData);
}


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
        var comment=getComment(ids[i]);
        if(comment && comment.replies && comment.replies.length>0){
            comment.replies=getComments(comment.replies);
        }
        ids[i] = comment;
    }
    return ids;
}

const getPostData = () =>{
    const postData=fs.readFileSync(postPath);
    const parsedPostData =
    JSON.parse(postData);
    parsedPostData.forEach(post => {
        post.comments=
        getComments(post.comments);
    });
    return parsedPostData
}

app.get('/post-data',(req,res)=>{
    getPostData();
    res.send(getPostData());
})

app.post('/add-comment',(req,res)=>{
    saveComment(req.body);
    res.send().status(200)
})
app.listen(port,()=>console.log("server is running on port " + port));
