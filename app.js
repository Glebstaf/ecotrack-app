/**
 * EcoTrack Application Logic
 * Version: 5.1 Fixed Form Submission
 */

const ACTIONS = [
    { id: 1, name: "Выключил свет при выходе", points: 5, icon: "💡" },
    { id: 2, name: "Прошёл пешком вместо транспорта", points: 10, icon: "🚶" },
    { id: 3, name: "Сдал пластик на переработку", points: 15, icon: "♻️" },
    { id: 4, name: "Использовал свою бутылку для воды", points: 8, icon: "💧" },
    { id: 5, name: "Посадил растение/дерево", points: 20, icon: "🌳" },
    { id: 6, name: "Выключил воду, пока чистил зубы", points: 7, icon: "🦷" },
    { id: 7, name: "Поехал на автобусе/метро", points: 12, icon: "🚌" },
    { id: 8, name: "Сдал старые батарейки", points: 15, icon: "🔋" }
];

const ACHIEVEMENTS = [
    { id: 1, name: "Первые шаги", desc: "10 очков", req: 10, type: "points", diff: "easy", icon: "🌱" },
    { id: 2, name: "Новичок", desc: "50 очков", req: 50, type: "points", diff: "easy", icon: "🌿" },
    { id: 3, name: "Старт дан", desc: "100 очков", req: 100, type: "points", diff: "easy", icon: "🚩" },
    { id: 4, name: "Серия 3", desc: "3 дня подряд", req: 3, type: "streak", diff: "easy", icon: "🔥" },
    { id: 5, name: "Экономный", desc: "5 раз выключил свет", req: 5, type: "act_1", diff: "easy", icon: "💡" },
    { id: 6, name: "Ходок", desc: "5 раз прошел пешком", req: 5, type: "act_2", diff: "easy", icon: "👟" },
    { id: 7, name: "Переработчик", desc: "3 раза сдал пластик", req: 3, type: "act_3", diff: "easy", icon: "♻️" },
    { id: 8, name: "Вода — жизнь", desc: "5 раз сэкономил воду", req: 5, type: "act_6", diff: "easy", icon: "🚰" },
    { id: 9, name: "Садовод", desc: "1 растение", req: 1, type: "act_5", diff: "easy", icon: "🌸" },
    { id: 10, name: "Батарейкин", desc: "2 раза сдал батарейки", req: 2, type: "act_8", diff: "easy", icon: "🔋" },
    { id: 11, name: "Активист", desc: "200 очков", req: 200, type: "points", diff: "medium", icon: "📢" },
    { id: 12, name: "Упорство", desc: "300 очков", req: 300, type: "points", diff: "medium", icon: "💪" },
    { id: 13, name: "Цель видна", desc: "400 очков", req: 400, type: "points", diff: "medium", icon: "🎯" },
    { id: 14, name: "Неделя силы", desc: "7 дней подряд", req: 7, type: "streak", diff: "medium", icon: "📅" },
    { id: 15, name: "Две недели", desc: "14 дней подряд", req: 14, type: "streak", diff: "medium", icon: "🗓️" },
    { id: 16, name: "Светлячок", desc: "20 раз выключил свет", req: 20, type: "act_1", diff: "medium", icon: "✨" },
    { id: 17, name: "Марафонец", desc: "20 раз прошел пешком", req: 20, type: "act_2", diff: "medium", icon: "🏃" },
    { id: 18, name: "Мастер Пластика", desc: "15 раз сдал пластик", req: 15, type: "act_3", diff: "medium", icon: "🥤" },
    { id: 19, name: "H2O", desc: "10 раз своя бутылка", req: 10, type: "act_4", diff: "medium", icon: "🍼" },
    { id: 20, name: "Лесник", desc: "5 растений", req: 5, type: "act_5", diff: "medium", icon: "🌲" },
    { id: 21, name: "Страж Воды", desc: "20 раз сэкономил воду", req: 20, type: "act_6", diff: "medium", icon: "🚿" },
    { id: 22, name: "Пассажир", desc: "15 раз транспорт", req: 15, type: "act_7", diff: "medium", icon: "🚇" },
    { id: 23, name: "Воин", desc: "10 раз батарейки", req: 10, type: "act_8", diff: "medium", icon: "⚔️" },
    { id: 24, name: "Планировщик", desc: "3 цели создано", req: 3, type: "goals", diff: "medium", icon: "📝" },
    { id: 25, name: "Финишер", desc: "1 цель выполнена", req: 1, type: "goals_done", diff: "medium", icon: "✅" },
    { id: 26, name: "Герой", desc: "500 очков", req: 500, type: "points", diff: "hard", icon: "🦸" },
    { id: 27, name: "Чемпион", desc: "750 очков", req: 750, type: "points", diff: "hard", icon: "🏆" },
    { id: 28, name: "Защитник", desc: "1000 очков", req: 1000, type: "points", diff: "hard", icon: "🛡️" },
    { id: 29, name: "Месяц", desc: "30 дней подряд", req: 30, type: "streak", diff: "hard", icon: "🌕" },
    { id: 30, name: "Полгода", desc: "180 дней подряд", req: 180, type: "streak", diff: "hard", icon: "📆" },
    { id: 31, name: "Лампочка Ильича", desc: "100 раз свет", req: 100, type: "act_1", diff: "hard", icon: "💡" },
    { id: 32, name: "Форрест Гамп", desc: "100 раз пешком", req: 100, type: "act_2", diff: "hard", icon: "👟" },
    { id: 33, name: "Король Переработки", desc: "50 раз пластик", req: 50, type: "act_3", diff: "hard", icon: "♻️" },
    { id: 34, name: "Властелин Воды", desc: "50 раз бутылка", req: 50, type: "act_4", diff: "hard", icon: "💧" },
    { id: 35, name: "Энт", desc: "20 растений", req: 20, type: "act_5", diff: "hard", icon: "🌳" },
    { id: 36, name: "Посейдон", desc: "100 раз вода", req: 100, type: "act_6", diff: "hard", icon: "🔱" },
    { id: 37, name: "Магистраль", desc: "50 раз транспорт", req: 50, type: "act_7", diff: "hard", icon: "🚄" },
    { id: 38, name: "Барон", desc: "50 раз батарейки", req: 50, type: "act_8", diff: "hard", icon: "🔋" },
    { id: 39, name: "Архитектор", desc: "10 целей", req: 10, type: "goals", diff: "hard", icon: "🏗️" },
    { id: 40, name: "Исполком", desc: "5 целей выполнено", req: 5, type: "goals_done", diff: "hard", icon: "✔️" },
    { id: 41, name: "Легенда", desc: "2500 очков", req: 2500, type: "points", diff: "expert", icon: "👑" },
    { id: 42, name: "Титан", desc: "5000 очков", req: 5000, type: "points", diff: "expert", icon: "🗿" },
    { id: 43, name: "Годовой абонемент", desc: "365 дней", req: 365, type: "streak", diff: "expert", icon: "🎉" },
    { id: 44, name: "Супермен", desc: "20 целей выполнено", req: 20, type: "goals_done", diff: "expert", icon: "🦸️" },
    { id: 45, name: "Абсолют", desc: "50 целей выполнено", req: 50, type: "goals_done", diff: "expert", icon: "💎" },
    { id: 46, name: "???", desc: "Ночная сова", req: 1, type: "sec_night", diff: "secret", icon: "🦉", hidden: true },
    { id: 47, name: "???", desc: "Точный расчет", req: 1, type: "sec_exact", diff: "secret", icon: "🎯", hidden: true },
    { id: 48, name: "???", desc: "Удача новичка", req: 1, type: "sec_lucky", diff: "secret", icon: "🍀", hidden: true },
    { id: 49, name: "???", desc: "Спидран", req: 1, type: "sec_speed", diff: "secret", icon: "⚡", hidden: true },
    { id: 50, name: "???", desc: "Коллекционер", req: 1, type: "sec_master", diff: "secret", icon: "🏅", hidden: true }
];

