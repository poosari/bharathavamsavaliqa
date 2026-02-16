# 🏛️ Bharatha Vamsavali QA

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-blue.svg)](https://expressjs.com/)

**Interactive platform with 1008 Q&A pairs on Ancient Indian History**

[Live Demo](#) | [GitHub](https://github.com/poosari/bharathavamsavaliqa) | [Documentation](#)

---

## 🌟 Features

✨ **1008 Hand-Curated Questions** - Comprehensive coverage of Ancient Indian History
🔍 **Full-Text Search** - Find questions by keyword across all content
📂 **18 Categories** - Organized by historical periods and topics
📊 **Difficulty Levels** - Beginner, Intermediate, Advanced options
🎲 **Random Questions** - Quick learning with randomized Q&As
📱 **Mobile Responsive** - Perfect on any device
⚡ **Fast & Lightweight** - Instant load times
🔒 **No Authentication** - Open to everyone
📈 **View Tracking** - See question popularity

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Local Setup (5 minutes)

```bash
# Clone repository
git clone https://github.com/poosari/bharathavamsavaliqa.git
cd bharathavamsavaliqa

# Install dependencies
npm install

# Start server
npm start
```

Then open: **http://localhost:3000**

### With Docker

```bash
docker build -t bharathavamsavaliqa .
docker run -p 3000:3000 bharathavamsavaliqa
```

---

## 📊 Project Structure

```
bharathavamsavaliqa/
├── public/
│   ├── index.html          # Main UI
│   ├── style.css           # Styling
│   └── app.js              # Frontend logic
├── data/
│   └── questions.json      # 1008 questions
├── server.js               # Express server
├── package.json            # Dependencies
├── README.md               # This file
├── Dockerfile              # Docker config
└── .gitignore
```

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:3000/api
```

### Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/questions` | Get all questions |
| GET | `/questions/:id` | Get question by ID |
| GET | `/search?keyword=...` | Search questions |
| GET | `/categories` | Get all categories |
| GET | `/category/:name` | Filter by category |
| GET | `/difficulty/:level` | Filter by difficulty |
| GET | `/random?count=10` | Get random questions |
| GET | `/stats` | Get statistics |
| GET | `/health` | Health check |

### Example Requests

```bash
# Search questions
curl http://localhost:3000/api/search?keyword=vedic

# Get statistics
curl http://localhost:3000/api/stats

# Get random questions
curl http://localhost:3000/api/random?count=5
```

---

## 🌐 Deployment

### Heroku (Easiest)

```bash
# Install Heroku CLI
brew install heroku

# Login
heroku login

# Deploy
heroku create bharathavamsavaliqa
git push heroku main

# Open app
heroku open
```

**Live URL**: `https://bharathavamsavaliqa.herokuapp.com`

### Railway

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Connect repository
5. Railway auto-deploys!

### Render

1. Go to https://render.com
2. Create new Web Service
3. Connect GitHub repository
4. Select "Node"
5. Deploy!

### AWS/EC2

```bash
# SSH into instance
ssh -i key.pem ubuntu@your-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and run
git clone https://github.com/poosari/bharathavamsavaliqa.git
cd bharathavamsavaliqa
npm install
npm start
```

---

## 📚 Data Format

The `data/questions.json` file contains:

```json
[
  {
    "category": "Vedic Period",
    "questions": [
      {
        "question": "What are the Vedas?",
        "answer": "The Vedas are ancient Sanskrit texts...",
        "difficulty": "beginner",
        "tone": "academic",
        "keywords": ["vedas", "sanskrit", "ancient"]
      }
    ]
  }
]
```

---

## 🎓 Statistics

- **Questions**: 1008
- **Categories**: 18
- **Difficulty Levels**: 3 (Beginner, Intermediate, Advanced)
- **File Size**: ~400 KB (JSON)
- **App Size**: ~5 MB (with dependencies)

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details

---

## 🎯 Roadmap

- [ ] User accounts & authentication
- [ ] Save favorites to database
- [ ] Quiz mode with scoring
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Advanced analytics

---

## 📞 Support

Found a bug or have a suggestion?
- Open an [issue](https://github.com/poosari/bharathavamsavaliqa/issues)
- Check existing [discussions](https://github.com/poosari/bharathavamsavaliqa/discussions)

---

## 🙏 Acknowledgments

- 1008 Q&A pairs based on Bharatha Vamsavali and historical research
- Built with Node.js and Express
- Inspired by the love for ancient Indian history

---

**Made with ❤️ for Learning**

[⬆ Back to Top](#-bharata-vamsavali-qa)
