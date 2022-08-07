// next方法是异步
export function generatorToAsync(genFn) {
    return (...args) => {
        let executeCancel = false;
        function cancel () {
            executeCancel = true;
        }
        const gen = genFn(...args);
        const promise = new Promise((resolve, reject) => {
            function step(args) {
                if (executeCancel)
                    return reject(new Error('cancel'));
                const { value, done } = args;
                if (done) {
                    return resolve(value);
                }
                return Promise.resolve(value).then(val => step(gen.next(val)), err => step(gen.throw(err)))
            }
            step({});
        })
        return { promise, cancel };
    }
}

// next方法是同步
// export function generatorToAsync(genFn) {
//     return (...args) => {
//         let executeCancel = false;
//         function cancel () {
//             executeCancel = true;
//         }
//         const gen = genFn(...args);
//         const promise = new Promise((resolve, reject) => {
//             function step(args) {
//                 if (executeCancel)
//                     return reject(new Error('cancel'));
//                 let res;
//                 try {
//                     res = gen.next(args);
//                 } catch (err) {
//                     reject(err);
//                 }
//                 const { value, done } = res;
//                 if (done) {
//                     return resolve(value);
//                 }
//                 return Promise.resolve(value).then(val => gen.next(val), err => gen.throw(err))
//             }
//             step({});
//         })
//         return { promise, cancel };
//     }
// }