import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Router } from "express"; 
import { getSubscribedChannels,toggleSubscription,getUserChannelSubscribers } from "../controllers/subscrption.controller.js";

const router = Router();

router.use(verifyJWT);     // Apply verifyJWT middleware to all routes in this file

router
    .route("/channel/:channelId")
    .get(getUserChannelSubscribers)
    .post(toggleSubscription);

router.route("/user/:subscriberId").get(getSubscribedChannels);

export default router;