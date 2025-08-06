//If requestHandler is async, it returns a promise.
//If it throws an error, .catch(next) passes the error to Express.
//Move to next middleware -> next()
//Pass the error to Express, and let the error-handling middleware deal with it -> next(error)
//promise version
const asyncHandler=(requestHandler)=>{
   return (req,res,next)=>
       {
        Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err));
}}

export {asyncHandler}

//async/await version
/*
const asyncHandler=(fn)=>{
  return  async (req,res,next)=>{
          try{
          await fn(req,res,next);
          }catch(err){
             res.status(err.code || 500).json({
                success:false,
                message:err.message,
            })
          }
    }
}
export {asyncHandler}
*/