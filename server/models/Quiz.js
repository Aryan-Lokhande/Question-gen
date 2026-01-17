import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["MCQ", "TRUE/FALSE"],
    },
    difficulty: {
      type: String,
      required: true,
      enum: ["Easy", "Medium", "Hard"],
    },
    question: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      required: function () {
        return this.type === "MCQ";
      },
    },
    correctAnswer: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const quizSchema = new mongoose.Schema({
  roomName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: "",
  },
  category: {
    type: [String],
    required: true,
    enum: [
      "Tech",
      "Science",
      "Language-learning",
      "Professional",
      "Career-Development",
      "General",
      "Study-Room",
      "Hobbies",
    ],
  },
  questions: {
    type: [questionSchema],
    required: true,
    validate: {
      validator: function (questions) {
        return questions.length > 0;
      },
      message: "At least one question is required",
    },
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

quizSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

quizSchema.index({ roomName: 1 });
quizSchema.index({ createdAt: -1 });

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;
