// Firebase Config
firebase.initializeApp({
    apiKey: "AIzaSyDnqd553IyzA9AlsZzt9pv8u0S-KdroyX4",
    authDomain: "ecotrack-db.firebaseapp.com",
    projectId: "ecotrack-db",
    storageBucket: "ecotrack-db.firebasestorage.app",
    messagingSenderId: "280648314403",
    appId: "1:280648314403:web:3f5624ac94124be206cb96"
});

const db = firebase.firestore();
const TEACHER_CODE = "УЧИТЕЛЬ2026";

const ACTIONS = [
    {id:1, name:"💡 Выключил свет", points:5, desc:"Выключил свет, выходя из комнаты"},
{id:2, name:"🚶 Прошел пешком", points:10, desc:"Выбрал прогулку вместо транспорта"},
{id:3, name:"♻️ Сдал пластик", points:15, desc:"Сдал пластиковые бутылки на переработку"},
{id:4, name:"💧 Своя бутылка", points:8, desc:"Использовал многоразовую бутылку"},
{id:5, name:"🌳 Посадил дерево", points:20, desc:"Посадил растение или дерево"},
{id:6, name:"🦷 Выключил воду", points:7, desc:"Выключал воду при чистке зубов"},
{id:7, name:"🚌 Общественный транспорт", points:12, desc:"Поехал на автобусе/метро"},
{id:8, name:"🔋 Сдал батарейки", points:15, desc:"Сдал использованные батарейки"}
];

const TASKS = [
    {id:1, title:"Эко-старт", desc:"Выполни 3 любых действия за день", points:20, difficulty:"easy", req:{type:"daily_actions", count:3}},
{id:2, title:"Неделя активности", desc:"Сохраняй данные 7 дней подряд", points:100, difficulty:"medium", req:{type:"streak", count:7}},
{id:3, title:"Месяц эко-привычек", desc:"30 дней активности", points:500, difficulty:"hard", req:{type:"streak", count:30}},
{id:4, title:"Светлячок", desc:"Выключи свет 20 раз", points:50, difficulty:"easy", req:{type:"action", id:1, count:20}},
{id:5, title:"Пешеход", desc:"Пройди пешком 15 раз", points:75, difficulty:"medium", req:{type:"action", id:2, count:15}},
{id:6, title:"Переработчик", desc:"Сдай пластик 10 раз", points:100, difficulty:"medium", req:{type:"action", id:3, count:10}},
{id:7, title:"Защитник природы", desc:"Посади 5 растений", points:150, difficulty:"hard", req:{type:"action", id:5, count:5}},
{id:8, title:"Эко-чемпион", desc:"Набери 1000 очков", points:0, difficulty:"hard", req:{type:"points", count:1000}}
];

const ACHIEVEMENTS = [
    {id:1, name:"🌱 Первые шаги", desc:"Набери 10 очков", icon:"🌱", req:10, type:"points"},
{id:2, name:"🌿 Новичок", desc:"Набери 50 очков", icon:"🌿", req:50, type:"points"},
{id:3, name:"🌳 Активист", desc:"Набери 200 очков", icon:"🌳", req:200, type:"points"},
{id:4, name:"🦸 Герой экологии", desc:"Набери 500 очков", icon:"🦸", req:500, type:"points"},
{id:5, name:"👑 Легенда", desc:"Набери 1000 очков", icon:"👑", req:1000, type:"points"},
{id:6, name:"🔥 Неделя активности", desc:"7 дней подряд", icon:"🔥", req:7, type:"streak"},
{id:7, name:"📅 Месяц активности", desc:"30 дней подряд", icon:"📅", req:30, type:"streak"},
{id:8, name:"💡 Светлячок", desc:"Выключи свет 20 раз", icon:"💡", req:20, type:"action_1"},
{id:9, name:"👟 Пешеход", desc:"Пройди пешком 20 раз", icon:"👟", req:20, type:"action_2"},
{id:10, name:"♻️ Переработчик", desc:"Сдай пластик 15 раз", icon:"♻️", req:15, type:"action_3"},
{id:11, name:"💧 Водный страж", desc:"Используй бутылку 25 раз", icon:"💧", req:25, type:"action_4"},
{id:12, name:"🌲 Садовод", desc:"Посади 10 растений", icon:"🌲", req:10, type:"action_5"}
];

let user = null;
let userData = null;
let uid = null;

// Уведомления на сайте
window.showNotification = function(message, type='success') {
    const notif = document.createElement('div');
    notif.className = `notification ${type}`;
    notif.textContent = message;
    document.body.appendChild(notif);
    setTimeout(() => {
        notif.style.opacity = '0';
        notif.style.transform = 'translateX(100px)';
        setTimeout(() => notif.remove(), 300);
    }, 3000);
};

