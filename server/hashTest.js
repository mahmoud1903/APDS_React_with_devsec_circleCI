const bcrypt = require('bcryptjs');
const User = require('./models/User');

(async () => {
    const plaintextPassword = 'Password1!';
    const hash = await User.hashPassword(plaintextPassword); // Hash the plaintext password
    console.log('Generated Hash:', hash);

    // Now compare the hashed password to the original plaintext
    const isMatch = await bcrypt.compare(plaintextPassword, hash);
    console.log('Password match after hashing:', isMatch); // Expect `true`
})();
