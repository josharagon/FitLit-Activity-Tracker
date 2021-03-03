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
import { fetchData, displayError } from './APICalls';
import { checkForError, postAllUserData } from './PostData';

import * as JSC from 'jscharting';

let currentUser = null
let today
let submitButton = document.querySelector('.submit-button');
submitButton.addEventListener('click', postData);

const activityStepChartNum = document.getElementById('activity-chart-num');
const activityStepBar = document.getElementById('chart-baractivity');
const allUserChartNum = document.querySelector('.all-user-num');
const allUserBar = document.querySelector('.all-user-bar');

const activityChart = document.querySelector('.activity-chart')
const activityChartHeader = document.querySelector('.activity-chart-header');
const sleepChart = document.querySelector('.sleep-chart');
const sleepChartHeader = document.querySelector('.sleepChartHeader')

const sleepChartNum = document.getElementById('sleep-chart-num');
const sleepChartBar = document.getElementById('chart-barsleep');
const allSleepChart = document.getElementById('all-sleep-chart')
const allSleepChartNum = document.querySelector('.all-sleep-num');
const allSleepChartBar = document.querySelector('.all-sleep-bar');

const addDataButton = document.getElementById('addDataButton');
const userInputForm = document.getElementById('formContainer');
const allDisplayedData = document.getElementById('mainInfoContainer')

addDataButton.addEventListener('click', displayForm);
let displayMain = true
window.addEventListener('load', startApp)

function displayForm() {
  if(displayMain) {
    userInputForm.classList.remove('hidden');
    allDisplayedData.classList.add('hidden');
    displayMain = false
  } else {
    userInputForm.classList.add('hidden');
    allDisplayedData.classList.remove('hidden');
    displayMain = true
  }
}

function startApp() {
  fetchCurrentData()
}

