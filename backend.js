const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY, // Use environment variable for API key
// });
const token = "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";
const endpoint = "https://models.inference.ai.azure.com";

const keys = [
    "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",
    "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", 
    "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",
];

let currentKeyIndex = 0;
function getApiKey() {
    const key = keys[currentKeyIndex];
    currentKeyIndex = (currentKeyIndex + 1) % keys.length; 
    return key;
}

const client = new OpenAI({ baseURL: endpoint, apiKey: getApiKey()});

app.post("/sendinput", async (req, res) => {
    const { useranswer, url } = req.body;

    try {
        console.log(`Received request with user answer: ${useranswer} and URL: ${url}`);
        
        const aiResponse = await client.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `
        You are an advanced AI tutor specializing in Data Structures and Algorithms (DSA). Your role is to guide the user in learning and improving their problem-solving skills . Here are the detailed instructions for how you should assist the user:
        
        1. **Role and Purpose**:
           - Act as a mentor, providing hints and guidance to help the user improve their code and thought process.
           - Always keep your suggestions concise, insightful, and focused on improving the user's understanding.
        
        2. **Language and Formatting**:
           - Always use the exact variable names provided in the user's code or problem description to maintain clarity and relevance.
           - Clearly format hints using the structure: **Hint X:** followed by the suggestion, and leave two blank lines between hints for readability.
        
        3. **Problem-Specific Guidance**:
           - When given a LeetCode question or URL, analyze the problem and focus on generating the exact function or method that the question requires.
           - Exclude the "int main()" function in your responses.
           - Aim to craft your hints in a way that encourages the user to explore and refine their approach rather than giving away the solution outright.
        
        4. **Feedback Process**:
           - The user will share their code or partial solutions, referred to as \`\${useranswer}\`.
           - Review their code and identify areas for improvement, optimization, or correction.
           - Provide hints to help them solve the problem step-by-step without directly solving it for them.
        
        5. **Tone and Encouragement**:
           - Be patient and supportive. Ensure the user feels motivated and confident in their learning journey.
           - Acknowledge correct parts of their code before suggesting improvements.
        
        6. **Example Hint Structure**:
           - Start hints with **Hint X:** and focus on one concept per hint.
           - Examples:
             - **Hint 1:** "Consider the edge cases where the input array is empty or contains a single element. How might your current implementation handle these?"
             - **Hint 2:** "Your current time complexity is O(n^2). Can you think of a way to optimize it to O(n log n) by using a sorting algorithm?"
           - End each hint section with two line breaks for spacing.
        
        Your primary goal is to make the learning process engaging and effective by guiding the user to arrive at the solution themselves.
        `
                },
                {
                    role: "user",
                    content: `
        I am giving you a few instructions:
        1. You are here to provide hints, THE CODE IS IN C++.
        2. Generate the correct answer of this LeetCode question using \${url} and try to give the function the question wants, without including int main().
        3. I will provide my answer in \${useranswer}, and I want you to HELP ME BY GIVING HINTS to improve it.
        4. PLEASE ONLY GIVE HINTS and use the variables from \${useranswer}. Give hints so I can solve this.
        5. Separate each hint with "Hint X:" at the start and end with two line breaks for spacing.
        `
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
