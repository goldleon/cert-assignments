// Container for all environments

const environment = {};

// Staging (default) Object
environment.staging = {
    httpPort: 3000,
    envName: 'staging'
};

// Production Object
environment.production = {
    httpPort: 5011,
    envName: 'production'
};

// Determine which environment was passed as a cmd line arg
const currentEnv = typeof (process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

const envToExport = typeof (environment[currentEnv]) == 'object' ? environment[currentEnv] : environment.staging;


// export the module

module.exports = envToExport;