let progress = document.getElementById('progress');

let btnId = 0;


let colors = {
    'Bathroom' : 'green',
    'Kitchen' : 'yellow',
    'Balcony' : 'purple'
}

let done = JSON.parse(localStorage.getItem('done')) || {};

const neighbors = ['Danylo', 'Maxim', 'Volodya'];
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


// cards buttons


// week buttons

document.getElementById('prev').addEventListener('click', () => {
  if (week === 0) return;
  week--;
  render();
});

document.getElementById('next').addEventListener('click', () => {
  week++;
  render();
});


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

    document.getElementById('week-title').textContent = 'Week ' + week;
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
}

render();