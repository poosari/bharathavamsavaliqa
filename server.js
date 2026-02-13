const express = require('express');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Load questions data
const questionsPath = path.join(__dirname, 'data', 'questions.json');
let questionsData = [];

try {
  const rawData = fs.readFileSync(questionsPath, 'utf8');
  const parsedData = JSON.parse(rawData);

  // Flatten questions from categories
  questionsData = [];
  let questionId = 1;

  if (Array.isArray(parsedData)) {
    parsedData.forEach(categoryObj => {
      if (categoryObj.questions && Array.isArray(categoryObj.questions)) {
        categoryObj.questions.forEach(q => {
          questionsData.push({
            id: questionId++,
            question: q.question,
            answer: q.answer,
            category: categoryObj.category,
            difficulty: q.difficulty || 'beginner',
            tone: q.tone || 'academic',
            keywords: q.keywords || [],
            viewCount: 0,
            isFavorite: false
          });
        });
      }
    });
  }

  console.log(`✅ Loaded ${questionsData.length} questions from JSON`);
} catch (error) {
  console.error('❌ Error loading questions:', error.message);
  process.exit(1);
}

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes

// Serve HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API: Get all questions
app.get('/api/questions', (req, res) => {
  res.json(questionsData);
});

// API: Get question by ID
app.get('/api/questions/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const question = questionsData.find(q => q.id === id);

  if (!question) {
    return res.status(404).json({ error: 'Question not found' });
  }

  question.viewCount = (question.viewCount || 0) + 1;
  res.json(question);
});

// API: Search questions
app.get('/api/search', (req, res) => {
  const keyword = req.query.keyword ? req.query.keyword.toLowerCase() : '';

  if (!keyword) {
    return res.status(400).json({ error: 'Keyword required' });
  }

  const results = questionsData.filter(q =>
    q.question.toLowerCase().includes(keyword) ||
    q.answer.toLowerCase().includes(keyword)
  );

  res.json(results);
});

// API: Get all categories
app.get('/api/categories', (req, res) => {
  const categories = [...new Set(questionsData.map(q => q.category))];
  res.json(categories);
});

// API: Filter by category
app.get('/api/category/:category', (req, res) => {
  const category = req.params.category;
  const results = questionsData.filter(q => q.category === category);
  res.json(results);
});

// API: Filter by difficulty
app.get('/api/difficulty/:level', (req, res) => {
  const level = req.params.level;
  const results = questionsData.filter(q => q.difficulty === level);
  res.json(results);
});

// API: Get random questions
app.get('/api/random', (req, res) => {
  const count = parseInt(req.query.count) || 10;
  const shuffled = [...questionsData].sort(() => Math.random() - 0.5);
  res.json(shuffled.slice(0, count));
});

// API: Get statistics
app.get('/api/stats', (req, res) => {
  const categories = [...new Set(questionsData.map(q => q.category))];
  const difficulties = [...new Set(questionsData.map(q => q.difficulty))];

  const stats = {
    totalQuestions: questionsData.length,
    totalCategories: categories.length,
    categories: categories,
    difficulties: difficulties,
    totalViews: questionsData.reduce((sum, q) => sum + (q.viewCount || 0), 0),
    totalFavorites: questionsData.filter(q => q.isFavorite).length
  };

  res.json(stats);
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    questions: questionsData.length,
    timestamp: new Date()
  });
});

// Start server
app.listen(PORT, () => {
  console.log('');
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║  🏛️  Bharata Vamsavali QA Platform');
  console.log('║');
  console.log(`║  🌐 App:  http://localhost:${PORT}`);
  console.log('║  📚 Data: 1008 Questions Loaded');
  console.log('║  🔌 API:  http://localhost:' + PORT + '/api');
  console.log('║');
  console.log('╚═══════════════════════════════════════════════════════╝');
  console.log('');
});
