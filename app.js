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
    {id:1, name:"💡 Выключил свет", points:5}, {id:2, name:"🚶 Прошел пешком", points:10},
{id:3, name:"♻️ Сдал пластик", points:15}, {id:4, name:"💧 Своя бутылка", points:8},
{id:5, name:"🌳 Посадил дерево", points:20}, {id:6, name:"🦷 Выключил воду", points:7},
{id:7, name:"🚌 Транспорт", points:12}, {id:8, name:"🔋 Батарейки", points:15}
];

const TASKS = [
    {id:1, title:"Эко-старт", desc:"Выполни 3 действия за день", points:20, diff:"easy", req:{type:"daily", count:3}},
{id:2, title:"Неделя силы", desc:"7 дней серии", points:100, diff:"medium", req:{type:"streak", count:7}},
{id:3, title:"Светлячок", desc:"Выключи свет 20 раз", points:50, diff:"easy", req:{type:"act", id:1, count:20}},
{id:4, title:"Мастер пластика", desc:"Сдай пластик 15 раз", points:100, diff:"hard", req:{type:"act", id:3, count:15}},
{id:5, title:"Герой", desc:"Набери 1000 очков", points:0, diff:"hard", req:{type:"points", count:1000}}
];

const ACHIEVEMENTS = [
    {id:1, name:"Новичок", icon:"🌱", req:10, type:"points"}, {id:2, name:"Активист", icon:"🌿", req:50, type:"points"},
{id:3, name:"Герой", icon:"🦸", req:500, type:"points"}, {id:4, name:"Легенда", icon:"👑", req:1000, type:"points"},
{id:5, name:"Серия 7", icon:"🔥", req:7, type:"streak"}, {id:6, name:"Серия 30", icon:"📅", req:30, type:"streak"}
];

const SHOP_ITEMS = [
    {id:1, name:"Супер-рамка", icon:"🖼️", price:100, type:"frame"},
{id:2, name:"Корона", icon:"👑", price:500, type:"avatar"},
{id:3, name:"Звезда", icon:"⭐", price:50, type:"avatar"},
{id:4, name:"Ракета", icon:"🚀", price:150, type:"avatar"},
{id:5, name:"Титул: Эко-Бог", icon:"🏆", price:1000, type:"title", text:"Эко-Бог"}
];

const TIPS = [
    "Выключай воду, когда чистишь зубы — это экономит до 10 литров!",
"Одна переработанная алюминиевая банка экономит энергию, как лампочка на 3 часа!",
"Используй многоразовую сумку вместо пакетов — они разлагаются 400 лет.",
"Сдай макулатуру — 100 кг бумаги спасают 1 дерево.",
"Выключай приборы из розетки — они потребляют энергию даже в режиме ожидания."
];

let user = null;
let userData = null;
let uid = null;

