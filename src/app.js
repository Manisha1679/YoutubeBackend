import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";

const app = express();
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,

}));

app.use(express.json({limit:"16kb"}))  //when data comes from form(now this is used instaed of body-parser)
app.use(express.urlencoded({extended:true,limit:"16kb"})) //when data comes from url(from search in the browser)
app.use(express.static("public"));
app.use(cookieParser());
app.use(morgan("dev")); //HTTP request logger middleware for node.js 

//import routes
import userRouter from "./routes/user.route.js";
import commentRouter from "./routes/comment.route.js";
import tweetRouter from "./routes/tweet.route.js";
import videoRouter from "./routes/video.route.js";
import playlistRouter from "./routes/playlist.route.js";
import healthcheckRouter from "./routes/healthcheck.route.js";
import subscriptionRouter from "./routes/subscription.route.js";
import likeRouter from "./routes/like.route.js";
import dashboardRouter from "./routes/dashboard.route.js";

//declaring the routes
app.use("/api/v1/users", userRouter); //When user will hit the route "/api/v1/users" the control will be passed to userRoute
//The url will be "http://localhost:8080/api/v1/users" the it will go to userRoute method,then there it will become :"http://localhost:8000/api/v1/users/login or http://localhost:8000/api/v1/users/register"
app.use("/api/v1/comment",commentRouter);
app.use("/api/v1/tweet",tweetRouter);
app.use("/api/v1/video",videoRouter);
app.use("/api/v1/playlist",playlistRouter);
app.use("/api/v1/healthcheck",healthcheckRouter);
app.use("/api/v1/subscriptions",subscriptionRouter);
app.use("/api/v1/likes",likeRouter);
app.use("/api/v1/dashboard",dashboardRouter);

export {app};