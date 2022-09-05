// t is number of spirals, m is scale of spiral shape (space between lines)
// returns an array of 2 elements, [x , y]
export function spiral(t, m) {
    return [(t / m) * Math.cos(t), (t / m) * Math.sin(t)];
}