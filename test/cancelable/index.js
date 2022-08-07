import { generatorToAsync } from './generatorToAsync.js'
import { asyncTask } from './asyncTask.js';
const executor = generatorToAsync(
     function* handleTasks() {
        const res1 = yield asyncTask('1');
        console.log(res1);
        const res2 = yield asyncTask('2');
        console.log(res2);
    }
)
const { promise, cancel } = executor();
promise.catch(() => {
    console.log('Cancelled')
})
setTimeout(cancel, 100)