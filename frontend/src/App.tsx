import './App.css';
import Clock from './components/Clock';
import { ClientProvider } from "./util/providers/ClientProvider";



function App() {
  return (
    <ClientProvider>
        <div className="App">
            <header>
                <h1>GClock</h1>
                <p>gRPC web example using Go + ConnectRPC + React</p>
            </header>

            <Clock />
      
        </div>
    </ClientProvider>
  );
}

export default App;
