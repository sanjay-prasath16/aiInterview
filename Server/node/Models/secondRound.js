import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        interview_data: [
            {
                question: String,
                response: String,
                code: String,
                exampleOutput: String,
                userOutput: String,
            },
        ],
        questions_asked: { type: Number, default: 0 },
    },
    { collection: 'Second Round' }
);

const secondRound = mongoose.model('secondRound', candidateSchema);
export default secondRound;