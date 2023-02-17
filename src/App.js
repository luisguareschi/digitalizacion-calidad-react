import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useEffect} from "react";
import SelectPlaneWindow from "./components/select-plane-window/SelectPlaneWindow";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import CreatePlaneWindow from "./components/create-plane-window/CreatePlaneWindow";
import ViewQuadrantWindow from "./components/view-quadrant-window/ViewQuadrantWindow";
import ViewPartWindow from "./components/view-part-window/ViewPartWindow";
import LoadPlaneDataWindow from "./components/LoadPlaneDataWindow";

function App() {
    return (
    <div className="App">
        <BrowserRouter>
            <Routes>
                <Route path={'/'} element={<SelectPlaneWindow/>}/>
                <Route path={'/create_plane'} element={<CreatePlaneWindow/>}/>
                <Route path={'/quadrant_view'} element={<ViewQuadrantWindow/>}/>
                <Route path={'/part_view'} element={<ViewPartWindow/>}/>
                <Route path={'/load_plane'} element={<LoadPlaneDataWindow/>}/>
            </Routes>
        </BrowserRouter>
    </div>
    );
}

export default App;
