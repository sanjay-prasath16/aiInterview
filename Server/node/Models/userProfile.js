import mongoose from 'mongoose';
const { Schema } = mongoose;

const userProfile = new Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: String,
  profile: String,
  projects: [{
    name: String,
    description: String,
    technologies: [String]
  }],
  experiences: [{
    role: String,
    companyName: String,
    description: String,
    startDate: String,
    endDate: String
  }],
  firstRoundScore: { type: Number, required: true },
  secondRoundScore: { type: Number, required: true }
});

const profile = mongoose.model('userProfile', userProfile);

export default profile;