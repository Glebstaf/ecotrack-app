// === ДАННЫЕ ===

// Список школ по городам
const schoolsByCity = {
    "Уфа": ["Школа №1", "Школа №5", "Лицей №96", "Гимназия №3", "Школа №125", "Центр образования №1"],
    "Москва": ["Школа №1502", "Лицей №1535", "Гимназия №1543", "Школа №179", "ЦО №1828"],
    "Санкт-Петербург": ["Школа №188", "Лицей №239", "Гимназия №209", "Школа №307", "ЦО №1553"],
    "Казань": ["Школа №12", "Лицей №131", "Гимназия №5", "Школа №171", "ЦО №1"],
    "Новосибирск": ["Школа №130", "Лицей №130", "Гимназия №1", "Школа №188", "ЦО №1"]
};

// Эко-действия
const ecoActions = [
    { id: 1, name: "Выключил свет при выходе", points: 5, icon: "💡" },
    { id: 2, name: "Прошёл пешком вместо автобуса", points: 10, icon: "🚶" },
    { id: 3, name: "Переработал пластик", points: 15, icon: "♻️" },
    { id: 4, name: "Использовал многоразовую бутылку", points: 8, icon: "💧" },
    { id: 5, name: "Посадил дерево/растение", points: 20, icon: "🌳" },
    { id: 6, name: "Выключил воду при чистке зубов", points: 7, icon: "🦷" },
    { id: 7, name: "Использовал общественный транспорт", points: 12, icon: "🚌" },
    { id: 8, name: "Сдал батарейки на переработку", points: 15, icon: "🔋" }
];

