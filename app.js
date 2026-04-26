console.log("🔧 App starting...");

// Firebase config
try {
    firebase.initializeApp({
        apiKey: "AIzaSyDnqd553IyzA9AlsZzt9pv8u0S-KdroyX4",
        authDomain: "ecotrack-db.firebaseapp.com",
        projectId: "ecotrack-db",
        storageBucket: "ecotrack-db.firebasestorage.app",
        messagingSenderId: "280648314403",
        appId: "1:280648314403:web:3f5624ac94124be206cb96"
    });
    console.log("✅ Firebase initialized");
} catch (e) {
    console.error("❌ Firebase error:", e);
}

const db = firebase.firestore();
console.log("✅ Firestore ready");

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

let user = null;
let data = null;
let uid = null;

// Make functions global
window.doRegister = function() {
    console.log(" doRegister called");

    const name = document.getElementById('name').value;
    const type = document.getElementById('school-type').value;
    const num = document.getElementById('school-num').value;
    const city = document.getElementById('city').value;
    const cls = document.getElementById('class').value;

    console.log("Form values:", {name, type, num, city, cls});

    if (!name || !num || !city || !cls) {
        alert('Заполни все поля!');
        return;
    }

    uid = Date.now().toString();
    user = {name: name, school: type + " " + num, city: city, class: cls};
    data = {user: user, points: 0, streak: 0, lastDate: null, history: []};

    console.log("Saving user:", uid);

    db.collection("users").doc(uid).set(data).then(() => {
        console.log("✅ Saved to Firebase");
        localStorage.setItem('eco_uid', uid);
        showMain();
    }).catch(err => {
        console.error("❌ Save error:", err);
        alert("Ошибка: " + err.message);
    });
};

window.saveDay = function() {
    console.log("💾 saveDay called");
    const checked = document.querySelectorAll('#actions input:checked');
    if (checked.length === 0) return alert('Выбери действие!');

    const today = new Date().toDateString();
    if (data.lastDate === today) return alert('Уже сохранено сегодня!');

    let pts = 0;
    checked.forEach(c => pts += parseInt(c.dataset.points));

    data.points += pts;
    data.lastDate = today;
    data.streak++;
    data.history.push({date: today, points: pts});

    db.collection("users").doc(uid).set(data);

    document.getElementById('points').textContent = data.points;
    document.getElementById('streak').textContent = data.streak;
    alert('+' + pts + ' очков! 🔥');

    document.querySelectorAll('#actions input').forEach(c => c.checked = false);
};

window.showStats = function() {
    document.getElementById('main-screen').classList.add('hidden');
    document.getElementById('stats-screen').classList.remove('hidden');

    const ctx = document.getElementById('chart').getContext('2d');
    const hist = data.history.slice(-7);
    new Chart(ctx, {
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
        options: {responsive: true}
    });
};

window.showLeaders = function() {
    document.getElementById('main-screen').classList.add('hidden');
    document.getElementById('leaders-screen').classList.remove('hidden');

    const div = document.getElementById('leaders-list');
    div.innerHTML = 'Загрузка...';

    db.collection("users").orderBy("points", "desc").limit(20).get().then(snap => {
        div.innerHTML = '';
        let i = 1;
        snap.forEach(doc => {
            const u = doc.data();
            div.innerHTML += `<div class="leader-item"><b>${i}. ${u.user.name}</b> - ${u.points} оч. <small>(${u.user.school}, ${u.user.city})</small></div>`;
            i++;
        });
    });
};

window.showMain = function() {
    console.log("🏠 showMain called");
    document.getElementById('reg-screen').classList.add('hidden');
    document.getElementById('main-screen').classList.remove('hidden');
    document.getElementById('stats-screen').classList.add('hidden');
    document.getElementById('leaders-screen').classList.add('hidden');

    document.getElementById('user-name').textContent = user.name;
    document.getElementById('user-info').textContent = user.city + ", " + user.school;
    document.getElementById('points').textContent = data.points;
    document.getElementById('streak').textContent = data.streak;
    document.getElementById('level').textContent = getLevel(data.points);

    const div = document.getElementById('actions');
    div.innerHTML = '';
    ACTIONS.forEach(a => {
        div.innerHTML += `<div class="action-item"><span>${a.name}</span><input type="checkbox" id="act${a.id}" data-points="${a.points}"></div>`;
    });
};

function getLevel(p) {
    if (p < 50) return "Новичок";
    if (p < 200) return "Активист";
    if (p < 500) return "Герой";
    return "Легенда";
}

// Load saved user
window.onload = function() {
    console.log("🔄 Page loaded");
    const saved = localStorage.getItem('eco_uid');
    if (saved) {
        console.log("Found saved UID:", saved);
        uid = saved;
        db.collection("users").doc(uid).get().then(doc => {
            if (doc.exists) {
                console.log("✅ User loaded from Firebase");
                data = doc.data();
                user = data.user;
                showMain();
            } else {
                console.log("❌ User not found in Firebase");
                localStorage.clear();
            }
        }).catch(err => console.error("Load error:", err));
    } else {
        console.log("No saved user, showing registration");
    }
};

console.log("✅ App loaded successfully");
