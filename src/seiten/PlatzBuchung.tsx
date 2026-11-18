import Chatbox from '../komponenten/Chatbox.tsx';

function PlatzBuchung(): React.JSX.Element {
  return (
    <section>
      <h2>Platz buchen</h2>
      <p>
        Fragen zu unseren Plätzen? Unser Platzwart Bruno hilft dir gerne weiter.
        Bald kann er auch direkt für dich reservieren.
      </p>
      <Chatbox />
    </section>
  );
}

export default PlatzBuchung;