// 50 ДОСТИЖЕНИЙ (Easy, Medium, Hard, Expert, Secret)
const achievements = [
    // EASY (1-10)
    { id: 1, name: "Первые шаги", desc: "Набери 10 очков", icon: "🌱", req: 10, type: "points", diff: "easy" },
    { id: 2, name: "Новичок", desc: "Набери 50 очков", icon: "🌿", req: 50, type: "points", diff: "easy" },
    { id: 3, name: "Старательный", desc: "Набери 100 очков", icon: "", req: 100, type: "points", diff: "easy" },
    { id: 4, name: "Первая неделя", desc: "3 дня подряд", icon: "📅", req: 3, type: "days", diff: "easy" },
    { id: 5, name: "Экономный", desc: "Выключи свет 5 раз", icon: "💡", req: 5, type: "action_1", diff: "easy" },
    { id: 6, name: "Пешеход", desc: "Пройди пешком 5 раз", icon: "🚶", req: 5, type: "action_2", diff: "easy" },
    { id: 7, name: "Первый пластик", desc: "Переработай 3 раза", icon: "♻️", req: 3, type: "action_3", diff: "easy" },
    { id: 8, name: "Водосберегатель", desc: "Выключай воду 5 раз", icon: "💧", req: 5, type: "action_6", diff: "easy" },
    { id: 9, name: "Любитель природы", desc: "Посади 1 растение", icon: "🌸", req: 1, type: "action_5", diff: "easy" },
    { id: 10, name: "Батарейка", desc: "Сдай батарейки 2 раза", icon: "🔋", req: 2, type: "action_8", diff: "easy" },

    // MEDIUM (11-25)
    { id: 11, name: "Эко-активист", desc: "Набери 200 очков", icon: "🌳", req: 200, type: "points", diff: "medium" },
    { id: 12, name: "Упорный", desc: "Набери 300 очков", icon: "🌲", req: 300, type: "points", diff: "medium" },
    { id: 13, name: "Целеустремлённый", desc: "Набери 400 очков", icon: "🎯", req: 400, type: "points", diff: "medium" },
    { id: 14, name: "Неделя активности", desc: "7 дней подряд", icon: "📆", req: 7, type: "days", diff: "medium" },
    { id: 15, name: "Две недели", desc: "14 дней подряд", icon: "🗓️", req: 14, type: "days", diff: "medium" },
    { id: 16, name: "Мастер света", desc: "Выключи свет 20 раз", icon: "💡", req: 20, type: "action_1", diff: "medium" },
    { id: 17, name: "Марафонец", desc: "Пройди пешком 20 раз", icon: "🏃", req: 20, type: "action_2", diff: "medium" },
    { id: 18, name: "Мастер переработки", desc: "Переработай 15 раз", icon: "♻️", req: 15, type: "action_3", diff: "medium" },
    { id: 19, name: "Бутылочка", desc: "Используй бутылку 10 раз", icon: "🍼", req: 10, type: "action_4", diff: "medium" },
    { id: 20, name: "Садовод", desc: "Посади 5 растений", icon: "🌺", req: 5, type: "action_5", diff: "medium" },
    { id: 21, name: "Эконом воды", desc: "Выключай воду 20 раз", icon: "🚰", req: 20, type: "action_6", diff: "medium" },
    { id: 22, name: "Транспорт", desc: "Используй 15 раз", icon: "🚌", req: 15, type: "action_7", diff: "medium" },
    { id: 23, name: "Эко-воин", desc: "Сдай батарейки 10 раз", icon: "🔋", req: 10, type: "action_8", diff: "medium" },
    { id: 24, name: "Целеполагатель", desc: "Создай 3 цели", icon: "📝", req: 3, type: "goals", diff: "medium" },
    { id: 25, name: "Достигатор", desc: "Выполни 1 цель", icon: "✅", req: 1, type: "goals_comp", diff: "medium" },

    // HARD (26-40)
    { id: 26, name: "Зелёный герой", desc: "Набери 500 очков", icon: "🌳", req: 500, type: "points", diff: "hard" },
    { id: 27, name: "Эко-чемпион", desc: "Набери 750 очков", icon: "🏆", req: 750, type: "points", diff: "hard" },
    { id: 28, name: "Защитник природы", desc: "Набери 1000 очков", icon: "🌍", req: 1000, type: "points", diff: "hard" },
    { id: 29, name: "Месяц активности", desc: "30 дней подряд", icon: "📅", req: 30, type: "days", diff: "hard" },
    { id: 30, name: "Полгода эко", desc: "180 дней подряд", icon: "🗓️", req: 180, type: "days", diff: "hard" },
    { id: 31, name: "Светлячок", desc: "Выключи свет 100 раз", icon: "💡", req: 100, type: "action_1", diff: "hard" },
    { id: 32, name: "Ультра-пешеход", desc: "Пройди 100 раз", icon: "🥾", req: 100, type: "action_2", diff: "hard" },
    { id: 33, name: "Король переработки", desc: "Переработай 50 раз", icon: "♻️", req: 50, type: "action_3", diff: "hard" },
    { id: 34, name: "H2O мастер", desc: "Используй бутылку 50 раз", icon: "💧", req: 50, type: "action_4", diff: "hard" },
    { id: 35, name: "Лесник", desc: "Посади 20 растений", icon: "🌲", req: 20, type: "action_5", diff: "hard" },
    { id: 36, name: "Водный страж", desc: "Выключай воду 100 раз", icon: "🚿", req: 100, type: "action_6", diff: "hard" },
    { id: 37, name: "Транспортный маг", desc: "Используй 50 раз", icon: "🚇", req: 50, type: "action_7", diff: "hard" },
    { id: 38, name: "Батарейный барон", desc: "Сдай 50 раз", icon: "🔋", req: 50, type: "action_8", diff: "hard" },
    { id: 39, name: "Планировщик", desc: "Создай 10 целей", icon: "📋", req: 10, type: "goals", diff: "hard" },
    { id: 40, name: "Исполнитель", desc: "Выполни 5 целей", icon: "✔️", req: 5, type: "goals_comp", diff: "hard" },

    // EXPERT (41-45)
    { id: 41, name: "Легенда", desc: "Набери 2500 очков", icon: "", req: 2500, type: "points", diff: "expert" },
    { id: 42, name: "Эко-титан", desc: "Набери 5000 очков", icon: "👑", req: 5000, type: "points", diff: "expert" },
    { id: 43, name: "Год без отходов", desc: "365 дней подряд", icon: "🎉", req: 365, type: "days", diff: "expert" },
    { id: 44, name: "Супергерой", desc: "Выполни 20 целей", icon: "🦸", req: 20, type: "goals_comp", diff: "expert" },
    { id: 45, name: "Абсолют", desc: "Выполни 50 целей", icon: "💎", req: 50, type: "goals_comp", diff: "expert" },

    // SECRET (46-50)
    { id: 46, name: "Сова", desc: "Зайди ночью", icon: "🦉", req: 1, type: "secret_midnight", diff: "secret", hidden: true },
    { id: 47, name: "Перфекционист", desc: "Ровно 100 или 500 очков", icon: "🎯", req: 1, type: "secret_exact", diff: "secret", hidden: true },
    { id: 48, name: "Удачливый", desc: "Секретный шанс", icon: "🍀", req: 1, type: "secret_lucky", diff: "secret", hidden: true },
    { id: 49, name: "Спидраннер", desc: "200 очков за неделю", icon: "⚡", req: 1, type: "secret_speed", diff: "secret", hidden: true },
    { id: 50, name: "Коллекционер", desc: "Открой 40 достижений", icon: "🏅", req: 1, type: "secret_master", diff: "secret", hidden: true }
];