// Смена темы
window.toggleTheme = function() {
    const body = document.body;
    const current = body.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', next);
    localStorage.setItem('eco_theme', next);
    showNotification('Тема изменена на ' + (next === 'dark' ? 'тёмную' : 'светлую'));
};

// Показать/скрыть поле кода учителя
window.toggleTeacherCode = function() {
    const role = document.getElementById('role').value;
    const group = document.getElementById('teacher-code-group');
    const input = document.getElementById('teacher-code');
    if (role === 'teacher') {
        group.classList.remove('hidden');
        input.required = true;
    } else {
        group.classList.add('hidden');
        input.required = false;
        input.value = '';
    }
};

// Скрыть все экраны
window.hideAllScreens = function() {
    const screens = ['student-screen', 'teacher-screen', 'stats-screen', 'leaders-screen', 'achievements-screen', 'calendar-screen'];
    screens.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });
};

// Переход по ролям
window.routeUser = function() {
    if (!userData || !user) return;
    window.hideAllScreens();
    document.getElementById('reg-screen').classList.add('hidden');

    if (userData.user.role === 'teacher') {
        window.showTeacherScreen();
    } else {
        window.showStudentScreen();
    }
};

// Регистрация
window.doRegister = function() {
    const firstName = document.getElementById('first-name').value.trim();
    const lastName = document.getElementById('last-name').value.trim();
    const role = document.getElementById('role').value;
    const code = document.getElementById('teacher-code').value;
    const type = document.getElementById('school-type').value;
    const num = document.getElementById('school-num').value;
    const city = document.getElementById('city').value;
    const cls = document.getElementById('class').value;

    if (!firstName || !lastName || !num || !city || !cls) {
        showNotification('Заполните все поля!', 'error');
        return;
    }

    if (role === 'teacher' && code !== TEACHER_CODE) {
        showNotification('Неверный код учителя!', 'error');
        return;
    }

    uid = Date.now().toString();
    const fullName = firstName + " " + lastName;
    user = {firstName, lastName, fullName, role, school: type + " " + num, city, class: cls};
    userData = {user, points: 0, streak: 0, lastDate: null, history: [], achievements: [], completedTasks: []};

    db.collection("users").doc(uid).set(userData).then(() => {
        localStorage.setItem('eco_uid', uid);
        showNotification('Регистрация успешна! 🎉');
        setTimeout(() => window.routeUser(), 500);
    }).catch(err => {
        showNotification('Ошибка: ' + err.message, 'error');
    });
};

// Показать экран ученика
window.showStudentScreen = function() {
    window.hideAllScreens();
    document.getElementById('student-screen').classList.remove('hidden');

    document.getElementById('user-greeting').textContent = 'Привет, ' + user.fullName + '! 👋';
    document.getElementById('user-info').textContent = user.city + ', ' + user.school + ' | ' + user.class;
    document.getElementById('points').textContent = userData.points;
    document.getElementById('streak').textContent = userData.streak;
    document.getElementById('level').textContent = window.getLevel(userData.points);

    // Actions
    const div = document.getElementById('actions');
    div.innerHTML = '';
    ACTIONS.forEach(a => {
        div.innerHTML += `<div class="action-item">
        <input type="checkbox" id="act${a.id}" data-points="${a.points}">
        <div class="action-info">
        <div class="action-name">${a.name}</div>
        <div style="font-size:0.85rem;color:var(--text-light)">${a.desc}</div>
        </div>
        <span class="action-points">+${a.points}</span>
        </div>`;
    });

    // Tasks
    window.renderTasks();
};

// Отобразить задания
window.renderTasks = function() {
    const div = document.getElementById('tasks-list');
    div.innerHTML = '';

    const completed = userData.completedTasks || [];

    TASKS.forEach(task => {
        const isCompleted = completed.includes(task.id);
        div.innerHTML += `<div class="task-item ${task.difficulty}" onclick="checkTask(${task.id})">
        <div class="task-header">
        <div class="task-title">${task.title}</div>
        <div class="task-difficulty ${task.difficulty}">${task.difficulty === 'easy' ? 'Легко' : task.difficulty === 'medium' ? 'Средне' : 'Сложно'}</div>
        </div>
        <div class="task-desc">${task.desc}</div>
        <div class="task-reward">🏆 ${task.points > 0 ? '+' + task.points + ' очков' : 'Достижение!'}</div>
        ${isCompleted ? '<div style="margin-top:10px;color:var(--primary);font-weight:700">✓ Выполнено</div>' : ''}
        </div>`;
    });
};

