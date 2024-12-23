import express from "express";
import {registerUser,loginUser,currentUser} from "../controllers/userController.js"
import validateTokenHandler from "../middleware/validateTokenHandler.js";
const router=express.Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.get("/current",validateTokenHandler,currentUser);

export default router