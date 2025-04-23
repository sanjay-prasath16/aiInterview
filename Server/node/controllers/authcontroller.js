import FirstRound from '../Models/firstRound.js';
import secondRound from '../Models/secondRound.js';
import dotenv from 'dotenv';
import User from '../Models/user.js';
import { hashPassword, comparePassword } from '../helpers/passwordEncrypt.js';
import jwt from 'jsonwebtoken';
import express from 'express';
import cookieParser from 'cookie-parser';
import profile from '../Models/userProfile.js';

const app = express();

app.use(cookieParser());

dotenv.config();

const test = () => {
  console.log("testing backend");
}

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!username) {
      return res.json({
        err: 'enter a name to proceed'
      })
    };
    if (!email) {
      return res.json({
        err: 'enter a email to proceed'
      })
    } else if (!emailRegex.test(email)) {
      return res.json({
        err: 'enter email in the format of abc@gmail.com'
      })
    }
    if (!password) {
      return res.json({
        err: 'enter a password to proceed'
      })
    } else if (password.length < 6) {
      return res.json({
        err: 'password should be at least 6 characters'
      })
    };
    const exist = await User.findOne({ email });
    if (exist) {
      return res.json({
        err: 'Entered email is already registered with us!!'
      })
    };

    const hashedPassword = await hashPassword(password)
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    return res.json(user)
  } catch (err) {
    console.log(err);
  }
}

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.json({
        err: 'Sorry, No user found with the entered User name'
      })
    }
    const match = await comparePassword(password, user.password);
    if (!password) {
      return res.json({
        err: 'Please enter the password'
      })
    }
    if (match) {
      jwt.sign({ email: user.email, id: user._id, name: user.username }, process.env.JWT_SECRET, { expiresIn: '4y' }, (err, token) => {
        if (err) {
          console.error("JWT Sign Error:", err);
          return res.status(500).json({ err: "Token generation failed" });
        }
        res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'lax', path: '/', maxAge: 4 * 365 * 24 * 60 * 60 * 1000 });
        res.json({ user, role: user.role, token });
      })
    }
    if (!match) {
      return res.json({
        err: 'You have entered a wrong Password.Please Try Again'
      })
    }
  } catch (err) {
    console.log(err)
  }
};

const storeInterviewData = async (req, res) => {
  const { candidate_name, question, answer } = req.body;
  console.log(candidate_name, question, answer);

  try {
    const candidate = await FirstRound.findOne({ name: candidate_name }); // Use a different variable name

    if (!candidate) {
      const newCandidate = new FirstRound({
        name: candidate_name,
        interview_data: [{ question, response: answer }],
        questions_asked: 1,
      });
      await newCandidate.save();
      return res.status(200).json({ message: 'Interview data saved successfully', candidate: newCandidate });
    } else {
      const updatedCandidate = await FirstRound.findOneAndUpdate(
        { name: candidate_name },
        {
          $push: {
            interview_data: {
              question: question,
              response: answer
            }
          },
          $inc: { questions_asked: 1 },
        },
        { new: true }
      );

      return res.status(200).json({ message: 'Interview data updated successfully', candidate: updatedCandidate });
    }
  } catch (error) {
    console.error('Error saving interview data:', error);
    res.status(500).json({ message: 'Error saving interview data' });
  }
};

const storeTechnicalData = async (req, res) => {
  const { question, code, exampleOutput, userOutput } = req.body;

  try {
    const candidate = await secondRound.findOne({ name: "default_candidate" });

    if (!candidate) {
      const newCandidate = new secondRound({
        name: "sanjay",
        interview_data: [{ question, code, exampleOutput, userOutput }],
        questions_asked: 1,
      });
      await newCandidate.save();
      return res.status(200).json({ message: 'Interview data saved successfully', candidate: newCandidate });
    } else {
      const updatedCandidate = await secondRound.findOneAndUpdate(
        { name: "sanjay" },
        {
          $push: {
            interview_data: {
              question,
              code,
              exampleOutput,
              userOutput
            }
          },
          $inc: { questions_asked: 1 },
        },
        { new: true }
      );

      return res.status(200).json({ message: 'Interview data updated successfully', candidate: updatedCandidate });
    }
  } catch (error) {
    console.error('Error saving interview data:', error);
    res.status(500).json({ message: 'Error saving interview data' });
  }
};

const getProfile = (req, res) => {
  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
      if (err) {
        res.clearCookie('token')
        return res.status(401).json({ err: 'You have been logged out for some security purpose.Kindly loginin again in order to book your food' });
      }
      res.json(user)
    })
  } else {
    res.json(null)
  }
};

const userProfile = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const updatedData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
      profile: req.body.profile,
      projects: req.body.projects,
      experiences: req.body.experiences
    };

    const updatedUser = await profile.findByIdAndUpdate(
      userId,
      { $set: updatedData },
      { new: true }
    );

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
}

const logoutUser = async (req, res) => {
  console.log("entering logout function");
  res.clearCookie('token');
  res.json({ message: 'Logged out Successfully' });
};

export default {
  test,
  registerUser,
  loginUser,
  getProfile,
  storeInterviewData,
  storeTechnicalData,
  userProfile,
  logoutUser,
};