// === СОСТОЯНИЕ ПРИЛОЖЕНИЯ ===
let currentUser = null;
let userData = null;
let weekChart = null;

// === ИНИЦИАЛИЗАЦИЯ ===
document.addEventListener('DOMContentLoaded', () => {
    loadUser();
    initRegistration();
    initCitySelector();
});

function initCitySelector() {
    const citySelect = document.getElementById('userCity');
    const schoolSelect = document.getElementById('userSchool');

    citySelect.addEventListener('change', function() {
        const selectedCity = this.value;
        schoolSelect.innerHTML = '<option value="">🏫 Выберите школу</option>';

        if (selectedCity && schoolsByCity[selectedCity]) {
            schoolSelect.disabled = false;
            schoolsByCity[selectedCity].forEach(school => {
                const option = document.createElement('option');
                option.value = school;
                option.textContent = school;
                schoolSelect.appendChild(option);
            });
        } else {
            schoolSelect.disabled = true;
        }
    });
}

function initRegistration() {
    const form = document.getElementById('userForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('userName').value;
        const userClass = document.getElementById('userClass').value;
        const school = document.getElementById('userSchool').value;
        const city = document.getElementById('userCity').value;

        if (!school || !city) {
            alert('⚠️ Пожалуйста, выберите город и школу!');
            return;
        }

        registerUser(name, userClass, school, city);
    });
}

function registerUser(name, userClass, school, city) {
    currentUser = {
        name: name,
        class: userClass,
        school: school,
        city: city,
        id: Date.now()
    };

    userData = {
        user: currentUser,
        totalPoints: 0,
        totalActions: 0,
        history: [],
        achievements: [],
        streak: 0,
        lastActionDate: null,
        goals: []
    };

    saveData();
    showDashboard();
}

function saveData() {
    if (currentUser) {
        localStorage.setItem('ecotrack_user_' + currentUser.id, JSON.stringify(userData));
        localStorage.setItem('ecotrack_current', currentUser.id);
    }
}

function loadUser() {
    const currentId = localStorage.getItem('ecotrack_current');
    if (currentId) {
        const data = localStorage.getItem('ecotrack_user_' + currentId);
        if (data) {
            userData = JSON.parse(data);
            currentUser = userData.user;
            showDashboard();
        }
    }
}

// === ГЛАВНЫЙ ЭКРАН ===
function showDashboard() {
    document.getElementById('registration').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');

    document.getElementById('displayUserName').textContent = currentUser.name;
    document.getElementById('userInfo').textContent = `📍 ${currentUser.city}, ${currentUser.school}, ${currentUser.class}`;

    updateStats();
    renderActions();
    checkAchievements();
    initGoals(); // Инициализация целей
}

function updateStats() {
    document.getElementById('totalPoints').textContent = userData.totalPoints;
    document.getElementById('totalActions').textContent = userData.totalActions;
    document.getElementById('userLevel').textContent = getLevelName(userData.totalPoints);
}

function getLevelName(points) {
    if (points < 50) return "Новичок";
    if (points < 200) return "Эко-активист";
    if (points < 500) return "Зелёный герой";
    if (points < 1000) return "Защитник";
    return "Легенда";
}

function renderActions() {
    const list = document.getElementById('actionsList');
    list.innerHTML = '';

    ecoActions.forEach(action => {
        const item = document.createElement('div');
        item.className = 'action-item';
        item.innerHTML = `
            <input type="checkbox" id="action_${action.id}" data-points="${action.points}" data-id="${action.id}">
            <label for="action_${action.id}" style="flex:1; cursor:pointer;">${action.icon} ${action.name}</label>
            <span class="action-points">+${action.points}</span>
        `;
        list.appendChild(item);
    });

    document.getElementById('saveDayBtn').onclick = saveDay;
}

