import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleSpreadsheet } from 'google-spreadsheet';

dotenv.config();

const app = express()
const port = process.env.PORT || 3000;

// Force HTTPS
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.protocol !== 'https' && req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    }
    else {
      next();
    }
  })
}

const buildPath = path.resolve(__dirname, '../../frontend/dist');
const indexHtml = path.join(buildPath, 'index.html');

// Setup build path as a static assets path
app.use(express.static(buildPath));
// Serve index.html on unmatched routes
app.get('/', (req, res) => res.sendFile(indexHtml));

const { GOOGLE_SHEETS_ID, GOOGLE_SHEETS_CLIENT_EMAIL, GOOGLE_SHEETS_PRIVATE_KEY } = process.env;
if (!GOOGLE_SHEETS_ID || !GOOGLE_SHEETS_CLIENT_EMAIL || !GOOGLE_SHEETS_PRIVATE_KEY) {
  console.log('Insufficient google creds provided');
  process.exit();
}
const doc = new GoogleSpreadsheet(GOOGLE_SHEETS_ID);
doc.useServiceAccountAuth({
  client_email: GOOGLE_SHEETS_CLIENT_EMAIL,
  private_key: GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n')
});
doc.loadInfo()
  .then(() => {
    app.get('/maps', async (req, res) => {
      try {
        const rows = await doc.sheetsByIndex[0].getRows();
        res.send(rows.map((row) => {
          const {
            "Map name": name,
            "Player count": playerCount,
            "Attributes": attributes,
            "Map string": mapString
          } = row;
          const requiresPoK = attributes.split(', ').includes('PoK required');
          if (!name) {
            return false;
          }
          return {
            name,
            playerCount: parseInt(playerCount),
            requiresPoK,
            mapString: mapString.trim().split(/\s*,\s*|\s+/)
          }
        }).filter(Boolean));
      } catch {
        res.status(500).send('Failed to retrieve maps');
      }
    });
  })
  .then(() => console.log('connected to google sheet'))
  .catch((e) => console.log('Failed to connect to google sheet', e));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
