import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.model.js";
import { Like } from "../models/like.model.js";


const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const userId = req.user?._id;

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const commentsAggregate = Comment.aggregate([
    {
      $match: {
        video: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "comment",
        as: "likes",
      },
    },
    {
      $addFields: {
        likesCount: {
          $size: "$likes",
        },

        owner: {
          $first: "$owner",
        },
        isLiked:{
            $cond:{
                if:{ $in : [userId,"$likes.likedBy"]},
                then:true,
                else:false
            }
        }
      }
    },
    {
        $sort:{
            createdAt:-1
        }
    },
    {
        $project:{
            content:1,
            createdAt:1,
            likesCount:1,
            owner:{
                fullName:1,
                username:1,
                "avatar.url":1,
            },
            isLiked:1
        }
    }
  ]);

  const options = {
    page:parseInt(page,10),
    limit:parseInt(limit,10)
  }

const comments = await Comment.aggregatePaginate(   //in the comments model we have used the plugin mongoose-aggregate-paginate,hence can use this aggregatepaginate here.
      commentsAggregate, 
      options
);

return res
         .status(200)
         .json(
            new ApiResponse(200,comments,"All comments fetched successfully")
         )

});

const addComment = asyncHandler(async(req,res)=>{
const {videoId} = req.params;
const {content} = req.body;

if(!content){
    throw new ApiError(400,"Content is required");
}
const video = await Video.findById(videoId);
if(!video){
    throw new ApiError(404,"Video not found");
}

const comment = await Comment.create({
    content,
    owner:req.user?._id,
    video:videoId
});
if(!comment){
    throw new ApiError(500,"Failed to add comment,please try again");
}

return res
       .status(200)
       .json(
        new ApiResponse(201,comment,"Comment added successfully")
       )
});

const updateComment = asyncHandler(async(req,res)=>{
    const {commentId }=req.params;
    const {content}=req.body;
    if(!content){
        throw new ApiError(400,"Content is required")
    }

    const comment = await Comment.findById(commentId);
    if(!comment){
        throw new ApiError(404,"Comment not found")
    }

    if(comment?.owner.toString() !== req.user?._id.toString()){
        throw new ApiError(403,"Only comment owner can edit the comment")
    }

    const updatedComment = await Comment.findByIdAndUpdate(
        comment?._id,
        {
            $set:{
                content
            }
        },
        {new:true}
    );
   if(!updatedComment){
    throw new ApiError(500,"Failed to update the comment,please try again")
   }

 return res
        .status(200)
        .json(
            new ApiResponse(200,updatedComment,"Comment updated successfully")
        );
});

const deleteComment = asyncHandler(async(req,res)=>{
const {commentId} = req.params;

const comment= await Comment.findById(commentId);
    if(!comment){
        throw new ApiError(404,"Comment not found")
}

    if(comment?.owner !== req.user?._id){
        throw new ApiError(403,"Only comment owner can delete their comment")
}

await Comment.findByIdAndDelete(commentId);

await Like.deleteMany({
    comment:commentId,
    likedBy:req.user
});

return res
       .status(200)
       .json(
        new ApiResponse(200,{commentId},"Comment deleted successfully")
       )
});

export { 
    getVideoComments ,
    addComment,
    updateComment,
    deleteComment
};
