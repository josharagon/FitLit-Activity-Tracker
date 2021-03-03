
export const fetchData = () => {
    let userData =  fetch("http://localhost:3001/api/v1/users")
        .then(response => response.json())
        .then(userData => {
            return userData
        })
        .catch(err => displayError(err))

    let hydrationData = fetch("http://localhost:3001/api/v1/hydration")
        .then(response => response.json())
        .then(hydrationData => {
            return hydrationData;
        })
        .catch(err => displayError(err))

    let activityData = fetch("http://localhost:3001/api/v1/activity")
        .then(response => response.json())
        .then(activityData => {
            return activityData;
        })
        .catch(err => displayError(err))

    let sleepData = fetch("http://localhost:3001/api/v1/sleep")
        .then(response => response.json())
        .then(sleepData => {
            return sleepData;
        })
        .catch(err => displayError(err));

        return Promise.all([userData, hydrationData, activityData, sleepData])
        .then(data => {
          let allData = {}
          allData.userData = data[0].userData;
          allData.hydrationData = data[1].hydrationData;
          allData.activityData = data[2].activityData;
          allData.sleepData = data[3].sleepData;
          return allData;
        });
}

export const displayError = (errorMessage) => {
  const updatingDisplay =  document.getElementById('updatingDisplay');
  const message = errorMessage.message === 'Failed to fetch' ?
    "Internet connection may be unstable. Check again in a moment please." : errorMessage
  updatingDisplay.innerText = message;
}
