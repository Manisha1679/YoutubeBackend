import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new mongoose.Schema(
    {
        videoFile:{
             type: {
                url: String,    //cloudinary url
                public_id: String,
            },
            required: true,
        },
         thumbnail:{
             type: {
                url: String,       //cloudinary url
                public_id: String,
            },
            required: true,
        },
         title:{
            type:String,  
            required:true
        },
         description:{
            type:String,  
            required:true
        },
        isPublished:{
            type:Boolean,
            default:true
        },
        owner:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        duration:{
            type:Number, //returned from cludinary
            required:true
        },
        views:{
            type:Number,
            default:0
        }
    },
    {
        timestamps:true
    }
);

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video",videoSchema);