import { Link } from 'react-router-dom';

function Startseite(): React.JSX.Element {
  return (
    <>
      <section id='verein' aria-label='Vorstellung des Vereins'>
        <h2>Willkommen beim TC Netzroller!</h2>
        <p>
          Unser Name ist Programm: Bei uns rollt der Ball gerne mal über die
          Netzkante – und manchmal leider auch wieder zurück. Wir sind ein
          kleiner, familiärer Verein, in dem Anfänger und alte Hasen gemeinsam
          spielen. Entschuldigungen für Netzroller werden selbstverständlich
          akzeptiert, ernst gemeint sind sie aber nie.
        </p>

        <h3>Unsere Plätze</h3>
        <ul>
          <li>
            <strong>3 Außenplätze</strong> (Sand) – für alle, die Sonne lieben
            und rote Socken nicht stören.
          </li>
          <li>
            <strong>3 Hallenplätze</strong> – für Regen, Schnee und Tage, an
            denen der Wind wieder schuld gewesen wäre.
          </li>
        </ul>
        <p>
          <Link to='/plaetze'>Zur Platzbuchung</Link>
        </p>

        <h3>Unsere Trainer</h3>
        <p>
          Unsere Trainer bringen dir Vorhand, Rückhand, Aufschlag und Volley bei
          – egal ob du gerade anfängst oder schon Turniere spielst. Nur für
          Netzroller übernehmen sie keine Garantie.
        </p>
        <p>
          <Link to='/trainer'>Zur Trainerbuchung</Link>
        </p>

        <h3>Unsere Turniere</h3>
        <p>
          Vom Frühjahrs-Cup über die Vereinsmeisterschaft bis zum
          Hallen-Doppel im Winter: Bei uns gibt es jedes Jahr mehrere Turniere.
          Die wichtigste Regel steht in keinem Regelbuch – wer im Finale
          verliert, zahlt die erste Runde im Vereinsheim.
        </p>
      </section>

      <h2>Tennis Guide</h2>
      <p>Ein paar allgemeine Tipps rund ums Tennisspielen:</p>

      <section id='grundlagen' aria-label='Bereich Grundlagen'>
        <h2>Grundlagen</h2>
        <article>
          <p>
            Tennis ist ein beliebter Sport, der sowohl im Einzel als auch im
            Doppel gespielt werden kann. Das Spiel wird auf einem rechteckigen
            Platz mit einem Netz in der Mitte gespielt.
          </p>
          <p>
            Die Spieler schlagen den Ball abwechselnd über das Netz, wobei das
            Ziel darin besteht, den Ball so zu platzieren, dass der Gegner ihn
            nicht zurückschlagen kann.
          </p>
          <p>
            Die Punkte werden nach einem speziellen System gezählt: 15, 30, 40
            und Spiel. Ein Spieler muss mindestens zwei Punkte Vorsprung haben,
            um ein Spiel zu gewinnen.
          </p>
        </article>
      </section>

      <section id='schlaege' aria-label='Bereich Schläge'>
        <h2>Schläge</h2>
        <article>
          <p>
            Es gibt verschiedene Schläge im Tennis, die jeweils unterschiedliche
            Techniken erfordern. Der Grundschlag ist der Vorhand- und
            Rückhandschlag, die beide essenziell für das Spiel sind.
          </p>
          <p>
            Die Vorhand wird mit der dominanten Hand ausgeführt und ist oft
            kraftvoller, während die Rückhand entweder einhändig oder beidhändig
            gespielt werden kann.
          </p>
          <p>
            Weitere wichtige Schläge sind der Aufschlag, der Lob und der Volley.
            Jeder Schlag hat seine eigenen Strategien und Einsatzmöglichkeiten im
            Spiel.
          </p>
        </article>
      </section>

      <section id='training' aria-label='Bereich Training'>
        <h2>Training</h2>
        <article>
          <p>
            Regelmäßiges Training ist entscheidend, um die Fähigkeiten im Tennis
            zu verbessern. Es umfasst sowohl technische Übungen als auch
            Konditionstraining.
          </p>
          <p>
            Technische Übungen beinhalten das Üben von Schlägen, Bewegungen auf
            dem Platz und das Entwickeln von Spielstrategien. Konditionstraining
            hilft dabei, Ausdauer, Schnelligkeit und Beweglichkeit zu steigern.
          </p>
          <p>
            Ein ausgewogenes Trainingsprogramm sollte auch mentale Aspekte
            berücksichtigen, wie Konzentration, Stressbewältigung und taktisches
            Denken.
          </p>
        </article>
      </section>
    </>
  );
}

export default Startseite;
