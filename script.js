let debug = false

const board = document.getElementById('board')
const table = document.getElementById('table')

const nodeWidth = 20

const tableWidth = Math.floor(board.offsetWidth / (nodeWidth + 4)) - (Math.floor(board.offsetWidth / (nodeWidth + 4)) % 2)
const tableHeight = Math.floor(board.offsetHeight / (nodeWidth + 4)) - (Math.floor(board.offsetHeight / (nodeWidth + 4)) % 2)

init(tableWidth, tableHeight)

function mouseNode(clientX, clientY, remove) {
    const nodeElement = document.elementFromPoint(clientX, clientY)
    if (nodeElement.className != 'unvisited' && nodeElement.className != 'visited' && nodeElement.className != 'wall' && nodeElement.className != 'path') return

    if (remove) {
        nodeElement.className = 'unvisited'
        nodes[nodeElement.id].class = 'unvisited'
    }
    else {
        nodeElement.className = 'wall'
        nodes[nodeElement.id].class = 'wall'
    }
}

let drawing = false
let remove

table.addEventListener('mousedown', event => {
    event.preventDefault ? event.preventDefault() : event.returnValue = false
    const node = document.elementFromPoint(event.clientX, event.clientY)
    if (node.className == 'wall') remove = true
    else remove = false
    drawing = true
    mouseNode(event.clientX, event.clientY, remove)
})

document.addEventListener('mouseup', event => {
    drawing = false
})

table.addEventListener('mousemove', event => {
    if (drawing) mouseNode(event.clientX, event.clientY, remove)
})

function pathfind() {
    aStar(nodes, start, end, manhattan, loopReturn => {
        let path = []
        if (loopReturn) path =  loopReturn
        let i = 0
        let loop = setInterval(() => {
            if (i >= path.length) return clearInterval(loop)
            const node = document.getElementById(path[i])
            if (node.className == 'visited') node.className = 'path'
            i++
        }, 30)
    })
}

function clearPath() {
    clearInterval(loop)
    let element = document.getElementById('table').children
    element = element[0].children
    for (let i = 0; i < element.length; i++) {
        const item = element[i].children
        for (let j = 0; j < item.length; j++) {
            const element = item[j]
            if (element.className == 'visited' || element.className == 'path' || element.className == 'highlight') document.getElementById(element.id).className = 'unvisited'
        }
    }
}

document.addEventListener('keydown', event => {
    if (event.key === 'Enter') debug = true
})

document.addEventListener('keyup', event => {
    if (event.key === 'Enter') debug = false
})