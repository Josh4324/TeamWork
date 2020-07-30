const compare = (a, b) => {
    const time1 = a.createdon.getTime();
    const time2 = b.createdon.getTime();

    let comparison = 0;
    if (time1 > time2) {
        comparison = 1;
    } else if (time1 < time2) {
        comparison = -1;
    }
    return comparison * -1;
}

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
};

const cloudinaryConfig = {
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
}


module.exports.compare = compare;
module.exports.config = config;
module.exports.cloudinaryConfig = cloudinaryConfig;