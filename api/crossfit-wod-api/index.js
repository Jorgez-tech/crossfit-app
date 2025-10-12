require('dotenv').config();
const app = require("./app");
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`API is listening on port ${PORT}`);
});


