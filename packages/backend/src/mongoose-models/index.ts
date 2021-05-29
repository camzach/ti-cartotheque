import { Schema, model } from 'mongoose';

const mapSchema = new Schema({
  name: String,
  requiresPoK: Boolean,
  playerCount: Number,
  mapString: [Number]
});

const Map = model('Map', mapSchema);

export { Map }
