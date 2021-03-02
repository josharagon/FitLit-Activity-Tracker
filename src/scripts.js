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

// NEW VARIABLE AND EVENT LISTENERS

let currentUser = null
let today
let submitButton = document.querySelector('.submit-button');
submitButton.addEventListener('click', postData);

//USER DATA
var userAddress = document.getElementById('userAddress')
var userEmail = document.getElementById('userEmail')
var userStridelength = document.getElementById('userStridelength')
var userStepGoal = document.getElementById('stepGoalCard')
var userAvgStepGoal = document.getElementById('avStepGoalCard')

//HYDRATION CIRCLE CHART
var hydrationChartText = document.getElementById('chart-text');
var hydrationChartNum = document.getElementById('chart-num');
var hydrationBar = document.getElementById('chart-barhydro');
var hydrationDay = document.getElementById('day-oz');
var hydrationAvg = document.getElementById('avg-oz');
var radioBox = document.querySelector('.data-radio');
//ACTIVITY CIRCLE CHART
var dataSelectorRadio = document.getElementById('user-selector');
var personalDataChart = document.getElementById('personal-data-chart');
var allUserDataChart = document.getElementById('all-user-chart');
var personalDataRadio = document.getElementById('personal-data');
var allUserDataRadio = document.getElementById('all-users');
var activityStepChartNum = document.getElementById('activity-chart-num');
var activityStepBar = document.getElementById('chart-baractivity');
var allUserChartNum = document.querySelector('.all-user-num');
var allUserBar = document.querySelector('.all-user-bar');
var activityCategoryRadio = document.getElementById('category');
var stepsRadio = document.getElementById('category-steps');
var milesRadio = document.getElementById('category-miles');
var milesLabel = document.getElementById('category-label-miles');
var stairsRadio = document.getElementById('category-stairs');
var activeRadio = document.getElementById('category-active');
var activityChart = document.querySelector('.activity-chart');
var activityChartHeader = document.querySelector('.activity-chart-header');

// SLEEP CIRCLE CHART
var sleepChart = document.querySelector('.sleep-chart');
var sleepChartHeader = document.querySelector('.sleepChartHeader')
var sleepDataSelector = document.getElementById('selector-sleep');
var personalSleepChart = document.getElementById('personal-sleep-chart');
var personalSleepRadio = document.getElementById('personal-sleep');
var allSleepRadio = document.getElementById('all-sleep');
var sleepChartNum = document.getElementById('sleep-chart-num');
var sleepChartBar = document.getElementById('chart-barsleep');
var allSleepChart = document.getElementById('all-sleep-chart')
var allSleepChartNum = document.querySelector('.all-sleep-num');
var allSleepChartBar = document.querySelector('.all-sleep-bar');
var sleepTypeRadio = document.getElementById('sleep-type');
var hoursSleptRadio = document.getElementById('type-hours');
var sleepQualityRadio = document.getElementById('type-quality');

window.addEventListener('load', startApp)

function startApp() {
  fetchCurrentData()
}

function fetchCurrentData() {
  radioBox.addEventListener('click', updateHydrationChart);
  sleepDataSelector.addEventListener('click', changeShownType);
  dataSelectorRadio.addEventListener('click', changeShownData);
  fetchData()
  .then(allData => {
    if (!currentUser) {
      currentUser = new User(allData.userData[Math.floor(Math.random() * allData.userData.length)]);
    }
    displayUser(currentUser);
    today = returnLatestDate(allData);
  let userRepo = new UserRepo(allData.userData, currentUser);
  displaySleepData(allData.sleepData, currentUser, today, userRepo);
  displayHydrationData(allData.hydrationData, currentUser, today, userRepo);
  displayActivityData(allData.activityData, currentUser, today, userRepo);
  })
}

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

function returnLatestDate(allData) {
  let userActivityData = allData.activityData.filter(userData => {
    return currentUser.id === userData.userID
  })
  return userActivityData[userActivityData.length - 1].date
}

function displaySleepData(sleepData, user, today, userRepo) {
  let sleepObject = new Sleep(sleepData, user, today, userRepo);
  let daySleep = sleepObject.calculateDailySleep();
  let dayQuality = sleepObject.calculateDailySleepQuality();
  window.sleepDay = { hours: daySleep, quality: dayQuality};
  let averageSleep = sleepObject.calculateAverageSleep();
  let sleepQuality = sleepObject.calculateAverageSleepQuality();
  window.sleepAvg = { hours: averageSleep, quality: sleepQuality };
  sleepChartHeader.innerText = 'Your hours slept this week';
  sleepChartNum.innerHTML = `${sleepDay.hours}<span>hr</span>`;
  sleepChartBar.style.strokeDashoffset = `calc(440 - (440 * ${sleepDay.hours}) / 12)`;
  allSleepChartNum.innerHTML = `${sleepAvg.hours}<span></span>`;
  allSleepChartBar.style.strokeDashoffset = `calc(440 - (440 * ${sleepAvg.hours}) / 12)`;
  compileChart(sleepObject, "hoursSlept", "purple", "hours of sleep");
  sleepTypeRadio.addEventListener('click', function () {
    updateSleepChart(sleepObject);
  });
}