// Проверка задания
window.checkTask = function(taskId) {
    const task = TASKS.find(t => t.id === taskId);
    if (!task || (userData.completedTasks || []).includes(taskId)) return;

    let completed = false;

    if (task.req.type === 'points' && userData.points >= task.req.count) completed = true;
    if (task.req.type === 'streak' && userData.streak >= task.req.count) completed = true;
    if (task.req.type === 'daily_actions' && userData.history.length > 0) {
        const today = new Date().toDateString();
        const todayHistory = userData.history.filter(h => h.date === today);
        const actionsToday = todayHistory.reduce((sum, h) => sum + Object.keys(h.actions || {}).length, 0);
        if (actionsToday >= task.req.count) completed = true;
    }
    if (task.req.type === 'action') {
        const actionId = task.req.id.toString();
        let count = 0;
        userData.history.forEach(h => {
            if (h.actions && h.actions[actionId]) count += h.actions[actionId];
        });
            if (count >= task.req.count) completed = true;
    }

    if (completed) {
        if (!userData.completedTasks) userData.completedTasks = [];
        userData.completedTasks.push(taskId);
        if (task.points > 0) {
            userData.points += task.points;
        }
        db.collection("users").doc(uid).set(userData);
        showNotification(`Задание "${task.title}" выполнено! +${task.points} очков`, 'success');
        window.renderTasks();
        document.getElementById('points').textContent = userData.points;
    } else {
        showNotification('Задание ещё не выполнено. Продолжай в том же духе!', 'error');
    }
};

// Показать экран учителя
window.showTeacherScreen = function() {
    window.hideAllScreens();
    document.getElementById('teacher-screen').classList.remove('hidden');
    document.getElementById('teacher-info').textContent = user.fullName + ' | ' + user.city + ', ' + user.school;
    window.loadTeacherData();
};

// Сохранить день
window.saveDay = function() {
    const checked = document.querySelectorAll('#actions input:checked');
    if (checked.length === 0) {
        showNotification('Выберите хотя бы одно действие!', 'error');
        return;
    }

    const today = new Date().toDateString();
    if (userData.lastDate === today) {
        showNotification('Вы уже сохраняли данные сегодня!', 'error');
        return;
    }

    let pts = 0;
    let actionsDone = {};
    checked.forEach(c => {
        pts += parseInt(c.dataset.points);
        const actId = c.dataset.id;
        actionsDone[actId] = (actionsDone[actId] || 0) + 1;
    });

    userData.points += pts;
    userData.lastDate = today;
    userData.streak++;
    userData.history.push({date: today, points: pts, actions: actionsDone});

    window.checkAchievements();

    db.collection("users").doc(uid).set(userData).then(() => {
        document.getElementById('points').textContent = userData.points;
        document.getElementById('streak').textContent = userData.streak;
        document.getElementById('level').textContent = window.getLevel(userData.points);
        showNotification(`+${pts} очков! Отличная работа! 🔥`);
        document.querySelectorAll('#actions input').forEach(c => c.checked = false);
        window.renderTasks();
    });
};

// Статистика
window.showStats = function() {
    window.hideAllScreens();
    document.getElementById('stats-screen').classList.remove('hidden');

    const ctx = document.getElementById('chart').getContext('2d');
    const hist = userData.history.slice(-7);

    if (window.myChart) window.myChart.destroy();

    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: hist.map(h => h.date.slice(0,5)),
                               datasets: [{
                                   label: 'Очки',
                                   data: hist.map(h => h.points),
                               borderColor: '#10b981',
                               backgroundColor: 'rgba(16,185,129,0.2)',
                               fill: true,
                               tension: 0.4
                               }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0,0,0,0.05)' }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });
};

// Топ школы
window.showLeaders = function() {
    window.hideAllScreens();
    document.getElementById('leaders-screen').classList.remove('hidden');

    const div = document.getElementById('leaders-list');
    div.innerHTML = '<p style="text-align:center;color:var(--text-light)">Загрузка...</p>';

    db.collection("users").where("user.school", "==", user.school).orderBy("points", "desc").limit(20).get().then(snap => {
        div.innerHTML = '';
        if (snap.empty) {
            div.innerHTML = '<p style="text-align:center;color:var(--text-light)">Пока нет участников. Будь первым!</p>';
            return;
        }

        let i = 1;
        snap.forEach(doc => {
            const u = doc.data();
            if (u.user.role === 'student') {
                const icon = i === 1 ? '🥇' : i === 2 ? '🥈' : i === 3 ? '🥉' : `<span style="color:var(--text-light);font-weight:700">${i}.</span>`;
                div.innerHTML += `<div style="padding:15px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center">
                <div>
                <div style="font-size:1.2rem">${icon} <b>${u.user.fullName}</b></div>
                <div style="color:var(--text-light);font-size:0.9rem">${u.user.class}</div>
                </div>
                <div style="background:var(--primary-light);padding:8px 16px;border-radius:20px;font-weight:700;color:var(--primary)">${u.points} очков</div>
                </div>`;
                i++;
            }
        });
    });
};

