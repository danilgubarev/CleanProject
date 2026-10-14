let progress = document.getElementById('progress');


let btnId = 0;


let colors = {
    'Bathroom' : 'green',
    'Kitchen' : 'yellow',
    'Balcony' : 'purple'
}

let done = JSON.parse(localStorage.getItem('done')) || {};

const neighbors = ['Данил', 'Максим', 'Владимир'];
const tasks = ['Кухня', 'Ванная', 'Балкон и Коридор'];

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


document.getElementById('rooms').addEventListener('click', (event) => {
            let button = event.target;
            if (!button) return;

            const key = button.dataset.key;

            if (done[key]) {
                delete done[key];
            } else {
                done[key] = new Date().toISOString();
            }

            localStorage.setItem('done', JSON.stringify(done))
            render();
        })

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