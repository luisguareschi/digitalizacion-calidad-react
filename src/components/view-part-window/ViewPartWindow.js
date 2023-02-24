import NavigationBar from "../NavigationBar";
import {useEffect, useState} from "react";
import "./ViewPartWindow.css"
import {Grid} from "@mui/material";
import {Button, Spinner} from "react-bootstrap";
import PartsListSelector from "./PartsListSelector";
import SelectedPartPlot from "./SelectedPartPlot";
import RecordsTable from "./RecordsTable";
import LoadPlaneDataWindow from "../LoadPlaneDataWindow";
import {useNavigate} from "react-router-dom";

const ViewPartWindow = (props) => {
    let navigate = useNavigate();
    const [filename, setfilename] = useState('')
    const [planeType, setplaneType] = useState('')
    const [planeName, setplaneName] = useState('')
    const [allPoints, setallPoints] = useState([])
    const [allParts, setallParts] = useState([])
    const [selectedPart, setSelectedPart] = useState('')
    const [recordsTable, setRecordsTable] = useState([])
    const [isDownloading, setIsDownloading] = useState(false)

    // usar el localstorage para cargar los datos del avion
    const getPlaneData = () => {
        const data = JSON.parse(localStorage.getItem("planeData"))
        setallPoints(data.allPoints)
        setallParts(data.allParts)
        setfilename(data.filename)
        setplaneType(data.planeType)
        setplaneName(data.planeName)
        setRecordsTable(data.recordsTable)
    }

    // cargar datos del avion
    useEffect(()=>{
        getPlaneData()
    }, [])

    // seleccionar parte
    const setPart = (part) => {
        setSelectedPart(part)
    }

    const saveRecordChanges = (records) => {
        const msg = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'filename': filename, 'recordsTable': records})
        }
        fetch("http://localhost:5000/save_record", msg)
            .then(response => response)
            .catch(error => alert("There was an error saving the changes"))
    }

    // agregar nueva entrada a la tabla
    const addRow = (data) => {
        let records = [...recordsTable]
        records.unshift(data)
        setRecordsTable(records)
        saveRecordChanges(records)
    }

    // eliminar entrada de la tabla
    const deleteRow = (pointID) => {
        let records = [...recordsTable]
        records = records.filter(dict => dict.id !== pointID)
        setRecordsTable(records)
        saveRecordChanges(records)
    }

    // descargar informe que se esta editando
    const downloadRecord = () => {
        setIsDownloading(true)
        const body = {
            method:"POST",
            headers: {
                "Content-Type":"application/json",
            },
            body: JSON.stringify({recordsTable: recordsTable})
        }
        fetch(`http://localhost:5000/download_table`, body)
            .then(res => res.blob())
            .then(blob => {
                let FileSaver = require('file-saver');
                FileSaver.saveAs(blob, `export-${filename}`);
            })
            .then(r => r)
            .catch(e => alert("There was an error exporting the file."))
            .finally(() => setIsDownloading(false))
    }

    const downloadButton = () => {
        return (
            <Button onClick={downloadRecord} className={'download-button'} disabled={isDownloading}>
                {isDownloading ? "Downloading..." : "Export Records"}
                {isDownloading ? <Spinner animation="border" className={"loading-icon"}></Spinner> : ""}
            </Button>
        )
    }

    if (allPoints.length*allParts.length === 0) {
        return
    }

    return (
        <div>
            <NavigationBar planeName={planeName} planeType={planeType} downloadButton={downloadButton}/>
                <Grid container rowSpacing={1} columnSpacing={1} height={"93vh"} justifyContent={"center"} alignItems={"center"} display={"flex"} marginTop={0} padding={"1%"} item={true}>
                    <Grid xs={6} className={'part-view-container'} item={true}>
                        <Grid container rowSpacing={1} columnSpacing={1} height={"93vh"} justifyContent={"center"} alignItems={"center"} display={"flex"} padding={"2%"} paddingLeft={0} item={true}>
                            <Grid xs={12} className={'part-view-container-left'} paddingBottom={1} item={true}>
                                <div className={'part-view-grid-item'} style={{padding: 10}}>
                                    <PartsListSelector allParts={allParts} setSelectedPartName={setPart} recordsTable={recordsTable}/>
                                </div>
                            </Grid>
                            <Grid xs={12} className={'part-view-container-left'} paddingTop={1} item={true}>
                                <div className={'part-view-grid-item'} style={{padding: 10}}>
                                    <RecordsTable recordsTable={recordsTable} setPart={setPart} deleteRow={deleteRow}/>
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid xs={6} className={'part-view-container'} item={true}>
                        <div className={'part-view-grid-item'}>
                            <SelectedPartPlot allParts={allParts}
                                              allPoint={allPoints}
                                              selectedPartName={selectedPart}
                                              addRecord={addRow}
                                              registeredPoints={recordsTable.map((dict) => dict.id)}
                                              recordsTable={recordsTable}
                            />
                        </div>
                    </Grid>
                </Grid>
        </div>
    )
}

export default ViewPartWindow