
# Fullstackopen - osa 4

[fullstackopen osa 4](https://fullstackopen.com/osa4)

## Backend

Tehdään uusi Node-projekti
```
npm init
npm install eslint
npm install express
npm install dotenv
npm install express
npm install mongodb
npm install mongoose
npm install cors
npm install morgan --save
npm install --save-dev nodemon
```

## ESLint

Suosittu työkalu JavaScriptissä staattiseen analyysiin eli "linttaukseen" on [ESLint](https://archive.eslint.org/docs/user-guide/getting-started)

```
npm install eslint --save-dev
npm init @eslint/config@latest

```

### Lisäosat

[Lisäosat](https://eslint.style/packages/js): 

```
npm install --save-dev eslint @eslint/js
npm install --save-dev @stylistic/eslint-plugin-js
```

### MongoDB

Käytetään [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database) palvelun tarjoamaa NoSQL tietokantaa


# Frontend

Luodaan frontend-alihakemistoon Vite-projekti:
```
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install axios
npm run dev
```

## Lokaali testaus

Käynnistetään backend: `npm run dev`
Käynnistetään frontend: `npm run dev`
Mennään selaimella osoitteeseen: `http://localhost:5173/`

## Lokaali testaus frontendin tuotantokoodilla

Frontendin sovelluskehitysmoodia varten Viten konfiguraation on määritelty proxyasetukset, joiden perusteella React toimii lokaalissa ympäritössä proxynä.
Jos React-koodi tekee HTTP-pyynnön palvelimen johonkin osoitteeseen, joka ei ole React-sovelluksen vastuulla (eli kyse ei ole esim. sovelluksen JavaScript-koodin tai CSS:n lataamisesta), lähetetään pyyntö edelleen osoitteessa http://localhost:3001 olevalle palvelimelle.

Backendissä generoidaan frontendin tuotantokoodi: `npm run build:ui`
Käynnistetään backend: `npm run dev`
Mennään selaimella osoitteeseen: `http://localhost:3001/`

### Same origin policy ja CORS
Koska palvelin on localhostin portissa 3001 ja frontend localhostin portissa 5173, niiden origin ei ole sama.
Muista origineista tulevat pyynnöt voidaan sallia kaikkiin backendin Express routeihin käyttämällä Noden cors-middlewarea.

```
npm install cors

const cors = require('cors')

app.use(cors())

```

## Testaus

Asennetaan Jestin SuperTest kirjastoa

```
npm install --save-dev supertest
```

# Ympärsitömuuttuja / NODE_ENV

Pitää asentaa `cross-env` jotta NODE_ENV voidaan määritellä Windows:ssa

```
npm install --save-dev cross-env
```

# awsync / await miten päästään eroon try - catch lohkoisa

express-async-errors -kirjastoa käytettäessä ei tarvita
erillisiä avulla try-catch lohkoja eikä next(exception) funktiokutsu. Kirjasto hoitaa asian konepellin alla, eli jos async-funktiona määritellyn routen sisällä syntyy poikkeus, siirtyy suoritus automaattisesti virheenkäsittelijämiddlewareen.

`npm install express-async-errors`


# Kirjautuminen

JSON web token generoidaan jsonwebtoken-kirjaston avulla.
.env tiedostoon talletetaan testailua varten:
`SECRET=1dfae605-829f-47d8-bfca-536aa7e7eec1`


Kryptauksessa käytetään bcryptjs kirjastoa (bcrypt kirjasston kanssa
voi olla ongelmia Windowsin kanssa)

```

npm install  bcryptjs
npm install jsonwebtoken
```
