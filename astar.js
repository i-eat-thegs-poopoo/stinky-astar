let loop

function init(width, height) {
    clearInterval(loop)
    grid = []
    let gridHTML = ''

    for (let y = 0; y < height - 1; y++) {
        let row = []
        gridHTML += '<tr>'

        for (let x = 0; x < width - 1; x++) {
            row.push({
                pos: {
                    x: x,
                    y: y
                },
                f: 0,
                g: 0,
                h: 0,
                parent: null,
                wall: false
            })
            gridHTML += `<td id="${y}-${x}" class="unvisited"></td>`
        }
        grid.push(row)
        gridHTML += '</tr>'
    }

    document.getElementById('table').innerHTML = gridHTML

    start = grid[height / 2][Math.round(width / 4)]
    end = grid[height / 2][width - Math.round(width / 4) - 2]
    const startElement = document.getElementById(`${height / 2}-${Math.round(width / 4)}`)
    const endElement = document.getElementById(`${height / 2}-${width - Math.round(width / 4) - 2}`)
    startElement.className = 'start'
    startElement.innerHTML = '<svg width="20" height="20"><circle cx="10" cy="10" r="7" fill="none" stroke="#2d3539" stroke-width="6" /></svg>'
    endElement.className = 'end'
    endElement.innerHTML = '<svg width="20" height="20"><g transform="rotate(45, 10, 10)"><rect x="0" y="6.5" width="20" height="7" fill="#2d3539" /><rect x="6.5" y="0" width="7" height="20" fill="#2d3539" /></g></svg>'
}

function manhattan(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
}

function getNeighbors(grid, node) {
    const x = node.pos.x
    const y = node.pos.y

    let result = []

    if (grid[y - 1]) result.push(grid[y - 1][x])
    if (grid[y + 1]) result.push(grid[y + 1][x])
    if (grid[y][x - 1]) result.push(grid[y][x - 1])
    if (grid[y][x + 1]) result.push(grid[y][x + 1])

    return result
}

function hasNode(list, node) {
    let result
    list.forEach(x => {
        if (x.pos == node.pos) result = x
    })
    return result
}

function aStar(grid, start, end, callback) {
    clearPath()
    let open = []
    let closed = []

    open.push(start)

    let prev

    loop = setInterval(() => {
        if (!open.length) return clearInterval(loop), prev.className = 'visited'
        let current = open[0]
        let index = 0
        open.forEach((x, i) => {
            if (x.f < current.f) current = x, index = i
        })

        if (current.pos == end.pos) {
            let curr = current
            let result = []
            while (curr.parent) {
                result.push(curr)
                curr = curr.parent
            }
            callback(result.reverse())
            return clearInterval(loop), prev.className = 'visited'
        }

        open.splice(index, 1)
        closed.push(current)

        const currentElement = document.getElementById(`${current.pos.y}-${current.pos.x}`)
        if (currentElement.className == 'unvisited') currentElement.className = 'highlight'
        if (prev && prev.className == 'highlight') prev.className = 'visited'
        prev = currentElement

        if (currentElement.className == 'visited' || currentElement.className == 'wall') return

        getNeighbors(grid, current).forEach(x => {
            if (hasNode(closed, x) || x.wall) return

            x.parent = current

            const turn = current.parent && current.parent.parent && current.pos.x - current.parent.pos.x != current.parent.pos.x - current.parent.parent.pos.x && current.pos.y - current.parent.pos.y != current.parent.pos.y - current.parent.parent.pos.y

            x.g = current.g + 1
            x.h = manhattan(x.pos, end.pos)
            x.f = x.g + x.h

            let node = hasNode(open, x)
            if (node && x.g > node.g) return

            open.push(x)
        })
    }, 10)
}