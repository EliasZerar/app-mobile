const ENVIRONMENT = getEnvironment();
const MONGODB_ENDPOINT = process.env.MONGODB_ENDPOINT;
const SECRET = process.env.JWT_SECRET;
module.exports = {
    MONGODB_ENDPOINT,
    ENVIRONMENT,
    SECRET,
};

function getEnvironment() {
    return process.env.ENVIRONMENT || "development";
}
