
const letterTypes = ['rock'];
let rand = letterTypes[Math.floor(Math.random() * letterTypes.length)];
console.log(rand);
const letters = [
    {
        dir: '../../assets/' + rand + '/D.glb',
        pos: { x: -9, y: -1 },
        name: "D",
    },
    {
        dir: '../../assets/' + rand + '/A.glb',
        pos: { x: -5.5, y: -1 },
        name: "A",
    },
    {
        dir: '../../assets/' + rand + '/N.glb',
        pos: { x: -2, y: -1 },
        name: "N",

    },
    {
        dir: '../../assets/' + rand + '/I.glb',
        pos: { x: 2, y: -1 },
        name: "I",
    },
    {
        dir: '../../assets/' + rand + '/E.glb',
        pos: { x: 3.5, y: -1 },
        name: "E",
    },
    {
        dir: '../../assets/' + rand + '/L.glb',
        pos: { x: 6.5, y: -1 },
        name: "L",
    },
]

export default letters