import {Button, FloatingLabel, Form} from "react-bootstrap";
import "./CreatePlaneWindow.css"
import {BiArrowBack} from "react-icons/bi"
import {IoIosArrowBack}  from "react-icons/io"
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {AnimatePresence, motion} from "framer-motion"
import flaskAddress from "../flaskAddress";

const CreatePlaneWindow = (props) => {
    const [planeName, setplaneName] = useState('')
    const [planeType, setplaneType] = useState('v900')
    let navigate = useNavigate()

    // volver a la pagina principal
    const goBackHandler = (event) => {
        navigate("/")
    }

    // mandar el request para crear el archivo xlsx del avion
    const createPlaneClicked = (event) => {
        const file_name = `${planeName}_${planeType}.xlsx`
        if (planeName.replaceAll(" ", '') === '') {
            alert('Aircraft name cannot be blank')
            return
        }
        if (JSON.parse(localStorage.getItem("planeNames")).includes(planeName)) {
            alert(`Filename "${file_name}" already exists`)
            return
        }
        const data = {'filename':file_name}
        const msg = {
            method:'POST',
            headers : {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(data)
        }
        fetch(`${flaskAddress}create_record`, msg)
            .then(response => response)
        localStorage.setItem('selected_plane', file_name)
        navigate("/load_plane")
    }

    // handler para guardar la seleccion de avion
    const selectPlaneHandler = (event) => {
        setplaneType(event.target.value)
    }

    // handler para guardar el nombre escrito
    const planeNameHandler = (event) => {
        setplaneName(event.target.value)
    }

    return(
        <div className={'create-plane-window'}>
            <AnimatePresence>
                <motion.div className={'create-plane-container'}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{duration: 0.3}}
                            exit={{scale: 0}}
                >
                    <div className={'title'}>
                        <IoIosArrowBack onClick={goBackHandler}/>
                        <h1>Create New Aircraft</h1>
                    </div>
                    <Form>
                        <div className="enter-name">
                            <FloatingLabel
                                controlId="floatingInput"
                                label="Aircraft name"
                                className="mb-3"
                            >
                                <Form.Control
                                    placeholder="name@example.com"
                                    value={planeName}
                                    onChange={planeNameHandler}
                                />
                            </FloatingLabel>
                        </div>
                        <div className="select-plane">
                            <Form.Label>Aircraft type:</Form.Label>
                            <Form.Select value={planeType} onChange={selectPlaneHandler}>
                                <option>v900</option>
                                <option>v1000</option>
                                <option>RPB</option>
                            </Form.Select>
                        </div>
                    </Form>
                    <Button onClick={createPlaneClicked}>Create Aircraft</Button>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}

export default CreatePlaneWindow