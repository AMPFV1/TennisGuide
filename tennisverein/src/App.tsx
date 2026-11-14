// src/App.tsx
// Haupt-Komponente: Navigation und die Routen fuer die drei Seiten
import { Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './komponenten/Navigation.tsx';
import Startseite from './seiten/Startseite.tsx';
import TrainerBuchung from './seiten/TrainerBuchung.tsx';
import PlatzBuchung from './seiten/PlatzBuchung.tsx';

function App(): React.JSX.Element {
  return (
    <>
      <Navigation />
      <main>
        <Routes>
          <Route path='/' element={<Startseite />} />
          <Route path='/trainer' element={<TrainerBuchung />} />
          <Route path='/plaetze' element={<PlatzBuchung />} />
          {/* Unbekannte URL -> zurueck zur Startseite */}
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
