const fs = require("fs")
const dataFile = fs.readFileSync("./input5.txt").toString("utf8")

const dataTest = 
`    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`

const lines = dataFile.split('\n')

const instructions = lines.filter(line => line.match('move')).map(instruction => {
  const regexp = /(\d+)/g
  return instruction.match(regexp)
})
/*
[
  [ '1', '2', '1' ],
  [ '3', '1', '3' ],
  [ '2', '2', '1' ],
  [ '1', '1', '2' ]
]
*/

const stacks = lines.filter(line => !line.match('move'))
stacks.pop()
stacks.pop()

const stacksMatrice = stacks.map(stack => {
  stack += ' '
  return stack.match(/( {4}|[A-Z])/g)
}).reverse()
/*
[ 
  [ 'Z', 'M', 'P' ],
  [ 'N', 'C', ' ' ],
  [ ' ', 'D', ' ' ] ]
*/

const transposedMatrice = stacksMatrice[0].map((col, i) => stacksMatrice.map(row => row[i]).filter(stack => stack !== '    '));
/*
[ 
  [ 'Z', 'N' ],
  [ 'M', 'C', 'D' ], 
  [ 'P' ] ]
*/
console.log('Matrice at start ', transposedMatrice)


instructions.forEach(instruction => {

  const nbCratesToMove = Number(instruction[0])
  const pileStart = Number(instruction[1])-1
  const pileEnd = Number(instruction[2])-1

  const stacksToMove = [];
  for (let i = 0; i < nbCratesToMove; i++) {
    const topCrate = transposedMatrice[pileStart].pop();
    stacksToMove.unshift(topCrate);
  }
  transposedMatrice[pileEnd].push(...stacksToMove);
})

console.log('Matrice at end ', transposedMatrice)

const topCrates = transposedMatrice.reduce(
  (accumulator, stack) => {
    const topCrate = stack.pop()
    return accumulator + (typeof topCrate !== "undefined" ? topCrate : ' ')
  },
  ''
);

console.log(topCrates);

// étoile 2