function saveDay() {
    const checkboxes = document.querySelectorAll('.action-item input[type="checkbox"]:checked');
    let dayPoints = 0;
    let dayActionsCount = 0;
    let actionsMap = {};

    // Считаем очки и сохраняем какие действия выполнены
    checkboxes.forEach(cb => {
        dayPoints += parseInt(cb.dataset.points);
        dayActionsCount++;
        actionsMap[cb.dataset.id] = (actionsMap[cb.dataset.id] || 0) + 1;
    });

    if (dayActionsCount === 0) {
        alert('⚠️ Отметь хотя бы одно действие!');
        return;
    }

    const today = new Date().toDateString();
    if (userData.lastActionDate === today) {
        alert('⚠️ Ты уже сохранял действия сегодня!');
        return;
    }

    userData.totalPoints += dayPoints;
    userData.totalActions += dayActionsCount;
    userData.lastActionDate = today;

    // Считаем серию
    if (userData.history.length > 0) {
        const lastDate = new Date(userData.history[userData.history.length - 1].date);
        const diffDays = (new Date() - lastDate) / (1000 * 60 * 60 * 24);
        userData.streak = (diffDays === 1) ? userData.streak + 1 : 1;
    } else {
        userData.streak = 1;
    }

    userData.history.push({
        date: today,
        points: dayPoints,
        actionsCount: dayActionsCount,
        details: actionsMap // Сохраняем детали для ачивок
    });

    saveData();
    updateStats();
    checkAchievements();

    alert(`🎉 Отлично! +${dayPoints} очков за сегодня!`);

    // Сброс чекбоксов
    document.querySelectorAll('.action-item input[type="checkbox"]').forEach(cb => cb.checked = false);
}

// === ДОСТИЖЕНИЯ (Логика проверки) ===
function checkAchievements() {
    let newUnlocks = [];

    achievements.forEach(ach => {
        if (userData.achievements.includes(ach.id)) return;

        let unlocked = false;

        // Обычные проверки
        if (ach.type === 'points' && userData.totalPoints >= ach.req) unlocked = true;
        if (ach.type === 'days' && userData.streak >= ach.req) unlocked = true;
        if (ach.type === 'goals' && userData.goals.length >= ach.req) unlocked = true;
        if (ach.type === 'goals_comp') {
            const completed = userData.goals.filter(g => g.completed).length;
            if (completed >= ach.req) unlocked = true;
        }

        // Проверка по действиям (action_X)
        if (ach.type.startsWith('action_')) {
            const actionId = ach.type.split('_')[1];
            let count = 0;
            userData.history.forEach(h => {
                if (h.details && h.details[actionId]) count += h.details[actionId];
            });
            if (count >= ach.req) unlocked = true;
        }

        // СЕКРЕТНЫЕ ДОСТИЖЕНИЯ
        if (ach.type === 'secret_midnight') {
            if (new Date().getHours() >= 0 && new Date().getHours() < 6 && userData.totalPoints > 50) unlocked = true;
        }
        if (ach.type === 'secret_exact') {
            if ([100, 500, 1000, 2000].includes(userData.totalPoints)) unlocked = true;
        }
        if (ach.type === 'secret_lucky') {
            if (Math.random() < 0.05 && userData.totalActions > 20) unlocked = true; // 5% шанс при сохранении
        }
        if (ach.type === 'secret_speed') {
            if (userData.history.length >= 3) {
                const first = new Date(userData.history[0].date);
                const last = new Date(userData.history[userData.history.length-1].date);
                const days = (last - first) / (1000 * 60 * 60 * 24);
                if (days <= 7 && userData.totalPoints >= 200) unlocked = true;
            }
        }
        if (ach.type === 'secret_master') {
            if (userData.achievements.length >= 40) unlocked = true;
        }

        if (unlocked) {
            userData.achievements.push(ach.id);
            newUnlocks.push(ach);
        }
    });

    if (newUnlocks.length > 0) {
        saveData();
        newUnlocks.forEach(ach => {
            setTimeout(() => {
                alert(`🏆 ДОСТИЖЕНИЕ ОТКРЫТО!\n\n${ach.icon} ${ach.hidden ? '???' : ach.name}\n${ach.desc}`);
            }, 100);
        });
    }
}

// === ЦЕЛИ (ИСПРАВЛЕННАЯ КНОПКА) ===
function initGoals() {
    // Гарантируем, что кнопка работает
    const btn = document.getElementById('addGoalBtn');
    btn.onclick = addGoal;
    renderGoals();
}

