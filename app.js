// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyDnqd553IyzA9AlsZzt9pv8u0S-KdroyX4",
    authDomain: "ecotrack-db.firebaseapp.com",
    projectId: "ecotrack-db",
    storageBucket: "ecotrack-db.firebasestorage.app",
    messagingSenderId: "280648314403",
    appId: "1:280648314403:web:3f5624ac94124be206cb96"
};

// Init Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const ACTIONS = [
    { id: 1, name: "💡 Выключил свет", points: 5 },
    { id: 2, name: "🚶 Прошел пешком", points: 10 },
    { id: 3, name: "♻️ Сдал пластик", points: 15 },
    { id: 4, name: "💧 Своя бутылка", points: 8 },
    { id: 5, name: "🌳 Посадил растение", points: 20 }
];

let currentUser = null;
let userData = null;
let userId = null;

// Load user
function init() {
    const savedId = localStorage.getItem('eco_uid');
    if (savedId) {
        userId = savedId;
        db.collection("users").doc(userId).get().then(doc => {
            if (doc.exists) {
                userData = doc.data();
                currentUser = userData.user;
                showDashboard();
            } else {
                localStorage.clear();
                location.reload();
            }
        }).catch(err => console.error(err));
    }
}

// Save to Firebase
function saveData() {
    if (userId && userData) {
        db.collection("users").doc(userId).set(userData);
        localStorage.setItem('eco_uid', userId);
    }
}

// Register
function register(name, schoolType, schoolNum, city, cls) {
    userId = Date.now().toString();
    currentUser = {
        name: name,
        school: schoolType + " " + schoolNum,
        city: city,
        class: cls
    };
    userData = {
        user: currentUser,
        points: 0,
        streak: 0,
        lastDate: null,
        history: [],
        achievements: []
    };
    saveData();
    showDashboard();
}

// Show dashboard
function showDashboard() {
    document.getElementById('screen-register').classList.add('hidden');
    document.getElementById('screen-dashboard').classList.remove('hidden');
    document.getElementById('dash-name').textContent = currentUser.name;
    document.getElementById('dash-info').textContent = currentUser.city + ", " + currentUser.school;
    document.getElementById('stat-points').textContent = userData.points;
    document.getElementById('stat-streak').textContent = userData.streak;

    // Render actions
    const list = document.getElementById('list-actions');
    list.innerHTML = '';
    ACTIONS.forEach(act => {
        const div = document.createElement('div');
        div.style.cssText = 'padding:10px;background:#f3f4f6;margin:5px 0;border-radius:8px;display:flex;justify-content:space-between;align-items:center';
        div.innerHTML = `
            <span>${act.name}</span>
            <input type="checkbox" data-id="${act.id}" data-points="${act.points}" style="width:20px;height:20px;margin:0">
        `;
        list.appendChild(div);
    });
}

// Save day
document.addEventListener('DOMContentLoaded', () => {
    // Form submit
    document.getElementById('reg-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('inp-name').value;
        const type = document.getElementById('inp-school-type').value;
        const num = document.getElementById('inp-school-num').value;
        const city = document.getElementById('inp-city').value;
        const cls = document.getElementById('inp-class').value;
        register(name, type, num, city, cls);
    });

    // Save button
    document.getElementById('btn-save').addEventListener('click', function() {
        const checkboxes = document.querySelectorAll('#list-actions input:checked');
        if (checkboxes.length === 0) return alert('Выбери действие!');

        const today = new Date().toDateString();
        if (userData.lastDate === today) return alert('Уже сохранено!');

        let points = 0;
        checkboxes.forEach(cb => {
            points += parseInt(cb.dataset.points);
        });

        userData.points += points;
        userData.lastDate = today;
        userData.streak++;
        userData.history.push({ date: today, points: points });
        saveData();

        document.getElementById('stat-points').textContent = userData.points;
        document.getElementById('stat-streak').textContent = userData.streak;
        alert('+' + points + ' очков! 🔥');

        checkboxes.forEach(cb => cb.checked = false);
    });
});

// UI navigation
const ui = {
    show: function(screen) {
        document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
        document.getElementById('screen-' + screen).classList.remove('hidden');

        if (screen === 'stats') {
            renderChart();
        } else if (screen === 'leaders') {
            loadLeaders();
        }
    }
};

// Render chart
function renderChart() {
    const ctx = document.getElementById('chart').getContext('2d');
    const history = userData.history.slice(-7);
    new Chart(ctx, {
        type: 'line',
         {
            labels: history.map(h => h.date.slice(0, 5)),
            datasets: [{
                label: 'Очки',
                 history.map(h => h.points),
                borderColor: '#10b981',
                fill: true,
                backgroundColor: 'rgba(16, 185, 129, 0.2)'
            }]
        },
        options: { responsive: true }
    });
}

// Load leaders
function loadLeaders() {
    const list = document.getElementById('list-leaders');
    db.collection("users").orderBy("points", "desc").limit(10).get().then(snapshot => {
        list.innerHTML = '';
        snapshot.forEach((doc, i) => {
            const u = doc.data();
            const div = document.createElement('div');
            div.style.cssText = 'padding:10px;border-bottom:1px solid #eee';
            div.innerHTML = `<b>${i+1}. ${u.user.name}</b> - ${u.points} очков <small>(${u.user.school})</small>`;
            list.appendChild(div);
        });
    });
}

// Init app
init();
