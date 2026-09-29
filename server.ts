import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// AI Confectionery Assistant Endpoint (WhatsApp Chatbot backend)
app.post('/api/chat-assistant', async (req: Request, res: Response) => {
  try {
    const { message, history, currentCategory, budget } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (ai) {
      const systemInstruction = `You are "Sweetie", the WhatsApp AI Confectionery Sommelier & Shopping Assistant for "Sharma Confectioners & Royal Sweets" (an Amazon-style luxury confectionery store).
Your goal is to guide customers to the perfect confectionery treat, chocolate box, Indian mithai, or gift hamper based on their taste, budget, dietary needs (e.g., eggless, 100% vegetarian, diabetic/sugar-free, dark cocoa percentage), or occasion (Birthday, Anniversary, Rakhi, Diwali, Corporate).

Respond in a warm, polite, and helpful WhatsApp tone (you can use English, Hindi, or conversational Hinglish if the user asks in Hindi/Hinglish).
Keep your message concise (2-4 short friendly sentences with relevant sweet emojis).

Always include relevant category suggestions from:
- 'dark-chocolates' (Belgian Dark Cocoa 70%-85%, Hazelnut Pralines, Truffles)
- 'royal-sweets' (Kaju Katli, Motichoor Laddu, Saffron Pistachio Barfi)
- 'gourmet-candies' (Berry Gummies, Sour Candies, Caramel Chews)
- 'bakery-cookies' (French Macarons, Dutch Butter Cookies, Choco Chunk Cookies)
- 'gift-hampers' (Luxury Wooden Boxes, Festive Hampers, Celebration Baskets)
- 'sugar-free' (Stevia Dark Truffles, Almond Date Bites, Fig Walnut Rolls)

Format your output as a JSON object:
{
  "reply": "Your WhatsApp response message text here",
  "suggestedCategory": "one of the category keys above or 'all'",
  "recommendedKeywords": ["keyword1", "keyword2"],
  "priceFilterMax": 1000 or null
}`;

      const prompt = `User WhatsApp Message: "${message}"
Current selected category: "${currentCategory || 'all'}"
User budget constraint (if any): "${budget || 'any'}"
Recent conversation context: ${JSON.stringify(history || [])}

Provide your sweet advice and recommend matching products.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const responseText = response.text?.trim() || '{}';
      try {
        const parsed = JSON.parse(responseText);
        return res.json({
          reply: parsed.reply || "Namaste! Welcome to Sharma Confectioners! How may I sweeten your day? Explore our Belgian chocolates or royal sweets.",
          suggestedCategory: parsed.suggestedCategory || 'all',
          recommendedKeywords: parsed.recommendedKeywords || [],
          priceFilterMax: parsed.priceFilterMax || null,
        });
      } catch (err) {
        return res.json({
          reply: responseText || "I'd love to help you pick the best chocolates and sweets from Sharma Confectioners! Let me know your preference.",
          suggestedCategory: 'all',
          recommendedKeywords: [],
        });
      }
    } else {
      // Graceful rule-based matcher if API key is not yet configured
      const lower = message.toLowerCase();
      let reply = "Hello! Welcome to Sharma Confectioners! 🍫 Here are our best recommendations:";
      let suggestedCategory = 'all';
      let keywords: string[] = [];

      if (lower.includes('dark') || lower.includes('cocoa') || lower.includes('chocolate')) {
        reply = "Looking for rich chocolate? 🍫 Our 70% Single-Origin Belgian Dark Truffles & Roasted Hazelnut Pralines are top-rated! Would you like to check them out?";
        suggestedCategory = 'dark-chocolates';
        keywords = ['belgian', 'truffle', 'dark'];
      } else if (lower.includes('sweet') || lower.includes('mithai') || lower.includes('kaju') || lower.includes('laddu') || lower.includes('barfi')) {
        reply = "Craving royal traditional sweets? 🥮 Try our Silver-Coated Pure Cashew Kaju Katli and Saffron Desi Ghee Motichoor Laddus. Freshly prepared daily!";
        suggestedCategory = 'royal-sweets';
        keywords = ['kaju', 'laddu', 'barfi'];
      } else if (lower.includes('sugar free') || lower.includes('diabetic') || lower.includes('healthy') || lower.includes('diet')) {
        reply = "We have guilt-free sweets! 🌿 Our Sugar-Free Almond Date Bites & Stevia Dark Chocolate bars have zero added sugar and are 100% diabetic-friendly.";
        suggestedCategory = 'sugar-free';
        keywords = ['sugar-free', 'date', 'stevia'];
      } else if (lower.includes('gift') || lower.includes('hamper') || lower.includes('pack') || lower.includes('box')) {
        reply = "Looking for the perfect gift? 🎁 Our Luxury Velvet Royal Confectionery Hamper comes in gold-embossed packaging with custom gift cards!";
        suggestedCategory = 'gift-hampers';
        keywords = ['hamper', 'luxury', 'gift'];
      } else if (lower.includes('candy') || lower.includes('gummy') || lower.includes('kids') || lower.includes('toffee')) {
        reply = "For candies & fun treats! 🍬 Check out our Gourmet Fruit Gummies and Belgian Sea Salt Caramel Chews—kids and adults love them!";
        suggestedCategory = 'gourmet-candies';
        keywords = ['gummy', 'candy', 'caramel'];
      } else if (lower.includes('cookie') || lower.includes('macaron') || lower.includes('bakery')) {
        reply = "Fresh from our oven! 🧁 Assorted French Pastel Macarons and Dutch Butter Choco-Chunk Cookies. Melt-in-mouth goodness!";
        suggestedCategory = 'bakery-cookies';
        keywords = ['macaron', 'cookie'];
      } else {
        reply = "Namaste! 🙏 I am your Sharma Confectioners WhatsApp Assistant. You can ask for chocolates, royal Indian mithai, sugar-free treats, or festival gift hampers!";
      }

      return res.json({
        reply,
        suggestedCategory,
        recommendedKeywords: keywords,
      });
    }
  } catch (error: any) {
    console.error('Chatbot error:', error);
    return res.status(500).json({
      reply: "We are having high sweet traffic! Please browse our top categories or select an item directly from the catalogue.",
      suggestedCategory: 'all',
      recommendedKeywords: [],
    });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
