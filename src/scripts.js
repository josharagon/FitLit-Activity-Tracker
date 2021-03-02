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

var sidebarName = document.getElementById('sidebarName');
var stepGoalCard = document.getElementById('stepGoalCard');
var headerText = document.getElementById('headerText');
var userAddress = document.getElementById('userAddress');
var userEmail = document.getElementById('userEmail');
var userStridelength = document.getElementById('userStridelength');
var friendList = document.getElementById('friendList');
var hydrationToday = document.getElementById('hydrationToday');
var hydrationAverage = document.getElementById('hydrationAverage');
var hydrationThisWeek = document.getElementById('hydrationThisWeek');
var hydrationEarlierWeek = document.getElementById('hydrationEarlierWeek');
var historicalWeek = document.querySelectorAll('.historicalWeek');
var sleepToday = document.getElementById('sleepToday');
var sleepQualityToday = document.getElementById('sleepQualityToday');
var avUserSleepQuality = document.getElementById('avUserSleepQuality');
var sleepThisWeek = document.getElementById('sleepThisWeek');
var sleepEarlierWeek = document.getElementById('sleepEarlierWeek');
var friendChallengeListToday = document.getElementById('friendChallengeListToday');
var friendChallengeListHistory = document.getElementById('friendChallengeListHistory');
var bigWinner = document.getElementById('bigWinner');
var userStepsToday = document.getElementById('userStepsToday');
var avgStepsToday = document.getElementById('avgStepsToday');
var avgStepGoalCard = document.getElementById('avStepGoalCard')
var userStairsToday = document.getElementById('userStairsToday');
var avgStairsToday = document.getElementById('avgStairsToday');
var userMinutesToday = document.getElementById('userMinutesToday');
var avgMinutesToday = document.getElementById('avgMinutesToday');
var userStepsThisWeek = document.getElementById('userStepsThisWeek');
var userStairsThisWeek = document.getElementById('userStairsThisWeek');
var userMinutesThisWeek = document.getElementById('userMinutesThisWeek');
var bestUserSteps = document.getElementById('bestUserSteps');
var streakList = document.getElementById('streakList');
var streakListMinutes = document.getElementById('streakListMinutes');
//HYDRATION CIRCLE CHART
var hydrationChartText = document.getElementById('chart-text');
var hydrationChartNum = document.getElementById('chart-num');
var hydrationBar = document.getElementById('chart-barhydro');
var hydrationDay = document.getElementById('day-oz');
var hydrationAvg = document.getElementById('avg-oz');
var radioBox = document.querySelector('.data-radio');
radioBox.addEventListener('click', updateHydrationChart);
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
dataSelectorRadio.addEventListener('click', changeShownData)
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
sleepDataSelector.addEventListener('click', changeShownType);




let currentUser = null
let today

window.addEventListener('keydown', postData)
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

  fetchData()
    .then(allData => {
      let currentUser = new User(allData.userData[Math.floor(Math.random() * allData.userData.length)]);
      let userRepo = new UserRepo(allData.userData, currentUser);
      let today = allData.activityData[allData.activityData.length - 1].date
      // console.log(userRepo.getToday(currentUser.id))
      let hydrationRepo = new Hydration(allData.hydrationData, currentUser);
      // let today = makeToday(userRepo, currentUser.id, hydrationData);
      // console.log(allData.activityData.length, allData.activityData)
      displaySleepData(allData.sleepData, currentUser, today, userRepo);
      displayHydrationData(allData.hydrationData, currentUser, today, userRepo);
      displayActivityData(allData.activityData, currentUser, today, userRepo);
    })

  function returnLatestDate(allData) {
  let userActivityData = allData.activityData.filter(userData => {
    return currentUser.id === userData.userID
  })
  return userActivityData[userActivityData.length - 1].date
}

function displayHydrationData(hydrationData, user, today, userRepo) {
    let hydrationObject = new Hydration(hydrationData, user, today, userRepo);
    let averageHydration = hydrationObject.calculateAverageOunces();
    let dayAmount = hydrationObject.calculateDailyOunces();
    window.averageHydration = hydrationObject.calculateAverageOunces();
    window.dailyHydration = dayAmount;
    const weekHydrationRecord = hydrationObject.hydrationData.filter(drink => drink.userID === hydrationObject.user.id);
    hydrationChartNum.innerHTML = `${dayAmount}<span>oz</span>`
    hydrationBar.style.strokeDashoffset = `calc(440 - (440* ${dayAmount}) / 100)`
    compileChart(hydrationObject, "numOunces")
  }

