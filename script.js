const neighbors = ['Danylo', 'Maxim', 'Volodya'];
const tasks = ['Кухня', 'Ванная', 'Балкон и Коридор'];

/* 

написать функцию, которая по номеру недели возвращает, кто что убирает

*/

function getAssignments(week) {
    
    let result = {};

    for (let n = 0; n < neighbors.length; n++) {
        let solution = (n + week) % tasks.length;
        result[neighbors[n]] = tasks[solution];
    };

    return result;
    
};


console.log(getAssignments(0));
console.log(getAssignments(1));
console.log(getAssignments(2));
console.log(getAssignments(3));


// console.log(%3)
