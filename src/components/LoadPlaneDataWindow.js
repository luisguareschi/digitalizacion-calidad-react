import {useEffect, useState} from "react";
import LoadingWindow from "./LoadingWindow";
import {json, useNavigate} from "react-router-dom";
import flaskAddress from "./flaskAddress";

const LoadPlaneDataWindow = (props) => {
    let navigate = useNavigate();
    const [allPoints, setallPoints] = useState([])
    const [allParts, setallParts] = useState([])
    const [filename, setfilename] = useState('')
    const [planeType, setplaneType] = useState('')
    const [planeName, setplaneName] = useState('')
    const [recordsTable, setRecordsTable] = useState([])
    const [recordsLoaded, setRecordsLoaded] = useState(false)
    // obtener los puntos del tipo de avion seleccionado
    const getAllPoints = (planeType) => {
        const msg = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'type': planeType})
        }
        fetch(`${flaskAddress}get_xlsx`, msg)
            .then(response => response.json())
            .then(json => {
                setallPoints(json)
            })
    }

    // obtener las partes del tipo de avion seleccionado
    const getAllParts = (planeType) => {
        const msg = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'type': `PARTES_INTERES_${planeType}`})
        }
        fetch(`${flaskAddress}get_xlsx`, msg)
            .then(response => response.json())
            .then(json => {
                setallParts(json)
            })
    }

    //
    const getRecordsTable = (file) => {
        const msg = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'filename': file})
        }
        fetch(`${flaskAddress}get_record`, msg)
            .then(response => response.json()
                .then(json => {
                    setRecordsTable(json)
                }))
    }

    // obtener nombre del avion seleccionado y las partes
    useEffect(() => {
        let selection = localStorage.getItem('selected_plane')
        let split = selection.split('_')
        let name = ''
        let type = split[split.length - 1].split('.')[0]
        for (let i in split) {
            let item = split[i]
            if (split.length === 2) {
                name = name + item
                break
            }
            if (i === split.length - 2) {
                name = name + item
                break
            }
            if (i < split.length - 2) {
                name = name + item + '_'
            }

        }
        setfilename(selection)
        setplaneName(name)
        setplaneType(type)
        getAllPoints(type.toUpperCase())
        getAllParts(type.toUpperCase())
        getRecordsTable(selection)
        setRecordsLoaded(true)
    }, [])


    // guardar datos obtenidos
    const savePlaneData = () => {
        let data = {
            allPoints: allPoints,
            allParts: allParts,
            filename: filename,
            planeType: planeType,
            planeName: planeName,
            recordsTable: recordsTable
        }
        localStorage.setItem("planeData", JSON.stringify(data))
    }

    if (allPoints.length*allParts.length === 0 && recordsLoaded) {
        return (
            <LoadingWindow/>
        )
    }
    else {
        savePlaneData()
        navigate('/quadrant_view')
    }
}

export default LoadPlaneDataWindow