const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const { MongoClient } = require('mongodb');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Replace with actual credentials
const GOOGLE_CLIENT_ID = '263377282526-qioeb9vm8l6eac3ch59bg9qib2rm8t57.apps.googleusercontent.com';
const MONGO_URI = "mongodb+srv://madhukiraninaparthi2001:817NMoBslbSu6Cf9@cluster0.c9fpk.mongodb.net/";
const JWT_SECRET = "your_jwt_secret"; // Change this to a secure key

const client = new OAuth2Client(GOOGLE_CLIENT_ID);
const mongoClient = new MongoClient(MONGO_URI);
let db;

async function connectToMongoDB() {
    try {
        await mongoClient.connect();
        console.log('✅ Connected to MongoDB!');
        db = mongoClient.db('urbanWanderDB');
    } catch (err) {
        console.error('❌ MongoDB connection error:', err);
    }
}

connectToMongoDB();

// **Google Sign-In API**
app.post('/google/signin', async (req, res) => {
    const token = req.body.credential;
    
    if (!token) {
        return res.status(400).json({ error: "Missing credential token" });
    }

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const googleId = payload['sub'];
        const email = payload['email'];
        const name = payload['name'];
        const pictureUrl = payload['picture'];

        let user = await db.collection("users").findOne({ googleId });

        if (!user) {
            user = { googleId, email, name, pictureUrl, createdAt: new Date() };
            await db.collection("users").insertOne(user);
            console.log("🆕 New user created:", user);
        } else {
            console.log("✅ Existing user logged in:", user);
        }

        const authToken = jwt.sign(
            { userId: user.googleId, email: user.email },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            message: "Google sign-in successful",
            token: authToken,
            user,
        });
    } catch (error) {
        console.error("❌ Google Sign-in verification failed:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

// **Protected Profile Route**
app.get('/profile', async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Unauthorized, no token provided" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await db.collection("users").findOne({ googleId: decoded.userId });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error("❌ Invalid token:", error);
        res.status(403).json({ error: "Invalid token" });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
