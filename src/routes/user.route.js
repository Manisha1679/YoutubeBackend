import { Router } from "express";
import { changeCurrentPassword, 
         getCurrentUser, 
         getUserChannelProfile, 
         getUserWatchHistory, 
         updateAccountDetails, 
         updateUserAvatar, 
         updateUserCoverImage, 
         userLogin, 
         userLogout, 
         userRegister
        } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { refreshAccessToken } from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
]),
    userRegister
);

router.route("/login").post(userLogin);

//secured routes
router.route("/logout").post(verifyJWT,userLogout);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT,changeCurrentPassword);
router.route("/current-user").get(verifyJWT,getCurrentUser);
router.route("/update-account").patch(verifyJWT,updateAccountDetails);  //use patch only otherwise all the data will be updated

router.route("/update-avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar);
router.route("/update-cover-image").patch(verifyJWT,upload.single("coverImage"),updateUserCoverImage);

router.route("/channel/:username").get(verifyJWT,getUserChannelProfile);  //since we got the username from req.params
router.route("/history").get(verifyJWT,getUserWatchHistory);

export default router;