import {Container, Nav, Navbar} from "react-bootstrap";
import "./NavigationBar.css"
import {useEffect, useState} from "react";

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

    return (
        <Navbar bg="primary" variant="dark">
            <Container>
                <Navbar.Brand>{`${props.planeName} - ${props.planeType}`}</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link href="/">Select Aircraft</Nav.Link>
                    <Nav.Link href="/quadrant_view" className={quadrantClicked ? 'active-tab' : ''}>Quadrant View</Nav.Link>
                    <Nav.Link href="/part_view" className={partClicked ? 'active-tab' : ''}>Part View</Nav.Link>
                </Nav>
            </Container>
            {selectQuadrantButton()}
        </Navbar>

    )
}

export default NavigationBar