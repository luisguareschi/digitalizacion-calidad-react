import {Container, Nav, Navbar} from "react-bootstrap";
import "./NavigationBar.css"
import {useEffect, useState} from "react";
import {RiPlaneFill} from "react-icons/ri";

const NavigationBar = (props) => {
    const [quadrantClicked, setquadrantClicked] = useState(false)
    const [partClicked, setpartClicked] = useState(false)

    // highlight in white the menu selected
    useEffect(()=> {
        const direction = window.location.href
        if (direction.includes("quadrant_view")) {
            setquadrantClicked(true)
        }
        if (direction.includes("part_view")) {
            setpartClicked(true)
        }
    }, [])

    // boton para seleccionar cuadrante
    const selectQuadrantButton = () => {
        if (props.quadrantSelect === undefined) return
        return (
            props.quadrantSelect()
        )
    }

    const downloadRecordsButton = () => {
        if (props.downloadButton === undefined) return
        return (
            props.downloadButton()
        )
    }

    return (
        <Navbar bg="primary" variant="dark">
            <Container>
                <Navbar.Brand>
                    <div className={'nav-bar-plane-title'}>
                        <RiPlaneFill />
                        {`${props.planeName} - ${props.planeType}`}
                    </div>
                </Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link href="/">Select Aircraft</Nav.Link>
                    <Nav.Link href="/quadrant_view" className={quadrantClicked ? 'active-tab' : ''}>Quadrant View</Nav.Link>
                    <Nav.Link href="/part_view" className={partClicked ? 'active-tab' : ''}>Part View</Nav.Link>
                </Nav>
            </Container>
            {downloadRecordsButton()}
            {selectQuadrantButton()}
        </Navbar>

    )
}

export default NavigationBar