const store = {
    user: null,
    data: null,

    init() {
        const id = localStorage.getItem('eco_uid');
        if (id) {
            this.data = JSON.parse(localStorage.getItem('eco_data_' + id)) || null;
            if (this.data) this.user = this.data.user;
        }
    },

    save() {
        if (this.user && this.data) {
            localStorage.setItem('eco_uid', this.user.id);
            localStorage.setItem('eco_data_' + this.user.id, JSON.stringify(this.data));
        }
    },

    register(name, schoolType, schoolNum, city, cls) {
        const fullSchoolName = `${schoolType} ${schoolNum}`;
        this.user = { id: Date.now().toString(), name, school: fullSchoolName, city, cls };
        this.data = {
            user: this.user,
            points: 0,
            streak: 0,
            lastDate: null,
            history: [],
            goals: [],
            achievements: []
        };
        this.save();
    },

    reset() {
        if(confirm("Сбросить весь прогресс?")) {
            localStorage.clear();
            location.reload();
        }
    }
};

const ui = {
    show(screenId) {
        document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
        document.getElementById('screen-' + screenId).classList.remove('hidden');

        if (screenId === 'dashboard') dashboard.render();
        if (screenId === 'stats') stats.render();
        if (screenId === 'achievements') achievements.render();
        if (screenId === 'leaders') leaders.render();
    },

    showRegister() {
        this.show('register');
        document.getElementById('reg-form').reset();
    }
};

