import mongoose, { mongo } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
    {
       username:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true,
        index:true
       },
        email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true,
       },
        fullName:{
        type:String,
        required:true,
        trim:true,
        index:true
       },
       avatar:{
        type: {
            public_id:String,
            url:String             //cloudinary url
        }, 
        required:true
       },
       coverImage:{
         type: {
            public_id:String,
            url:String             //cloudinary url
        }
       },
       watchHistory: [
         {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video"
         } 
    ],
       password:{
        type:String,
        required:[true,"Password is required"]
       },
       refreshToken:{
        type:String,
        
       }
    },
    {
        timestamps:true
    }
);

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next(); //if password is not changed then go to next middleware

    this.password= await bcrypt.hash(this.password,10); //If a password is changed,hash it and store in password field in the userSchema
    next();
})

userSchema.methods.isPasswordCorrect = async function (password) {  //compares the user entered password with the hashed password stored in db
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccesToken = function(){
   return jwt.sign(
        {
            _id:this._id,
            username:this.username,
            email:this.email,
            fullName:this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
   return jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User",userSchema);



//we will not store the access token in db,will store refresh token instead