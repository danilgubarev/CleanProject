let colors = {
    'Bathroom' : 'green',
    'Kitchen' : 'yellow',
    'Balcony' : 'purple'
}




const neighbors = ['Danylo', 'Maxim', 'Volodya'];
const tasks = ['Кухня', 'Ванная', 'Балкон и Коридор'];

const startDate = new Date('2026-10-05');

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


function render() {
    let container = document.getElementById('rooms');
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
        const color = colors[task];

        const card = document.createElement('div');
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
                <div class="status">Ждёт</div>
            </div>
        <button class="btn ${color}">Отметить убранным</button>
        `;

        card.querySelector('.card-title').textContent = task;
        card.querySelector('.avatar').textContent = person[0];
        card.querySelector('.assignee-name').textContent = person;

        container.append(card);
    }
}

render();