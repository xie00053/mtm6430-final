import Vue from "vue";
import Vuex from "vuex";
import axiosAuth from "./axios-auth";
import router from "./router";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    idToken: null,
    userId: null,
    error: "",
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
    }
  },
  actions: {
    signUp({commit}, authData ) {
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
            "accounts:signInWithPassword?key=AIzaSyBlK0mKp9wuIXmtMfw9wAt22excikJZga8",
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
          }

      },

      getters: {
        isauthenticated(state) {
          return state.idToken !== null;
      }
  }
});

