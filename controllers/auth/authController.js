import User from '../../models/user/userModel.js';
import { forgotPasswordPinTemplate } from '../../templates/forgetPasswordEmailTemplate.mjml.js';
import { passwordChangedTemplate } from '../../templates/passwordChangedEmailTemplate.mjml.js';
import { verifyEmailTemplate } from '../../templates/verifyEmail.mjml.js';
import { sendEmail } from '../../utils/sendEmail.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';




export const registerUser = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const pin = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await User.create({
      name,
      email,
      username,
      password: hashed,
      verificationPin: pin,
      pinExpiry: Date.now() + 24 * 60 * 60 * 1000,
    });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    const emailHTML = verifyEmailTemplate(name, pin);

    await sendEmail(email, 'Your Email Verification Code', emailHTML);

    res
      .cookie('verifyToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax', 
        maxAge: 24 * 60 * 60 * 1000, 
      })
      .status(201)
      .json({
        message: 'User registered. Check your email for the verification PIN.',
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during signup' });
  }
};

export const verifyPin = async (req, res) => {
  try {
    const token = req.cookies.verifyToken;

    if (!token) {
      return res.status(401).json({ message: 'Session expired.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (user.verified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    const { pin } = req.body;

    if (!pin || pin.length !== 6) {
      return res.status(400).json({ message: 'Please enter a valid 6-digit PIN' });
    }

    if (user.verificationPin !== pin) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    if (user.pinExpiry < Date.now()) {
      return res.status(400).json({ message: 'Verification code has expired' });
    }

    user.verified = true;
    user.verificationPin = null;
    user.pinExpiry = null;
    await user.save();

    res.clearCookie('verifyToken');

    return res.status(200).json({ message: 'Email verified successfully!' });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: 'Invalid or expired verification session' });
  }
};

// Resend Verification PIN

export const resendVerificationPin = async (req, res) => {
  try {
    const token = req.cookies.verifyToken;

    if (!token) {
      return res.status(440).json({
        message: 'Session expired.',
        code: 'SESSION_EXPIRED',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.verified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    const newPin = Math.floor(100000 + Math.random() * 900000).toString();

    user.verificationPin = newPin;
    user.pinExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save();

    const emailContent = verifyEmailTemplate(user.name, newPin);
    await sendEmail(user.email, 'Your New Email Verification Code', emailContent);


    res.status(200).json({ message: 'A new verification PIN has been sent to your email.' });
  } catch (err) {
    console.error(err);

    if (err.name === 'TokenExpiredError') {
      return res.status(440).json({
        message: 'Session expired.',
        code: 'SESSION_EXPIRED',
      });
    }

    res.status(400).json({ message: 'Invalid verification session.' });
  }
};

// Resend Verification PIN using EMAIL

export const resendPinByEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'No user found with that email.' });
    }

    if (user.verified) {
      return res.status(400).json({ message: 'Email is already verified.' });
    }

    // Generate new PIN
    const newPin = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationPin = newPin;
    user.pinExpiry = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.cookie('verifyToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Send email with new PIN
    const emailContent = verifyEmailTemplate(user.name, newPin);
    await sendEmail(user.email, 'Your Verification Code', emailContent);

    res.status(200).json({ message: 'A new verification PIN has been sent to your email.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during resend.' });
  }
};


// Forget Password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No user found with that email.' });
    }

    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPin = pin;
    user.resetPinExpiry = Date.now() + 2 * 60 * 60 * 1000; // 2 hours
    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.cookie('resetToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 2 * 60 * 60 * 1000 // 2 hours
    });

    const emailHTML = forgotPasswordPinTemplate(user.name, pin);
    await sendEmail(user.email, 'Your Password Reset Code', emailHTML);

    res.status(200).json({
      message: 'Password reset PIN has been sent to your email.',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error while sending reset PIN.' });
  }
};



// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const token = req.cookies.resetToken;

    if (!token) {
      return res.status(440).json({ message: 'Session expired.', code: 'RESET_SESSION_EXPIRED' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const { pin, newPassword } = req.body;

    if (!pin || !newPassword) {
      return res.status(400).json({ message: 'PIN and new password are required.' });
    }

    if (user.resetPin !== pin) {
      return res.status(400).json({ message: 'Invalid PIN.' });
    }

    if (user.resetPinExpiry < Date.now()) {
      return res.status(400).json({ message: 'PIN has expired. Please request a new one.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    user.resetPin = null;
    user.resetPinExpiry = null;
    await user.save();

    res.clearCookie('resetToken');

    const confirmationHTML = passwordChangedTemplate(user.name);
    await sendEmail(user.email, 'Your Password Was Changed', confirmationHTML);

    res.status(200).json({ message: 'Password has been reset successfully.' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid or expired reset session.' });
  }
};




// Login by Username or Email
export const loginUser = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
      return res.status(400).json({ message: 'Username/email and password are required.' });
    }

    const user = await User.findOne({
      $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }]
    });

    if (!user) {
      return res.status(404).json({ message: 'Invalid credentials.' });
    }

    if (!user.verified) {
      return res.status(403).json({ message: 'Please verify your email before logging in.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during login.' });
  }
};
