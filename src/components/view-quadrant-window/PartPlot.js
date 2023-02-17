import "./PartPlot.css"
import {useEffect, useState} from "react";
import {json} from "react-router-dom";
import {Tab, Tabs} from "react-bootstrap";
import Plot from "react-plotly.js";
import {AnimatePresence, motion} from "framer-motion"

const PartPlot = (props) => {
    const [selectedParts, setselectedParts] = useState([])
    const [motionDivKey, setMotionDivKey] = useState(0)

    // hallar todas las partes que contengan al punto y crear un arrays con cada uno
    useEffect(()=>{
        // obtener los nombres de las partes que pertenecen a los puntos seleccionados
        let parts = []
        let partNames = []
        for (let point of props.selectedPoints) {
            for (let part of props.allParts) {
                if (point.ID === part.ID) {
                    partNames.push(part.DESCRIPTION)
                    parts.push(part)
                }
            }
        }
        // obtener datos y puntos que conforman cada parte
        let partsInfo = []
        for (let part of parts) {
            let partData = {
                name:part.DESCRIPTION,
                x:[], y:[], z:[],
                blueX:part.Xe, blueY:part.Ye, blueZ:part.Ze,
                pointID:part.ID,
                parts:[...partNames]
            }
            for (let point of props.allParts) {
                if (point.DESCRIPTION === part.DESCRIPTION && point.ID !== part.ID) {
                    partData.x.push(point.Xe)
                    partData.y.push(point.Ye)
                    partData.z.push(point.Ze)
                }
            }
            partsInfo.push(partData)
        }
        console.log(partsInfo)
        setselectedParts(partsInfo)
    }, [props.allParts, props.selectedPoints])

    const emptyPlot = () => {
        return (
            <Tab eventKey="Select a part" title="Select a part">
                <div className={'quadrant-part-plot'}>
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
                </div>
            </Tab>
        )
    }

    // handler para refrescar la pantalla y que el gráfico ocupe el espacio necesario
    const resizeGraph = (event) => {
        window.dispatchEvent(new Event('resize'));
        setMotionDivKey(Date.now())
    }

    return (
        <AnimatePresence>
            <div className={'part-plot-outer-container'}>
                <Tabs
                    defaultActiveKey={selectedParts.length === 0 ? 'Select a part' : selectedParts[0].name}
                    className="mb-3"
                    justify
                    key={JSON.stringify(selectedParts)}
                    onSelect={resizeGraph}
                >
                    {selectedParts.length === 0 ? emptyPlot() : ''}
                    {selectedParts.map((dict) => {
                        if (selectedParts.length === 0) {return}
                        return (
                            <Tab eventKey={dict.name} title={dict.name} key={dict.name}>
                                <motion.div className={'quadrant-part-plot'}
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{duration: 0.3}}
                                            exit={{scale: 0}}
                                            key={motionDivKey}

                                >
                                    <Plot
                                        data={[
                                            {
                                                x: dict.x,
                                                y: dict.y,
                                                z: dict.z,
                                                type: 'scatter3d',
                                                mode: 'markers',
                                                marker: {color: 'black', size:4},
                                            },
                                            {
                                                x: [dict.blueX],
                                                y: [dict.blueY],
                                                z: [dict.blueZ],
                                                type: 'scatter3d',
                                                mode: 'markers',
                                                marker: {color: 'blue', size:5},
                                            }
                                        ]}
                                        config={{responsive: true}}
                                        willReadFrequently={true}
                                    />
                                    <div className={"part-info-container"}>
                                        <div>
                                            <text style={{fontWeight: "bold"}}>Location: </text>
                                            <text>[x:{dict.blueX}, y:{dict.blueY}, z:{dict.blueZ}]</text>
                                        </div>
                                        <div>
                                            <text style={{fontWeight: "bold"}}>Name: </text>
                                            <text>{dict.name}</text>
                                        </div>
                                        <div>
                                            <text style={{fontWeight: "bold"}}>Point ID: </text>
                                            <text>{dict.pointID}</text>
                                        </div>
                                        <text style={{fontWeight: "bold"}}>Parts:</text>
                                        <text>[{selectedParts.map((dict2) => dict2.name+", ")}]</text>
                                    </div>
                                </motion.div>
                            </Tab>
                        )
                    })}
                </Tabs>
            </div>
        </AnimatePresence>
    )
}

export default PartPlot