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
    },
    givesAFuck: () => {
        var rndValue = Math.random();
        return rndValue > 0.85;
    },
    getRandomJoke: () => {
        var keys = Object.keys(botQuestions);
        var rndQuestion = keys[Math.round(Math.random() * keys.length)];
        var jokeAnswer = botQuestions[rndQuestion];

        return {
            "question": rndQuestion,
            "answer": jokeAnswer
        };
    }
};