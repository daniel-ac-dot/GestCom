const bcrypt = require("bcrypt");

const password = "123456";

bcrypt.hash(password, 10, (error, hash) => {

    if (error) {
        console.log(error);
        return;
    }

    console.log("Hash generado:");
    console.log(hash);

});