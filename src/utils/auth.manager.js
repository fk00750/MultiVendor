const User = require("../models/user.model")
const crypto = require('crypto')

class AuthManager {
    async findByEmail(email) {
        try {
            if (!email) throw new Error("Undefined Email")

            // find the user 
            const user = await User.findOne({ email: email })

            if (!user) return false

            return user
        } catch (error) {
            console.log(`utils > auth.manager.js > AuthManager > findUserByPhoneNumber: ${error.message}`)
            throw error
        }
    }

    async createUser(name, email, password, city, pincode) {
        try {
            if (!name || !email || !password) throw new Error("Undefined User Fields")

            // create unique id
            const userId = await this.createUniqueId('user')

            if (!userId) throw new Error("Unable to create user id");

            // hash password
            const hashedPassword = await this.hashedPassword(password);

            if (!hashedPassword) throw new Error("Unable to hash password");

            // create user
            const user = await User.create({
                userId: userId,
                name: name,
                email: email,
                password: hashedPassword,
                city: city,
                pincode: pincode
            })

            if (!user) throw error

            return user
        } catch (error) {
            console.log(`utils > auth.manager.js > AuthManager > createUser: ${error.message}`)
            throw error
        }
    }

    /**
      * @async
      * @method hashedPassword
      * @description salt and hash the password
      * @param {string} password
      * @throws {Error} trows error in case of any failure
      * @returns {string} salted and hashed password
    */
    async hashedPassword(password) {
        return new Promise((resolve, reject) => {
            // create a salt
            const salt = crypto.randomBytes(16).toString('hex');

            // create a hash
            crypto.pbkdf2(password, salt, 10000, 64, 'sha256', (err, derivedKey) => {
                if (err) {
                    console.log(`src > utils > auth.manager.js > hashedPassword : ${err.message}`);
                    return reject(err);
                }

                // combine salt with hash
                const hashedPassword = derivedKey.toString('hex');
                const storedPassword = `${salt}:${hashedPassword}`;

                resolve(storedPassword);
            });
        });
    }


    /**
     * @async
     * @method verifyPassword
     * @description Verify salted and hashed the password
     * @param {string} enteredPassword - entered password
     * @param {string} storedPassword - stored password
     * @throws {Error} trows error in case of any failure
     * @returns {boolean} True if password is correct
    */
    async verifyPassword(enteredPassword, storedPassword) {
        try {
            const [salt, storedHash] = storedPassword.split(":")

            const enteredHash = crypto.pbkdf2Sync(enteredPassword, salt, 10000, 64, 'sha256').toString('hex')

            return enteredHash === storedHash
        } catch (error) {
            console.log(`src > utils > auth.manager.js > verifyPassword : ${error.message}`)
            throw error
        }
    }


    /**
     * @async
     * @method createUniqueId
     * @description Create unique id for different purpose
     * @param {string} type - unique id type
     * @throws {Error} trows error in case of any failure
     * @returns {string} unique id
    */
    async createUniqueId(type = 'user') {
        try {
            // create unqiue id string
            const unique_string = Date.now().toString(16)
            let id

            // check the id format
            switch (type) {
                case 'user':
                    id = `${unique_string}/u`
                    break;
                case 'admin':
                    id = `${unique_string}/a`
                    break;
                case 'spam':
                    id = `${unique_string}/s`
                    break;
                default:
                    id = `${unique_string}/u`
                    break;
            }

            if (id) return id
        } catch (error) {
            console.log(`src > utils > auth.manager.js > createUniqueId : ${error.message}`)
            throw error
        }
    }

    /**
 * @async
 * @method validateUserId
 * @description validates unique or user id format
 * @param {string} id - unique id 
 * @throws {Error} trows error in case of any failure
 * @returns {boolean} True if id format is correct
 */
    async validateUserId(id) {
        try {
            const userTypes = ['u', 'a', 's']

            const splitId = id.split('/')

            if (splitId.length !== 2) throw new Error("Invalid user id format")

            const [dateString, specialSymbol] = splitId

            if (!userTypes.includes(specialSymbol)) throw new Error("Invalid user id format")

            const dateStringRegex = /^[0-9a-f]{11}$/i;

            if (!dateStringRegex.test(dateString)) throw new Error("Invalid user id format")

            return true
        } catch (error) {
            console.log(`src > utils > auth.manager.js > validateUserId : ${error.message}`)
            throw error
        }
    }
}

module.exports = AuthManager