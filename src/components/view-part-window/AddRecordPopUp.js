import {Button, Col, Container, Modal, Row} from "react-bootstrap";
import {useEffect, useState} from "react";
import {InputLabel, MenuItem, Select} from "@mui/material";


const problemTypes = [
    '1ra Sobremedida', '2da Sobremedida', '3A', 'NC', 'Quemadura', 'Delaminacion', 'Otro', '-'
]

const AddRecordPopUp = (props) => {
    const [quality, setQuality] = useState("")
    const [problemType, setProblemType] = useState('')
    const titleStyle = {fontWeight: "bold"}

    // resetear all
    useEffect(() => {
        setQuality("")
        setProblemType("")
    }, [props.show])

    // desactivar problem type si quality es 0
    useEffect(() => {
        if (quality === 0) {
            setProblemType("-")
        }
        else {
            setProblemType("")
            }
    }, [quality])

    const handleAddRecord = () => {
        // part_name	quality	id	problem_type	quadrant
        let data = {
            part_name: props.pointData.partName,
            quality: quality,
            id: props.pointData.id,
            problem_type: problemType,
            quadrant: props.pointData.quadrant,
        }

        props.addRecord(data)
        // props.onHide()
    }

    if (props.registeredPoints.includes(props.pointData.id)) {
        return
    }

    return (
        <Modal
            show={props.show}
            onHide={props.onHide}
            centered
            dialogClassName={'add-record-pop-up-container'}
            size={'lg'}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Add Record
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container fluid>
                    <Row>
                        <Col>
                            <text style={titleStyle}>Part name:</text>
                        </Col>
                        <Col>{props.pointData.partName}</Col>
                        <Col>
                            <text style={titleStyle}>Point ID:</text>
                        </Col>
                        <Col>{props.pointData.id}</Col>
                    </Row>
                    <Row>
                        <Col>
                            <text style={titleStyle}>Quality:</text>
                        </Col>
                        <Col>
                            <Select autoWidth
                                    className={'select-record-input'}
                                    value={quality}
                                    onChange={(event)=>setQuality(event.target.value)}
                            >
                                <MenuItem value={0}>0</MenuItem>
                                <MenuItem value={1}>1</MenuItem>
                            </Select>
                        </Col>
                        <Col>
                            <text style={titleStyle}>Problem Type:</text>
                        </Col>
                        <Col>
                            <Select autoWidth
                                    className={'select-record-input'}
                                    label={'Problem Type'}
                                    value={problemType}
                                    onChange={(event)=>setProblemType(event.target.value)}
                                    disabled={!quality}
                            >
                                {problemTypes.map((type, index) => {
                                    return (
                                        <MenuItem key={index} value={type}>
                                            {type}
                                        </MenuItem>
                                    )
                                })}
                            </Select>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <text style={titleStyle}>Quadrant:</text>
                        </Col>
                        <Col>{props.pointData.quadrant}</Col>
                        <Col></Col>
                        <Col></Col>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleAddRecord}>Add Record</Button>
                <Button onClick={props.onHide}>Cancel</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default AddRecordPopUp