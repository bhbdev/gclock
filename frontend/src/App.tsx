import './App.css';
import Header from './components/Header'
import BaseLayout from './components/layouts/BaseLayout';
import ClockContainer from './components/Clock/ClockContainer';
import { ClientProvider } from "./util/providers/ClientProvider";
import MainCol from './components/MainCol';



function App() {
  return (
    <ClientProvider>
        <BaseLayout>     
            <Header />
            <MainCol>
                <ClockContainer />
            </MainCol>
        </BaseLayout>
    </ClientProvider>
  );
}

export default App;
