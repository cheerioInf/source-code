// 声明 Promise 的三种状态常量
const STATE = {
  PEDING: "pending",
  REJECTED: "rejected",
  FULFILLED: "fulfilled",
};

class Promise {
  // Promise 构造函数主体
  constructor(executor) {
    // 锁定 this
    const self = this;
    // 定义初始状态、值、回调函数
    self.promiseState = STATE.PEDING;
    self.promiseResult = undefined;
    self.callbacks = [];

    function invokeCallback(data, type) {
      // 如果状态为 pending 则直接返回
      if (self.promiseState !== STATE.PEDING) return;
      // 设置 Promise 状态
      self.promiseState =
        type === STATE.FULFILLED ? STATE.FULFILLED : STATE.REJECTED;
      // 设置 Promise 值
      self.promiseResult = data;
      // 执行回调函数数组中的回调函数
      self.callbacks.forEach((callback) => {
        if (type === STATE.FULFILLED) {
          callback.onResolve(self.promiseResult);
        } else if (type === STATE.REJECTED) {
          callback.onReject(self.promiseResult);
        }
      });
    }

    // resolve 函数
    function resolve(data) {
      invokeCallback(data, STATE.FULFILLED);
    }

    // reject 函数
    function reject(data) {
      invokeCallback(data, STATE.REJECTED);
    }

    // 执行执行器函数，如果执行器函数内 throw，则将 throw 内容传入 reject
    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  then(onResolve, onReject) {
    // 指定 this
    const self = this;

    // 如果参数为空，则自动创建
    if (!onReject) {
      onReject = (reason) => {
        throw reason;
      };
    }

    if (!onResolve) {
      onResolve = (value) => value;
    }

    // then 方法返回 Promise 对象，以便链式调用
    return new Promise((resolve, reject) => {
      // Promise 返回值
      function thenReturn(type) {
        // 如果 then 中抛出错误，直接 reject
        try {
          // 接受传入函数返回值，判断其结果类型
          const result =
            type === STATE.FULFILLED
              ? onResolve(self.promiseResult)
              : onReject(self.promiseResult);
          // 如果为 Promise，则获得 Promise 的返回值
          if (result instanceof Promise) {
            result.then(
              (value) => {
                resolve(value);
              },
              (reason) => {
                reject(reason);
              }
            );
          } else {
            // 如果为普通类型，则返回普通类型
            type === STATE.FULFILLED ? resolve(result) : reject(result);
          }
        } catch (err) {
          reject(err);
        }
      }

      // 判断类型
      // 如果 Promise 内部，同步代码直接调用
      if (self.promiseState === STATE.FULFILLED) {
        queueMicrotask(() => {
          thenReturn(STATE.FULFILLED);
        });
      } else if (self.promiseState === STATE.REJECTED) {
        queueMicrotask(() => {
          thenReturn(STATE.REJECTED);
        });
      } else {
        // 如果为 pending 类型（异步代码调用，在执行 then 时，状态还未改变）
        // 添加进回调函数数组，等状态改变了再调用
        self.callbacks.push({
          onResolve: () => {
            thenReturn(STATE.FULFILLED);
          },
          onReject: () => {
            thenReturn(STATE.REJECTED);
          },
        });
      }
    });
  }

  catch(onReject) {
    return this.then(undefined, onReject);
  }

  static resolve(result) {
    return new Promise((resolve, reject) => {
      if (result instanceof Promise) {
        result.then(
          (value) => {
            resolve(value);
          },
          (reason) => {
            reject(reason);
          }
        );
      } else {
        resolve(result);
      }
    });
  }

  static reject(result) {
    return new Promise((resolve, reject) => {
      reject(result);
    });
  }

  static all(promsies) {
    return new Promise((resolve, reject) => {
      const returnValues = [];
      promsies.forEach((item, index) => {
        Promise.resolve(item).then(
          (value) => {
            returnValues[index] = value;
            if (index + 1 === promsies.length) {
              resolve(returnValues);
            }
          },
          (reason) => {
            reject(reason);
          }
        );
      });
    });
  }

  static race(promises) {
    return new Promise((resolve, reject) => {
      promises.forEach((item) => {
        Promise.resolve(item).then(
          (value) => {
            resolve(value);
          },
          (reason) => {
            reject(reason);
          }
        );
      });
    });
  }
}

// // 声明 Promise 的三种状态常量
// const STATE = {
//   PEDING: "pending",
//   REJECTED: "rejected",
//   FULFILLED: "fulfilled",
// };

// // Promise 构造函数主体
// function Promise(executor) {
//   // 锁定 this
//   const self = this;
//   // 定义初始状态、值、回调函数
//   self.promiseState = STATE.PEDING;
//   self.promiseResult = undefined;
//   self.callbacks = [];

//   function invokeCallback(data, type) {
//     // 如果状态为 pending 则直接返回
//     if (self.promiseState !== STATE.PEDING) return;
//     // 设置 Promise 状态
//     self.promiseState =
//       type === STATE.FULFILLED ? STATE.FULFILLED : STATE.REJECTED;
//     // 设置 Promise 值
//     self.promiseResult = data;
//     // 执行回调函数数组中的回调函数
//     self.callbacks.forEach((callback) => {
//       if (type === STATE.FULFILLED) {
//         callback.onResolve(self.promiseResult);
//       } else if (type === STATE.REJECTED) {
//         callback.onReject(self.promiseResult);
//       }
//     });
//   }

//   // resolve 函数
//   function resolve(data) {
//     invokeCallback(data, STATE.FULFILLED);
//   }

//   // reject 函数
//   function reject(data) {
//     invokeCallback(data, STATE.REJECTED);
//   }

//   // 执行执行器函数，如果执行器函数内 throw，则将 throw 内容传入 reject
//   try {
//     executor(resolve, reject);
//   } catch (err) {
//     reject(err);
//   }
// }

// // then 方法
// Promise.prototype.then = function (onResolve, onReject) {
//   // 指定 this
//   const self = this;

//   // 如果参数为空，则自动创建
//   if (!onReject) {
//     onReject = (reason) => {
//       throw reason;
//     };
//   }

//   if (!onResolve) {
//     onResolve = (value) => value;
//   }

//   // then 方法返回 Promise 对象，以便链式调用
//   return new Promise((resolve, reject) => {
//     // Promise 返回值
//     function thenReturn(type) {
//       // 如果 then 中抛出错误，直接 reject
//       try {
//         // 接受传入函数返回值，判断其结果类型
//         const result =
//           type === STATE.FULFILLED
//             ? onResolve(self.promiseResult)
//             : onReject(self.promiseResult);
//         // 如果为 Promise，则获得 Promise 的返回值
//         if (result instanceof Promise) {
//           result.then(
//             (value) => {
//               resolve(value);
//             },
//             (reason) => {
//               reject(reason);
//             }
//           );
//         } else {
//           // 如果为普通类型，则返回普通类型
//           type === STATE.FULFILLED ? resolve(result) : reject(result);
//         }
//       } catch (err) {
//         reject(err);
//       }
//     }

//     // 判断类型
//     // 如果 Promise 内部，同步代码直接调用
//     if (self.promiseState === STATE.FULFILLED) {
//       setTimeout(() => {
//         thenReturn(STATE.FULFILLED);
//       });
//     } else if (self.promiseState === STATE.REJECTED) {
//       setTimeout(() => {
//         thenReturn(STATE.REJECTED);
//       });
//     } else {
//       // 如果为 pending 类型（异步代码调用，在执行 then 时，状态还未改变）
//       // 添加进回调函数数组，等状态改变了再调用
//       self.callbacks.push({
//         onResolve: () => {
//           thenReturn(STATE.FULFILLED);
//         },
//         onReject: () => {
//           thenReturn(STATE.REJECTED);
//         },
//       });
//     }
//   });
// };

// // catch 方法
// // 接受 onReject，如果前面 then 没有第二个回调，会调用 catch
// Promise.prototype.catch = function (onReject) {
//   return this.then(undefined, onReject);
// };

// Promise.resolve = function (result) {
//   return new Promise((resolve, reject) => {
//     if (result instanceof Promise) {
//       result.then(
//         (value) => {
//           resolve(value);
//         },
//         (reason) => {
//           reject(reason);
//         }
//       );
//     } else {
//       resolve(result);
//     }
//   });
// };

// Promise.reject = function (result) {
//   return new Promise((resolve, reject) => {
//     reject(result);
//   });
// };

// Promise.all = function (promsies) {
//   return new Promise((resolve, reject) => {
//     const returnValues = [];
//     promsies.forEach((item, index) => {
//       Promise.resolve(item).then(
//         (value) => {
//           returnValues[index] = value;
//           if (index + 1 === promsies.length) {
//             resolve(returnValues);
//           }
//         },
//         (reason) => {
//           reject(reason);
//         }
//       );
//     });
//   });
// };

// Promise.race = function (promises) {
//   return new Promise((resolve, reject) => {
//     promises.forEach((item) => {
//       Promise.resolve(item).then(
//         (value) => {
//           resolve(value);
//         },
//         (reason) => {
//           reject(reason);
//         }
//       );
//     });
//   });
// };
