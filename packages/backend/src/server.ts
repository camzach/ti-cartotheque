import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import { Map } from './mongoose-models';
import dotenv from 'dotenv';

dotenv.config();

const app = express()
const port = process.env.PORT || 3000;

const buildPath = path.resolve(__dirname, '../../frontend/dist');
const indexHtml = path.join(buildPath, 'index.html');

// Setup build path as a static assets path
app.use(express.static(buildPath));
// Serve index.html on unmatched routes
app.get('/', (req, res) => res.sendFile(indexHtml));

const MONGO_URI = process.env.MONGO_URI || '';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('connected to mongodb'))
  .catch(() => console.log('mongodb failed to connect'));

app.get('/maps', async (req, res) => {
  try {
    const docs = await Map.find().select({ '_id': 0 });
    res.send(docs);
  } catch(e) {
    res.status(400).send('Failed to retireve maps');
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
