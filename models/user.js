const { string } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    //we can create any no. of feilds like email,name..
    email: {
        type : String,
        require: true
    }
});

userSchema.plugin(passportLocalMongoose);
//er're using passportlocalmongoose as plugin bcz,
// it automatically implements username hashing,salting and hash password 
// and so that we dont need to build it from scratch and it also adds some methods
module.exports = mongoose.model('User',userSchema);
