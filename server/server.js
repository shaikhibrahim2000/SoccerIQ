
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/leagues', require('./routes/leagues'));
app.use('/api/teams', require('./routes/teams'));
app.use('/api/players', require('./routes/players'));
app.use('/api/positions', require('./routes/positions'));
app.use('/api/head-to-head', require('./routes/headToHead'));
app.use('/api/seasons', require('./routes/seasons'));
app.use('/api/matches', require('./routes/matches'));
app.use('/api/player-stats', require('./routes/playerStats'));

app.get('/', (req, res) => {
    res.send('Football Analysis Platform API Running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
