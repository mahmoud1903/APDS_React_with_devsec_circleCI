const bcrypt = require('bcryptjs');

const storedHash = "$2a$10$w3R8E8jarcIJbHod3u6bg.4W8xfM5b1/ZjFwmFnEg2PvDZQ7uviR2"; // Exact hash from seed output
const enteredPassword = "Password1!";

bcrypt.compare(enteredPassword, storedHash, (err, result) => {
    if (err) {
        console.error("Comparison error:", err);
    } else {
        console.log("Password match:", result); // Should print true if they match
    }
});