startApp();

function postData() {
  if (currentUser) {
    postNewData()
  } else {
    console.log("no current user found")
  }
}

function postNewData() {
  let userSleepData = {
    "userID" : currentUser.id, 
    "date" : "2019/02/20",
    "hoursSlept" : 7,
    "sleepQuality" : 3
  }
  
  let userHydrationData = {
    "userID" : currentUser.id, 
    "date" : "2019/02/20", 
    "numOunces": 14
  }
  
  let userActivityData = {
    "userID" : currentUser.id, 
    "date" : "2019/02/20", 
    "numSteps" : 3000, 
    "minutesActive" : 60, 
    "flightsOfStairs" : 15
  }
  // This is all placeholder info. All of of this data will be retrieved from values on our form 

  postAllUserData(userSleepData, userHydrationData, userActivityData)
  .then(response => {
    fetchCurrentData()
    // current adds to the display instead of overwriting it - need to fix when we connect to DOM
  })
}

function makeGraphPoints(dates) {
  //INPUT: Array w/objects Date/value pairs
  //OUTPUT: Array w/ objects of x: date and y:value
  const points = dates.map(date => {
    return Object.keys(date)[0];
  });
  return points.map((dateKey, index) => {
    return { x: dateKey, y: dates[index][dateKey] }
  })
};

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
    let daySleep = sleepObject.calculateDailySleep();
    console.log(daySleep)
    let dayQuality = sleepObject.calculateDailySleepQuality();
    window.sleepDay = { hours: daySleep, quality: dayQuality};
    console.log(sleepDay)
    let averageSleep = sleepObject.calculateAverageSleep();
    let sleepQuality = sleepObject.calculateAverageSleepQuality();
    window.sleepAvg = { hours: averageSleep, quality: sleepQuality };
    let allUsersSleepQuality = sleepObject.calculateAllUserSleepQuality();
    sleepChartHeader.innerText = 'Your hours slept this week';
    sleepChartNum.innerHTML = `${sleepDay.hours}<span>hr</span>`
    sleepChartBar.style.strokeDashoffset = `calc(440 - (40 * ${sleepDay.hours}) / 12)`
    allSleepChartNum.innerHTML = `${sleepAvg.hours}<span></span>`
    allSleepChartBar.style.strokeDashoffset = `calc(440 - (40 * ${sleepAvg.hours}) / 12)`
    compileChart(sleepObject, 'hoursSlept');
    sleepTypeRadio.addEventListener('click', function () {
      updateSleepChart(sleepObject);
    });
  }  

  function displayActivityData(activityData, currentUser, today, userRepo) {
    let activityRepo = new Activity(activityData, today, currentUser, userRepo);
    let personalAmount = activityRepo.returnUserStepsByDate().numSteps;
    let personalMiles = activityRepo.getMilesFromStepsByDate();
    let personalStairs = activityRepo.getStairRecord();
    let personalActive = activityRepo.getActiveMinutesByDate();
    window.personalData = { steps: personalAmount, miles: personalMiles, stairCount: personalStairs, minsActive: personalActive };
    console.log(personalData)
    let allAmount = activityRepo.getAllUserAverageForDay('numSteps');
    let allStairs = activityRepo.getAllUserAverageForDay('flightsOfStairs');
    let allActive = activityRepo.getAllUserAverageForDay('minutesActive');
    window.allUserData = { steps: allAmount, stairCount: allStairs, minsActive: allActive };

   
    display(userMinutesToday, 'Active Minutes', activityRepo.getActiveMinutesByDate())

    const userStairs = activityRepo.userDataForToday('flightsOfStairs')
    activityRepo.getMilesFromStepsByDate()
    // need to create dom element
    activityRepo.getStairRecord()
    //  - all time stair record need to create dom element
    var avgStairsToday = document.getElementById('avgStairsToday');
    const averageStairs = activityRepo.getAllUserAverageForDay('flightsOfStairs')
    // avgStairsToday.insertAdjacentHTML("afterBegin", `<p>Stair Count: </p><p>All Users</p><p><span class="number">${averageStairs}</span></p>`)
    // this returns the average # of stairs for today for all users
    var avgMinutesToday = document.getElementById('avgMinutesToday');
    const averageMinutes = activityRepo.getAllUserAverageForDay('minutesActive')
    // avgMinutesToday.insertAdjacentHTML("afterBegin", `<p>Active Minutes:</p><p>All Users</p><p><span class="number">${averageMinutes}</span></p>`)
    // average minutes active for all users today
    var avgStepsToday = document.getElementById('avgStepsToday');
    const averageSteps = activityRepo.getAllUserAverageForDay('numSteps')
    // avgStepsToday.insertAdjacentHTML("afterBegin", `<p>Step Count:</p><p>All Users</p><p><span class="number">${averageSteps}</span></p>`)
    // average number of steps for everyone today
    //weekly views:
    activityStepChartNum.innerHTML = `${personalAmount}<span></span>`
    activityStepBar.style.strokeDashoffset = `calc(440 - (40 * ${personalAmount}) / 1500)`
    allUserChartNum.innerHTML = `${allAmount}<span></span>`
    allUserBar.style.strokeDashoffset = `calc(440 - (40 * ${allAmount}) / 1500)`
    var userStepsThisWeek = document.getElementById('userStepsThisWeek');
    const weeklySteps = activityRepo.userDataForWeek("numSteps");
    compileChart(activityRepo, "numSteps")
    activityCategoryRadio.addEventListener('click', function () {
      updateCategory(activityRepo);
    });
  }
  
 function compileChart(healthCategory, propertyName) {
    let chart = new JSC.Chart(`chartDiv-${propertyName}`, {
      type: 'spline',
      legend_visible: false,
      axisTick_gridline: { visible: false },
      box_fill: '#ffffff00',
      series: [
        {
          points: makeGraphPoints(healthCategory.userDataForWeek(propertyName))
        },
      ]
    });
  }

  function updateCategory(activityRepo) {
    if (stepsRadio.checked === true) {
      activityChart.id = 'chartDiv-numSteps';
      compileChart(activityRepo, 'numSteps');
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
      compileChart(activityRepo, 'flightsOfStairs');
      activityChartHeader.innerText = 'Your stairs this week';
      activityStepChartNum.innerHTML = `${personalData.stairCount}<span>stairs</span>`
      activityStepBar.style.strokeDashoffset = `calc(440 - (440 * ${personalData.stairCount}) / 100)`
      allUserChartNum.innerHTML = `${allUserData.stairCount}<span>stairs</span>`
      allUserBar.style.strokeDashoffset = `calc(440 - (440 * ${allUserData.stairCount}) / 100)`
    } else if (activeRadio.checked === true) {
      activityChart.id = 'chartDiv-minutesActive';
      compileChart(activityRepo, 'minutesActive');
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
      compileChart(sleepObject, 'hoursSlept');
      sleepChartHeader.innerText = 'Your hours slept this week';
      sleepChartNum.innerHTML = `${sleepDay.hours}<span>hr</span>`
      sleepChartBar.style.strokeDashoffset = `calc(440 - (40 * ${sleepDay.hours}) / 12)`
      allSleepChartNum.innerHTML = `${sleepAvg.hours}<span>hr</span>`
      allSleepChartBar.style.strokeDashoffset = `calc(440 - (40 * ${sleepAvg.hours}) / 12)`
    } else if (sleepQualityRadio.checked === true) {
      sleepChart.id = 'chartDiv-sleepQuality';
      compileChart(sleepObject, 'sleepQuality');
      sleepChartHeader.innerText = 'Your sleep quality this week'
      sleepChartNum.innerHTML = `${sleepDay.quality}<span>/5</span>`
      sleepChartBar.style.strokeDashoffset = `calc(440 - (40 * ${sleepDay.quality}) / 5)`
      allSleepChartNum.innerHTML = `${sleepAvg.quality}<span>/5</span>`
      allSleepChartBar.style.strokeDashoffset = `calc(440 - (440 * ${sleepAvg.quality}) / 5)`
    }
  }

  function displayAverageSteps(activityRepo) {
    let averageSteps = activityRepo.returnUserStepsByDate();
    userStepsToday.insertAdjacentHTML("afterBegin", `<p>Step Count:</p><p>You</p><p><span class="number">${averageSteps.numSteps}</span></p>`)
  }

  function displayActiveMinutes(activityRepo) {
    let activeMinutes = activityRepo.getActiveMinutesByDate();
    userMinutesToday.insertAdjacentHTML("afterBegin", `<p>Active Minutes:</p><p>You</p><p><span class="number">${activeMinutes}</span></p>`)
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

startApp();

