// src/komponenten/Navigation.tsx
// Kopfbereich mit Menue fuer die drei Seiten
import { NavLink } from 'react-router-dom';

function Navigation(): React.JSX.Element {
  // NavLink bekommt die Klasse 'aktiv', wenn die Seite gerade offen ist
  const linkKlasse = ({ isActive }: { isActive: boolean }): string =>
    isActive ? 'aktiv' : '';

  return (
    <header>
      <h1>Tennisverein</h1>
      <nav aria-label='Hauptnavigation'>
        <ul>
          <li>
            <NavLink to='/' end className={linkKlasse}>
              Startseite
            </NavLink>
          </li>
          <li>
            <NavLink to='/trainer' className={linkKlasse}>
              Trainer buchen
            </NavLink>
          </li>
          <li>
            <NavLink to='/plaetze' className={linkKlasse}>
              Platz buchen
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Navigation;
