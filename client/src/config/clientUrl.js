// source images are not loadin with official website...
exports.CLIENT_URL = process.env.NODE_ENV === 'production'
    ? 'https://www.fiddelize.com.br'
    : 'http://localhost:3000'