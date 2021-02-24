
const fetchData = () => {
    let userData =  fetch("http://localhost:3001/api/v1/users")
        .then(response => response.json())
        .then(userData => {
            console.log(userData)
            return userData
        })
        .catch(err => console.log(err.message))
    
    let hydrationData = fetch("http://localhost:3001/api/v1/hydration")
        .then(response => response.json())
        .then(hydrationData => {
            return hydrationData
        })
        .catch(err => console.log(err.message))

    let activityData = fetch("http://localhost:3001/api/v1/activity")
        .then(response => response.json())
        .then(activityData => {
            return activityData
        })
        .catch(err => console.log(err.message))
    
    let sleepData = fetch("http://localhost:3001/api/v1/sleep")
        .then(response => response.json())
        .then(sleepData => {
            sleepData
        })
        .catch(err => console.log(err.message))
    
    return Promise.all([userData, hydrationData, activityData, sleepData])
    .then(data => {
      let allData = {}
      allData.userData = data[0];
      allData.hydrationData = data[1];
      allData.activityData = data[2];
      allData.sleepData = data[3];
      return allData;
    })
}


// promise all resolve

export default fetchData;