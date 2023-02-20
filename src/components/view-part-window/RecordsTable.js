import {Button, Table} from "react-bootstrap";
import {useEffect, useRef, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import FilterRecordDropdown from "./FilterRecordDropdown";
import {Menu, MenuItem} from "@mui/material";


const RecordsTable = (props) => {
    const headers = ['Part Name', 'Quality', 'Problem Type', 'Point ID']
    const headersColumnName = {'Part Name': 'part_name', 'Quality': 'quality', 'Problem Type': 'problem_type', 'Point ID': 'id'}
    const divRef = useRef(null)
    const [filtersTable, setFiltersTable] = useState({})
    const [contextMenuCords, setContextMenuCords] = useState(null)
    const [recordIDClicked, setRecordIDClicked] = useState(null)

    // hacer sroll al principio de la tabla al agregar un punto
    useEffect(() => {
        divRef.current.scroll({
            top: 0,
            behavior: "smooth"
        })
    }, [props.recordsTable])

    // handle para cuando se selecciona una parte
    const partClicked = (partName) => {
        props.setPart(partName)
    }

    // aplicar los filtros
    const changeFiltersTable = (columnName, selectedValues) => {
        let filters = {...filtersTable}
        filters[columnName] = selectedValues
        setFiltersTable(filters)
    }

    // handler para cuando se hace right click en la tabla
    const handleContextMenu = (pointID) => (event) => {
        event.preventDefault();
        setRecordIDClicked(pointID)
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
        setRecordIDClicked(null)
    };

    // delete record handler
    const deleteRecord = () => {
        if (window.confirm("Are you sure you want to delete this record? This action cannot be undone")) {
            props.deleteRow(recordIDClicked)
        }
        handleClose()
    }

    return (
        <>
            <AnimatePresence>
                <div style={{textAlign: "left"}} className={'part-list-records-table'} ref={divRef}>
                    <Table striped bordered hover responsive style={{height: "100%"}}>
                        <thead>
                        <tr>
                            {headers.map((header, index) => {
                                return (
                                    <th key={index}>
                                        {header}
                                        <FilterRecordDropdown
                                            columnValues={props.recordsTable.map(dict => dict[headersColumnName[header]])}
                                            columnName={headersColumnName[header]}
                                            changeFiltersTable={changeFiltersTable}
                                        />
                                    </th>
                                )
                            })}
                        </tr>
                        </thead>
                        <tbody>
                        {props.recordsTable.map((dict, index) => {
                            // filtrar fila
                            for (let key in headersColumnName) {
                                let columnName = headersColumnName[key]
                                if (filtersTable[columnName] !== undefined && filtersTable[columnName].length > 0) {
                                    if (!filtersTable[columnName].includes(dict[columnName])) {
                                        return ('')
                                    }
                                }
                            }
                            let style = {}
                            if (recordIDClicked === dict.id) {
                                style = {background: "rgba(0,0,0,0.32)"}
                            }
                            return (
                                <motion.tr key={dict.id}
                                           initial={{ scale: 0 }}
                                           animate={{ scale: 1 }}
                                           transition={{duration: 0.3}}
                                           exit={{scale: 0}}
                                           onContextMenu={handleContextMenu(dict.id)}
                                           style={style}
                                >
                                    <td onDoubleClick={()=> partClicked(dict.part_name)}>{dict.part_name}</td>
                                    <td>{dict.quality}</td>
                                    <td>{dict.problem_type}</td>
                                    <td>{dict.id}</td>
                                </motion.tr>
                            )
                        })}
                        </tbody>
                    </Table>
                </div>
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
        </>
    )
}

export default RecordsTable