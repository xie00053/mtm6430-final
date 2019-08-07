import axios from "axios";

const instance = axios.create({
// https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]
// the basic url
  baseURL: "https://identitytoolkit.googleapis.com/v1/"
});

// instance.defaults.headers.common['SOMETHING'] = 'something'

export default instance;