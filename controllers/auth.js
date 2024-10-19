const UserModel = require('../models/user')
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs/dist/bcrypt');

const register = async (req, res) => {

    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'please provide name email and password' })
        }

        // hashing 

        const user = await UserModel.create({ ...req.body });
        const token = jwt.sign({ userId: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: '30d' })
        return res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });

    } catch (error) {
       console.log(error);
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'please Provide Email and Password' });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ msg: 'Invalid Credentials' })
    }

    // compare password 

    const isPasswordCorrect = await user.comparePassword(password);

    // check the password
    if (!isPasswordCorrect) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ msg: 'Invalid Credentials' })
    }

    const token = jwt.sign({ userId: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: '30d' })
    return res.status(StatusCodes.OK).json({ user: { name: user.name }, token });

}


module.exports = { register, login };
