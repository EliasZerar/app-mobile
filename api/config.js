const ENVIRONMENT = getEnvironment();
const MONGODB_ENDPOINT = process.env.MONGODB_ENDPOINT;

module.exports = {
    MONGODB_ENDPOINT,
    ENVIRONMENT
};

function getEnvironment() {
    return process.env.ENVIRONMENT || "development";
}
