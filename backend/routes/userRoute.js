import express from "express";
import {registerUser,loginUser,currentUser,getAllUsers} from "../controllers/userController.js"
import validateTokenHandler from "../middleware/validateTokenHandler.js";
const router=express.Router();

router.post("/user/register",registerUser)

router.post("/user/login",loginUser)

router.get("/user/current",validateTokenHandler,currentUser);

router.get("/user",getAllUsers);

export default router