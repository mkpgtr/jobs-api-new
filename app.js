require('dotenv').config()
const express = require('express');
require('express-async-errors')

// security packages
const hetmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');



const app = express()
// connectDB
const connectDB = require('./DB/connection')
const authenticateUser = require('./middleware/authentication')

// routes
const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')

// error Handler
const errorHandlerMiddleware = require('./middleware/error-handler');
const notFoundMiddleware = require('./middleware/not-found');


//  middleware
app.set('trust proxy', 1)
app.use(rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
}));
app.use(express.json());
app.use(hetmet())
app.use(cors());
app.use(xss());

// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter);

app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log(`server is Listening at port no ${port}`);
        })
    } catch (error) {
        console.log(error);
    }
}


start();