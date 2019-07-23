# Websockets 101

Kurs i WebSockets og Socket.IO.

## Installasjon

1. Last ned dette repoet
2. Åpne to terminalvinduer
3. Kjør opp serveren i den ene terminalen
```bash
$ cd websockets/server
$ npm i
$ npm start
```
4. Kjør opp webapplikasjonen i den andre terminalen
```bash
$ cd websockets/client
$ npm i
$ npm start
```

Steg fire skal automatisk åpne et nettleservindu for deg. Når du fått opp dette er det bare å gå i gang med oppgavene under.

(For å kjøre opp løsningsforslaget, bytt ut `npm start` med `npm run start:lf` for både server og klient)

## Oppgave 1

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

## Oppgave 2

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

Du bør nå se chatvinduet med meldingen "Velkommen til chatten" og et inputfelt, og kan da gå videre til neste oppgave.

## Oppgave 3

