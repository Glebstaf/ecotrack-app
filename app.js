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
{id:7, name:"🚌 Общественный транспорт", points:12},
{id:8, name:"🔋 Сдал батарейки", points:15}
];

let user = null;
let userData = null;
let uid = null;

document.getElementById('role').addEventListener('change', function() {
    const codeInput = document.getElementById('teacher-code');
    if (this.value === 'teacher') {
        codeInput.classList.remove('hidden');
        codeInput.required = true;
    } else {
        codeInput.classList.add('hidden');
        codeInput.required = false;
    }
});

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
    user = {firstName: firstName, lastName: lastName, fullName: fullName, role: role, school: type + " " + num, city: city, class: cls};
    userData = {user: user, points: 0, streak: 0, lastDate: null, history: []};

    db.collection("users").doc(uid).set(userData).then(() => {
        localStorage.setItem('eco_uid', uid);
        routeUser();
    }).catch(err => {
        alert("Ошибка: " + err.message);
    });
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

    db.collection("users").doc(uid).set(userData);

    document.getElementById('points').textContent = userData.points;
    document.getElementById('streak').textContent = userData.streak;
    alert('+' + pts + ' очков! 🔥');

    document.querySelectorAll('#actions input').forEach(c => c.checked = false);
};

function routeUser() {
    if (userData.user.role === 'teacher') {
        showTeacherScreen();
    } else {
        showStudentScreen();
    }
}

window.showStudentScreen = function() {
    document.getElementById('reg-screen').classList.add('hidden');
    document.getElementById('teacher-screen').classList.add('hidden');
    document.getElementById('stats-screen').classList.add('hidden');
    document.getElementById('leaders-screen').classList.add('hidden');
    document.getElementById('student-screen').classList.remove('hidden');

    document.getElementById('user-fullname').textContent = user.fullName;
    document.getElementById('user-info').textContent = user.city + ", " + user.school;
    document.getElementById('points').textContent = userData.points;
    document.getElementById('streak').textContent = userData.streak;
    document.getElementById('level').textContent = getLevel(userData.points);

    const div = document.getElementById('actions');
    div.innerHTML = '';
    ACTIONS.forEach(a => {
        div.innerHTML += `<div class="action-item"><span>${a.name}</span><input type="checkbox" id="act${a.id}" data-points="${a.points}"></div>`;
    });
};

window.showTeacherScreen = function() {
    document.getElementById('reg-screen').classList.add('hidden');
    document.getElementById('student-screen').classList.add('hidden');
    document.getElementById('stats-screen').classList.add('hidden');
    document.getElementById('leaders-screen').classList.add('hidden');
    document.getElementById('teacher-screen').classList.remove('hidden');

    document.getElementById('teacher-info').textContent = user.city + ", " + user.school;
    loadTeacherData();
};

function loadTeacherData() {
    const tbody = document.getElementById('students-body');
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center">Загрузка...</td></tr>';

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

        students.sort((a, b) => b.points - a.points);

        document.getElementById('total-students').textContent = students.length;
        document.getElementById('class-avg').textContent = students.length ? Math.round(totalPoints / students.length) : 0;
        document.getElementById('top-score').textContent = maxPoints;

        tbody.innerHTML = '';
        students.forEach(s => {
            tbody.innerHTML += `
            <tr>
            <td>${s.user.fullName}</td>
            <td>${s.user.class}</td>
            <td><b>${s.points}</b></td>
            <td>${s.streak} дн.</td>
            <td><button class="delete-btn" onclick="deleteStudent('${s.id}')">Удалить</button></td>
            </tr>
            `;
        });
    });
}

window.deleteStudent = function(studentId) {
    if (confirm('Вы уверены, что хотите удалить этого ученика? Это действие нельзя отменить.')) {
        db.collection("users").doc(studentId).delete().then(() => {
            loadTeacherData();
            alert('Ученик удален.');
        }).catch(err => {
            alert('Ошибка при удалении: ' + err.message);
        });
    }
};

window.showStats = function() {
    document.getElementById('student-screen').classList.add('hidden');
    document.getElementById('stats-screen').classList.remove('hidden');

    const ctx = document.getElementById('chart').getContext('2d');
    const hist = userData.history.slice(-7);

    if (window.myChart instanceof Chart) {
        window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
        type: 'line',
        {
            labels: hist.map(h => h.date.slice(0,5)),
                               datasets: [{
                                   label: 'Очки',
                                   hist.map(h => h.points),
                               borderColor: '#10b981',
                               backgroundColor: 'rgba(16,185,129,0.2)',
                               fill: true,
                               tension: 0.4
                               }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, grid: { color: '#f3f4f6' } },
                x: { grid: { display: false } }
            }
        }
    });
};

window.showLeaders = function() {
    document.getElementById('student-screen').classList.add('hidden');
    document.getElementById('leaders-screen').classList.remove('hidden');

    const div = document.getElementById('leaders-list');
    div.innerHTML = '<p style="text-align:center; color:#6b7280;">Загрузка...</p>';

    db.collection("users").where("user.school", "==", user.school).orderBy("points", "desc").limit(20).get().then(snap => {
        div.innerHTML = '';
        if (snap.empty) {
            div.innerHTML = '<p style="text-align:center; color:#6b7280;">Пока нет участников</p>';
            return;
        }

        let i = 1;
        snap.forEach(doc => {
            const u = doc.data();
            if (u.user.role === 'student') {
                const rankIcon = i === 1 ? '🥇' : i === 2 ? '🥈' : i === 3 ? '🥉' : i + '.';
                div.innerHTML += `<div style="padding:12px; border-bottom:1px solid #e5e7eb;"><b>${rankIcon} ${u.user.fullName}</b> <small>(${u.user.class})</small> — ${u.points} очков</div>`;
                i++;
            }
        });
    });
};

window.logout = function() {
    localStorage.removeItem('eco_uid');
    location.reload();
};

function getLevel(p) {
    if (p < 50) return "Новичок";
    if (p < 200) return "Активист";
    if (p < 500) return "Герой";
    if (p < 1000) return "Легенда";
    return "Титан";
}

window.onload = function() {
    const saved = localStorage.getItem('eco_uid');
    if (saved) {
        uid = saved;
        db.collection("users").doc(uid).get().then(doc => {
            if (doc.exists) {
                userData = doc.data();
                user = userData.user;
                routeUser();
            }
        });
    }
};
