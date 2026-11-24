# TC Netzroller – Tennis Guide mit KI-Platzwart

React-Anwendung eines fiktiven Tennisvereins, entstanden als Einsendeaufgabe 2 in
**SED502 Frontend Development** (FernFH, WS 2026/27, Gruppenarbeit). Die statische Vereinsseite
aus ESA 1 wurde dafür mit React, TypeScript und React Router neu aufgebaut und um einen
KI-Platzwart erweitert, mit dem Mitglieder Plätze, Trainer und Trainingsgeräte per Chat buchen.

## Für wen ist die App?

Für Vereinsmitglieder und Interessierte des TC Netzroller. Sie finden dort Informationen zum
Verein und zu den Grundlagen des Tennisspiels und buchen Plätze, ohne Formulare auszufüllen.

## Funktionen

- **Startseite** mit Vereinsvorstellung (Plätze, Trainer, Turniere) und dem „Tennis Guide“:
  Grundlagen, Schläge und Training.
- **Platzbuchung mit KI-Platzwart „Bruno“:** Bruno fragt im Chat nacheinander ab, was für die
  Buchung fehlt (Spielen oder Training, Einzel oder Doppel, Tag, Uhrzeit, Platz, Namen, Trainer,
  Geräte) und trägt die Angaben in den Buchungsentwurf ein. Gebucht wird erst, wenn die
  Person auf „Jetzt buchen“ klickt.
- **Streaming:** Brunos Antworten erscheinen Wort für Wort, während sie ankommen. Ein
  Tipp-Hinweis und ein Zeichenzähler (max. 500 Zeichen) begleiten die Eingabe.
- **Antwort-Kacheln:** Statt zu tippen, können Vorschläge von Bruno (Art, Spielform, Termin,
  Trainer, Geräte) angeklickt werden.
- **Prüfung im Code:** Bruno kann sich irren. Darum prüft die App jede Buchung nochmals selbst
  (Zeitraum heute bis +7 Tage, keine vergangene Uhrzeit, Platz, Trainer und Geräte frei,
  Außenplätze bei Regen gesperrt). Schlägt die Prüfung fehl, erfährt Bruno davon und
  schlägt eine Alternative vor.
- **Wetterleiste mit echter Vorhersage** (Open-Meteo, heute + 7 Tage). Bei Regen und Schnee sind die
  Außenplätze gesperrt. Beim Laden zeigt die Leiste Platzhalter, bei einem Fehler eine
  verständliche Meldung mit „Nochmal versuchen“. Bruno kennt dieselbe Vorhersage.
- **Eigene Buchungen** werden aufgelistet und lassen sich stornieren.

### Stand der Umsetzung

| Anforderung ESA 2                          | Stand                                                                 |
| ------------------------------------------ | --------------------------------------------------------------------- |
| React + TypeScript + Vite                  | umgesetzt                                                             |
| Mindestens 3 Seiten mit React Router       | in Arbeit (derzeit Startseite, Platzbuchung und Weiterleitung)        |
| Custom Hooks                               | `useAI` und `useWetter` umgesetzt                                     |
| KI-Feature mit Streaming                   | umgesetzt (Bruno über OpenRouter)                                     |
| Externe REST-API mit loading/success/error | umgesetzt (Wetter von Open-Meteo, `useWetter`). Belegung ist Mock    |
| `.env` für den API-Schlüssel               | umgesetzt (`.env.example` als Vorlage)                                |

## Voraussetzungen