function displayHydrationData(hydrationData, user, today, userRepo) {
  let hydrationObject = new Hydration(hydrationData, user, today, userRepo);
  let dayAmount = hydrationObject.calculateDailyOunces();
  window.averageHydration = hydrationObject.calculateAverageOunces();
  window.dailyHydration = dayAmount;
  hydrationChartNum.innerHTML = `${dayAmount}<span>oz</span>`;
  hydrationBar.style.strokeDashoffset = `calc(440 - (440* ${dayAmount}) / 100)`;
  compileChart(hydrationObject, "numOunces", "blue", "fluid ounces of water consumed")
}

function displayActivityData(activityData, currentUser, today, userRepo) {
  let activityRepo = new Activity(activityData, today, currentUser, userRepo);
  let personalAmount = activityRepo.returnUserStepsByDate().numSteps;
  let personalMiles = activityRepo.getMilesFromStepsByDate();
  let personalStairs = activityRepo.getStairRecord();
  let personalActive = activityRepo.getActiveMinutesByDate();
  window.personalData = { steps: personalAmount, miles: personalMiles, stairCount: personalStairs, minsActive: personalActive };
  let allAmount = activityRepo.getAllUserAverageForDay('numSteps');
  let allStairs = activityRepo.getAllUserAverageForDay('flightsOfStairs');
  let allActive = activityRepo.getAllUserAverageForDay('minutesActive');
  window.allUserData = { steps: allAmount, stairCount: allStairs, minsActive: allActive };
  activityRepo.getMilesFromStepsByDate()
  activityRepo.getStairRecord()
  activityStepChartNum.innerHTML = `${personalAmount}<span></span>`
  activityStepBar.style.strokeDashoffset = `calc(440 - (40 * ${personalAmount}) / 1500)`
  allUserChartNum.innerHTML = `${allAmount}<span></span>`
  allUserBar.style.strokeDashoffset = `calc(440 - (40 * ${allAmount}) / 1500)`
  compileChart(activityRepo, "numSteps", "orange", "number of steps")
  activityCategoryRadio.addEventListener('click', function () {
      updateCategory(activityRepo);
  });
}

function compileChart(healthCategory, propertyName, color, chartDescription) {
  let dataPoints = healthCategory.userDataForWeek(propertyName);
  dataPoints.forEach(point => point.color = color);
  dataPoints.forEach(point => point.description =`on ${point.x} your ${chartDescription} was ${point.y}`)
  let chart = new JSC.Chart(`chartDiv-${propertyName}`, {
    tabIndex: "auto",
    grid: {
      enabled: true,
      tabIndex: true,
      xAxis_label_text: "Date",
    },
    description: `Chart displaying your ${chartDescription} each day over the last seven days`,
    type: 'spline',
    legend_visible: false,
    box_fill: 'none',
    yAxis_alternateGridFill: 'none',
    yAxis_defaultTick_gridLine: {visible: false},
    xAxis_defaultTick_gridLine: {visible: false},
    series: [
      {
        tabIndex: "auto",
        line_color: color,
        points: dataPoints
      },
    ]
  });
}



