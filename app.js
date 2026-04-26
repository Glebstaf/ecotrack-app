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
    {id:1, name:"💡 Выключил свет", points:5},
{id:2, name:"🚶 Прошел пешком", points:10},
{id:3, name:"♻️ Сдал пластик", points:15},
{id:4, name:"💧 Своя бутылка", points:8},
{id:5, name:"🌳 Посадил дерево", points:20},
{id:6, name:"🦷 Выключил воду", points:7},
{id:7, name:"🚌 Транспорт", points:12},
{id:8, name:"🔋 Батарейки", points:15}
];

const ACHIEVEMENTS = [
    {id:1, name:"🌱 Первые шаги", req:10, type:"points"},
{id:2, name:"🌿 Новичок", req:50, type:"points"},
{id:3, name:"🌳 Активист", req:200, type:"points"},
{id:4, name:"🦸 Герой", req:500, type:"points"},
{id:5, name:"👑 Легенда", req:1000, type:"points"},
{id:6, name:"📅 Неделя", req:7, type:"streak"}
];

let user = null;
let userData = null;
let uid = null;

// ВСЕ ФУНКЦИИ ОБЪЯВЛЕНЫ СРАЗУ:

window.toggleTheme = function() {
    const body = document.body;
    const current = body.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', next);
    localStorage.setItem('eco_theme', next);
};

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

window.showNotification = function(msg) {
    alert(msg);
};

window.routeUser = function() {
    if (!userData || !user) return;
    hideAllScreens();
    if (userData.user.role === 'teacher') {
        showTeacherScreen();
    } else {
        showStudentScreen();
    }
};

window.hideAllScreens = function() {
    ['student-screen', 'teacher-screen', 'stats-screen', 'leaders-screen', 'achievements-screen', 'tasks-screen', 'shop-screen', 'calendar-screen'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });
};

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
        alert('Заполните все поля!');
        return;
    }

    if (role === 'teacher') {
        if (!code || code !== TEACHER_CODE) {
            alert('Неверный код учителя!');
            return;
        }
    }

    uid = Date.now().toString();
    const fullName = firstName + " " + lastName;
    user = {firstName, lastName, fullName, role, school: type + " " + num, city, class: cls};
    userData = {user, points: 0, streak: 0, lastDate: null, history: [], achievements: [], purchasedItems: []};

    db.collection("users").doc(uid).set(userData).then(() => {
        localStorage.setItem('eco_uid', uid);
        alert('Регистрация успешна! 🎉');
        routeUser();
    }).catch(err => {
        alert('Ошибка: ' + err.message);
    });
};

window.showStudentScreen = function() {
    hideAllScreens();
    document.getElementById('student-screen').classList.remove('hidden');

    document.getElementById('user-greeting').textContent = 'Привет, ' + user.fullName + '! 👋';
    document.getElementById('user-info').textContent = user.city + ', ' + user.school;
    document.getElementById('points').textContent = userData.points;
    document.getElementById('streak').textContent = userData.streak;
    document.getElementById('level').textContent = getLevel(userData.points);

    const div = document.getElementById('actions');
    div.innerHTML = '';
    ACTIONS.forEach(a => {
        div.innerHTML += `<div class="action-item">
        <input type="checkbox" id="act${a.id}" data-points="${a.points}">
        <div class="action-info">
        <div class="action-name">${a.name}</div>
        </div>
        <span class="action-points">+${a.points}</span>
        </div>`;
    });
};

window.showTeacherScreen = function() {
    hideAllScreens();
    document.getElementById('teacher-screen').classList.remove('hidden');
    document.getElementById('teacher-info').textContent = user.fullName + ' | ' + user.city + ', ' + user.school;
    loadTeacherData();
};

window.saveDay = function() {
    const checked = document.querySelectorAll('#actions input:checked');
    if (checked.length === 0) return alert('Выберите действие!');

    const today = new Date().toDateString();
    if (userData.lastDate === today) return alert('Уже сохранено сегодня!');

    let pts = 0;
    checked.forEach(c => pts += parseInt(c.dataset.points));

    userData.points += pts;
    userData.lastDate = today;
    userData.streak++;
    userData.history.push({date: today, points: pts});

    checkAchievements();

    db.collection("users").doc(uid).set(userData);

    document.getElementById('points').textContent = userData.points;
    document.getElementById('streak').textContent = userData.streak;
    document.getElementById('level').textContent = getLevel(userData.points);
    alert('+' + pts + ' очков! 🔥');

    document.querySelectorAll('#actions input').forEach(c => c.checked = false);
};

window.showStats = function() {
    hideAllScreens();
    document.getElementById('stats-screen').classList.remove('hidden');

    const ctx = document.getElementById('chart').getContext('2d');
    const hist = userData.history.slice(-7);

    if (window.myChart) window.myChart.destroy();

    window.myChart = new Chart(ctx, {
        type: 'line',
        {
            labels: hist.map(h => h.date.slice(0,5)),
                               datasets: [{
                                   label: 'Очки',
                                   hist.map(h => h.points),
                               borderColor: '#10b981',
                               backgroundColor: 'rgba(16,185,129,0.2)',
                               fill: true
                               }]
        },
        options: {responsive: true, maintainAspectRatio: false}
    });
};

