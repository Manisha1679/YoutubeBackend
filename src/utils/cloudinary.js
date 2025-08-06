import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

  // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret:process.env.CLOUDINARY_API_SECRET
    });

    const uploadFileToCloudinary= async (localFilePath)=>{
     try {
        if(!localFilePath) return null;

        //Upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })

        //after file upload is successful
       // console.log("File uploaded successfully on Cloudinary",response.url);
        fs.unlinkSync(localFilePath)
        return response;
        
     } catch (error) {
      //console.error("Cloudinary upload failed:", error); 
        fs.unlinkSync(localFilePath)  //removes the locally saved temporary file as the upload operation got failed
        return null;
     }
    }

    const deleteFileFromCloudinary = async (public_id, resource_type="image") => {
    try {
        if (!public_id) return null;

        //delete file from cloudinary
        const result = await cloudinary.uploader.destroy(public_id, {
            resource_type: `${resource_type}`
        });
    } catch (error) {
        return error;
        console.log("delete on cloudinary failed", error);
    }
};

    export {uploadFileToCloudinary,deleteFileFromCloudinary};


    
  