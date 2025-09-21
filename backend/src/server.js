require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const authRouter = require('./routes/auth');
const customersRouter = require('./routes/customers');
const { errorHandler } = require('./middleware/errorHandler');
const { initDb } = require('./db');
const winston = require('winston');
const cors = require('cors');



const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [new winston.transports.Console()],
});

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors()); // allows all origins
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(cors({
  origin: '*', // allow all origins
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.get('/', (req, res) => res.json({ message: 'CockroachDB Customer Backend with Auth is running' }));

app.use('/api/auth', authRouter);
app.use('/api/customers', customersRouter);

app.use(errorHandler);

initDb()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error('Failed to initialize DB', err);
    process.exit(1);
  });