// const fetchData = () => {
//     fetchUserData();
//     fetchHydrationData();
//     fetchSleepData();
//     fetchActivityData();
// }

// const fetchUserData = () => {
//     fetch("http://localhost:3001/api/v1/users")
//     .then(response => response.json())
//     .then(userData => console.log(userData))
//     // function that would change dom display
//     .catch(err => console.log(err.message))
// }

// const fetchHydrationData = () => {
//     fetch("http://localhost:3001/api/v1/hydration")
//     .then(response => response.json())
//     .then(hydrationData => console.log(hydrationData))
//     // function that would change dom display
//     .catch(err => console.log(err.message))
// }
// const fetchActivityData = () => {
//     return fetch("http://localhost:3001/api/v1/activity")
//     .then(response => response.json())
//     .then(activityData => {
//         console.log("activity data", activityData)
//         return activityData
//     })
//     .catch(err => console.log(err.message))
// }

// const fetchSleepData = () => {
//     fetch("http://localhost:3001/api/v1/sleep")
//     .then(response => response.json())
//     .then(sleepData => console.log(sleepData))
//     // function that would change dom display
//     .catch(err => console.log(err.message))
// }
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