import Quiz from '../models/Quiz.js';

// Save quiz to database
export const saveQuiz = async (req, res) => {
  try {
    const { roomName, title, description, difficulty, questions } = req.body;

    // Validation
    if (!roomName || !title || !difficulty || !questions || questions.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Room name, title, difficulty, and at least one question are required'
      });
    }

    // Check if room name already exists
    const existingQuiz = await Quiz.findOne({ roomName });
    if (existingQuiz) {
      return res.status(400).json({
        success: false,
        error: `Quiz with room name "${roomName}" already exists`
      });
    }

    // Create new quiz
    const quiz = new Quiz({
      roomName,
      title,
      description: description || '',
      difficulty,
      questions,
      totalQuestions: questions.length
    });

    await quiz.save();

    console.log(`✅ Quiz "${roomName}" saved successfully with ${questions.length} questions`);

    res.json({
      success: true,
      message: 'Quiz saved successfully',
      quizId: quiz._id,
      roomName: quiz.roomName,
      totalQuestions: quiz.totalQuestions
    });

  } catch (error) {
    console.error('❌ Error saving quiz:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'A quiz with this room name already exists'
      });
    }

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get all quizzes
export const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find()
      .select('roomName title totalQuestions difficulty createdAt isActive')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: quizzes.length,
      quizzes
    });

  } catch (error) {
    console.error('❌ Error fetching quizzes:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get quiz by room name
export const getQuizByRoomName = async (req, res) => {
  try {
    const { roomName } = req.params;
    const quiz = await Quiz.findOne({ roomName });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: 'Quiz not found'
      });
    }

    res.json({
      success: true,
      quiz
    });

  } catch (error) {
    console.error('❌ Error fetching quiz:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Update quiz questions (for reordering)
export const updateQuizQuestions = async (req, res) => {
  try {
    const { roomName } = req.params;
    const { questions } = req.body;

    if (!questions || !Array.isArray(questions)) {
      return res.status(400).json({
        success: false,
        error: 'Valid questions array is required'
      });
    }

    const quiz = await Quiz.findOneAndUpdate(
      { roomName },
      { 
        questions,
        totalQuestions: questions.length,
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: 'Quiz not found'
      });
    }

    console.log(`✅ Quiz "${roomName}" questions updated`);

    res.json({
      success: true,
      message: 'Questions updated successfully',
      quiz
    });

  } catch (error) {
    console.error('❌ Error updating questions:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Delete quiz
export const deleteQuiz = async (req, res) => {
  try {
    const { roomName } = req.params;
    const quiz = await Quiz.findOneAndDelete({ roomName });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: 'Quiz not found'
      });
    }

    console.log(`✅ Quiz "${roomName}" deleted`);

    res.json({
      success: true,
      message: 'Quiz deleted successfully'
    });

  } catch (error) {
    console.error('❌ Error deleting quiz:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};