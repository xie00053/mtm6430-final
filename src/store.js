import Vue from "vue";
import Vuex from "vuex";
import axiosAuth from "./axios-auth";
import router from "./router";
import globalAxios from "axios";


Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    idToken: null,
    userId: null,
    error: "",
    user:null,
  },
  mutations: {
    AUTH_USER(state, userData) {
      state.idToken = userData.token;
      state.userId = userData.userId;
    },
    SET_ERROR(state, errorMessage) {
      state.error = errorMessage;
    },
    EMPTY_ERROR(state) {
      state.error = "";
    },
    CLEAR_DATA(state) {
      state.idToken = null;
      state.userId = null;
    },
    STORE_USER(state,user){
      state.user = user;
    }
  },
  actions: {
    signUp({commit, dispatch}, authData ) {
      axiosAuth
        // Web API key
        // AIzaSyCqu8s9Oz3LVK_zD6cOp2cSJhDp1WAfP24
        // https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]
        .post("accounts:signUp?key=AIzaSyCqu8s9Oz3LVK_zD6cOp2cSJhDp1WAfP24", 
        {
          email: authData.email,
          password: authData.password,
          returnSecureToken: true
        })
        .then(res => {
          console.log(res);
        // Save the auth info in the state
          commit("AUTH_USER", {
            token: res.data.idToken,
            userId: res.data.localId
          });

        // Local Storage
          const now = new Date();
          const expirationDate = new Date(now.getTime() + res.data.expiresIn * 1000)

          localStorage.setItem("token",res.data.idToken)
          localStorage.setItem("userId",res.data.localId)
          localStorage.setItem("userId","expirationDate", expirationDate);


        // dispatch the storeUser from action
          dispatch("storeUser", authData);

          router.push({ name: "dashboard" });

        })
        .catch(error => {
          console.log(error.response.data.error.message);
          commit("SET_ERROR", error.response.data.error.message);
        });
      },

      signIn({ commit }, authData) {
        axiosAuth
          .post(
            "accounts:signInWithPassword?key=AIzaSyCqu8s9Oz3LVK_zD6cOp2cSJhDp1WAfP24",
            {
              email: authData.email,
              password: authData.password,
              returnSecureToken: true
            }
          )
          .then(res => {
            console.log(res);
            commit("AUTH_USER", {
              token: res.data.idToken,
              userId: res.data.localId
            });

            // Local Storage
          const now = new Date();
          const expirationDate = new Date(now.getTime() + res.data.expiresIn * 1000)

          localStorage.setItem("token",res.data.idToken)
          localStorage.setItem("userId",res.data.localId)
          localStorage.setItem("userId","expirationDate", expirationDate);
// store the user email in the localstorage, which is the common item between authendiacation and database
          localStorage.setItem("userEmail",authData.email);

          router.push({ name: "dashboard" });


          })
          .catch(error => {
            console.log(error.response.data.error.message);
            commit("SET_ERROR", error.response.data.error.message);
          });
      },// closing sign in

      clearError({commit}) {
        commit ('EMPTY_ERROR');
      },

      logout ({commit}) {
        localStorage.removeItem('token');
        localStorage.removeItem('expirationDate');
        localStorage.removeItem('userId');

        // commit mutation to clear the state
        commit("CLEAR_DATA");
        // send user to sign in routh
        router.push({ name:"signin"});
      },
// 检测如果超时，自动退出，如果没有，继续get data，保持login
      autoLogin({commit}) {
        const token =localStorage.getItem('token');
        const expirationDate =localStorage.getItem('expirationDate');
        const userId =localStorage.getItem('userId');

        const now = new Date() 
          if(now >= expirationDate) {
            return;
          }
          commit("AUTH_USER", {
            token:token,
            userId:userId
          });
        
      },

      // when the user login, the data will store in the database, also the email and password store in the authentication
      storeUser({state},userData) {
        if(!state.idToken){
          return;
        }
        globalAxios.post("https://lixie-mtm6430-final.firebaseio.com/users.json" 
            + "?auth=" 
            + state.idToken, 
          userData)
        .then(res => console.log(res))
        .catch(error => console.log(error.message));        
      },

      fetchUser({commit,state}, userEmail) {
        if(!state.idToken) {
          return;
        }
        globalAxios.get("https://lixie-mtm6430-final.firebaseio.com/users.json" 
        + "?auth=" 
        + state.idToken)
        .then(res => {
          const data = res.data;
          for (let key in data) {
            const user = data[key];
            if(user.email == userEmail) {
              console.log(user);
              user.id = key;
              commit("STORE_USER", user);
            }
          }
        });

      },
    
      updateUser({state}) {
        globalAxios
        .patch("https://lixie-mtm6430-final.firebaseio.com/users/" + 
        state.user.id + 
        ".json" + 
        "?auth=" + 
        state.idToken,
        {name: state.user.name},
        {city: state.user.city},
        {age: state.user.age},
        {job: state.user.job},
        )
        .then(res => console.log(res))
        .catch(error => console.log(error.message))
      },

  },

  getters: {
    isauthenticated(state) {
      return state.idToken !== null;
    },
    getUser(state) {
      return state.user;
    }
  }
});