const events = {
    bind() {
        document.getElementById('reg-form').addEventListener('submit', (e) => {
            e.preventDefault(); // Останавливаем перезагрузку страницы
            const name = document.getElementById('inp-name').value.trim();
            const type = document.getElementById('inp-school-type').value;
            const num = document.getElementById('inp-school-num').value.trim();
            const city = document.getElementById('inp-city').value.trim();
            const cls = document.getElementById('inp-class').value.trim();

            if (!name || !num || !city || !cls) return alert('Заполни все поля!');

            store.register(name, type, num, city, cls);
            ui.show('dashboard');
        });

        document.getElementById('btn-save-day').addEventListener('click', actions.saveDay);
    }
};

const dashboard = {
    render() {
        const u = store.user;
        const d = store.data;

        document.getElementById('dash-name').textContent = u.name;
        document.getElementById('dash-info').textContent = `${u.city}, ${u.school}, ${u.cls}`;

        document.getElementById('stat-points').textContent = d.points;
        document.getElementById('stat-streak').textContent = d.streak;
        document.getElementById('stat-level').textContent = this.getLevel(d.points);

        actions.renderList();
        goals.renderList();
    },

    getLevel(points) {
        if (points < 50) return "Новичок";
        if (points < 200) return "Активист";
        if (points < 500) return "Герой";
        if (points < 1000) return "Легенда";
        return "Титан";
    }
};

