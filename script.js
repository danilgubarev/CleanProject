const neighbors = ['Danylo', 'Maxim', 'Volodya'];
const tasks = ['Кухня', 'Ванная', 'Балкон и Коридор'];

const startDate = new Date('2026-10-05');

function getWeekNumber(date = new Date()) {

    let milWeek = date - startDate;
    let weekTransform = milWeek / (1000 * 60 * 60 * 24 * 7)
    let result = Math.floor(weekTransform);
    return result

};

function getAssignments(week) {
    
    let result = {};

    for (let n = 0; n < neighbors.length; n++) {

        let solution = (n + week) % tasks.length;
        result[neighbors[n]] = tasks[solution];
        
    };

    return result;
    
};


// console.log(getAssignments(0));
// console.log(getAssignments(1));
// console.log(getAssignments(2));
// console.log(getAssignments(3));


// console.log(%3)
