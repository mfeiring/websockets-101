# Websockets 101

Kurs i WebSockets og Socket.IO.

## Installasjon

1. Last ned dette repoet
2. Åpne to terminalvinduer
3. Kjør opp serveren i den ene terminalen
```bash
$ cd websockets-101/server
$ npm i
$ npm start
```
4. Kjør opp webapplikasjonen i den andre terminalen
```bash
$ cd ../client
$ npm i
$ npm start
```

Steg fire skal automatisk åpne et nettleservindu for deg. Når du fått opp dette er det bare å gå i gang med oppgavene under.

(For å kjøre opp løsningsforslaget, bytt ut `npm start` med `npm run start:lf` for både server og klient)

## Oppgave 1 - Deltakerliste

Foreløpig er serveren vår ganske enkel. Vi har opprettet en `socket.io`-instans ved å kjøre `const io = require('socket.io')(server)`, deretter lytter vi til et `connection`-event, som fyrer av hver gang en klient (en `socket`) kobler seg til. Dersom du har startet webapplikasjonen og åpnet den i en nettleser, bør du kunne se følgende logget i terminalen du startet serveren i `a user connected 😻`.
- Hva skjer hvis du refresher nettleservinduet?
- Hva skjer hvis du åpner applikasjonen i flere faner?

Det første vi skal gjøre er å sende en liste over deltakere i chatten (`participants`) til en klient idet den kobler seg til `socket.io`-instansen vår. Foreløpig har vi populert denne listen med `DUMMY_PARTICIPANTS`.

**Server**
1. Åpne filen `server/server.js`
2. Bruk funksjonen `socket.emit(EVENT_NAME, PAYLOAD)` for å sende ut `participants`-lista (_EVENT_NAME_ og _PAYLOAD_ er kun ment som placeholdere).

**Klient**
1. Åpne filen `client/src/components/Participants.jsx`.
2. Lytt til eventet som sender ut `participants`-lista ved å bruke funksjonen 
```js
socket.on(EVENT_NAME, PAYLOAD => {
    console.log(PAYLOAD)
    //Do stuff with payload
})
```
3. Bruk funksjonen `setParticipants` for å oppdatere `participants`-staten, idet du mottar lista fra serveren. Du bør nå kunne se deltakerene _Powerwolf_ og _Babymetal_ i deltakerlista i nettleseren.

Vi kunne også sendt ut deltakerlista ved å bruke `io.emit(EVENT_NAME, PAYLOAD)`. Da hadde vi imidlertid sendt ut lista til samtlige klienter som er tilkoblet. Altså: `io` er den "globale" `socket.io`-instansen alle klienter kobler seg til, mens `socket` representerer den aktuelle klienten. 

## Oppgave 2 - Join chat

Det neste steget er å kunne joine chatten. Frontendkoden for denne komponenten finner du i `client/src/components/Chat.jsx`. Denne komponenten har to ulike visninger, et enkelt skjema for å skrive inn brukernavn og joine chatten, og en chatvisning, som vises avhengig av om staten `active` er henholdsvis `false` eller `true`. Den er satt til `false`, og tanken er altså at den skal endres til `true` idet man joiner.

**Klient**
1. I den tomme `joinChat`-funksjonen (sett bort fra `e.preventDefault()`), bruk en `socket.emit()`-funksjon for å sende et objekt med deltakernavn (`nickname`) og deltaker-ID (`id`) til serveren. Bruk IDen til socketen (`socket.id`).   
_Tips_: Du kan bruke `e.target.nickname.value` for å hente ut verdien i inputfeltet. 

**Server**
1. For å lytte på et event fra en klient i serveren, bruker vi en `socket.on()`-funksjon, på tilsvarende måte som vi gjorde for å ta imot deltagerlista i `client/src/components/Participants.jsx`. Lag en slik funksjon, som tar i mot deltakerobjektet du sendte ut i `joinChat`-funksjonen, og lagrer det i `participants`-lista.
2. Send ut oppdatert deltakerliste til alle tilkoblede klienter, ved å bruke en `io.emit(EVENT_NAME, PAYLOAD)`-funksjon inne i `socket.on`-funksjonen fra steg 1. For enkelhets skyld kan det være greit å bruke samme event-navn her, som det du brukte for å sende deltakerlista første gang.  
Dette vil altså sende oppdatert deltakerliste til samtlige klienter, inkludert den som sendte inn forespørselen. Vi kunne ha valgt å sende ut eventet til alle _ekskludert_ innsender (`socket.broadcast.emit(EVENT_NAME, PAYLOAD)`), men innsender ville da ikke fått lista oppdatert med sitt eget brukernavn.
3. Send ut en liste over alle meldinger (`chatMessages`) _kun_ til brukeren som akkurat joinet chatten. Foreløpig inneholder denne lista kun `DUMMY_MESSAGES`.

