import './css/base.scss';
import './css/style.scss';
import './css/reset.scss';
import './images/person walking on path.jpg';
import './images/The Rock.jpg';

import User from './User';
import Activity from './Activity';
import Hydration from './Hydration';
import Sleep from './Sleep';
import UserRepo from './User-repo';
import fetchData from './APICalls';
import postAllUserData from './PostData';

import * as JSC from 'jscharting';

// var sidebarName = document.getElementById('sidebarName');
// var headerText = document.getElementById('headerText');
// var userAddress = document.getElementById('userAddress');
// var userEmail = document.getElementById('userEmail');


// NEW VARIABLE AND EVENT LISTENERS

let currentUser = null
let today
let submitButton = document.querySelector('.submit-button');
submitButton.addEventListener('click', postData);
//this event listener will be fire upon submitting a form

function startApp() {
  fetchCurrentData()
}

function fetchCurrentData() {
  fetchData()
  .then(allData => {
    if (!currentUser) {
      currentUser = new User(allData.userData[Math.floor(Math.random() * allData.userData.length)]);
    }
  today = returnLatestDate(allData)
  let userRepo = new UserRepo(allData.userData, currentUser);
  displaySleepData(allData.sleepData, currentUser, today, userRepo);
  displayHydrationData(allData.hydrationData, currentUser, today, userRepo);
  displayActivityData(allData.activityData, currentUser, today, userRepo);
  })
}


function returnLatestDate(allData) {
  let userActivityData = allData.activityData.filter(userData => {
    return currentUser.id === userData.userID
  })
  return userActivityData[userActivityData.length - 1].date
}


startApp();

function postData() {
  if (currentUser) {
    postNewData()
  } else {
    alert("no current user found")
  }
}


function postNewData() {
  const hoursSleptEntry = document.getElementById('hoursSleptEntry');
  const sleepQualityEntry = document.getElementById('sleepQualityEntry');
  const numOuncesEntry = document.getElementById('numOuncesEntry');
  const numStepsEntry = document.getElementById('numStepsEntry');
  const minutesActiveEntry = document.getElementById('minutesActiveEntry');
  const flightsOfStairsEntry = document.getElementById('flightsOfStairsEntry');
  const newEntry = {
    "hoursSlept": hoursSleptEntry.value,
    "sleepQuality": sleepQualityEntry.value,
    "numOunces": numOuncesEntry.value,
    "numSteps": numStepsEntry.value,
    "minutesActive" : minutesActiveEntry.value,
    "flightsOfStairs" : flightsOfStairsEntry.value
  }
  let newData = catchData(newEntry);
  const date = setNewDate();
  let userSleepData = {
    "userID" : currentUser.id,
    "date" : date,
    "hoursSlept" : newData.hoursSlept,
    "sleepQuality" : newData.sleepQuality
  }

  let userHydrationData = {
    "userID" : currentUser.id,
    "date" : date,
    "numOunces": newData.numOunces
  }

  let userActivityData = {
    "userID" : currentUser.id,
    "date" : date,
    "numSteps" : newData.numSteps,
    "minutesActive" : newData.minutesActive,
    "flightsOfStairs" : newData.flightsOfStairs
  }

  let updatingDisplay = document.getElementById('updatingDisplay');
  postAllUserData(userSleepData, userHydrationData, userActivityData)
  .then(response => {
    updatingDisplay.innerHTML = "Updating Your Account...";
    setTimeout(() => {updatingDisplay.innerHTML = ""}, 1500)
    console.log(response)
  })
  .catch(err => {
    alert(err.message)
  })
}

function setNewDate() {
  let splitDate = today.split("");
  let day = parseInt(splitDate[splitDate.length - 1]);
  day++;
  splitDate.pop();
  splitDate.push(day);
  return splitDate.join("");
}

function catchData(data) {
  //let error = "You need to enter valid numbers, try again!"
  const properties = Object.keys(data);
  properties.map(property => {
    let enteredNum = parseInt(data[property])
    if (enteredNum <= 0 || !enteredNum) {
      data[property] = 0;
    }
  })
  return data;
}

