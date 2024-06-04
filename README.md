
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