import {useEffect, useState} from "react";
import "./ViewQuadrantWindow.css"
import NavigationBar from "../NavigationBar";
import QuadrantPlot from "./QuadrantPlot";
import PartPlot from "./PartPlot";
import {useNavigate} from "react-router-dom";

const ViewQuadrantWindow = (props) => {
    let navigate = useNavigate()
    const [filename, setfilename] = useState('')
    const [planeType, setplaneType] = useState('')
    const [planeName, setplaneName] = useState('')
    const [selectedQuadrant, setselectedQuadrant] = useState('Upper') //Upper, Lower, Left, Right
    const [allPoints, setallPoints] = useState([])
    const [allParts, setallParts] = useState([])
    const [clickedPoints, setclickedPoints] = useState([])

    // obtener los datos cargados
    const getPlaneData = () => {
        const data = JSON.parse(localStorage.getItem("planeData"))
        setallPoints(data.allPoints)
        setallParts(data.allParts)
        setfilename(data.filename)
        setplaneType(data.planeType)
        setplaneName(data.planeName)
    }

    // obtener nombre del avion seleccionado y las partes
    useEffect(() => {
        getPlaneData()
    }, [])

    // boton para seleccionar cuadrante
    const quadrantSelect = () => {
        return (
            <select value={selectedQuadrant}
                    onChange={(event) => {setselectedQuadrant(event.target.value)}}
                    className={'quadrant-picker'}
            >
                <option>Upper</option>
                <option>Lower</option>
                <option>Left</option>
                <option>Right</option>
            </select>
        )
    }

    // mostrar pantalla de carga mientras se cargan todos los puntos
    if (allPoints.length*allParts.length === 0) {
        return
    }

    return (
        <div>
            <NavigationBar planeName={planeName} planeType={planeType} quadrantSelect={quadrantSelect}/>
            <div className={'plot-outer-container'}>
                <QuadrantPlot allPoints={allPoints} selectedQuadrant={selectedQuadrant} key={selectedQuadrant}
                              setClickedPoints={setclickedPoints}/>
                <PartPlot allPoints={allPoints} selectedPoints={clickedPoints} key={clickedPoints} allParts={allParts}/>
            </div>
        </div>
    )
}

export default ViewQuadrantWindow