const actions = {
    renderList() {
        const list = document.getElementById('list-actions');
        list.innerHTML = '';
        ACTIONS.forEach(act => {
            const div = document.createElement('div');
            div.className = 'action-row';
            div.innerHTML = `
                <input type="checkbox" id="act-${act.id}" data-id="${act.id}" data-points="${act.points}">
                <div class="action-info">
                    <label for="act-${act.id}">${act.icon} ${act.name}</label>
                </div>
                <span class="action-points">+${act.points}</span>
            `;
            list.appendChild(div);
        });
    },

    saveDay() {
        const checkboxes = document.querySelectorAll('#list-actions input:checked');
        if (checkboxes.length === 0) return alert('Выбери хотя бы одно действие!');

        const today = new Date().toDateString();
        if (store.data.lastDate === today) return alert('Ты уже сохранял данные сегодня!');

        let dayPoints = 0;
        let dayActions = {};

        checkboxes.forEach(cb => {
            const pts = parseInt(cb.dataset.points);
            const id = cb.dataset.id;
            dayPoints += pts;
            dayActions[id] = (dayActions[id] || 0) + 1;
        });

        store.data.points += dayPoints;
        store.data.lastDate = today;

        if (store.data.history.length > 0) {
            const last = new Date(store.data.history[store.data.history.length-1].date);
            const diff = (new Date() - last) / (1000*60*60*24);
            store.data.streak = (diff >= 1 && diff < 2) ? store.data.streak + 1 : 1;
        } else {
            store.data.streak = 1;
        }

        store.data.history.push({
            date: today,
            points: dayPoints,
            details: dayActions
        });

        store.save();
        dashboard.render();
        achievements.check();
        alert(`Отлично! +${dayPoints} очков! 🔥`);

        document.querySelectorAll('#list-actions input').forEach(cb => cb.checked = false);
    }
};

const goals = {
    add() {
        const text = document.getElementById('goal-text').value.trim();
        const date = document.getElementById('goal-date').value;
        if (!text || !date) return alert('Заполни название и дату!');

        store.data.goals.push({
            id: Date.now(),
            text,
            date,
            done: false
        });
        store.save();
        this.renderList();
        achievements.check();
        document.getElementById('goal-text').value = '';
    },

    toggle(id) {
        const g = store.data.goals.find(x => x.id === id);
        if (g) {
            g.done = !g.done;
            store.save();
            this.renderList();
            achievements.check();
        }
    },

    delete(id) {
        if(!confirm('Удалить цель?')) return;
        store.data.goals = store.data.goals.filter(x => x.id !== id);
        store.save();
        this.renderList();
    },

    renderList() {
        const list = document.getElementById('list-goals');
        list.innerHTML = '';
        if (store.data.goals.length === 0) {
            list.innerHTML = '<p style="text-align:center;color:#999;font-size:0.9em;">Нет активных целей</p>';
            return;
        }

        store.data.goals.sort((a,b) => a.done - b.done).forEach(g => {
            const isExpired = new Date(g.date) < new Date() && !g.done;
            const div = document.createElement('div');
            div.className = `goal-item ${g.done ? 'completed' : ''} ${isExpired ? 'expired' : ''}`;
            div.innerHTML = `
                <div>
                    <strong>${g.text}</strong><br>
                    <small>${new Date(g.date).toLocaleDateString()}</small>
                </div>
                <div class="goal-actions">
                    <button class="btn btn-small btn-secondary" onclick="goals.toggle(${g.id})">${g.done ? '↩️' : '✅'}</button>
                    <button class="btn btn-small btn-danger" onclick="goals.delete(${g.id})">×</button>
                </div>
            `;
            list.appendChild(div);
        });
    }
};

