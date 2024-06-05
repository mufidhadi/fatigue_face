import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Home } from './pages/home';
import { ChartPage } from './pages/chart';

function App() {
    return (
        <>
            <Hero />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path='chart/:employeeId' element={<ChartPage />} />
            </Routes>
        </>
    )

    function Hero({ }) {
        return (
            <>
                <div className="bg-dark text-light">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col text-center">
                                <h1 className="display-3 my-4">Fatigue Detector Dashboard</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default App;