// Достижения
window.showAchievements = function() {
    window.hideAllScreens();
    document.getElementById('achievements-screen').classList.remove('hidden');

    const div = document.getElementById('badges-list');
    div.innerHTML = '';

    const unlocked = userData.achievements || [];

    ACHIEVEMENTS.forEach(a => {
        const isUnlocked = unlocked.includes(a.id);
        div.innerHTML += `<div class="badge ${isUnlocked ? 'unlocked' : 'locked'}" title="${a.desc}">
        <div class="badge-icon">${a.icon}</div>
        <div class="badge-name">${a.name}</div>
        <div class="badge-desc">${a.desc}</div>
        </div>`;
    });
};

// Календарь
window.showCalendar = function() {
    window.hideAllScreens();
    document.getElementById('calendar-screen').classList.remove('hidden');

    const div = document.getElementById('activity-calendar');
    div.innerHTML = '';

    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
        const dateStr = new Date(today.getFullYear(), today.getMonth(), i).toDateString();
        const active = userData.history && userData.history.some(h => h.date === dateStr);
        const isToday = i === today.getDate();

        div.innerHTML += `<div class="calendar-day ${active ? 'active' : ''} ${isToday ? 'today' : ''}">${i}</div>`;
    }
};

// Данные учителя
window.loadTeacherData = function() {
    db.collection("users").where("user.school", "==", user.school).get().then(snap => {
        let students = [];
        let totalPoints = 0;
        let maxPoints = 0;

        snap.forEach(doc => {
            const d = doc.data();
            if (d.user.role === 'student') {
                students.push({...d, id: doc.id});
                totalPoints += d.points;
                if (d.points > maxPoints) maxPoints = d.points;
            }
        });

        document.getElementById('total-students').textContent = students.length;
        document.getElementById('class-avg').textContent = students.length ? Math.round(totalPoints / students.length) : 0;
        document.getElementById('top-score').textContent = maxPoints;

        const container = document.getElementById('teacher-content');
        let html = '<h3 style="margin:25px 0 15px">📋 Список класса</h3><div class="table-container"><table><thead><tr><th>ФИО</th><th>Класс</th><th>Очки</th><th>Серия</th><th>Действие</th></tr></thead><tbody>';

        students.sort((a, b) => b.points - a.points).forEach(s => {
            html += `<tr>
            <td><b>${s.user.fullName}</b></td>
            <td>${s.user.class}</td>
            <td><b>${s.points}</b></td>
            <td>${s.streak} дн.</td>
            <td><button onclick="window.deleteStudent('${s.id}')" style="background:var(--danger);color:white;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:0.85rem">Удалить</button></td>
            </tr>`;
        });

        html += '</tbody></table></div>';
        container.innerHTML = html;
    });
};

// Удалить ученика
window.deleteStudent = function(studentId) {
    if (confirm('Вы уверены, что хотите удалить этого ученика?')) {
        db.collection("users").doc(studentId).delete().then(() => {
            showNotification('Ученик удалён');
            window.loadTeacherData();
        });
    }
};

// Проверка достижений
window.checkAchievements = function() {
    if (!userData.achievements) userData.achievements = [];
    let newAchievements = false;

    ACHIEVEMENTS.forEach(a => {
        if (userData.achievements.includes(a.id)) return;

        let got = false;
        if (a.type === 'points' && userData.points >= a.req) got = true;
        if (a.type === 'streak' && userData.streak >= a.req) got = true;
        if (a.type.startsWith('action_')) {
            const actionId = a.type.split('_')[1];
            let count = 0;
            userData.history.forEach(h => {
                if (h.actions && h.actions[actionId]) count += h.actions[actionId];
            });
                if (count >= a.req) got = true;
        }

        if (got) {
            userData.achievements.push(a.id);
            newAchievements = true;
            showNotification(`🏆 Новое достижение: ${a.name}!`, 'success');
        }
    });

    if (newAchievements) {
        db.collection("users").doc(uid).set(userData);
    }
};

window.getLevel = function(p) {
    if (p < 50) return "Новичок";
    if (p < 200) return "Активист";
    if (p < 500) return "Герой";
    if (p < 1000) return "Легенда";
    return "Титан";
};

window.logout = function() {
    localStorage.removeItem('eco_uid');
    showNotification('До свидания! 👋');
    setTimeout(() => location.reload(), 1000);
};

// Инициализация
window.onload = function() {
    const savedTheme = localStorage.getItem('eco_theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);

    const saved = localStorage.getItem('eco_uid');
    if (saved) {
        uid = saved;
        db.collection("users").doc(uid).get().then(doc => {
            if (doc.exists) {
                userData = doc.data();
                user = userData.user;
                window.routeUser();
            }
        }).catch(err => {
            console.error('Error:', err);
        });
    }
};