window.toggleTheme = function() {
    const b = document.body;
    b.setAttribute('data-theme', b.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
};

window.toggleTeacherCode = function() {
    const g = document.getElementById('teacher-code');
    document.getElementById('role').value === 'teacher' ? g.classList.remove('hidden') : g.classList.add('hidden');
};

window.hideAllScreens = function() {
    ['reg-screen', 'student-screen', 'teacher-screen', 'stats-screen', 'achievements-screen', 'shop-screen', 'leaders-screen'].forEach(id => {
        document.getElementById(id).classList.add('hidden');
    });
};

window.routeUser = function() {
    if (!userData || !user) return;
    window.hideAllScreens();
    if (userData.user.role === 'teacher') {
        document.getElementById('teacher-screen').classList.remove('hidden');
        window.loadTeacherData();
        document.getElementById('teacher-info').textContent = user.fullName + ' | ' + user.school;
    } else {
        document.getElementById('student-screen').classList.remove('hidden');
        window.showStudentScreen();
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
        alert('Заполните все поля!');
        return;
    }

    if (role === 'teacher' && code !== TEACHER_CODE) {
        alert('Неверный код учителя!');
        return;
    }

    uid = Date.now().toString();
    const fullName = firstName + " " + lastName;
    user = {firstName, lastName, fullName, role, school: type + " " + num, city, class: cls};
    userData = {user, points: 0, streak: 0, lastDate: null, history: [], achievements: [], completedTasks: [], inventory: []};

    db.collection("users").doc(uid).set(userData).then(() => {
        localStorage.setItem('eco_uid', uid);
        alert('Регистрация успешна! 🎉');
        window.routeUser();
    }).catch(err => {
        alert('Ошибка: ' + err.message);
    });
};

window.showStudentScreen = function() {
    document.getElementById('user-greeting').textContent = 'Привет, ' + user.fullName + '!';
    document.getElementById('user-info').textContent = user.city + ', ' + user.school + ' | ' + user.class;
    document.getElementById('points').textContent = userData.points;
    document.getElementById('streak').textContent = userData.streak;
    document.getElementById('level').textContent = window.getLevel(userData.points);

    // Show Daily Tip
    const tipBox = document.getElementById('daily-tip');
    tipBox.classList.remove('hidden');
    document.getElementById('tip-content').textContent = TIPS[Math.floor(Math.random() * TIPS.length)];

    // Update Avatar based on shop
    const equipped = userData.equippedAvatar || '🦸♂️';
    document.getElementById('user-avatar').textContent = equipped;

    // Update Title
    const title = userData.equippedTitle || '';
    document.getElementById('user-title').textContent = title;

    // Render Actions
    const div = document.getElementById('actions');
    div.innerHTML = '';
    ACTIONS.forEach(a => {
        div.innerHTML += `<div class="action-item">
        <span style="font-weight:600">${a.name}</span>
        <input type="checkbox" id="act${a.id}" data-points="${a.points}" style="width:24px; height:24px; accent-color:var(--primary)">
        </div>`;
    });
    window.renderTasks();
};

window.renderTasks = function() {
    const div = document.getElementById('tasks-list');
    div.innerHTML = '';
    const completed = userData.completedTasks || [];
    TASKS.forEach(t => {
        const isDone = completed.includes(t.id);
        div.innerHTML += `<div class="task-item" onclick="checkTask(${t.id})" style="opacity:${isDone?0.6:1}">
        <div>
        <div style="font-weight:700">${t.title}</div>
        <div style="font-size:0.85rem; color:var(--text-light)">${t.desc}</div>
        </div>
        <span class="task-badge diff-${t.diff}">${isDone ? '✅' : t.points + ' 🏆'}</span>
        </div>`;
    });
};

window.checkTask = function(id) {
    const t = TASKS.find(x => x.id === id);
    if ((userData.completedTasks||[]).includes(id)) return alert('Уже выполнено!');

    let done = false;
    if (t.req.type === 'points' && userData.points >= t.req.count) done = true;
    if (t.req.type === 'streak' && userData.streak >= t.req.count) done = true;
    if (t.req.type === 'daily' && userData.history.length > 0) {
        const last = userData.history[userData.history.length-1];
        if (Object.keys(last.actions||{}).length >= t.req.count) done = true;
    }
    if (t.req.type === 'act') {
        let c = 0; userData.history.forEach(h => { if(h.actions && h.actions[t.req.id]) c += h.actions[t.req.id]; });
        if (c >= t.req.count) done = true;
    }

    if (done) {
        if (!userData.completedTasks) userData.completedTasks = [];
        userData.completedTasks.push(id);
        if (t.points > 0) userData.points += t.points;
        db.collection("users").doc(uid).set(userData);
        alert(`🎉 Задание "${t.title}" выполнено!`);
        window.showStudentScreen();
    } else {
        alert('Задание еще не выполнено. Продолжай стараться! 💪');
    }
};

window.saveDay = function() {
    const checked = document.querySelectorAll('#actions input:checked');
    if (!checked.length) return alert('Выбери действие!');
    const today = new Date().toDateString();
    if (userData.lastDate === today) return alert('Уже сохранено!');

    let pts = 0; let acts = {};
    checked.forEach(c => { pts += +c.dataset.points; acts[c.dataset.id] = (acts[c.dataset.id]||0)+1; });

    userData.points += pts; userData.lastDate = today; userData.streak++;
    userData.history.push({date: today, points: pts, actions: acts});
    window.checkAchievements();

    db.collection("users").doc(uid).set(userData).then(() => {
        window.showStudentScreen();
        window.confettiExplosion();
    });
};

window.showStats = function() {
    window.hideAllScreens();
    document.getElementById('stats-screen').classList.remove('hidden');
    const ctx = document.getElementById('chart').getContext('2d');
    const h = userData.history.slice(-7);
    if (window.myChart) window.myChart.destroy();

    // ИСПРАВЛЕНИЕ ОШИБКИ CHART.JS
    window.myChart = new Chart(ctx, {
        type: 'line',
        {
            labels: h.map(x => x.date.slice(0,5)),
                               datasets: [{
                                   label: 'Очки',
                                   h.map(x => x.points),
                               borderColor: '#10b981',
                               backgroundColor: 'rgba(16,185,129,0.2)',
                               fill: true,
                               tension: 0.4
                               }]
        },
        options: {responsive: true, plugins:{legend:{display:false}}}
    });
};

window.showShop = function() {
    window.hideAllScreens();
    document.getElementById('shop-screen').classList.remove('hidden');
    const div = document.getElementById('shop-list');
    div.innerHTML = '';
    const owned = userData.inventory || [];

    SHOP_ITEMS.forEach(item => {
        const isOwned = owned.includes(item.id);
        div.innerHTML += `<div class="shop-item ${isOwned ? 'owned' : ''}" onclick="buyItem(${item.id})">
        <span class="shop-icon">${item.icon}</span>
        <div style="font-weight:700">${item.name}</div>
        <div class="shop-price">${isOwned ? 'Куплено' : item.price + ' 🏆'}</div>
        </div>`;
    });
};

window.buyItem = function(id) {
    const item = SHOP_ITEMS.find(x => x.id === id);
    if ((userData.inventory||[]).includes(id)) {
        // Equip logic
        if (item.type === 'avatar') userData.equippedAvatar = item.icon;
        if (item.type === 'title') userData.equippedTitle = item.text;
        db.collection("users").doc(uid).set(userData).then(() => {
            alert('Надето! ✨');
            window.showStudentScreen();
        });
        return;
    }

    if (userData.points < item.price) return alert('Не хватает очков! 😢');

    userData.points -= item.price;
    if (!userData.inventory) userData.inventory = [];
    userData.inventory.push(id);

    // Auto equip first purchase
    if (item.type === 'avatar') userData.equippedAvatar = item.icon;
    if (item.type === 'title') userData.equippedTitle = item.text;

    db.collection("users").doc(uid).set(userData).then(() => {
        alert(`Куплено: ${item.name}! 🎉`);
        window.showShop();
    });
};

window.showAchievements = function() {
    window.hideAllScreens();
    document.getElementById('achievements-screen').classList.remove('hidden');
    const div = document.getElementById('badges-list');
    div.innerHTML = '';
    const unlocked = userData.achievements || [];
    ACHIEVEMENTS.forEach(a => {
        const isU = unlocked.includes(a.id);
        div.innerHTML += `<div style="text-align:center; padding:15px; background:rgba(255,255,255,0.4); border-radius:12px; opacity:${isU?1:0.4}">
        <div style="font-size:2.5rem">${a.icon}</div>
        <div style="font-weight:700; font-size:0.8rem">${a.name}</div>
        </div>`;
    });
};

window.showLeaders = function() {
    window.hideAllScreens();
    document.getElementById('leaders-screen').classList.remove('hidden');
    const div = document.getElementById('leaders-list');
    div.innerHTML = 'Загрузка...';
    db.collection("users").where("user.school", "==", user.school).orderBy("points", "desc").limit(10).get().then(snap => {
        div.innerHTML = '';
        let i=1;
        snap.forEach(doc => {
            const u = doc.data();
            if(u.user.role === 'student') {
                div.innerHTML += `<div style="padding:15px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between">
                <span><b>${i}. ${u.user.fullName}</b></span>
                <span style="font-weight:800; color:var(--primary)">${u.points} 🏆</span>
                </div>`;
                i++;
            }
        });
    });
};

window.loadTeacherData = function() {
    db.collection("users").where("user.school", "==", user.school).get().then(snap => {
        let studs = []; let tp=0, mp=0;
        snap.forEach(doc => {
            const d = doc.data();
            if(d.user.role === 'student') { studs.push({...d, id: doc.id}); tp+=d.points; if(d.points>mp)mp=d.points; }
        });
        document.getElementById('total-students').textContent = studs.length;
        document.getElementById('class-avg').textContent = studs.length ? Math.round(tp/studs.length) : 0;
        document.getElementById('top-score').textContent = mp;

        let html = '<div style="margin-top:20px"><table style="width:100%; text-align:left"><thead><tr style="border-bottom:2px solid var(--border)"><th>ФИО</th><th>Класс</th><th>Очки</th><th>Удл.</th></tr></thead><tbody>';
        studs.forEach(s => {
            html += `<tr style="border-bottom:1px solid var(--border)">
            <td style="padding:10px">${s.user.fullName}</td>
            <td style="padding:10px">${s.user.class}</td>
            <td style="padding:10px"><b>${s.points}</b></td>
            <td style="padding:10px"><button onclick="deleteStudent('${s.id}')" style="background:var(--danger); color:white; border:none; padding:5px 10px; border-radius:6px; cursor:pointer">X</button></td>
            </tr>`;
        });
        html += '</tbody></table></div>';
        document.getElementById('teacher-content').innerHTML = html;
    });
};

window.deleteStudent = function(id) {
    if(confirm('Удалить?')) db.collection("users").doc(id).delete().then(() => window.loadTeacherData());
};

window.checkAchievements = function() {
    if(!userData.achievements) userData.achievements = [];
    ACHIEVEMENTS.forEach(a => {
        if(userData.achievements.includes(a.id)) return;
        let got = false;
        if(a.type === 'points' && userData.points >= a.req) got = true;
        if(a.type === 'streak' && userData.streak >= a.req) got = true;
        if(got) {
            userData.achievements.push(a.id);
            db.collection("users").doc(uid).set(userData);
            alert(`🏆 Достижение: ${a.name}!`);
        }
    });
};

window.getLevel = function(p) {
    if(p<50) return "Новичок"; if(p<200) return "Активист"; if(p<500) return "Герой"; return "Легенда";
};

window.logout = function() {
    localStorage.removeItem('eco_uid');
    location.reload();
};

// Confetti Effect
window.confettiExplosion = function() {
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = (Math.random() * 2 + 1) + 's';
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 3000);
    }
};

// Init
window.onload = function() {
    const saved = localStorage.getItem('eco_uid');
    if (saved) {
        uid = saved;
        db.collection("users").doc(uid).get().then(doc => {
            if (doc.exists) {
                userData = doc.data();
                user = userData.user;
                window.routeUser();
            }
        });
    }
};
