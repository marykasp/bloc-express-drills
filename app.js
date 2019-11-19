const express = require('express')
const morgan = require('morgan')

// create an express application- creates a new app object
const app = express()

// mount middleware function to express app- morgan development logger
app.use(morgan('dev'))

app.get('/', (req, res) => {
    res.send('Express drills')
})

app.get('/sum', (req, res) => {
    console.log(req.query)
    const {
        a,
        b
    } = req.query

    // validation- a and b are required and should be numbers
    if (!a) {
        return res.status(400).send('a is required')
    }

    if (!b) {
        return res.status(400).send('b is required')
    }

    const numA = parseFloat(a)
    const numB = parseFloat(b)

    if (Number.isNaN(numA)) {
        return res.status(400).send('a must be a number')
    }

    if (Number.isNaN(numB)) {
        return res.status(400).send('b must be a number')
    }

    // validation pass so perform the sum calculation
    const sum = numA + numB
    console.log(sum)

    // format response string
    const responseString = `The sum of ${numA} and ${numB} is ${sum}`
    res.send(responseString)

})

// Second Express Drill
app.get('/cipher', (req, res) => {
    const {
        text,
        shift
    } = req.query

    // validation- required query strings
    if (!text) {
        return res.status(400).send('text is required')
    }

    if (!shift) {
        return res.status(400).send('shift is required')
    }

    const numShift = parseFloat(shift)

    if (Number.isNaN(numShift)) {
        return res.status(400).send('Shift must be a number')
    }

    const base = 'A'.charCodeAt(0) //get char code

    // create an array of characters from the text
    const cipher = text
        .toUpperCase()
        .split('')
        .map((char) => {
            // map each char to a converted char
            const code = char.charCodeAt(0)

            // if it is not one of the 16 letters ignore it
            if (code < base || code > (base + 26)) {
                return char
            }

            // otherwise convert it get the distance from A
            let diff = code - base;
            diff = diff + numShift

            // cycle back to beginning
            diff = diff % 26

            // convert back to a character
            const shiftedChar = String.fromCharCode(base + diff)
            return shiftedChar
        })
        .join('') //construct a string from the map array

    res.status(200).send(cipher)

})

// EXPRESS DRILL 3
app.get('/lotto', (req, res) => {
    const {
        numbers
    } = req.query
    console.log(numbers)
    // validation- array must exist, must be an array, must be 6 numbers

    if (!numbers) {
        return res.status(200).send('Numbers is required')
    }

    if (!Array.isArray(numbers)) {
        return res.status(200).send('Numbers must be an array')
    }


    const guesses = numbers.map((n) => parseInt(n)).filter(n => !Number.isNaN(n) && (n >= 1 && n <= 20))

    if (guesses.length != 6) {
        return res.status(400).send('numbers must contain 6 intergers between 1 and 20')
    }

    // validated number array

    // 20 numbers to choose from
    const stockNumbers = Array(20).fill(1).map((_, i) => i + 1)

    // randomly generate 6 numbers
    const winningNumbers = [];
    for (let i = 0; i < 6; i++) {
        const ran = Math.floor(Math.random() * stockNumbers.length)
        winningNumbers.push(stockNumbers[ran])
        stockNumbers.splice(ran, 1)
    }

    // compare the guesses to the winning numbers
    let diff = winningNumbers.filter(n => !guesses.includes(n))

    let responseText;
    switch (diff.length) {
        case 0:
            responseText = "Wow! all your numbers matched the winninng numbers!";
            break;
        case 1:
            responseText = "Congratulations! You won $100. You only missed one number";
            break;
        case 2:
            responseText = "Congrats, you win a free ticket";
            break;
        default:
            responseText = "Sorry, you lose"
    }

    res.send(responseText)

})

app.listen(8000, () => {
    console.log('server started on PORT 8000')
})