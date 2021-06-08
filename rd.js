function reDivMaze(width, height) {
    // document.getElementById('1_1').className = 'wall'
    // document.getElementById(`${width - 3}_${height - 3}`).className = 'wall'

    init(tableWidth, tableHeight)

    let pos1 = '1_1'
    let pos2 = `${width - 3}_${height - 3}`
    let axis = true
    let iter = 0
    let end = 0

    function division(pos1, pos2, axis, iter) {
        iter ++

        if (iter > Number.MAX_VALUE) return end --

        end ++

        pos1 = pos1.split('_')
        pos1 = [parseInt(pos1[0]), parseInt(pos1[1])]
        pos2 = pos2.split('_')
        pos2 = [parseInt(pos2[0]), parseInt(pos2[1])]

        const ABS_WIDTH = pos2[0] - pos1[0]
        let width = Math.floor((ABS_WIDTH + 1) / 2)
        const ABS_HEIGHT = pos2[1] - pos1[1]
        let height = Math.floor((ABS_HEIGHT + 1) / 2)


        if (ABS_WIDTH < 1 || ABS_HEIGHT < 1) return end --

        let wallX = (Math.round((width - 1) * ((Math.random() * 0.25 + Math.random()) / 1.25)) + 1) * 2 - 1
        let wallY = (Math.round((height - 1) * ((Math.random() * 0.25 + Math.random()) / 1.25)) + 1) * 2 - 1

        let newReg1Pos1 = `${pos1[0]}_${pos1[1]}`
        let newReg1Pos2
        let newReg2Pos1
        let newReg2Pos2 = `${pos2[0]}_${pos2[1]}`

        let wallPos1 = pos1.slice()
        let wallPos2

        if (axis) {
            wallPos1[0] += wallX
            wallPos2 = wallPos1.slice()
            wallPos2[1] += ABS_HEIGHT
            newReg1Pos2 = wallPos2.slice()
            newReg1Pos2[0] -= 1
            newReg2Pos1 = wallPos1.slice()
            newReg2Pos1[0] += 1
        } 
        else {
            wallPos1[1] += wallY
            wallPos2 = wallPos1.slice()
            wallPos2[0] += ABS_WIDTH
            newReg1Pos2 = wallPos2.slice()
            newReg1Pos2[1] -= 1
            newReg2Pos1 = wallPos1.slice()
            newReg2Pos1[1] += 1
        }
        axis = !axis

        newReg1Pos2 = `${newReg1Pos2[0]}_${newReg1Pos2[1]}`
        newReg2Pos1 = `${newReg2Pos1[0]}_${newReg2Pos1[1]}`

        wallPos1 = `${wallPos1[0]}_${wallPos1[1]}`
        wallPos2 = `${wallPos2[0]}_${wallPos2[1]}`

        // console.log(wallPos1)
        // console.log(wallPos2)

        // document.getElementById(wallPos1).className = 'wall'
        // document.getElementById(wallPos2).className = 'wall'

        drawLine(wallPos1, wallPos2, wallX, wallY, true, axis)

        setTimeout(() => {
            division(newReg1Pos1, newReg1Pos2, axis, iter)
            setTimeout(() => {
                division(newReg2Pos1, newReg2Pos2, axis, iter)
                setTimeout(() => {
                    end --
                    toDraw.forEach(node => {
                        const element = document.getElementById(node)
                        if (element.className != 'start' && element.className != 'end') {
                            nodes[node].class = 'wall'
                            element.className = 'wall'
                        }
                    })
                }, 10)
            }, 10)
        }, 10)

    }

    function drawLine(pos1, pos2, wallX, wallY, open, axis) {
        pos1 = pos1.split('_')
        pos1 = [parseInt(pos1[0]), parseInt(pos1[1])]
        pos2 = pos2.split('_')
        pos2 = [parseInt(pos2[0]), parseInt(pos2[1])]
    
        let dX = pos2[0] - pos1[0]
        let dY = pos2[1] - pos1[1]
        
        let stepX = 0
        let stepY = 0
    
        if (dX) stepX = dX / Math.abs(dX)
        if (dY) stepY = dY / Math.abs(dY)
    
        const max = Math.max(dX, dY)
    
        let pos = pos1.slice()

        let opening = pos.slice()

        if (axis) {
            opening[0] += wallX - 1
        }
        else {
            opening[1] += wallY - 1
        }

        opening = `${opening[0]}_${opening[1]}`
    
        for (let i = 0; i < max + 1; i++) {
            if (`${pos[0]}_${pos[1]}` != opening || !open) toDraw.push(`${pos[0]}_${pos[1]}`)
            // document.getElementById(`${pos[0]}_${pos[1]}`).className = 'wall'
            pos[0] += stepX
            pos[1] += stepY
        }
    }

    let toDraw = []
    console.log(width - 2, height - 2)
    drawLine('0_0', `${width - 2}_0`, 0, 0, false)
    drawLine(`${width - 2}_0`, `${width - 2}_${height - 2}`, 0, 0, false)
    drawLine(`0_${height - 2}`, `${width - 2}_${height - 2}`, 0, 0, false)
    drawLine('0_0', `0_${height - 2}`, 0, 0, false)
    division(pos1, pos2, axis, iter)
}