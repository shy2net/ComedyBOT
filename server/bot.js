const existingJokes = require('./jokes_db.json');

var botQuestions = {};

// Transform the jokes database into a dictionary for faster fetching
for (joke of existingJokes) 
    if (joke.question) botQuestions[joke.question.toLowerCase()] = joke.answer;

module.exports = ComedyBot = {
    questions: botQuestions,
    addQuestion: (question, answer) => {
        botQuestions[question] = answer;
    },
    getAnswer: (question) => {
        return botQuestions[question];
    }
};