function makeGraphPoints(dates) {
  const points = dates.map(date => {
    return Object.keys(date)[0];
  });
  return points.map((dateKey, index) => {
    return { x: dateKey, y: dates[index][dateKey] }
  })
};

function compileHydrationChart(hydrationObject) {
  // console.log(hydrationObject.calculateFirstWeekOunces())
  let hydrationChart = new JSC.Chart("chartDiv-hydration", {
    type: 'spline',
    legend_visible: false,
    axisTick_gridline: {visible: false},
    box_fill: '#5bc8ac',
    series: [
      {
        points: makeGraphPoints(hydrationObject.calculateFirstWeekOunces())
      },
    ]
  });
}

function makeHydrationHTML(id, hydrationInfo, userStorage, drinks) {
  return drinks.map(drinkData => `<li class="historical-list-listItem">On ${drinkData}oz</li>`).join(''); // needs dates?
}

  function displaySleepData(sleepData, user, today, userRepo) {
    var sleepToday = document.getElementById('sleepToday');
    var sleepQualityToday = document.getElementById('sleepQualityToday');
    var avUserSleepQuality = document.getElementById('avUserSleepQuality');
    var sleepThisWeek = document.getElementById('sleepThisWeek');
    var sleepEarlierWeek = document.getElementById('sleepEarlierWeek');
    let sleepObject = new Sleep(sleepData, user, today, userRepo);
    let averageSleep = sleepObject.calculateAverageSleep();
    let sleepQuality = sleepObject.calculateAverageSleepQuality();
    let weekSleep = sleepObject.calculateWeekSleep();
    let averageWeekSleep = sleepObject.calculateWeekSleepQuality();
    let allUsersSleepQuality = sleepObject.calculateAllUserSleepQuality();

    sleepToday.insertAdjacentHTML("afterBegin", `<p>You slept</p> <p><span class="number">${sleepObject.calculateDailySleep(today)}</span></p> <p>hours today.</p>`);
    sleepQualityToday.insertAdjacentHTML("afterBegin", `<p>Your sleep quality was</p> <p><span class="number">${sleepObject.calculateDailySleepQuality()}</span></p><p>out of 5.</p>`);
    avUserSleepQuality.insertAdjacentHTML("afterBegin", `<p>The average user's sleep quality is</p> <p><span class="number">${Math.round(sleepObject.calculateAllUserSleepQuality() *100)/100}</span></p><p>out of 5.</p>`);
    //console.log(sleepObject.calculateAllUserSleepQuality())
  }

  function displayHydrationData(hydrationData, user, today, userRepo) {
    var friendList = document.getElementById('friendList');
    var hydrationToday = document.getElementById('hydrationToday');
    var hydrationAverage = document.getElementById('hydrationAverage');
    var hydrationThisWeek = document.getElementById('hydrationThisWeek');
    var hydrationEarlierWeek = document.getElementById('hydrationEarlierWeek');

    let hydrationObject = new Hydration(hydrationData, user, today, userRepo);
    let averageHydration = hydrationObject.calculateAverageOunces();
    hydrationAverage.insertAdjacentHTML('afterBegin', `<p>Your average water intake is</p><p><span class="number">${averageHydration}</span></p> <p>oz per day.</p>`);
    hydrationToday.insertAdjacentHTML('afterBegin', `<p>You drank</p><p><span class="number">${hydrationObject.calculateDailyOunces()}</span></p><p>oz water today.</p>`); //userRepo.getToday()
    const weekHydrationRecord = hydrationObject.hydrationData.filter(drink => drink.userID === hydrationObject.user.id);
    // hydrationThisWeek.insertAdjacentHTML('afterBegin', makeHydrationHTML(hydrationObject.user.id, hydrationObject, hydrationObject.user, hydrationObject.calculateFirstWeekOunces()));
    // hydrationEarlierWeek.insertAdjacentHTML('afterBegin', makeHydrationHTML(hydrationObject.user.id, hydrationObject, hydrationObject.user, hydrationObject.calculateRandomWeekOunces()));
    compileChart(hydrationObject, "numOunces")
  }

