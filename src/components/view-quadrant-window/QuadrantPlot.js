import Plot from "react-plotly.js";
import {useEffect, useState} from "react";


const QuadrantPlot = (props) => {
    const [x, setx] = useState([])
    const [y, sety] = useState([])
    const [blueX, setblueX] = useState([])
    const [blueY, setblueY] = useState([])

    // crear el array de datos para plotly
    const quadrantPoints = () => {
        let xx = []
        let yy = []
        let especialX = []
        let especialY = []
        for (let dict of props.allPoints) {
            if (props.selectedQuadrant === 'Upper') {
                const quads = ['Superior', 'Upper']
                if (quads.includes(dict.QUADRANT)) {
                    if (isSpecialPoint(dict)) {
                        especialX.push(dict.Xe)
                        especialY.push(dict.Ye)
                    }
                    else {
                        xx.push(dict.Xe)
                        yy.push(dict.Ye)
                    }
                }
            }
            if (props.selectedQuadrant === 'Lower') {
                const quads = ['Inferior', 'Lower']
                if (quads.includes(dict.QUADRANT)) {
                    if (isSpecialPoint(dict)) {
                        especialX.push(dict.Xe)
                        especialY.push(dict.Ye)
                    }
                    else {
                        xx.push(dict.Xe)
                        yy.push(dict.Ye)
                    }
                }
            }
            if (props.selectedQuadrant === 'Right') {
                const quads = ['Derecho', 'Right']
                if (quads.includes(dict.QUADRANT)) {
                    if (isSpecialPoint(dict)) {
                        especialX.push(dict.Xe)
                        especialY.push(dict.Ze)
                    }
                    else {
                        xx.push(dict.Xe)
                        yy.push(dict.Ze)
                    }
                }
            }
            if (props.selectedQuadrant === 'Left') {
                const quads = ['Izquierdo', 'Left']
                if (quads.includes(dict.QUADRANT)) {
                    if (isSpecialPoint(dict)) {
                        especialX.push(dict.Xe)
                        especialY.push(dict.Ze)
                    }
                    else {
                        xx.push(dict.Xe)
                        yy.push(dict.Ze)
                    }
                }
            }
        }
        setx(xx)
        sety(yy)
        setblueX(especialX)
        setblueY(especialY)
    }

    // determina si el punto es de los que se quiere estudiar (AZUL)
    const isSpecialPoint = (dict) => {
        const matchers = ['-FC-', '-FCFC-', '-FCFCFC-', '-FCFCFCFC-', '-FCTI-', '-FCTIAL-', '-FCTIFC-', '-FCTIFCAL-', '-FCTIALAL-']
        const selectedToolTypes = ['ADH', 'TDRILL']
        const selectedToolTypes1 = [503, 534, 535,1534,1535]
        const toolType = dict['Tdrill/adh/230/ninguno']
        const toolType1 = dict['Tool 1']
        const processFName = dict['Process Feature Name']
        for (let pattern of matchers) {
            if (processFName.includes(pattern)) {
                for (let tool1 of selectedToolTypes1) {
                    if (toolType1 === tool1) {
                        for (let tool of selectedToolTypes) {
                            if (toolType === tool) {
                                return true
                            }
                        }
                    }
                }
            }
        }


    }

    // cargar los puntos
    useEffect(()=>{
        quadrantPoints()
    }, [])

    // handler de cuando se selecciona un punto
    const handleClick = (event) => {
        const x = event.points[0].x
        const y = event.points[0].y
        if (blueX.includes(x) === false && blueY.includes(y) === false) {
            return
        }
        const clickedPoint = props.allPoints.filter((dict) => {
            const XYquads = ['Superior', 'Upper', 'Inferior', 'Lower']
            if (XYquads.includes(props.selectedQuadrant)) {
                if (dict.Xe === x && dict.Ye === y) {
                    return dict
                }
            }
            const XZquads = ['Right', 'Derecho', 'Left', 'Izquierdo']
            if (XZquads.includes(props.selectedQuadrant)) {
                if (dict.Xe === x && dict.Ze === y) {
                    return dict
                }
            }
        })
        props.setClickedPoints(clickedPoint)
    }

    return (
        <div className={'quadrant-plot-div'}>
            <h1 className={'quadrant-title'}>Quadrant: {props.selectedQuadrant}</h1>
            <Plot
                data={[
                    {
                        x: x,
                        y: y,
                        type: 'scatter',
                        mode: 'markers',
                        marker: {color: 'black', size:4},
                    },
                    {
                        x: blueX,
                        y: blueY,
                        type: 'scatter',
                        mode: 'markers',
                        marker: {color: 'blue', size:4},
                    }
                ]}
                config={{responsive: true}}
                onClick={handleClick}
            />
        </div>
    )
}

export default QuadrantPlot