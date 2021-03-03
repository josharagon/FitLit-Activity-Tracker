import { displayError } from './APICalls';

export const checkForError = response => {
  if (!response.ok) {
    throw new Error("Please make sure fields are all filled.")
  }
}

export const postAllUserData = (userSleepData, userHydrationData, userActivityData) => {
    let sleepData = fetch("http://localhost:3001/api/v1/sleep", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userSleepData),
        })
        .then(response => response.json())
        .catch(err => displayError(err))

    let hydrationData = fetch("http://localhost:3001/api/v1/hydration", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userHydrationData),
        })
        .then(response => response.json())
        .catch(err => displayError(err))

    let activityData = fetch("http://localhost:3001/api/v1/activity", {
            method : "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify(userActivityData)
        })
        .then(response => response.json())
        .catch(err => displayError(err))

    return Promise.all([sleepData, hydrationData, activityData])
    .then(allPostedData => {
        let postedData = {}
        postedData.postedSleepData = allPostedData[0]
        postedData.postedHydrationData = allPostedData[1]
        postedData.postedActivityData = allPostedData[2]
        return postedData
    })
}
