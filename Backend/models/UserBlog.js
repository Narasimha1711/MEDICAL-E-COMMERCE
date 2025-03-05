const mongoose = require('mongoose')

const UserBlogsSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },

    username: {
        type: String, 
        required: true
    },
    tags : {
        type: String,
        
    }
},
{
    timestamps: true
}) 


const UserBlogModel = mongoose.model("UserBlog", UserBlogsSchema)
module.exports = UserBlogModel