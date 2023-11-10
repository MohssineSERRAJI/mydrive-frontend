import axios from "axios";
import { v4 } from "uuid";

let browserIDCheck = localStorage.getItem("browser-id");

const sleep = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 150);
  });
};



const axiosRetry = axios.create({ baseURL: "http://127.0.0.1:8000" });
const axiosNoRetry = axios.create({ baseURL: "http://127.0.0.1:8000" });
const axios3 = axios.create({ baseURL: "http://127.0.0.1:8000" });

async function refreshAccessToken() {
  const response = await axiosRetry.post('/user-service/get-token',{refresh: localStorage.getItem('refresh')});
  const access = response.data.access;
  const refresh = response.data.refresh;
  localStorage.setItem('access', access);
  localStorage.setItem('refresh', refresh);

  return;
}
axiosRetry.interceptors.request.use(
  (config) => {
    if (!browserIDCheck) {
      browserIDCheck = v4();
      localStorage.setItem("browser-id", browserIDCheck);
    }

    config.headers.Authorization = localStorage.getItem("access");

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosRetry.interceptors.response.use(
  (response) => {
    //console.log("axios interceptor successful")
    return response;
  },
  async (error) => {

      let originalRequest = error.config;
    if (error.response.status === 501){
      await refreshAccessToken()
      console.log(445445454)
      return axiosRetry(originalRequest)
    }
  }
);

// axios.interceptors.response.use( (response) => {

//     console.log("axios interceptor")
//   // Return a successful response back to the calling service
//     return response;
// }, (error) => {

//     const originalRequest = error.config;

//     if (originalRequest.ran) {
//       console.log("Request already ran");
//       return Promise.reject(error);
//     }

//     console.log("axios interceptor failed first request")
//   // Return any error which is not due to authentication back to the calling service
//   if (error.response.status !== 401) {
//       console.log("error does not equal 401");
//     return new Promise((resolve, reject) => {
//       reject(error);
//     });
//   }

//   // Logout user if token refresh didn't work or user is disabled

//   console.log("error url", error.config.url);

//   if (error.config.url === "/user-service/get-token") {
//       console.log("error url equal to refresh token route")
//     return new Promise((resolve, reject) => {
//       reject(error);
//     });
//   }

//   // Try request again with new token

//   // return new Promise((resolve, reject) => {
//   // })

//   return axios.post("/user-service/get-token").then((cookieResponse) => {

//     console.log("cookie status", cookieResponse.status);

//     if (cookieResponse.status === 201) {
//         console.log("cookie response", cookieResponse.data);

//         originalRequest.ran = true;
//         return axios(originalRequest);

//     } else {
//         return Promise.reject(error);
//     }
//   })
//   // .catch((cookieError) => {
//   //   console.log("cookieError", cookieError);
//   //   return Promise.reject(error);
//   // })

// });

export default axiosRetry;