window.showLeaders = function() {
    hideAllScreens();
    document.getElementById('leaders-screen').classList.remove('hidden');

    const div = document.getElementById('leaders-list');
    div.innerHTML = 'Загрузка...';

    db.collection("users").where("user.school", "==", user.school).orderBy("points", "desc").limit(20).get().then(snap => {
        div.innerHTML = '';
        if (snap.empty) {
            div.innerHTML = '<p style="text-align:center;color:var(--text-light)">Пока нет участников</p>';
            return;
        }

        let i = 1;
        snap.forEach(doc => {
            const u = doc.data();
            if (u.user.role === 'student') {
                const icon = i === 1 ? '🥇' : i === 2 ? '🥈' : i === 3 ? '🥉' : i + '.';
                div.innerHTML += `<div style="padding:12px;border-bottom:1px solid var(--border)">
                <b>${icon} ${u.user.fullName}</b> <small>(${u.user.class})</small> — ${u.points} очков
                </div>`;
                i++;
            }
        });
    });
};

window.showAchievements = function() {
    hideAllScreens();
    document.getElementById('achievements-screen').classList.remove('hidden');

    const div = document.getElementById('badges-list');
    div.innerHTML = '';

    ACHIEVEMENTS.forEach(a => {
        const unlocked = userData.achievements && userData.achievements.includes(a.id);
        div.innerHTML += `<div class="badge ${unlocked ? 'unlocked' : 'locked'}">
        <div class="badge-icon">${a.icon}</div>
        <div class="badge-name">${a.name}</div>
        </div>`;
    });
};

window.showTasks = function() {
    hideAllScreens();
    document.getElementById('tasks-screen').classList.remove('hidden');
    document.getElementById('tasks-list').innerHTML = '<p style="text-align:center;color:var(--text-light)">Заданий пока нет</p>';
};

window.showShop = function() {
    hideAllScreens();
    document.getElementById('shop-screen').classList.remove('hidden');

    const div = document.getElementById('shop-list');
    div.innerHTML = '';

    const purchased = userData.purchasedItems || [];

    ACHIEVEMENTS.forEach(a => {
        const bought = purchased.includes(a.id);
        div.innerHTML += `<div class="shop-item ${bought ? 'locked' : ''}" onclick="${bought ? '' : 'buyItem(' + a.id + ',' + a.req + ')'}">
        <div class="shop-icon">${a.icon}</div>
        <div class="shop-name">${a.name}</div>
        <div class="shop-price">${bought ? '✓ Куплено' : a.req + ' очков'}</div>
        </div>`;
    });
};

window.buyItem = function(id, price) {
    if (userData.points < price) {
        alert('Недостаточно очков!');
        return;
    }

    if (!userData.purchasedItems) userData.purchasedItems = [];
    userData.purchasedItems.push(id);
    userData.points -= price;

    db.collection("users").doc(uid).set(userData).then(() => {
        alert('Покупка успешна! 🎉');
        showShop();
    });
};

window.showCalendar = function() {
    hideAllScreens();
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
        let html = '<h3 style="margin:20px 0 10px">📋 Список класса</h3><div class="table-container" style="overflow-x:auto"><table style="width:100%;border-collapse:collapse"><thead><tr style="background:var(--bg)"><th style="padding:12px;text-align:left">ФИО</th><th style="padding:12px;text-align:left">Класс</th><th style="padding:12px;text-align:left">Очки</th><th style="padding:12px;text-align:left">Действие</th></tr></thead><tbody>';

        students.forEach(s => {
            html += `<tr style="border-bottom:1px solid var(--border)">
            <td style="padding:12px">${s.user.fullName}</td>
            <td style="padding:12px">${s.user.class}</td>
            <td style="padding:12px"><b>${s.points}</b></td>
            <td style="padding:12px"><button onclick="deleteStudent('${s.id}')" style="background:var(--danger);color:white;border:none;padding:5px 10px;border-radius:6px;cursor:pointer">Удалить</button></td>
            </tr>`;
        });

        html += '</tbody></table></div>';
        container.innerHTML = html;
    });
};

window.deleteStudent = function(studentId) {
    if (confirm('Удалить ученика?')) {
        db.collection("users").doc(studentId).delete().then(() => {
            loadTeacherData();
            alert('Ученик удален');
        });
    }
};

window.checkAchievements = function() {
    if (!userData.achievements) userData.achievements = [];

    ACHIEVEMENTS.forEach(a => {
        if (userData.achievements.includes(a.id)) return;

        let got = false;
        if (a.type === 'points' && userData.points >= a.req) got = true;
        if (a.type === 'streak' && userData.streak >= a.req) got = true;

        if (got) {
            userData.achievements.push(a.id);
            alert('🏆 Достижение: ' + a.name + '!');
        }
    });
};

function getLevel(p) {
    if (p < 50) return "Новичок";
    if (p < 200) return "Активист";
    if (p < 500) return "Герой";
    if (p < 1000) return "Легенда";
    return "Титан";
}

window.logout = function() {
    localStorage.removeItem('eco_uid');
    location.reload();
};

// Инициализация при загрузке
window.onload = function() {
    // Load theme
    const savedTheme = localStorage.getItem('eco_theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);

    // Load user
    const saved = localStorage.getItem('eco_uid');
    if (saved) {
        uid = saved;
        db.collection("users").doc(uid).get().then(doc => {
            if (doc.exists) {
                userData = doc.data();
                user = userData.user;
                routeUser();
            }
        }).catch(err => {
            console.error('Error loading user:', err);
        });
    }
};
