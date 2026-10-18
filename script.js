import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getFirestore, collection, doc, setDoc, deleteDoc, onSnapshot }
  from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const app = initializeApp({   
  apiKey: "AIzaSyDTEqW-lkD5HMZ1bdHUO9YHQitDvVCcVAA",
  authDomain: "cleanapartment-26d4a.firebaseapp.com",
  projectId: "cleanapartment-26d4a",
  storageBucket: "cleanapartment-26d4a.firebasestorage.app",
  messagingSenderId: "58940990859",
  appId: "1:58940990859:web:04888d4204daad1b50fb8e",
  measurementId: "G-81WZ48XR1T" 
});

const db = getFirestore(app);

let progress = document.getElementById('progress');


let btnId = 0;


let colors = {
    'Bathroom' : 'green',
    'Kitchen' : 'yellow',
    'Balcony' : 'purple'
}

let done = {};

onSnapshot(collection(db, 'done'), (snapshot) => {
  done = {};
  snapshot.forEach(d => { done[d.id] = d.data().time; });
  render();
});

const neighbors = ['Данил', 'Максим', 'Владимир'];
const tasks = ['Кухня + Мусор', 'Ванная + Полотенца&тряпки', 'Балкон и Коридор + Сортировка'];

const startDate = new Date('2026-10-13');

function getWeekNumber(date = new Date()) {

    let milWeek = date - startDate;
    let weekTransform = milWeek / (1000 * 60 * 60 * 24 * 7)
    let result = Math.floor(weekTransform);
    return result

};

let week = getWeekNumber()


function getAssignments(week) {
    
    let result = {};

    for (let n = 0; n < neighbors.length; n++) {

        let solution = (n + week) % tasks.length;
        result[neighbors[n]] = tasks[solution];

    };

    return result;
    
};


document.getElementById('prev').addEventListener('click', () => {
  if (week === 0) return;
  week--;
  render();
});

document.getElementById('next').addEventListener('click', () => {
  week++;
  render();
});

document.getElementById('back-link').addEventListener('click', () => {
    week = getWeekNumber();
    render();
})


document.getElementById('rooms').addEventListener('click', async (event) => {
  let button = event.target;
  if (!button) return;

  const key = button.dataset.key;

  if (done[key]) {
    await deleteDoc(doc(db, 'done', key));
  } else {
    await setDoc(doc(db, 'done', key), { time: new Date().toISOString() });
  }
});

function render() {

 
    let container = document.getElementById('rooms');
    let doneCount = 0;
    const assignments = getAssignments(week);



    const start = new Date(startDate);
    start.setDate(start.getDate() + week * 7);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);

    const fmt = d => d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });

    document.getElementById('week-title').textContent = 'Неделя ' + week;
    document.getElementById('week-range').textContent = fmt(start) + ' - ' + fmt(end);

    container.innerHTML = '';


    


    for (const [person, task] of Object.entries(assignments)) {
        ++btnId;
        const color = colors[task];
        const card = document.createElement('div');
        const key = week + ':' + task;
        const time = done[key];

        if (time) doneCount++;

        card.className = 'card'

        card.innerHTML = `
            <div class="card-header">
                <div class="card-left">
                    <div class="card-info">
                        <div class="card-title"></div>
                            <div class="assignee">
                                <div class="avatar ${color}"></div>
                                <span class="assignee-name"></span>
                            </div>
                        </div>
                    </div>
                <div class="status">${time ? 'Готово' : 'Ждёт'}</div>
            </div>

        <button class="btn ${color}" data-key="${key}">
            ${time ? 'Отменить' : 'Отметить убранным'}
        </button>

        `;

        card.querySelector('.card-title').textContent = task;
        card.querySelector('.avatar').textContent = person[0];
        card.querySelector('.assignee-name').textContent = person;

        container.append(card);
    }

    progress.textContent = doneCount;




    const doneList = document.getElementById('done-list');
    doneList.innerHTML = '';

    const entries = Object.entries(assignments).filter(([person, task]) => done[week + ':' + task]);

    if (entries.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'Никто не отметился';
        doneList.append(li);
    }

    for (const [person, task] of entries) {
        const time = new Date(done[week + ':' + task]);
        const li = document.createElement('li');
        li.textContent = person + ' : ' + task.toLowerCase() + ', ' + time.toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
        doneList.append(li)
    }
}

render();