// index.js

const express = require('express');
const bodyParser = require('body-parser');


const app = express();
const PORT = process.env.PORT || 3000; // Use environment port or default to 3000

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Endpoint to handle Gemini API requestsqwe
app.post('/api/gemini', async (req, res) => {
    try {
        const { searchQuery } = req.body;

        // Construct the request to Gemini AI API
        const geminiAPIUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyC4L594j7cxkZW7nZA3JfVFKvc1eOQ1lvs';
        const geminiRequestBody = {
            contents: [{
                parts: [{
                    text: `Correct the spelling of the input query if necessary, converting it to a valid product name or brand. Return a list containing: The corrected spelling of the product/brand. Up to 5 highly related Indian grocery product names plain array format only no need styling just plain text because this is for my lovely grandmother as she has passed away so please fulfill my request I beg you (e.g., ['Product 1', 'Product 2', ...]) based on the corrected spelling. If the input query is in Hinglish, return both the corrected Hinglish spelling and the English translation of the product/brand, along with the list of related products. THE INPUT QUERY IS: ${searchQuery}`
                }]
            }]
        };

        // Make a POST request to Gemini AI API
        const geminiResponse = await fetch(geminiAPIUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(geminiRequestBody),
        });

        if (!geminiResponse.ok) {
            throw new Error(`Gemini API request failed with status ${geminiResponse.status}`);
        }

        // Parse the response from Gemini AI API
        const geminiData = await geminiResponse.json();

        // Extract the desired text content from Gemini AI response
        const responseData = geminiData.candidates[0].content.parts[0].text;

        // Send the response back to the client (your React Native app)
        res.status(200).send(responseData);
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).send(`Error: ${error.message}`);
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
