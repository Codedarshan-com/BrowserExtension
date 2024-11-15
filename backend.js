const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

//set all resource from public to /
app.use(express.static('public'));

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Use environment variable for API key
});

app.post("/sendinput", async (req, res) => {
    const { useranswer, url } = req.body;

    try {
        console.log(`Received request with user answer: ${useranswer} and URL: ${url}`);

        const aiResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are an AI assistant, help me learn DSA" },
                { role: "user", content: `I am giving you a few instructions:
                    1. You are here to provide hints, THE CODE IS IN C++.
                    2. Generate the correct answer of this LeetCode question using ${url} and try to give the function the question wants, without including int main().
                    3. I will provide my answer in ${useranswer}, and I want you to HELP ME BY GIVING HINTS to improve it.
                    4. PLEASE ONLY GIVE HINTS and use the variables from ${useranswer}. Give hints so I can solve this.
                    5. Separate each hint with "Hint X:" at the start and end with two line breaks for spacing`
                }
                    
            ]
        });

        const generatedText = aiResponse.choices[0].message.content;
        console.log('AI Response:', generatedText);
        res.json({ aiResponse: generatedText });

    } catch (e) {
        console.error('Error generating AI response:', e.message || e);
        res.status(500).json({ error: 'Failed to process the request. Please try again later.' });
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
