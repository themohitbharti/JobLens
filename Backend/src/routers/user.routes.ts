import { Router } from "express";
import { 
    registerUser,
    loginUser, 
    logoutUser , 
    refreshAccessToken , 
    verifyOTP , 
    changePassword , 
    forgotPassword , 
    resetPassword, 
    getResumeStats,
    getLinkedinStats,
    getCombinedStats,} from "../controllers/user.controllers";
import {verifyToken} from '../middlewares/verifyToken.middleware'
import { validateInput } from "../middlewares/isValidInput.middleware";

const router = Router();

router.post('/register', validateInput ,registerUser);

router.post('/verify-otp', validateInput ,verifyOTP);

router.post('/login', loginUser);

router.post('/logout',verifyToken ,logoutUser);

router.post('/regenerate-tokens' ,refreshAccessToken);

router.post('/change-password' , verifyToken ,changePassword);

router.post('/forgot-password' ,forgotPassword);

router.post('/reset-password' , resetPassword)

// Stats routes
router.get("/resume-stats", verifyToken, getResumeStats);              // Resume stats only
router.get("/linkedin-stats", verifyToken, getLinkedinStats); // LinkedIn stats only
router.get("/combined-stats", verifyToken, getCombinedStats); // Both stats combined

export default router