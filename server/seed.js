const mongoose = require('mongoose');
const User = require('./models/User');

const users = [
    { username: 'Employee1', password: 'Password1!', role: 'employee' },
    { username: 'Employee2', password: 'Password2!', role: 'employee' },
];

const connectDB = async () => {
    await mongoose.connect('mongodb://localhost:27017/apds2');
    console.log('MongoDB Connected');
};

const seedUsers = async () => {
    await User.deleteMany(); // Clear existing users
    for (const user of users) {
        const hashedPassword = await User.hashPassword(user.password);
        console.log(`Seeding user: ${user.username}, Hashed Password: ${hashedPassword}`);
        
        const newUser = new User({
            username: user.username,
            password: hashedPassword,
            role: user.role,
        });
        await newUser.save();
    }
    console.log('Users seeded!');
    mongoose.connection.close();
};

connectDB().then(seedUsers);
