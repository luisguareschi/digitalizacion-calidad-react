import {Table} from "react-bootstrap";
import {TextField} from "@mui/material";
import {useEffect, useState} from "react";
import {BsFillCheckSquareFill} from "react-icons/bs";

const PartsListSelector = (props) => {
    const [currentText, setCurrentText] = useState('')
    const [selectedPartName, setSelectedPartName] = useState('')
    const partNames = Array.from(new Set(props.allParts.map(dict => dict.DESCRIPTION))).sort()
    const registeredParts = Array.from(new Set(props.recordsTable.map(dict => dict.part_name)))

    useEffect(()=> {
        props.setSelectedPartName(selectedPartName)
    }, [selectedPartName])

    return (
        <>
            <TextField label="Part Name"
                       variant="outlined"
                       value={currentText}
                       onChange={(event) => setCurrentText(event.target.value)}
                       className={'select-part-input'}/>
            <div className={'part-list-selector-container'}>
                <Table striped bordered hover responsive>
                    <tbody>
                    {partNames.map((name, index) => {
                        if (name.toUpperCase().includes(currentText.toUpperCase()) === false) {return }
                        let style = {}
                        if (selectedPartName === name) {
                            style = {background:'#0D6EFBFF', fontColor: "white", fontWeight: 'bold'}
                        }
                        let partChecked = registeredParts.includes(name)
                        let checkColor = style.background === '#0D6EFBFF' ? "white": '#0D6EFBFF'
                        return (
                            <tr key={index} style={style}>
                                <td onDoubleClick={(event) => setSelectedPartName(name)} style={{color: style.fontColor}} className={'td-select-plane-window'}>
                                    {name}
                                    {partChecked ? <BsFillCheckSquareFill style={{color: checkColor, marginLeft: 10}}/> : ''}
                                </td>
                            </tr>
                        )
                    })}
                    </tbody>
                </Table>
            </div>
        </>
    )
}

export default PartsListSelector