// function getName() {
//   return new Promise((resolve, reject) => {
//     resolve("cheerioInf");
//   });
// }

// function getAge() {
//   return new Promise((resolve, reject) => {
//     resolve(18);
//   });
// }

// function* fun() {
//   const name = yield getName();
//   console.log(name);
//   const age = yield getAge();
//   console.log(age);
// }

// function _async(fun) {
//   const gen = fun();
//   function next(data) {
//     const result = gen.next(data);
//     if (result.done) return true;
//     result.value.then((data) => {
//       next(data);
//     });
//   }
//   next();
// }

// _async(fun);

const getName = () => {
  return new Promise((resolve, reject) => {
    resolve("cheerioInf");
  });
};

const getAge = () => {
  return new Promise((resolve, reject) => {
    resolve(18);
  });
};

function* _async() {
  const name = yield getName();
  console.log(name);
  const age = yield getAge();
  console.log(age);
}

function autoRun(generater) {
  const gen = generater();
  function next(data) {
    const result = gen.next(data);
    console.log(result);
    if (result.done) return true;
    result.value.then((data) => {
      next(data);
    });
  }
  next();
}

autoRun(_async);