function displayActivityData(activityData, currentUser, today, userRepo) {
    var stepGoalCard = document.getElementById('stepGoalCard');
    var userStridelength = document.getElementById('userStridelength');
    var avgStepGoalCard = document.getElementById('avStepGoalCard')
    var userMinutesThisWeek = document.getElementById('userMinutesThisWeek');
    var bestUserSteps = document.getElementById('bestUserSteps');
    var userStairsThisWeek = document.getElementById('userStairsThisWeek');

    let activityRepo = new Activity(activityData, today, currentUser, userRepo);

    var userStepsToday = document.getElementById('userStepsToday');
    display(userStepsToday, 'Step Count', activityRepo.returnUserStepsByDate().numSteps)
    var userMinutesToday = document.getElementById('userMinutesToday');
    display(userMinutesToday, 'Active Minutes', activityRepo.getActiveMinutesByDate())

    const userStairs = activityRepo.userDataForToday('flightsOfStairs')
    var userStairsToday = document.getElementById('userStairsToday');
    userStairsToday.insertAdjacentHTML("afterBegin", `<p>Stair Count:</p><p>You</><p><span class="number">${userStairs}</span></p>`)
    // need users flights of stairs --??We have flights in activity data
    activityRepo.getMilesFromStepsByDate()
    // need to create dom element
    activityRepo.getStairRecord()
    //  - all time stair record need to create dom element
    var avgStairsToday = document.getElementById('avgStairsToday');
    const averageStairs = activityRepo.getAllUserAverageForDay('flightsOfStairs')
    avgStairsToday.insertAdjacentHTML("afterBegin", `<p>Stair Count: </p><p>All Users</p><p><span class="number">${averageStairs}</span></p>`)
    // this returns the average # of stairs for today for all users
    var avgMinutesToday = document.getElementById('avgMinutesToday');
    const averageMinutes = activityRepo.getAllUserAverageForDay('minutesActive')
    avgMinutesToday.insertAdjacentHTML("afterBegin", `<p>Active Minutes:</p><p>All Users</p><p><span class="number">${averageMinutes}</span></p>`)
    // average minutes active for all users today
    var avgStepsToday = document.getElementById('avgStepsToday');
    const averageSteps = activityRepo.getAllUserAverageForDay('numSteps')
    avgStepsToday.insertAdjacentHTML("afterBegin", `<p>Step Count:</p><p>All Users</p><p><span class="number">${averageSteps}</span></p>`)
    // average number of steps for everyone today
    //weekly views:
    var userStepsThisWeek = document.getElementById('userStepsThisWeek');
    const weeklySteps = activityRepo.userDataForWeek("numSteps");
    compileChart(activityRepo, "numSteps")
    compileChart(activityRepo, "flightsOfStairs")
    compileChart(activityRepo, "minutesActive")
  }

 function compileChart(healthCategory, propertyName) {
    let chart = new JSC.Chart(`chartDiv-${propertyName}`, {
      type: 'spline',
      legend_visible: false,
      axisTick_gridline: {visible: false},
      box_fill: '#ee6',
      series: [
        {
          points: makeGraphPoints(healthCategory.userDataForWeek(propertyName))
        },
      ]
    });
  }

function display(element, description, method) {
  element.insertAdjacentHTML("afterBegin", `<p>${description}:</p><p>You</p><p><span class="number">${method}</span></p>`)
}

function displayAverageSteps(activityRepo) {
  let averageSteps = activityRepo.returnUserStepsByDate();
  userStepsToday.insertAdjacentHTML("afterBegin", `<p>Step Count:</p><p>You</p><p><span class="number">${averageSteps.numSteps}</span></p>`)
}

function displayActiveMinutes(activityRepo) {
  let activeMinutes = activityRepo.getActiveMinutesByDate();
  userMinutesToday.insertAdjacentHTML("afterBegin", `<p>Active Minutes:</p><p>You</p><p><span class="number">${activeMinutes}</span></p>`)
}
