let loop
let nodes
let start
let end

function init(width, height) {
    clearInterval(loop)
    nodes = {}
    let gridHTML = ''
    for (let y = 0; y < height - 1; y++) {
        gridHTML += '<tr>'
        for (let x = 0; x < width - 1; x++) {
            nodes[`${x}_${y}`] = {
                'id': `${x}_${y}`,
                'f': 0,
                'g': 0,
                'h': 0,
                'parent': null,
                'class': 'unvisited',
            }
            gridHTML += `<td id="${x}_${y}" class="unvisited"></td>`
        }
        gridHTML += '</tr>'
    }
    document.getElementById('table').innerHTML = gridHTML
    const inX = Math.round(width / 4) - 1
    const inY = Math.round(height / 2) - 1
    start = `${inX}_${inY}`
    end = `${width - inX - 2}_${inY}`
    const startElement = document.getElementById(start)
    const endElement = document.getElementById(end)
    startElement.className = 'start'
    startElement.innerHTML = '<svg width="20" height="20"><circle cx="10" cy="10" r="7" fill="none" stroke="#2d3539" stroke-width="6" /></svg>'
    endElement.className = 'end'
    endElement.innerHTML = '<svg width="20" height="20"><g transform="rotate(45, 10, 10)"><rect x="0" y="6.5" width="20" height="7" fill="#2d3539" /><rect x="6.5" y="0" width="7" height="20" fill="#2d3539" /></g></svg>'
}

function manhattan(a, b) {
    a = a.split('_')
    b = b.split('_')
    return Math.abs(parseInt(a[0]) - parseInt(b[0])) + Math.abs(parseInt(a[1]) - parseInt(b[1]))
}

function getNeighbors(nodes, node) {
    node = node.split('_')
    const x = parseInt(node[0])
    const y = parseInt(node[1])
    let neighbors = []
    if (nodes[`${x + 1}_${y}`]) neighbors.push(`${x + 1}_${y}`)
    if (nodes[`${x - 1}_${y}`]) neighbors.push(`${x - 1}_${y}`)
    if (nodes[`${x}_${y + 1}`]) neighbors.push(`${x}_${y + 1}`)
    if (nodes[`${x}_${y - 1}`]) neighbors.push(`${x}_${y - 1}`)
    return neighbors
}

function aStar(nodes, start, end, heuristic, callback) {
    clearPath()

    let open = []
    let closed = []
    open.push(start)

    let prev

    loop = setInterval(() => {
        if (!open.length) return clearInterval(loop), prev.className = 'visited'

        let index = 0
        let current = open[index]
        open.forEach((node, i) => { if (nodes[node].f < nodes[current].f) index = i, current = node })

        if (current === end) {
            let curr = current
            let result = []
            while (nodes[curr].parent) {
                result.push(curr)
                curr = nodes[curr].parent
            }
            callback(result.reverse())
            return clearInterval(loop), prev.className = 'visited'
        }

        open.splice(index, 1)
        closed.push(current)

        if (nodes[current].class === 'visited' || nodes[current].class === 'wall') return

        nodes[current].class === 'visited'

        const currentElement = document.getElementById(current)
        if (currentElement.className == 'unvisited') currentElement.className = 'highlight'
        if (prev && prev.className == 'highlight') prev.className = 'visited'
        prev = currentElement

        if (currentElement.className == 'visited' || currentElement.className == 'wall') return

        getNeighbors(nodes, current).forEach(neighbor => {
            if (closed.includes(neighbor) || nodes[neighbor].class === 'visited' || nodes[neighbor].class === 'wall' || nodes[current].parent === neighbor) return

            nodes[neighbor].parent = current
            nodes[neighbor].g = nodes[current].g + 1
            nodes[neighbor].h = heuristic(neighbor, end)
            nodes[neighbor].f = nodes[neighbor].g + nodes[neighbor].h

            open.push(neighbor)
        })
    }, 10)
}