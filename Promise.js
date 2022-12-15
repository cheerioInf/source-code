const STATE = {
  PENDING: "pending",
  FULFILED: "filfiled",
  REJECTED: "rejected",
};

const OPERATION = {
  RESOLVE: "resolve",
  REJECT: "reject",
};

function Promise(excutor) {
  this.state = STATE.PENDING;
  this.data = undefined;
  this.callbacks = [];

  const invokeCallback = (callbacks, data, type) => {
    setTimeout(() => {
      callbacks.forEach((callback) => {
        switch (type) {
          case OPERATION.RESOLVE:
            console.log(callback);
            callback.resolve(data);
            break;
          case OPERATION.REJECT:
            callback.reject(data);
            break;
        }
      });
    });
  };

  const resolve = (value) => {
    if (this.state !== STATE.PENDING) return;
    this.state = STATE.FULFILED;
    this.data = value;
    invokeCallback(this.callbacks, this.data, OPERATION.RESOLVE);
  };

  const reject = (value) => {
    if (this.state !== STATE.PENDING) return;
    this.state = STATE.REJECTED;
    this.data = value;
    invokeCallback(this.callbacks, this.data, OPERATION.REJECT);
  };

  excutor(resolve, reject);
}

Promise.prototype.then = function (onResolve, onReject) {
  onReject =
    onReject instanceof Function
      ? onReject
      : (reason) => {
          throw reason;
        };

  return new Promise((resolve, reject) => {
    const commonHandler = (method, data) => {
      try {
        const result = method(data);
        if (result instanceof Promise) {
          result.then(resolve, reject);
        } else {
          resolve(result);
        }
      } catch (err) {
        reject(err);
      }
    };

    if (this.state === STATE.PENDING) {
      this.callbacks.push({
        resolve: () => commonHandler(onResolve, this.data),
        reject: () => commonHandler(onReject, this.data),
      });
    } else if (this.state === STATE.FULFILED) {
      setTimeout(() => {
        commonHandler(onResolve, this.data);
      });
    } else {
      setTimeout(() => {
        commonHandler(onReject, this.data);
      });
    }
  });
};

Promise.prototype.catch = function (onReject) {
  return this.then(undefined, onReject);
};

Promise.resolve = function (value) {
  return new Promise((resolve, reject) => {
    if (value instanceof Promise) {
      value.then(resolve, reject);
    } else {
      resolve(value);
    }
  });
};

Promise.reject = function (value) {
  return new Promise((resolve, reject) => {
    if (value instanceof Promise) {
      value.then(resolve, reject);
    } else {
      reject(value);
    }
  });
};

Promise.all = function (promises) {
  if (!promises || promises.length <= 0) return;
  const promisesArr = new Array(promises.length);
  console.log(promisesArr);
  return new Promise((resolve, reject) => {
    promises.forEach((promise, index) => {
      Promise.resolve(promise).then(
        (res) => {
          promisesArr[index] = res;
          console.log(promisesArr, index);
          if (index + 1 === promises.length) {
            console.log("@");
            resolve(promisesArr);
          }
        },
        (reason) => {
          reject(reason);
        }
      );
    });
  });
};

Promise.race = function (promises) {
  if (!promises || promises.length <= 0) return;
  return new Promise((resolve, reject) => {
    promises.forEach((promise) => {
      Promise.resolve(promise).then(
        (res) => {
          resolve(res);
        },
        (reason) => {
          reject(reason);
        }
      );
    });
  });
};