const achievements = {
    check() {
        const d = store.data;
        let unlockedAny = false;

        const actCounts = {};
        d.history.forEach(h => {
            for (let [aid, count] of Object.entries(h.details)) {
                actCounts[aid] = (actCounts[aid] || 0) + count;
            }
        });

        ACHIEVEMENTS.forEach(a => {
            if (d.achievements.includes(a.id)) return;

            let got = false;
            if (a.type === 'points' && d.points >= a.req) got = true;
            if (a.type === 'streak' && d.streak >= a.req) got = true;
            if (a.type === 'goals' && d.goals.length >= a.req) got = true;
            if (a.type === 'goals_done' && d.goals.filter(g=>g.done).length >= a.req) got = true;

            if (a.type.startsWith('act_')) {
                const aid = a.type.split('_')[1];
                if ((actCounts[aid] || 0) >= a.req) got = true;
            }

            if (a.type === 'sec_night' && new Date().getHours() < 6 && d.points > 50) got = true;
            if (a.type === 'sec_exact' && [100,500,1000].includes(d.points)) got = true;
            if (a.type === 'sec_lucky' && Math.random() < 0.05 && d.points > 0) got = true;
            if (a.type === 'sec_speed' && d.history.length > 5 && d.history[d.history.length-1].points - d.history[0].points > 100) got = true;
            if (a.type === 'sec_master' && d.achievements.length >= 40) got = true;

            if (got) {
                d.achievements.push(a.id);
                unlockedAny = true;
                setTimeout(() => alert(`🏆 Открыто достижение: ${a.hidden ? '???' : a.name}!`), 500);
            }
        });

        if (unlockedAny) store.save();
    },

    render() {
        const grid = document.getElementById('grid-achievements');
        grid.innerHTML = '';
        const d = store.data;

        ACHIEVEMENTS.forEach(a => {
            const isUnlocked = d.achievements.includes(a.id);
            const div = document.createElement('div');
            div.className = `ach-card ${isUnlocked ? 'unlocked' : 'locked'}`;
            div.innerHTML = `
                <span class="ach-icon">${isUnlocked || !a.hidden ? a.icon : '❓'}</span>
                <div class="ach-name">${isUnlocked || !a.hidden ? a.name : '???'}</div>
            `;
            div.title = isUnlocked || !a.hidden ? a.desc : '???';
            grid.appendChild(div);
        });
    }
};

const stats = {
    render() {
        const ctx = document.getElementById('chart-week').getContext('2d');
        if (window.myChart) window.myChart.destroy();

        const history = store.data.history.slice(-7);
        const labels = history.map(h => h.date.slice(0,5));
        const dataPoints = history.map(h => h.points);

        // ИСПРАВЛЕНА ОШИБКА СИНТАКСИСА CHART.JS
        window.myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels.length ? labels : ['Старт'],
                datasets: [{
                    label: 'Очки',
                    data: dataPoints.length ? dataPoints : [0],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: { responsive: true, plugins: { legend: { display: false } } }
        });

        document.getElementById('stats-details').innerHTML = `
            <div style="background:#f3f4f6;padding:15px;border-radius:10px;margin-top:10px;">
                <p>📅 Всего дней активности: <b>${store.data.history.length}</b></p>
                <p>🔥 Лучшая серия: <b>${store.data.streak}</b></p>
                <p>🏆 Достижений: <b>${store.data.achievements.length}/50</b></p>
            </div>
        `;
    }
};

const leaders = {
    render() {
        const list = document.getElementById('list-leaders');
        list.innerHTML = '';

        let users = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('eco_data_')) {
                const data = JSON.parse(localStorage.getItem(key));
                users.push(data);
            }
        }

        users.sort((a, b) => b.points - a.points);

        if (users.length === 0) {
            list.innerHTML = '<p style="text-align:center">Пока нет участников. Будь первым!</p>';
            return;
        }

        users.slice(0, 20).forEach((u, index) => {
            const div = document.createElement('div');
            div.className = 'leader-row';
            const rankClass = index === 0 ? 'top-1' : index === 1 ? 'top-2' : index === 2 ? 'top-3' : '';

            div.innerHTML = `
                <div class="rank ${rankClass}">${index + 1}</div>
                <div style="flex:1">
                    <div style="font-weight:bold">${u.user.name}</div>
                    <div style="font-size:0.8em;color:#666">${u.user.school}, ${u.user.cls}</div>
                </div>
                <div style="font-weight:bold;color:#10b981">${u.points} очк.</div>
            `;
            list.appendChild(div);
        });
    }
};

const app = {
    init() {
        store.init();
        if (store.user) {
            ui.show('dashboard');
        } else {
            ui.showRegister();
        }
        events.bind();
    },
    resetData() {
        store.reset();
    }
};

document.addEventListener('DOMContentLoaded', () => app.init());
