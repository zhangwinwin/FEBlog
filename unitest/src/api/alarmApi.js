export const fetchAlarmDetail = () => {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(() => {
        resolve('人机')
      })
      
    } catch (error) {
      reject(error)
    }
  })
}