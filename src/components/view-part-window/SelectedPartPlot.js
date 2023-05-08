import {useEffect, useState} from "react";
import {json} from "react-router-dom";
import {Tab, Tabs} from "react-bootstrap";
import Plot from "react-plotly.js";
import {AnimatePresence, motion} from "framer-motion"
import AddRecordPopUp from "./AddRecordPopUp";

const translateQuadrant = {
    Izquierdo: 'Left',
    Derecho: 'Right',
    Inferior: 'Lower',
    Superior: 'Upper'
}

const SelectedPartPlot = (props) => {
    const [partData, setPartData] = useState({})
    const [showPopUp, setShowPopUp] = useState(false)
    const [clickedPointData, setClickedPointData] = useState({})

    // obtener datos de la parte seleccionada
    useEffect(() => {
        let data = {
            name:props.selectedPartName,
            x:[], y:[], z:[],
            quadrant:'',
            info: [],
            bluex: [],
            bluey: [],
            bluez: [],
            blueInfo: [],
            blueQuadrant: '',

        }
        for (let dict of props.allParts) {
            if (dict.DESCRIPTION !== props.selectedPartName) {continue}
            let partNames = props.allParts.filter(dict2 => dict2.Xe === dict.Xe && dict2.Ye === dict.Ye && dict2.Ze === dict.Ze)
            partNames = partNames.map(dict2 => dict2.DESCRIPTION)
            let info = {
                id: dict.ID,
                partNames: partNames.toString(),
                quadrant: data.quadrant,
                partName: dict.DESCRIPTION
            }
            if (props.registeredPoints.includes(dict.ID)) {
                let recordInfo = props.recordsTable.filter(dict2=>dict2.id===dict.ID)[0]
                info.quality = recordInfo.quality
                info.problemType = recordInfo.problem_type
                data.bluex.push(dict.Xe)
                data.bluey.push(dict.Ye)
                data.bluez.push(dict.Ze)
                data.blueInfo.push(info)
                data.blueQuadrant = translateQuadrant[dict.QUADRANT] === undefined ? dict.QUADRANT : translateQuadrant[dict.QUADRANT]
            }
            else {
                data.x.push(dict.Xe)
                data.y.push(dict.Ye)
                data.z.push(dict.Ze)
                data.info.push(info)
                data.quadrant = translateQuadrant[dict.QUADRANT] === undefined ? dict.QUADRANT : translateQuadrant[dict.QUADRANT]
            }
        }
        setPartData(data)
    }, [props.selectedPartName, props.registeredPoints])

    const partPlot = () => {
        return (
            <Plot
                data={[
                    {
                        x: partData.x,
                        y: partData.y,
                        z: partData.z,
                        type: 'scatter3d',
                        mode: 'markers',
                        marker: {color: 'black', size:4},
                        text: partData.info,
                        hovertemplate: '' +
                            '<b>Point ID:</b> %{text.id}<br>' +
                            '<b>Parts: </b> %{text.partNames}' +
                            '<extra></extra>',
                    },
                    {
                        x: partData.bluex,
                        y: partData.bluey,
                        z: partData.bluez,
                        type: 'scatter3d',
                        mode: 'markers',
                        marker: {color: 'blue', size:5},
                        text: partData.blueInfo,
                        hovertemplate: '' +
                            '<b>Point ID:</b> %{text.id}<br>' +
                            '<b>Parts: </b> %{text.partNames}<br>' +
                            '<b>Quality: </b> %{text.quality}<br>' +
                            '<b>Problem Type: </b> %{text.problemType}' +
                            '<extra></extra>',
                    },
                ]}
                config={{responsive: true}}
                willReadFrequently={true}
                onClick={handlePlotClicked}
            />
        )
    }

    const emptyPlot = () => {
        return (
            <Plot
                data={[
                    {
                        x: [1],
                        y: [1],
                        z: [1],
                        type: 'scatter3d',
                        mode: 'markers',
                        marker: {color: 'white', size:1},
                    }
                ]}
                config={{responsive: true}}
            />
        )
    }

    const handlePlotClicked = (event) => {
        if (showPopUp) {
            return
        }
        let pointData = event.points[0].text
        if (props.registeredPoints.includes(pointData.id)) {
            alert("This point has already been registered")
            return
        }
        setClickedPointData(pointData)
        setShowPopUp(true)
    }

    const hidePopUp = () => {
        setShowPopUp(false)
    }
    return (
        <>
            <AnimatePresence>
                <div>
                    <h2 style={{marginTop: 40, marginBottom:0}}>{props.selectedPartName === '' ? 'Select a Part' : `Part: ${props.selectedPartName}`}</h2>
                    <motion.div className={'quadrant-part-plot'}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{duration: 0.3}}
                                exit={{scale: 0}}
                                key={props.selectedPartName}
                    >
                        {props.selectedPartName === '' ? emptyPlot() : partPlot()}
                        <div className={"part-info-container"}>
                            <div>
                                <text style={{fontWeight: "bold"}}>Name: </text>
                                <text>{partData.name}</text>
                            </div>
                            <div>
                                <text style={{fontWeight: "bold"}}>Quadrant: </text>
                                <text>{partData.quadrant}</text>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </AnimatePresence>
            <AddRecordPopUp show={showPopUp}
                            onHide={hidePopUp}
                            pointData={clickedPointData}
                            addRecord={props.addRecord}
                            registeredPoints={props.registeredPoints}
            />
        </>
    )
}

export default SelectedPartPlot