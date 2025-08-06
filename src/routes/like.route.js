import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Router } from "express";
import { getLikedVideos,toggleTweetLike,toggleCommentLike,toggleVideoLike } from "../controllers/like.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/toggle/tweet/:tweetId").post(toggleTweetLike);
router.route("/toggle/comment/:commentId").post(toggleCommentLike);
router.route("/toggle/video/:videoId").post(toggleVideoLike);
router.route("/video").get(getLikedVideos);

export default router;