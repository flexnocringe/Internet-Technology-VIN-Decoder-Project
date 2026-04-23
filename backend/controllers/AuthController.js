const user = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const {email, password} = req.body;
    const alreadyExists = await user.findOne({ email });
    if(alreadyExists) {
        return res.status(400).json({ message: 'Email already in use' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new user({ email, password: hashedPassword });
    await newUser.save();
    res.json({ message: 'Registration successful' });
};

exports.login = async (req, res) => {
    const {email, password} = req.body;
    const existingUser = await user.findOne({ email });
    if(!existingUser) {
        return res.status(400).json({ message: 'Invalid email' });
    }
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if(!isMatch) {
        return res.status(400).json({ message: 'Invalid password' });
    }
    const token = jwt.sign({ id: existingUser.id }, process.env.JWT_SECRET, { expiresIn: '7h' });
    res.json({ token });
};