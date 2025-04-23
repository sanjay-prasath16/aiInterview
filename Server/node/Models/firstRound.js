import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    interviewDate: { type: Date, default: Date.now },
    questions_asked: { type: Number, default: 0 },
    interview_data: [
      {
        question: { type: String, required: false },
        response: { type: String, required: false },
      },
    ],
  },
  { collection: 'First Round' }
);

const FirstRound = mongoose.model('FirstRound', candidateSchema);

export default FirstRound;