function addGoal() {
    const nameInput = document.getElementById('goalName');
    const deadlineInput = document.getElementById('goalDeadline');

    const name = nameInput.value.trim();
    const deadline = deadlineInput.value;

    if (!name || !deadline) {
        alert('⚠️ Введи название и дату!');
        return;
    }

    const goal = {
        id: Date.now(),
        name: name,
        deadline: deadline,
        completed: false
    };

    userData.goals.push(goal);
    saveData();
    renderGoals();
    checkAchievements(); // Проверить ачивки на создание цели

    nameInput.value = '';
    deadlineInput.value = '';
}

function renderGoals() {
    const list = document.getElementById('goalsList');
    list.innerHTML = '';

    if (!userData.goals || userData.goals.length === 0) {
        list.innerHTML = '<p style="text-align:center; color:#999;">Нет целей</p>';
        return;
    }

    userData.goals.forEach(goal => {
        const isExpired = new Date(goal.deadline) < new Date() && !goal.completed;
        const div = document.createElement('div');
        div.className = `goal-item ${goal.completed ? 'completed' : ''} ${isExpired ? 'expired' : ''}`;

        div.innerHTML = `
            <div style="flex:1">
                <strong>${goal.name}</strong><br>
                <small>${new Date(goal.deadline).toLocaleDateString()}</small>
            </div>
            <button class="btn-delete-goal" onclick="deleteGoal(${goal.id})">×</button>
        `;

        // Двойной клик для выполнения
        div.ondblclick = () => toggleGoal(goal.id);

        list.appendChild(div);
    });
}

function toggleGoal(id) {
    const goal = userData.goals.find(g => g.id === id);
    if (goal) {
        goal.completed = !goal.completed;
        saveData();
        renderGoals();
        checkAchievements();
    }
}

function deleteGoal(id) {
    if(confirm('Удалить цель?')) {
        userData.goals = userData.goals.filter(g => g.id !== id);
        saveData();
        renderGoals();
        checkAchievements();
    }
}

// === НАВИГАЦИЯ И ГРАФИКИ ===
function showSection(id) {
    document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');

    if (id === 'statistics') renderStats();
    if (id === 'achievements') renderAchievements();
    if (id === 'leaderboard') renderLeaderboard();
}

function renderStats() {
    const details = document.getElementById('statsDetails');
    details.innerHTML = `
        <div style="padding:10px; background:#f8f9fa; margin:5px 0; border-radius:8px;">📅 Серия: ${userData.streak} дн.</div>
        <div style="padding:10px; background:#f8f9fa; margin:5px 0; border-radius:8px;">🏆 Достижений: ${userData.achievements.length}/50</div>
    `;

    const ctx = document.getElementById('weekChart').getContext('2d');
    if (weekChart) weekChart.destroy();

    const last7 = userData.history.slice(-7);
    weekChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: last7.map(h => h.date.slice(0, 5)),
            datasets: [{
                label: 'Очки',
                data: last7.map(h => h.points),
                borderColor: '#2ecc71',
                backgroundColor: 'rgba(46,204,113,0.2)',
                fill: true
            }]
        },
        options: { responsive: true, plugins: { legend: { display: false } } }
    });
}

function renderAchievements() {
    const grid = document.getElementById('achievementsGrid');
    grid.innerHTML = '';

    achievements.forEach(ach => {
        const unlocked = userData.achievements.includes(ach.id);
        const div = document.createElement('div');
        div.className = `achievement-card diff-${ach.diff}`;

        div.innerHTML = `
            <span class="achievement-icon">${unlocked || !ach.hidden ? ach.icon : '❓'}</span>
            <div class="achievement-name">${unlocked || !ach.hidden ? ach.name : '???'}</div>
            <div class="achievement-desc">${unlocked || !ach.hidden ? ach.desc : '???'}</div>
        `;
        grid.appendChild(div);
    });
}

function renderLeaderboard() {
    const list = document.getElementById('leaderboardList');
    list.innerHTML = '';

    let users = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('ecotrack_user_')) {
            users.push(JSON.parse(localStorage.getItem(key)));
        }
    }

    users.sort((a, b) => b.totalPoints - a.totalPoints);

    users.forEach((u, index) => {
        const div = document.createElement('div');
        div.className = 'leader-item';
        const posClass = index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : '';

        div.innerHTML = `
            <div class="leader-position ${posClass}">${index + 1}</div>
            <div class="leader-info">
                <div class="leader-name">${u.user.name}</div>
                <div class="leader-class">${u.user.city}, ${u.user.school}</div>
            </div>
            <div class="leader-points">${u.totalPoints}</div>
        `;
        list.appendChild(div);
    });
}
