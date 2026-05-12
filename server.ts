import express from 'express';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

app.post('/api/ai', async (req, res) => {
  try {
    const { prompt, responseFormat } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not set' });
    }

    const result = await generateText({
      model: google('gemini-2.0-flash'),
      prompt,
    });

    const content = result.text;

    // Parse JSON if needed
    let parsedContent = content;
    if (responseFormat === 'json') {
      try {
        // Extract JSON from response if it's wrapped in markdown code blocks
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) {
          parsedContent = JSON.parse(jsonMatch[1].trim());
        } else {
          parsedContent = JSON.parse(content);
        }
      } catch (e) {
        // Return as is if parsing fails
        parsedContent = content;
      }
    }

    res.json({ content: parsedContent });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
