// src/App.tsx
// Haupt-Komponente: Navigation und die Routen fuer die Seiten
import { Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './komponenten/Navigation.tsx';
import Startseite from './seiten/Startseite.tsx';
import PlatzBuchung from './seiten/PlatzBuchung.tsx';

function App(): React.JSX.Element {
  return (
    <>
      <a className='skip-link' href='#inhalt'>
        Zum Inhalt springen
      </a>
      <Navigation />
      <main id='inhalt' tabIndex={-1}>
        <Routes>
          <Route path='/' element={<Startseite />} />
          <Route path='/plaetze' element={<PlatzBuchung />} />
          {/* Unbekannte URL -> zurueck zur Startseite */}
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </main>
      <footer className='seitenfuss'>
        <p>TC Netzroller – ein fiktiver Verein. Beispielprojekt für SED502 Frontend Development.</p>
      </footer>
    </>
  );
}

export default App;
