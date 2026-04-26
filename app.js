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

// Data
const ACTIONS = [
    {id:1, name:"💡 Выключил свет", points:5, icon:"💡"},
{id:2, name:"🚶 Прошел пешком", points:10, icon:"🚶"},
{id:3, name:"♻️ Сдал пластик", points:15, icon:"♻️"},
{id:4, name:"💧 Своя бутылка", points:8, icon:"💧"},
{id:5, name:"🌳 Посадил дерево", points:20, icon:"🌳"},
{id:6, name:"🦷 Выключил воду", points:7, icon:"🦷"},
{id:7, name:"🚌 Общественный транспорт", points:12, icon:"🚌"},
{id:8, name:"🔋 Сдал батарейки", points:15, icon:"🔋"}
];

const ACHIEVEMENTS = [
    {id:1, name:"Первые шаги", icon:"🌱", req:10, type:"points"},
{id:2, name:"Новичок", icon:"🌿", req:50, type:"points"},
{id:3, name:"Активист", icon:"🌳", req:200, type:"points"},
{id:4, name:"Герой", icon:"🦸", req:500, type:"points"},
{id:5, name:"Легенда", icon:"👑", req:1000, type:"points"},
{id:6, name:"Неделя активности", icon:"📅", req:7, type:"streak"},
{id:7, name:"Месяц активности", icon:"🗓️", req:30, type:"streak"},
{id:8, name:"Светлячок", icon:"💡", req:20, type:"action_1"},
{id:9, name:"Пешеход", icon:"👟", req:20, type:"action_2"},
{id:10, name:"Эко-воин", icon:"♻️", req:50, type:"action_3"}
];

const SHOP_ITEMS = [
    {id:1, name:"Эко-герой", icon:"🦸", price:100, desc:"Звание эко-героя"},
{id:2, name:"Зеленый палец", icon:"🌱", price:150, desc:"Награда за посадку"},
{id:3, name:"Спаситель планеты", icon:"🌍", price:300, desc:"Высшая награда"},
{id:4, name:"Эко-мастер", icon:"🎖️", price:500, desc:"Мастер экологии"},
{id:5, name:"Природный друг", icon:"🦋", price:200, desc:"Друг природы"}
];

let user = null;
let userData = null;
let uid = null;
let currentTheme = 'light';

// Theme
window.toggleTheme = function() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('eco_theme', currentTheme);
};

// Notifications
window.showNotification = function(message, type='success') {
    const notif = document.createElement('div');
    notif.className = `notification ${type}`;
    notif.textContent = message;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 3000);
};

window.showNotifications = function() {
    showNotification('У вас нет новых уведомлений', 'success');
};

// Registration
window.toggleTeacherCode = function() {
    const role = document.getElementById('role').value;
    const group = document.getElementById('teacher-code-group');
    if (role === 'teacher') {
        group.classList.remove('hidden');
    } else {
        group.classList.add('hidden');
    }
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
    userData = {user, points: 0, streak: 0, lastDate: null, history: [], achievements: [], purchasedItems: []};

    db.collection("users").doc(uid).set(userData).then(() => {
        localStorage.setItem('eco_uid', uid);
        showNotification('Регистрация успешна! 🎉');
        setTimeout(() => routeUser(), 500);
    }).catch(err => {
        showNotification('Ошибка: ' + err.message, 'error');
    });
};

// Save Day
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

    checkAchievements();

    db.collection("users").doc(uid).set(userData).then(() => {
        document.getElementById('points').textContent = userData.points;
        document.getElementById('streak').textContent = userData.streak;
        document.getElementById('level').textContent = getLevel(userData.points);
        showNotification(`+${pts} очков! Отличная работа! 🔥`);
        document.querySelectorAll('#actions input').forEach(c => c.checked = false);
    });
};

// Continue in next message...
