const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./model/User'); // Make sure the path is correct
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs'); // Setting EJS as view engine
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/user_details')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

// Default route to render registration page
app.get('/', (req, res) => {
    res.render('register');  // Renders register.ejs
});

// Login route to render login page
app.get('/login', (req, res) => {
    res.render('login');  // Renders login.ejs (create this file as needed)
});

app.get('/adminlogin', (req, res) => {
    res.render('adminlogin');  // Renders adminlogin.ejs
});

app.get('/admin-dashboard', (req, res) => {
    res.render('admin-dashboard');  // Renders admin-dashboard.ejs
});



app.get('/add-products', (req, res) => {
    res.render('add-products');  // Renders add-products.ejs
});

app.get('/view-orders', (req, res) => {
    res.render('view-orders');  // Renders view-orders.ejs
});

// Route to render View Customers page
app.get('/view-customers', (req, res) => {
    res.render('view-customers');  // Renders view-customers.ejs
});


// Route to fetch customer data
app.get('/get-customers', async (req, res) => {
    try {
        const customers = await User.find({}, 'username email'); // Fetch only username and email fields
        res.status(200).json(customers);
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Registration route
app.post('/register', async (req, res) => {
    const { username, password, email } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword, email });
        await newUser.save();

        console.log('User registered:', newUser);
        res.status(201).redirect('/login');  // Redirects to login page after successful registration
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
