/*
 * @Author: 黄叶
 * @Date: 2023-04-19 00:43:01
 * @LastEditTime: 2023-04-22 01:28:27
 * @FilePath: /schoolWall/src/utils/axios.js
 * @Description:
 */
import axios from "axios";
import router from "../router/router";

const instance = axios.create({
  // baseURL: "http://127.0.0.1:8080",
  baseURL: "http://192.168.31.141:8080/api",
  timeout: 30000, //最大请求时间
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * 请求拦截器
 */
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token != null) {
      config.headers.Authorization = token;
    }

    // 如果有需要在这里开启请求时的loading动画效果
    // config.headers.Authorization = getToken  //添加token,需要结合自己的实际情况添加，
    return config;
  },
  (err) => Promise.reject(err)
);

instance.interceptors.response.use(
  (res) => {
    if (res.data.code == 401) {
      ElMessageBox.confirm("查看内容需要登录", "暂无权限", {
        type: "warning",
        confirmButtonText: "前往登录",
        cancelButtonText: "我再看看",
      })
        .then(() => {
          router.push("/login");
          return;
        })
        .catch(() => {});
      return;
    }
    // 在这里关闭请求时的loading动画效果
    // 这里用于处理返回的结果，比如如果是返回401无权限，可能会是跳回到登录页的操作，结合自己的业务逻辑写
    // 一定结合自己的后端的返回代码进行操作
    // if (res.data.statusCode === 401) {
    //   console.log('无权限操作')
    // }
    return res.data;
  },
  (err) => {
    if (err) {
      // 在这里关闭请求时的loading动画效果
      console.log("请求网络失败");
    }
    return Promise.reject(err);
  }
);

// 封装post,get方法
// 按理来说应该也可以封装其他的方法
// export function request (url, method = "GET", params = {}) {
//   return new Promise((resolve, reject) => {
//     instance({
//       url: url,
//       method: method,
//       headers: { "Content-Type": "application/jsoncharset=UTF-8" },
//       data: params,
//     })
//       .then((res) => {
//         resolve(res.data);
//         return res;
//       })
//       .catch((error) => {
//         reject(error);
//       });
//   });
// };

// // 暴露所写的内容
export default instance;