// source images are not loadin with official website...
exports.CLIENT_URL = process.env.NODE_ENV === 'production'
    ? 'https://fiddelize.netlify.app'
    : 'http://localhost:3000'