**Tilbake til klienten**
1. I `client/src/components/Chat.jsx` lag en ny state-variabel `messages`, og en tilhørende funksjon for å oppdatere denne, ved å bruke en `useState`-hook.  
(Det er et bevisst valg å kalle denne noe annet enn `chatMessages`, for å unngå tvetydige variabelnavn)
2. Lag en ny `socket.on()`-funksjon som lytter på eventet som sender ut `chatMessages`-lista, og oppdaterer `messages`-staten med denne lista. Sørg samtidig for å sette `active`-staten til `true`.

Du bør nå se chatvinduet med meldingen "Velkommen til chatten" og et inputfelt, og kan da gå videre til neste oppgave. Fra og med nå kommer vi til å omtale funksjoner som sender et socket-event som _emit-funksjoner_, og funksjoner som tar imot et event som _lyttefunksjoner_

## Oppgave 3 - Send meldinger

Hvis du prøver å sende en melding nå, så vil du oppleve at hele vinduet refresher. Dette skjer fordi `<form>`-elementet rundt fyrer av en default action, som ikke driver med sånne SPA-greier som dynamisk datalasting. La oss fikse det.

**Server**
1. Lag en lytterfunksjon som tar imot nye meldinger fra en `socket`. Meldingen som kommer inn må være av typen `IncomingMessage`. Og legg til denne meldingen i `chatMessages`-lista.
   1. For å legge til meldingen i lista må vi utvide den med informasjon som `sender`. Du kan hente ut `socket.id` på serversiden også, og f.eks. bruke `participands.find()` for å finne deltakeren som matcher denne IDen.
2. Lag en emit-funksjon som videresender denne nye meldingen til alle tilkoblede klienter.

**Klient**
1. I `client/src/components/Chat.jsx` lag en funksjon som trigger ved `onSubmit` av skjemaet i chatvinduet, tilsvarende slik `joinChat`-funksjonen er satt opp. I deklarasjonen av denne funksjonen, bruk en emit-funksjon for å sende meldingen, slik at den fanges opp av lytterfunksjonen du har laget på serveren. Ha i bakhode hvilke felter du må sende inn for at dette skal fungere som forventet. 
2. Lag en funksjon som lytter etter eventet som sender ut den nye meldingen til alle klienter, og utvid `messages`-staten til å inneholde meldingen som sendes med.

Nå burde du kunne sende meldinger, og se at de dukker opp i chatten. Awesome 🙌

**Men!** Vi har et lite issue... 

Legg inn ei litta `console.log` i funksjonen du nettopp lagde (den som tar i mot en ny melding) og print ut den nye meldingen. Åpne en ny fane, uten å joine chatten.
- Hva skjer i konsollen til denne nye fanen, dersom du sender en melding i en fane der du har joina chatten? Dukker meldingen du nettopp sendte opp der også?

Vi har altså behov for noe som lar oss emitte events til et begrenset subsett av alle tilkoblede klienter: Kun de som har joinet chatten burde få tilsendt nye meldinger.

## Oppgave 4 - Begrensning av hvem vi sender meldinger til

For å begrense hvem vi sender meldinger til, kan vi bruke det `socket.io` kaller "rooms". For å sitere dokumentasjonen: 
> [Rooms are] arbitrary channels that sockets can join and leave

Vi kan sende et event, kun til klienter som har joina et gitt rom, ved å bruke funksjoner som `io.to(ROOM_NAME).emit(EVENT_NAME, PAYLOAD)` og `socket.to(ROOM_NAME).emit(EVENT_NAME, PAYLOAD)` for å sende til henholdsvis samtlige klienter, eller samtlige klienter med unntak av avsenderklienten.

**Server**
1. Få en klient til å joine rommet `'chat'` når de, vel, joiner chatten, ved å legge inn `socket.join('chat')` i funksjonen som legger inn en ny deltaker i `partcipants`-lista.
2. Oppdater emit-funksjonen du lagde i steg 2 av serverdelen i oppgave 3, slik at den nye meldingen kun sendes til klienter som har jointer `'chat'`-rommet.

