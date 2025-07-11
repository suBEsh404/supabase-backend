require('dotenv').config();

const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL and Key must be set in .env file');
}

const supabase = createClient(supabaseUrl, supabaseKey);

app.use(express.json());

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) return res.status(400).json({ error: error.message });

        res.status(201).json({
            message: 'User registered successfully!',
            user: data.user
        });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return res.status(401).json({ error: error.message });

        res.json({
            message: "Login successful!",
            token: data.session.access_token,
            user: data.user
        });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const { data, error } = await supabase.auth.getUser(token);
        if (error) return res.status(401).json({ error: 'Invalid Token' });

        req.user = data.user;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid Token' });
    }
};
app.get('/', (req, res) => {
    res.send('API is running!');
});


app.listen(PORT, () => {
    console.log(`NoobToWeb is on port ${PORT}`);
});
