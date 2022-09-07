// t is number of spirals, m is scale of spiral shape (space between lines)
// returns an array of 2 elements, [x , y]
export function spiral(t, m) {
    return [(t / m) * Math.cos(t), (t / m) * Math.sin(t)];
}

// integral function
// coefficients var is an int array []
// elements represent a higher and higher power starting from 0
// [5, 3, 1] == (5 * x) ** 2 + 3 * x + 1
export function integral(lowerLimit, upperLimit, coefficients) {

    let lower = 0
    let upper = 0

    for (let i = 0; i < coefficients.length; i++) {

        lower += (coefficients[i] * Math.pow(lowerLimit, i + 1)) / (i + 1)
        upper += (coefficients[i] * Math.pow(upperLimit, i + 1)) / (i + 1)

    }

    return Math.abs(upper - lower)

}