Gjenta den lille sjekken med to faner fra oppgave 3, og verifiser at brukere som ikke har joina chatten ikke får tilsendt nye meldinger.

## Oppgave 5 - Finpuss

Et par småting gjenstår for å gjøre chatten enda smoothere:

- **Annen styling på "deg selv" i deltakerlista**  
Finn en måte å sette klassen `participant--active` på det `<li>`-elementet i `Participants.jsx` som matcher "din bruker" 
- **Annen styling på meldinger du har sendt**  
Finn en måte å sette klassen `message--active` på de `<li>`-elementet i `Chat.jsx` som tilsvarer meldinger du har sendt.
- **Fjerning av deltakere fra lista, dersom de forlater siden**  Utvid `socket.on('disconnect')`-funksjonen, slik at den fjerner deltagere fra `participants`-lista
- **Scroll til bunnen av meldingslista når det kommer nye meldinger**  
Bruk en `useEffect`-hook for å oppdatere scrollposisjonen til meldingslista, slik at man ser nye meldinger når de kommer.

For å koble til hverandres chat, kan dere simpelthen bytte ut `localhost` med IP-adressen til en annen.x

## Oppgave 6 - Spill

I `client/src/components/Game.jsx` har vi satt opp en enkel komponent med et `canvas`-element. Funksjonen `mouseMove` fyrer av når vi beveger musepekeren over elementet, og lagrer posisjonen til musepekeren i variablene `x` og `y`. Poenget med denne oppgaven er og sende og motta disse koordinatene, slik at vi kan tegne opp bevegelsene til alle klienter som er tilkoblet serveren vår.

**Server**
1. Legg inn følgende typedefinisjoner i `server.ts`  
```
interface IncomingPosition {
    x: string;
    y: string;
  }

  interface Position extends IncomingPosition {
    id: string;
  }
```
2. Lag en tom liste der hvert element skal tilsvare et objekt av typen `Position`.
3. Lag en lytterfunksjon som tar imot en posisjon fra klienten, av typen `IncomingPosition`. Legg denne posisjonen inn i lista du nettopp lagde.
4. Send ut den oppdaterte posisjonslista til alle klienter.

**Klient**
1. Utvid `mouseMove`-funksjonen, slik at den sender `{x, y}` til lytterfunksjonen du lagde i steg 3 over.
2. Lag en lytterfunksjon som tar imot den oppdaterte posisjonslista, og tegner hvert element på canvaset.

For å tegne i et `canvas`-element, må vi benytte oss av [Canvas APIet](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API). Det første vi må gjøre er å hente ut en referanse til HTML-elementet `<canvas>`, slik
```js
const canvas = document.getElementById('canvas')
```
Deretter må vi hente ut en såkalt `rendering context`, som er der selve "tegningen" skjer. Dette gjør vi slik
```js
const context = canvas.getContext('2d');
```
For å faktisk tegne noe bruker vi deretter `context.fillRect(x, y, width, height)`. Dette lager et rektangel på posisjonen `[x, y]` med dimensjoner beskrevet av `width` og `height`. (Du kan lese mer om denne funksjonen [her](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillRect))

3. Endre fargen på det som tegnes ved å bruke `context.fillStyle =`*`color`*. `color` kan være en hvilken som helst streng, som er gyldig som en farge i CSS, f.eks. `'black'` eller `#f0f0f0f0`.
4. Gi hver klient en unik farge. Her kommer IDen inn i bildet. I `helpers.js` finner du en funksjon som vil hjelpe deg å generere hex-kode basert på ID.

Det kan hende du opplever at musepekeren lagger en del, og det er tre vanlige årsaker til dette:

1. Du bruker `console.log()` og det hoper seg opp med meldinger i nettleseren
2. X og Y koordinatene vises med desimalpresisjon, og dette fører til at 
det sendes veldig mange kall.
3. Man sender melding selv om ikke koordinatene har endret seg

Problem 2 og 3 kan man løse på flere måter, men her er et lite hint til deler av koden:
```
Math.abs(xPostion - x) > UPDATE_THRESHOLD
```
En annen måte å løse dette problemet på, er å mellomlagre posisjonene i applikasjonen, og kun sende et socket-kall f.eks. hvert 5 sekund.

