import {Table} from "react-bootstrap";
import {useEffect, useRef} from "react";
import {AnimatePresence, motion} from "framer-motion";


const RecordsTable = (props) => {
    const headers = ['Part Name', 'Quality', 'Problem Type', 'Point ID']
    const divRef = useRef(null)

    // hacer sroll al principio de la tabla al agregar un punto
    useEffect(() => {
        divRef.current.scroll({
            top: 0,
            behavior: "smooth"
        })
    }, [props.recordsTable])

    const partClicked = (partName) => {
        props.setPart(partName)
    }

    return (
        <AnimatePresence>
            <div style={{textAlign: "left"}} className={'part-list-records-table'} ref={divRef}>
                <Table striped bordered hover responsive>
                    <thead>
                    <tr>
                        {headers.map((header, index) => {
                            return (
                                <th key={index}>{header}</th>
                            )
                        })}
                    </tr>
                    </thead>
                    <tbody>
                    {props.recordsTable.map((dict, index) => {
                        return (
                            <motion.tr key={dict.id}
                                       initial={{ scale: 0 }}
                                       animate={{ scale: 1 }}
                                       transition={{duration: 0.3}}
                                       exit={{scale: 0}}
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
    )
}

export default RecordsTable