function updateCategory(activityRepo) {
  if (stepsRadio.checked === true) {
    activityChart.id = 'chartDiv-numSteps';
    compileChart(activityRepo, "numSteps", "orange", "number of steps")
    activityChartHeader.innerText = 'Your steps this week';
    activityStepChartNum.innerHTML = `${personalData.steps}<span></span>`
    activityStepBar.style.strokeDashoffset = `calc(440 - (40 * ${personalData.steps}) / 1500)`
    allUserChartNum.innerHTML = `${allUserData.steps}<span></span>`
    allUserBar.style.strokeDashoffset = `calc(440 - (40 * ${allUserData.steps}) / 1500)`
  } else if (milesRadio.checked === true) {
    activityChart.id = 'chartDiv-numSteps';
    compileChart(activityRepo, 'numSteps');
    activityChartHeader.innerText = 'Your steps this week'
    activityStepChartNum.innerHTML = `${personalData.miles}<span>mi</span>`
    activityStepBar.style.strokeDashoffset = `calc(440 - (440 * ${personalData.miles}) / 25)`
  } else if (stairsRadio.checked === true) {
    activityChart.id = 'chartDiv-flightsOfStairs';
    compileChart(activityRepo, "flightsOfStairs", "orange", "flights of stairs climbed")
    activityChartHeader.innerText = 'Your stairs this week';
    activityStepChartNum.innerHTML = `${personalData.stairCount}<span>stairs</span>`
    activityStepBar.style.strokeDashoffset = `calc(440 - (440 * ${personalData.stairCount}) / 100)`
    allUserChartNum.innerHTML = `${allUserData.stairCount}<span>stairs</span>`
    allUserBar.style.strokeDashoffset = `calc(440 - (440 * ${allUserData.stairCount}) / 100)`
  } else if (activeRadio.checked === true) {
    activityChart.id = 'chartDiv-minutesActive';
    compileChart(activityRepo, "minutesActive", "orange", "number of minutes spent physically active");
    activityChartHeader.innerText = 'Your active minutes this week';
    activityStepChartNum.innerHTML = `${personalData.minsActive}<span>mins</span>`
    activityStepBar.style.strokeDashoffset = `calc(440 - (440 * ${personalData.minsActive}) / 250)`
    allUserChartNum.innerHTML = `${allUserData.minsActive}<span>mins</span>`
    allUserBar.style.strokeDashoffset = `calc(440 - (440 * ${allUserData.minsActive}) / 250)`
  }
}

function updateSleepChart(sleepObject) {
  if (hoursSleptRadio.checked === true) {
    sleepChart.id = 'chartDiv-hoursSlept';
    compileChart(sleepObject, "hoursSlept", "purple", "hours of sleep");
    sleepChartHeader.innerText = 'Your hours slept this week';
    sleepChartNum.innerHTML = `${sleepDay.hours}<span>hr</span>`
    sleepChartBar.style.strokeDashoffset = `calc(440 - (440 * ${sleepDay.hours}) / 12)`
    allSleepChartNum.innerHTML = `${sleepAvg.hours}<span>hr</span>`
    allSleepChartBar.style.strokeDashoffset = `calc(440 - (440 * ${sleepAvg.hours}) / 12)`
  } else if (sleepQualityRadio.checked === true) {
    sleepChart.id = 'chartDiv-sleepQuality';
    compileChart(sleepObject, "sleepQuality", "purple", "quality of sleep on a scale of 1-5");
    sleepChartHeader.innerText = 'Your sleep quality this week';
    sleepChartNum.innerHTML = `${sleepDay.quality}<span>/5</span>`
    sleepChartBar.style.strokeDashoffset = `calc(440 - (440 * ${sleepDay.quality}) / 5)`
    allSleepChartNum.innerHTML = `${sleepAvg.quality}<span>/5</span>`
    allSleepChartBar.style.strokeDashoffset = `calc(440 - (440 * ${sleepAvg.quality}) / 5)`
  }
}

function updateHydrationChart() {
  if (hydrationDay.checked === true) {
    hydrationChartNum.innerHTML = `${dailyHydration}<span>oz</span>`
    hydrationBar.style.strokeDashoffset = `calc(440 - (440* ${dailyHydration}) / 100)`
    hydrationChartText.innerText = 'Today'
  } else if (hydrationAvg.checked === true) {
    hydrationChartNum.innerHTML = `${averageHydration}<span>oz</span>`
    hydrationBar.style.strokeDashoffset = `calc(440 - (440* ${averageHydration}) / 100)`
    hydrationChartText.innerText = 'On Average'
  }
}

function changeShownData() {
  if (personalDataRadio.checked === true) {
    personalDataChart.classList.remove('hidden');
    allUserDataChart.classList.add('hidden');
    milesLabel.style.display = 'inline-block';
  } else if (allUserDataRadio.checked === true) {
    allUserDataChart.classList.remove('hidden');
    personalDataChart.classList.add('hidden');
    milesLabel.style.display = 'none';
  }
}

function changeShownType() {
  if (personalSleepRadio.checked === true) {
    personalSleepChart.classList.remove('hidden');
    allSleepChart.classList.add('hidden');
  } else if (allSleepRadio.checked === true) {
    allSleepChart.classList.remove('hidden');
    personalSleepChart.classList.add('hidden');
  }
}


function displayUser(user) {
  userName.innerHTML = `Name: </br> ${user.name}`
  userAddress.innerHTML = `Address: </br> ${user.address}`;
  userEmail.innerHTML = `Email: </br> ${user.email}`;
  userStridelength.innerHTML = `Stride Length: </br> ${user.strideLength}`;
  userStepGoal.innerHTML = `Step Goal: </br> ${user.dailyStepGoal}`;
}