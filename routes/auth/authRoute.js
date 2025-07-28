import express from 'express'
import { forgotPassword, loginUser, registerUser, resendPinByEmail, resendVerificationPin, resetPassword, verifyPin } from '../../controllers/auth/authController.js'

const authRouter = express.Router()

authRouter.post("/signup", registerUser)
authRouter.post("/verify-pin", verifyPin)
authRouter.post("/resend-pin", resendVerificationPin)
authRouter.post("/resend-pin-by-email", resendPinByEmail)
authRouter.post("/forget-password", forgotPassword)
authRouter.post("/reset-password", resetPassword)
authRouter.post("/signin", loginUser)



export default authRouter