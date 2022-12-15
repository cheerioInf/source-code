// function Person() {}

// function Man() {}

// Man.prototype = new Person();

// const cheerioInf = new Man();

// console.log(cheerioInf instanceof Person);

// function _instanceof(obj, cons) {
//   let objProto = obj.__proto__;
//   const consProto = cons.prototype;
//   while (true) {
//     if (!objProto) return false;
//     if (objProto === consProto) return true;
//     objProto = objProto.__proto__;
//   }
// }

// console.log(_instanceof(cheerioInf, Person));
function Person() {}

function Man() {}
Man.prototype = new Person();

const cheerioInf = new Man();

console.log(cheerioInf instanceof Person);
function _instanceof(obj, con) {
  let objProto = obj.__proto__;
  const conProto = con.prototype;
  while (true) {
    if (objProto === conProto) return true;
    if (!objProto) return false;
    objProto = objProto.__proto__;
  }
}

console.log(_instanceof(cheerioInf, String));
