// Global variables
let allQuestions = [];
let filteredQuestions = [];
const API_BASE = '/api';

// DOM Elements
const searchInput = document.getElementById('searchInput');
const categorySelect = document.getElementById('categorySelect');
const difficultySelect = document.getElementById('difficultySelect');
const questionsContainer = document.getElementById('questionsContainer');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadAllQuestions();
    loadCategories();
    loadStats();
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

// Fetch all questions
async function loadAllQuestions() {
    try {
        const response = await fetch(`${API_BASE}/questions`);
        allQuestions = await response.json();
        filteredQuestions = [...allQuestions];
        displayQuestions(filteredQuestions);
    } catch (error) {
        console.error('Error loading questions:', error);
        showError('Failed to load questions');
    }
}

// Load categories
async function loadCategories() {
    try {
        const response = await fetch(`${API_BASE}/categories`);
        const categories = await response.json();

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

// Load statistics
async function loadStats() {
    try {
        const response = await fetch(`${API_BASE}/stats`);
        const stats = await response.json();

        document.getElementById('totalQuestions').textContent = stats.totalQuestions;
        document.getElementById('totalCategories').textContent = stats.totalCategories;
        document.getElementById('totalViews').textContent = (stats.totalViews || 0).toLocaleString();
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Search questions
async function searchQuestions() {
    const keyword = searchInput.value.trim();

    if (!keyword) {
        showError('Please enter a search term');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/search?keyword=${encodeURIComponent(keyword)}`);
        filteredQuestions = await response.json();
        displayQuestions(filteredQuestions);
    } catch (error) {
        console.error('Error searching:', error);
        showError('Search failed');
    }
}

// Get random questions
async function getRandomQuestions() {
    try {
        const response = await fetch(`${API_BASE}/random?count=10`);
        filteredQuestions = await response.json();
        displayQuestions(filteredQuestions);
        clearFilters();
    } catch (error) {
        console.error('Error getting random questions:', error);
        showError('Failed to get random questions');
    }
}

// Apply filters
async function applyFilters() {
    const category = categorySelect.value;
    const difficulty = difficultySelect.value;

    let filtered = [...allQuestions];

    if (category) {
        filtered = filtered.filter(q => q.category === category);
    }

    if (difficulty) {
        filtered = filtered.filter(q => q.difficulty === difficulty);
    }

    filteredQuestions = filtered;
    displayQuestions(filteredQuestions);
    searchInput.value = '';
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
        questionsContainer.innerHTML = '<div class="no-results"><p>No questions found</p></div>';
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
