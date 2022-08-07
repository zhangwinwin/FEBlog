export function asyncTask (No) {
    console.log(`Starting async task ${No}`)
    return new Promise(resolve => {
      setTimeout(() => {
        console.log(`Async task ${No} completed`)
        resolve(`Async task ${No} result`)
      }, 100)
    })
  }
  