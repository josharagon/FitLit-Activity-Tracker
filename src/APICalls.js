
const fetchData = () => {
    fetchUserData();
    fetchHydrationData();
    fetchSleepData();
    fetchActivityData();
}

const fetchUserData = () => {
    fetch("http://localhost:3001/api/v1/users")
    .then(response => response.json())
    .then(userData => console.log(userData))
    // function that would change dom display
    .catch(err => console.log(err.message))
}

const fetchHydrationData = () => {
    fetch("http://localhost:3001/api/v1/hydration")
    .then(response => response.json())
    .then(hydrationData => console.log(hydrationData))
    // function that would change dom display
    .catch(err => console.log(err.message))
}
const fetchActivityData = () => {
    fetch("http://localhost:3001/api/v1/activity")
    .then(response => response.json())
    .then(activityData => console.log(activityData))
    // function that would change dom display
    .catch(err => console.log(err.message))
}

const fetchSleepData = () => {
    fetch("http://localhost:3001/api/v1/sleep")
    .then(response => response.json())
    .then(sleepData => console.log(sleepData))
    // function that would change dom display
    .catch(err => console.log(err.message))
}

export default fetchData;