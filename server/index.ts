import express from 'express';
import cors from 'cors';
import { getMatches } from '../src/api/matches';

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.get('/api/matches', getMatches);

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
