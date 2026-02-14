// Global variables
let allQuestions = [];
let filteredQuestions = [];
let categoriesSet = new Set();

// DOM Elements
const searchInput = document.getElementById('searchInput');
const categorySelect = document.getElementById('categorySelect');
const difficultySelect = document.getElementById('difficultySelect');
const questionsContainer = document.getElementById('questionsContainer');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadAllQuestions();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchQuestions();
        }
    });

    categorySelect.addEventListener('change', applyFilters);
    difficultySelect.addEventListener('change', applyFilters);
}

// Fetch all questions from JSON file
async function loadAllQuestions() {
    try {
        const response = await fetch('/data/questions.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const rawData = await response.json();

        // Flatten questions from categories
        allQuestions = [];
        let questionId = 1;

        if (Array.isArray(rawData)) {
            rawData.forEach(categoryObj => {
                if (categoryObj.questions && Array.isArray(categoryObj.questions)) {
                    categoryObj.questions.forEach(q => {
                        allQuestions.push({
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
                        categoriesSet.add(categoryObj.category);
                    });
                }
            });
        }

        filteredQuestions = [...allQuestions];
        loadCategories();
        loadStats();
        displayQuestions(filteredQuestions);
        console.log(`✅ Loaded ${allQuestions.length} questions`);
    } catch (error) {
        console.error('Error loading questions:', error);
        showError('Failed to load questions: ' + error.message);
        questionsContainer.innerHTML = '<div class="loading" style="color: white;">Error loading questions. Please check the console for details.</div>';
    }
}

// Load categories from loaded questions
function loadCategories() {
    try {
        const categories = Array.from(categoriesSet).sort();

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Load statistics from loaded questions
function loadStats() {
    try {
        const stats = {
            totalQuestions: allQuestions.length,
            totalCategories: categoriesSet.size,
            totalViews: allQuestions.reduce((sum, q) => sum + (q.viewCount || 0), 0)
        };

        document.getElementById('totalQuestions').textContent = stats.totalQuestions;
        document.getElementById('totalCategories').textContent = stats.totalCategories;
        document.getElementById('totalViews').textContent = stats.totalViews.toLocaleString();
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Search questions
function searchQuestions() {
    const keyword = searchInput.value.trim().toLowerCase();

    if (!keyword) {
        showError('Please enter a search term');
        return;
    }

    filteredQuestions = allQuestions.filter(q => {
        const questionLower = (q.question || '').toLowerCase();
        const answerLower = (q.answer || '').toLowerCase();
        return questionLower.includes(keyword) || answerLower.includes(keyword);
    });

    displayQuestions(filteredQuestions);

    if (filteredQuestions.length === 0) {
        showError(`No questions found matching "${keyword}"`);
    }
}

// Get random questions
function getRandomQuestions() {
    const count = 10;
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    filteredQuestions = shuffled.slice(0, Math.min(count, shuffled.length));
    displayQuestions(filteredQuestions);
    clearFilters();
}

// Apply filters
function applyFilters() {
    const category = categorySelect.value;
    const difficulty = difficultySelect.value;

    let filtered = [...allQuestions];

    // Log filter values for debugging
    console.log(`🔍 Applying filters - Category: "${category}", Difficulty: "${difficulty}"`);

    if (category) {
        filtered = filtered.filter(q => q.category === category);
        console.log(`  After category filter: ${filtered.length} questions`);
    }

    if (difficulty) {
        filtered = filtered.filter(q => q.difficulty === difficulty);
        console.log(`  After difficulty filter: ${filtered.length} questions`);
    }

    filteredQuestions = filtered;
    displayQuestions(filteredQuestions);
    searchInput.value = '';

    // Log final result
    console.log(`✅ Filter complete: ${filteredQuestions.length} questions found`);
}

// Reset filters
function resetFilters() {
    categorySelect.value = '';
    difficultySelect.value = '';
    searchInput.value = '';
    filteredQuestions = [...allQuestions];
    displayQuestions(filteredQuestions);
    loadStats();
}

// Clear filters helper
function clearFilters() {
    categorySelect.value = '';
    difficultySelect.value = '';
    searchInput.value = '';
}

// Display questions
function displayQuestions(questions) {
    if (!questions || questions.length === 0) {
        const category = categorySelect.value || 'all categories';
        const difficulty = difficultySelect.value || 'all levels';
        const message = `
            <div class="no-results">
                <p>❌ No questions found</p>
                <p style="font-size: 0.9em; color: #666; margin-top: 10px;">
                    Try adjusting your filters: ${category} + ${difficulty}
                </p>
                <button class="btn btn-secondary" onclick="resetFilters()" style="margin-top: 15px;">Reset Filters</button>
            </div>
        `;
        questionsContainer.innerHTML = message;
        return;
    }

    questionsContainer.innerHTML = questions.map(q => `
        <div class="question-card">
            <div class="question-number">Question #${q.id}</div>
            <div class="question-text">${escapeHtml(q.question)}</div>
            <div class="answer-text">
                <strong>Answer:</strong> ${escapeHtml(q.answer)}
            </div>
            <div class="question-meta">
                <span class="badge badge-category">${escapeHtml(q.category)}</span>
                <span class="badge ${getDifficultyClass(q.difficulty)}">${q.difficulty}</span>
                <span class="view-count">👁️ ${q.viewCount || 0} views</span>
            </div>
        </div>
    `).join('');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Get difficulty badge class
function getDifficultyClass(difficulty) {
    const classMap = {
        'beginner': 'badge-beginner',
        'intermediate': 'badge-intermediate',
        'advanced': 'badge-advanced'
    };
    return classMap[difficulty] || 'badge-difficulty';
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #e74c3c;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);

    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);