- Node.js **20.19 oder neuer** (`node -v`, getestet mit Node 22)
- npm 10 oder neuer (`npm -v`)
- Ein kostenloser API-Schlüssel von [OpenRouter](https://openrouter.ai/keys) für Bruno. Die
  Wetter-API [Open-Meteo](https://open-meteo.com) braucht keinen Schlüssel.

## Lokal starten

```bash
git clone git@github.com:AMPFV1/TennisGuide.git
cd TennisGuide
npm install                      # Abhängigkeiten installieren (einmalig)
cp .env.example .env             # Vorlage kopieren und den eigenen Schlüssel eintragen
npm run dev                      # Entwicklungsserver mit Live-Reload
```

Danach im Browser <http://localhost:5173> öffnen.

### API-Schlüssel

Die Datei `.env` im Projektstamm enthält den Schlüssel und ist über `.gitignore` vom Repository
ausgeschlossen. Sie wird **nicht** eingecheckt.


Ohne Schlüssel startet die App trotzdem, Bruno antwortet dann mit einer Fehlermeldung.
Nach Änderungen an `.env` muss der Entwicklungsserver neu gestartet werden.

> **Hinweis:** Variablen mit dem Präfix `VITE_` werden von Vite in den Browser-Code eingebettet.
> Der Schlüssel ist damit im ausgelieferten Bundle sichtbar. Für ESA 2 mit einem kostenlosen
> Schlüssel ist das vertretbar. Für das Deployment in ESA 3 ist ein kleiner Proxy
> (Serverless-Funktion) die bessere Lösung.

## Build und Vorschau

```bash
npm run build      # Typprüfung (tsc -b) und Produktions-Build nach dist/
npm run preview    # liefert dist/ lokal aus
```

| Script            | Wirkung                                              |
| ----------------- | ---------------------------------------------------- |
| `npm run dev`     | Vite-Entwicklungsserver auf Port 5173                |
| `npm run build`   | `tsc -b` und danach `vite build` nach `dist/`        |
| `npm run preview` | Vorschau des Builds auf Port 4173                    |
| `npm run lint`    | Prüfung mit Oxlint                                   |

## Projektstruktur

```text
index.html                     Einstieg der Single-Page-Anwendung
src/main.tsx                   Start von React, BrowserRouter
src/App.tsx                    Navigation und Routen
src/seiten/                    Startseite, PlatzBuchung (Seiten der Routen)
src/komponenten/               Navigation, Chatbox, NachrichtBlaeschen, KachelListe,
                               BuchungsEntwurf, BuchungsListe, WetterLeiste
src/hooks/useAI.ts             Custom Hook: Chatverlauf, Streaming-Status, Fehler
src/hooks/useWetter.ts         Custom Hook: Wettervorhersage mit loading/success/error
src/utils/aiStream.ts          Streaming-Aufruf der OpenRouter-API (fetch, SSE)
src/utils/wetterApi.ts         Abruf der Open-Meteo-Vorhersage, Umrechnung der Wettercodes
src/utils/brunoPrompt.ts       System-Prompt für Bruno (Datum, Wetter, Belegung, Regeln)
src/utils/datenblock.ts        liest den versteckten JSON-Block aus Brunos Antwort
src/utils/verfuegbarkeit.ts    Prüfung: Zeitraum, Platz, Trainer, Geräte, Wetter
src/utils/formatierung.ts      Formatierung von Datum, Uhrzeit, Buchungsart
src/typen/                     Interfaces und Union-Typen (Buchung, Platz, Trainer, Nachricht)
src/daten/                     Plätze, Trainer, Geräte sowie Mock-Daten für die Belegung
```

## Technische Entscheidungen

- **Vite mit React und TypeScript.** `tsc -b` läuft im `strict`-Modus mit `noUnusedLocals` und
  `noUnusedParameters`, `npm run build` bricht bei Typfehlern ab.
- **Funktionale Komponenten mit typisierten Props.** Props, Zustände und Ereignisse sind über
  Interfaces und Union-Typen (`Kachel`, `Buchungsentwurf`) beschrieben.
- **Zustand im Seitenkomponenten-Baum.** `PlatzBuchung` hält Entwurf, Buchungen und Kacheln.
  Die Kinder (`Chatbox`, `KachelListe`, `BuchungsEntwurf`) sind reine Anzeige und melden
  Ereignisse über Callbacks nach oben. Der Chat läuft in `PlatzBuchung`, damit Bruno die
  eigenen Buchungen kennt.
- **Immutabilität.** Listen und Entwürfe werden beim Ändern neu erzeugt (Spread, `filter`),
  nie direkt verändert. Beim Streaming wird nur die letzte Nachricht ersetzt.
- **Custom Hook `useAI`.** Kapselt Verlauf, Streaming-Status, Fehler und Zurücksetzen und ist
  nicht an Bruno gebunden. Die Seite übergibt System-Prompt und einen Callback, der aufgerufen
  wird, wenn die Antwort vollständig ist.
- **Wetter-API mit drei Zuständen.** `useWetter` lädt die Vorhersage mit `fetch` und `AbortController`
  und leitet `loading`, `success` und `error` aus dem Ergebnis ab. Die Antwort wird geprüft, bevor
  sie verwendet wird. Fehlt die Vorhersage, sperrt der Code keine Plätze und Bruno sagt das ehrlich.
- **Streaming per `fetch` und `ReadableStream`.** Die Server-Sent-Events der API werden
  zeilenweise gelesen und Chunk für Chunk an den Hook weitergegeben.
- **Strukturierte Antwort.** Bruno hängt an jede Antwort einen `<daten>`-Block mit JSON an
  (Entwurf und Kacheln). Der Block wird im Chat ausgeblendet, auch während er noch ankommt, und
  vom Code ausgelesen.
- **KI schlägt vor, Code entscheidet.** Jede Buchung wird vor dem Speichern in
  `verfuegbarkeit.ts` nochmals geprüft, ohne sich auf Brunos Angaben zu verlassen.
- **Semantisches HTML und Barrierefreiheit.** `header`, `nav`, `main`, `section`, `article`,
  `aria-label` an Navigation und Bereichen, Text nur für Screenreader über `.visuell-versteckt`.

## Bedacht, aber nicht umgesetzt

Für einen echten Einsatz im Verein wären noch nötig:

**Benutzer**
- Benutzeranmeldung für Mitglieder
- Rollen (Mitglied, Trainer, Platzwart, Vorstand)
- Regeln für Gäste

**Daten**
- Echte Datenbank mit Backend statt Mock-Daten und React-State
- Doppelbuchungen am Server verhindern

**Vereinsbetrieb**
- Buchungsbestätigung per E-Mail
- Stornoregeln, Kontingente und Warteliste
- Gebühren für Halle, Trainer und Gäste
- Verwaltung für den Platzwart (Plätze sperren, Turniere eintragen)
- Arbeitstage und Urlaub der Trainer

## Aufgabenverteilung

> **Offen:** Bitte vor der Abgabe von beiden Personen ausfüllen. Es zählen erkennbare,
> gleichwertige Commits im Repository.

| Person          | Aufgaben                                                                                                                                                                            |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Jürgen          | Projektaufbau (Vite, React, Router), Startseite und Styling aus ESA 1, Platzbuchung, `useAI`-Hook und Streaming, Bruno-Prompt, Datenblock, Verfügbarkeitsprüfung, Kacheln, Chatbox  |
| Mathias Rangger | _noch einzutragen_ (zum Beispiel: README, Wetter-API mit `useWetter`-Hook, Fehler- und Ladezustände, Barrierefreiheit)                                                              |

## Einsatz von KI

### In der Anwendung

| Tool                | Modell                               | Zweck                                                                                       |
| ------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------- |
| OpenRouter (API)    | `nvidia/nemotron-3.5-super-vl:free`  | Platzwart „Bruno“: führt das Buchungsgespräch, beantwortet Tennisfragen, liefert Vorschläge |

Das Modell wird mit einem System-Prompt gesteuert, der Datum, Uhrzeit, Wetter, Plätze, Trainer,
Geräte und die belegten Zeiten enthält. Ergebnis: Bruno führt durch die Buchung, die Gültigkeit
prüft der Code (siehe oben).

### Bei der Entwicklung

> **Offen:** Pflichtangaben laut LV-Konzept pro Gruppenmitglied ergänzen: Toolname, verwendetes
> Modell, Art der Nutzung (zum Beispiel „Textkorrektur“, „Codebeispiel generiert“) und
> gekennzeichnete Textstellen.

| Person          | Tool / Modell | Art der Nutzung |
| --------------- | ------------- | --------------- |
| Jürgen          | Claude Code, Claude Opus 5.5 | Hilfe bei der Fehlersuche und Fehlerbehebung, bei Problemlösungen sowie Lösungsvorschläge |
| Mathias Rangger | Claude Code, Claude Sonnet 5.5 | README überarbeitet und strukturiert (Ausgangsbasis: Code und Commit-Historie) |

## Hinweis

Der TC Netzroller ist ein fiktiver Verein. Namen von Trainern und Mitgliedern in den
Beispieldaten sind frei erfunden.
