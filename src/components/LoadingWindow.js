import {Spinner} from "react-bootstrap";
import "./LoadingWindow.css"
import {AnimatePresence, motion} from "framer-motion"


const LoadingWindow = () => {
    return (
        <AnimatePresence>
            <div className={'loading-window'}>
                <motion.div initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{duration: 0.3}}
                            exit={{scale: 0}}>
                    <h1>Loading...</h1>
                    <Spinner animation="grow" variant="light" />
                </motion.div>
            </div>
        </AnimatePresence>
    )
}

export default LoadingWindow