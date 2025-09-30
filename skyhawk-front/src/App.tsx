import './App.css'
import Map from './components/Map';

function App() {
    return (
        <div style={{ width: '100%', height: '100%' }}>
            <h1>Map Test</h1>
            <div style={{ flex: 1, width: '100%', height:'95%' }}>
                <Map />
            </div>
        </div>
    );	
}

export default App