function fetchCurrentData() {
  document.querySelector('.data-radio').addEventListener('click', updateHydrationChart);
  document.getElementById('selector-sleep').addEventListener('click', changeShownType);
  document.getElementById('user-selector').addEventListener('click', changeShownData);
  fetchData()
  .then(allData => {
    if (!currentUser) {
      currentUser = new User(allData.userData[Math.floor(Math.random() * allData.userData.length)]);
    }
    displayUser(currentUser);
    today = returnLatestDate(allData);
  let userRepo = new UserRepo(allData.userData, currentUser);
  document.getElementById("headerText").innerText = `Welcome, ${currentUser.getFirstName()}! Here's your data for ${today}.`
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
  addFormData(newEntry);
}

function addFormData(newEntry) {
  const date = setNewDate();
  let userSleepData = {
    "userID" : currentUser.id,
    "date" : date,
    "hoursSlept" : newEntry.hoursSlept,
    "sleepQuality" : newEntry.sleepQuality
  }
  let userHydrationData = {
    "userID" : currentUser.id,
    "date" : date,
    "numOunces": newEntry.numOunces
  }
  let userActivityData = {
    "userID" : currentUser.id,
    "date" : date,
    "numSteps" : newEntry.numSteps,
    "minutesActive" : newEntry.minutesActive,
    "flightsOfStairs" : newEntry.flightsOfStairs
  }
  checkUserData(newEntry, userSleepData, userHydrationData, userActivityData);
}

function checkUserData(newEntry,userSleepData, userHydrationData, userActivityData) {
  let updatingDisplay = document.getElementById('updatingDisplay');
  if (!newEntry.hoursSlept || !newEntry.sleepQuality ||
    !newEntry.numOunces || !newEntry.numSteps ||
    !newEntry.minutesActive || !newEntry.flightsOfStairs) {
    updatingDisplay.innerText = "Please make sure fields are all filled."
  } else if (!isNumber(newEntry.hoursSlept) ||
    !isNumber(newEntry.sleepQuality) ||
    !isNumber(newEntry.numOunces) ||
    !isNumber(newEntry.minutesActive) ||
    !isNumber(newEntry.flightsOfStairs)) {
      updatingDisplay.innerText = "Please use a number for each entry."
    } else {
      postAllUserData(userSleepData, userHydrationData, userActivityData)
      .then(response => {
        updatingDisplay.innerHTML = "Updating Your Account...";
        setTimeout(() => {updatingDisplay.innerHTML = ""}, 1500)
      })
      .catch(err => {
        displayError(err)
      })
    }
}

function isNumber(userInput) {
  if (typeof userInput != "string") return false
  return !isNaN(userInput) && !isNaN(parseFloat(userInput))
}

function setNewDate() {
  let splitDate = today.split("");
  let day = parseInt(splitDate[splitDate.length - 1]);
  day++;
  splitDate.pop();
  splitDate.push(day);
  return splitDate.join("");
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
  compileChart(sleepObject, "hoursSlept", "pink", "hours of sleep");
  document.getElementById('sleep-type').addEventListener('click', function () {
    updateSleepChart(sleepObject);
  });
}

function displayHydrationData(hydrationData, user, today, userRepo) {
  let hydrationObject = new Hydration(hydrationData, user, today, userRepo);
  let dayAmount = hydrationObject.calculateDailyOunces();
  window.averageHydration = hydrationObject.calculateAverageOunces();
  window.dailyHydration = dayAmount;
  document.getElementById('chart-num').innerHTML = `${dayAmount}<span>oz</span>`;
  document.getElementById('chart-barhydro').style.strokeDashoffset = `calc(440 - (440* ${dayAmount}) / 100)`;
  compileChart(hydrationObject, "numOunces", "mediumturquoise", "fluid ounces of water consumed")
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
  compileChart(activityRepo, "numSteps", "yellow", "number of steps")
  document.getElementById('category').addEventListener('click', function () {
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
  if (document.getElementById('category-steps').checked) {
    activityChart.id = 'chartDiv-numSteps';
    compileChart(activityRepo, "numSteps", "yellow", "number of steps")
    activityChartHeader.innerText = 'Your steps this week';
    activityStepChartNum.innerHTML = `${personalData.steps}<span></span>`
    activityStepBar.style.strokeDashoffset = `calc(440 - (40 * ${personalData.steps}) / 1500)`
    allUserChartNum.innerHTML = `${allUserData.steps}<span></span>`
    allUserBar.style.strokeDashoffset = `calc(440 - (40 * ${allUserData.steps}) / 1500)`
  } else if (document.getElementById('category-miles').checked) {
    activityChart.id = 'chartDiv-numSteps';
    compileChart(activityRepo, "numSteps", "yellow", "number of steps");
    activityChartHeader.innerText = 'Your steps this week'
    activityStepChartNum.innerHTML = `${personalData.miles}<span>mi</span>`
    activityStepBar.style.strokeDashoffset = `calc(440 - (440 * ${personalData.miles}) / 25)`
  } else if (document.getElementById('category-stairs').checked) {
    activityChart.id = 'chartDiv-flightsOfStairs';
    compileChart(activityRepo, "flightsOfStairs", "yellow", "flights of stairs climbed")
    activityChartHeader.innerText = 'Your stairs this week';
    activityStepChartNum.innerHTML = `${personalData.stairCount}<span>stairs</span>`
    activityStepBar.style.strokeDashoffset = `calc(440 - (440 * ${personalData.stairCount}) / 100)`
    allUserChartNum.innerHTML = `${allUserData.stairCount}<span>stairs</span>`
    allUserBar.style.strokeDashoffset = `calc(440 - (440 * ${allUserData.stairCount}) / 100)`
  } else if (document.getElementById('category-active').checked) {
    activityChart.id = 'chartDiv-minutesActive';
    compileChart(activityRepo, "minutesActive", "yellow", "number of minutes spent physically active");
    activityChartHeader.innerText = 'Your active minutes this week';
    activityStepChartNum.innerHTML = `${personalData.minsActive}<span>mins</span>`
    activityStepBar.style.strokeDashoffset = `calc(440 - (440 * ${personalData.minsActive}) / 250)`
    allUserChartNum.innerHTML = `${allUserData.minsActive}<span>mins</span>`
    allUserBar.style.strokeDashoffset = `calc(440 - (440 * ${allUserData.minsActive}) / 250)`
  }
}

function updateSleepChart(sleepObject) {
  if (document.getElementById('type-hours').checked) {
    sleepChart.id = 'chartDiv-hoursSlept';
    compileChart(sleepObject, "hoursSlept", "pink", "hours of sleep");
    sleepChartHeader.innerText = 'Your hours slept this week';
    sleepChartNum.innerHTML = `${sleepDay.hours}<span>hr</span>`
    sleepChartBar.style.strokeDashoffset = `calc(440 - (440 * ${sleepDay.hours}) / 12)`
    allSleepChartNum.innerHTML = `${sleepAvg.hours}<span>hr</span>`
    allSleepChartBar.style.strokeDashoffset = `calc(440 - (440 * ${sleepAvg.hours}) / 12)`
  } else if (document.getElementById('type-quality').checked) {
    sleepChart.id = 'chartDiv-sleepQuality';
    compileChart(sleepObject, "sleepQuality", "pink", "quality of sleep on a scale of 1-5");
    sleepChartHeader.innerText = 'Your sleep quality this week';
    sleepChartNum.innerHTML = `${sleepDay.quality}<span>/5</span>`
    sleepChartBar.style.strokeDashoffset = `calc(440 - (440 * ${sleepDay.quality}) / 5)`
    allSleepChartNum.innerHTML = `${sleepAvg.quality}<span>/5</span>`
    allSleepChartBar.style.strokeDashoffset = `calc(440 - (440 * ${sleepAvg.quality}) / 5)`
  }
}

function updateHydrationChart() {
  if (document.getElementById('day-oz').checked) {
    document.getElementById('chart-num').innerHTML = `${dailyHydration}<span>oz</span>`
    document.getElementById('chart-barhydro').style.strokeDashoffset = `calc(440 - (440* ${dailyHydration}) / 100)`
    document.getElementById('chart-text').innerText = 'Today'
  } else if (document.getElementById('avg-oz').checked) {
    document.getElementById('chart-num').innerHTML = `${averageHydration}<span>oz</span>`
    document.getElementById('chart-barhydro').style.strokeDashoffset = `calc(440 - (440* ${averageHydration}) / 100)`
    document.getElementById('chart-text').innerText = 'On Average'
  }
}

function changeShownData() {
  if (document.getElementById('personal-data').checked) {
    document.getElementById('personal-data-chart').classList.remove('hidden');
    document.getElementById('all-user-chart').classList.add('hidden');
    document.getElementById('category-label-miles').style.display = 'inline-block';
  } else if (document.getElementById('all-users').checked) {
    document.getElementById('all-user-chart').classList.remove('hidden');
    document.getElementById('personal-data-chart').classList.add('hidden');
    document.getElementById('category-label-miles').style.display = 'none';
  }
}

function changeShownType() {
  if (document.getElementById('personal-sleep').checked) {
    document.getElementById('personal-sleep-chart').classList.remove('hidden');
    allSleepChart.classList.add('hidden');
  } else if (document.getElementById('all-sleep').checked) {
    allSleepChart.classList.remove('hidden');
    document.getElementById('personal-sleep-chart').classList.add('hidden');
  }
}

function displayUser(user) {
  userName.innerHTML = `Name: </br> ${user.name}`
  document.getElementById('userAddress').innerHTML = `Address: </br> ${user.address}`;
  document.getElementById('userEmail').innerHTML = `Email: </br> ${user.email}`;
  document.getElementById('userStridelength').innerHTML = `Stride Length: </br> ${user.strideLength}`;
  document.getElementById('stepGoalCard').innerHTML = `Step Goal: </br> ${user.dailyStepGoal}`;
}
