const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({

    name: {
        type: String,
        require: [true, 'please provide name'],
        minLength: 3,
        maxLength: 50
    },

    email: {
        type: String,
        require: [true, 'please provide email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
        ],
        unique: true
    },

    password: {
        type: String,
        require: [true, 'please provide password'],
        minLength: 6,
        // maxLength: 50
    },
})

userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next();
});


userSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatched = await bcrypt.compare(candidatePassword, this.password);
    return isMatched;
}


module.exports = mongoose.model('User', userSchema);