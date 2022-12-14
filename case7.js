const fs = require("fs")
const dataFile = fs.readFileSync("./input7.txt").toString("utf8")

const dataTest = `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`

const fileSystem = [];

const commands = dataFile.split('\n$ ').map(command => command.split('\n'))
commands[0][0] = commands[0][0].split('$ ')[1]

let path = []
let currentDir = '/'
let deepness = 1
commands.forEach(command => {
  if (command[0].includes('cd')) {
    const cdCommand = command[0].split(' ')
    if (cdCommand[1] === '..') {
      path.pop()
      deepness--
    }
    else {
      currentDir = cdCommand[1]
      path.push(cdCommand[1])
      deepness++
    }
  }
  else { //ls
    let filesSize = 0
    let childDirs = []
    for (let i = 1; i < command.length; i++) {
      if (command[i].match(/^(\d+)/g)) {
        filesSize+= Number(command[i].match(/^(\d+)/g))
      }
      else {
        childDirs.push(command[i].split('dir ')[1])
      }
    }
    const pathMinusItself = [...path]
    pathMinusItself.pop()
    fileSystem.push({
      name: currentDir,
      size: filesSize,
      childrens: childDirs,
      deepness: deepness,
      path: pathMinusItself
    })
  }
});

// faut trier fileSystem pour faire en premier ceux qui sont plus profond
fileSystem.sort(function (a, b) {
  return b.deepness - a.deepness;
});

for (const dir of fileSystem) {
  let totalChildrenSize = dir.size

  dir.childrens.forEach(child => {

    totalChildrenSize += fileSystem.find(elt => {
      return ((elt.name === child) && (dir.name === elt.path.slice(-1)[0]))
    }).size
  })
  dir.size = totalChildrenSize
}

const smallerDirs = fileSystem.filter(dir => dir.size <= 100000)
const smallerDirsSizeSum = smallerDirs.reduce((previous, current) => previous + current.size, 0)

console.log(smallerDirsSizeSum);

// 1288294 too low