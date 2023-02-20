import {useEffect, useState} from "react";
import {Button, Image, Table} from "react-bootstrap";
import "./SelectPlaneWindow.css"
import {useNavigate} from "react-router-dom";
import {AnimatePresence, motion} from "framer-motion"
import {Menu, MenuItem} from "@mui/material";

const SelectPlaneWindow = () => {
    let navigate = useNavigate();
    const [planesList, setplanesList] = useState({})
    const [selectedPlane, setselectedPlane] = useState('')
    const [selectedRow, setselectedRow] = useState(-1)
    const [contextMenuCords, setContextMenuCords] = useState(null)

    // funcion para lista de aviones creados
    const getPlanesList = () => {
        const body = {
            method:'GET',
            headers : {
                'Content-Type':'application/json'
            }
        }
        fetch("http://localhost:5000/get_planes_list", body)
            .then(response => response.json())
            .then(json => {
                // ordenar por fecha de modifiacion
                let newDict = {}
                // eslint-disable-next-line array-callback-return
                Object.keys(json).map(key => {
                    let val = json[key]
                    let newKey = key.slice(2, key.length)
                    newDict[newKey] = val
                })
                json = newDict
                setplanesList(json)
                localStorage.setItem("planeNames", JSON.stringify(Object.keys(json)))
            })
    }

    // handle para seleccionar el avion
    const handlePlaneClicked = (selectedRow) => (event) => {
        let file_name = event.target.id
        setselectedPlane(file_name)
        setselectedRow(selectedRow)
    }

    // obtener lista de aviones
    useEffect(() => {
        getPlanesList()
    }, [])

    // create plane handler. Abrir pestana de crear avion
    const createPlaneClicked = (event) => {
        return navigate("/create_plane")
    }

    // handler para ver avion
    const selectPlaneClicked = (event) => {
        if (selectedPlane ==='') {
            alert("You have to select a plane to continue")
            return
        }
        navigate('/load_plane')
        localStorage.setItem('selected_plane', selectedPlane)
    }

    // abrir el context menu
    const handleContextMenu = (selectedRow) => (event) => {
        event.preventDefault();
        let file_name = event.target.id
        setselectedPlane(file_name)
        setselectedRow(selectedRow)
        setContextMenuCords(
            contextMenuCords === null
                ? {
                    mouseX: event.clientX + 2,
                    mouseY: event.clientY - 6,
                }
                :
                null,
        );
    };

    // cerrar el context menu
    const handleClose = () => {
        setContextMenuCords(null);
    };

    // borrar el record
    const deleteRecord = () => {
        if (window.confirm("Are you sure you want to delete this record? This action cannot be undone")) {
            let planes = {...planesList}
            let index = 0
            for (let planeName in planes) {
                if (index === selectedRow) {
                    delete planes[planeName]
                }
                index += 1
            }
            setplanesList(planes)
            const body = {
                method:'POST',
                headers : {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({filename: selectedPlane})
            }
            fetch("http://localhost:5000/delete_record", body).then(r => r)
        }
        handleClose()
    }

    return (
        <div className={'home-window'} onContextMenu={(e)=>e.preventDefault()}>
            <AnimatePresence>
                <motion.div className={'select-plane-container'}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{duration: 0.3}}
                            exit={{scale: 0}}
                >
                    {/*<img src={require("../../assets/logo.png")} alt={"logo"} className={'homescreen-logo'}/>*/}
                    <h1>AIRBUS A350 XWB QD APP</h1>
                    <h3>Select an Aircraft</h3>
                    <div className={'planes-list-table'}>
                        <Table striped bordered hover size={'sm'}>
                            <tbody>
                            {Object.keys(planesList).map((name, key) => {
                                let filename = `${name}_${planesList[name]}.xlsx`
                                return (
                                    <tr key={key} className={selectedRow === key ? 'selected-row':''}>
                                        <td
                                            onClick={handlePlaneClicked(key)}
                                            id={filename}
                                            onContextMenu={handleContextMenu(key)}
                                            className={'td-select-plane-window'}
                                        >
                                            {name}<h6>({planesList[name]})</h6>
                                        </td>
                                    </tr>
                                )})}
                            </tbody>
                        </Table>
                    </div>
                    <div className={'start-buttons'}>
                        <Button onClick={selectPlaneClicked}>Select Aircraft</Button>
                        <Button onClick={createPlaneClicked}>Create new Aircraft</Button>
                    </div>
                </motion.div>
            </AnimatePresence>
            <Menu
                open={contextMenuCords !== null}
                onClose={handleClose}
                anchorReference="anchorPosition"
                anchorPosition={
                    contextMenuCords !== null
                        ? { top: contextMenuCords.mouseY, left: contextMenuCords.mouseX }
                        : undefined
                }
            >
                <MenuItem onClick={deleteRecord}>Delete</MenuItem>
            </Menu>
        </div>
    )
}

export default SelectPlaneWindow