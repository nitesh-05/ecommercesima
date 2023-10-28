// axios-config.js
import axios from 'axios';

const instance = axios.create({
baseURL: 'https://online-shoping-girv.onrender.com', // Set your base URL here
// Other options like headers, timeouts, etc.
});

export default instance;
