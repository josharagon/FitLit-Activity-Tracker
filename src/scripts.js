import './css/base.scss';
import './css/style.scss';
import './css/reset.scss';
import './images/person walking on path.jpg';
import './images/The Rock.jpg';

import userData from './data/users';
import hydrationData from './data/hydration';
import sleepData from './data/sleep';
import activityData from './data/activity';

import User from './User';
import Activity from './Activity';
import Hydration from './Hydration';
import Sleep from './Sleep';
import UserRepo from './User-repo';
import fetchData from './APICalls';

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
// var stepsGraph = document.getElementById('chartDiv-numSteps');
// var stairGraph = document.getElementById('chartDiv-flightsOfStairs');
// var activeGraph = document.getElementById('chartDiv-minutesActive');
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



function startApp() {
  // fetchData();
  // let userList = [];
  // makeUsers(userList);
  // let userRepo = new UserRepo(userList);
  // let hydrationRepo = new Hydration(hydrationData);
  // let sleepRepo = new Sleep(sleepData);
  // let activityRepo = new Activity(activityData);

  // var userNowId = pickUser();
  // let userNow = getUserById(userNowId, userRepo);
  // let today = makeToday(userRepo, userNowId, hydrationData);

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

  function makeHydrationHTML(id, hydrationInfo, userStorage, drinks) {
    return drinks.map(drinkData => `<li class="historical-list-listItem">On ${drinkData}oz</li>`).join(''); // needs dates?
  }


  function displaySleepData(sleepData, user, today, userRepo) {
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
    // display(userStepsToday, 'Step Count', activityRepo.returnUserStepsByDate().numSteps)
    display(userMinutesToday, 'Active Minutes', activityRepo.getActiveMinutesByDate())
    const userStairs = activityRepo.userDataForToday('flightsOfStairs')
    // userStairsToday.insertAdjacentHTML("afterBegin", `<p>Stair Count:</p><p>You</><p><span class="number">${userStairs}</span></p>`)
    // need users flights of stairs
    activityRepo.getMilesFromStepsByDate()
    // need to create dom element
    activityRepo.getStairRecord()
    //  - all time stair record need to create dom element
    const averageStairs = activityRepo.getAllUserAverageForDay('flightsOfStairs')
    // avgStairsToday.insertAdjacentHTML("afterBegin", `<p>Stair Count: </p><p>All Users</p><p><span class="number">${averageStairs}</span></p>`)
    // this returns the average # of stairs for today for all users
    const averageMinutes = activityRepo.getAllUserAverageForDay('minutesActive')
    // avgMinutesToday.insertAdjacentHTML("afterBegin", `<p>Active Minutes:</p><p>All Users</p><p><span class="number">${averageMinutes}</span></p>`)
    // average minutes active for all users today
    const averageSteps = activityRepo.getAllUserAverageForDay('numSteps')
    // avgStepsToday.insertAdjacentHTML("afterBegin", `<p>Step Count:</p><p>All Users</p><p><span class="number">${averageSteps}</span></p>`)
    // average number of steps for everyone today
    //weekly views:
    activityStepChartNum.innerHTML = `${personalAmount}<span></span>`
    activityStepBar.style.strokeDashoffset = `calc(440 - (40 * ${personalAmount}) / 1500)`
    allUserChartNum.innerHTML = `${allAmount}<span></span>`
    allUserBar.style.strokeDashoffset = `calc(440 - (40 * ${allAmount}) / 1500)`
    compileChart(activityRepo, "numSteps")
    // compileChart(activityRepo, "flightsOfStairs")
    // compileChart(activityRepo, "minutesActive")
    // userStepsThisWeek.insertAdjacentHTML("afterBegin", makeStepsHTML(activityRepo.userDataForWeek("numSteps")));
    //console.log(activityRepo.userDataForWeek("minutesActive"));
    //console.log(activityRepo.userDataForWeek("flightsOfStairs"));
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
          points: healthCategory.userDataForWeek(propertyName)
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
  function display(element, description, method) {
    // element.insertAdjacentHTML("afterBegin", `<p>${description}:</p><p>You</p><p><span class="number">${method}</span></p>`)
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
startApp();

// function displayDistanceWalked()

// let randomHistory = makeRandomDate(userRepo, userNowId, hydrationData);
// historicalWeek.forEach(instance => instance.insertAdjacentHTML('afterBegin', `Week of ${randomHistory}`));
// addInfoToSidebar(userNow, userRepo);

//addHydrationInfo(userNowId, hydrationRepo, today, userRepo, randomHistory);
// addSleepInfo(userNowId, sleepRepo, today, userRepo, randomHistory);
// let winnerNow = makeWinnerID(activityRepo, userNow, today, userRepo);
// addActivityInfo(userNowId, activityRepo, today, userRepo, randomHistory, userNow, winnerNow);
// addFriendGameInfo(userNowId, activityRepo, userRepo, today, randomHistory, userNow);


// function makeUsers(array) {
//   userData.forEach(function(dataItem) {
//     let user = new User(dataItem);
//     array.push(user);
//   })
// }

// function pickUser() {
//   return Math.floor(Math.random() * 50);
// }

// function getUserById(id, listRepo) {
//   return listRepo.getDataFromID(id);
// }

// function addInfoToSidebar(user, userRepo) {
//   sidebarName.innerText = user.name;
//   headerText.innerText = `${user.getFirstName()}'s Activity Tracker`;
//   stepGoalCard.innerText = `Your daily step goal is ${user.dailyStepGoal}.`
//   avgStepGoalCard.innerText = `The average daily step goal is ${userRepo.calculateAverageStepGoal()}`;
//   userAddress.innerText = user.address;
//   userEmail.innerText = user.email;
//   userStridelength.innerText = `Your stridelength is ${user.strideLength} meters.`;
//   friendList.insertAdjacentHTML('afterBegin', makeFriendHTML(user, userRepo))
// }
// need to refactor and call in our .then callback passing in current info 


// function makeFriendHTML(user, userRepo) {
//   return user.getFriendsNames(userRepo).map(friendName => `<li class='historical-list-listItem'>${friendName}</li>`).join('');
// }

// function makeWinnerID(activityInfo, user, dateString, userStorage){
//   return activityInfo.getWinnerId(user, dateString, userStorage)
// }

// function makeToday(userStorage, id, dataSet) {
//   //console.log(userStorage, id, dataSet)
//   var sortedArray = userStorage.makeSortedUserArray(id, dataSet);
//   return sortedArray[0].date;
// }

// function makeRandomDate(userStorage, id, dataSet) {
//   var sortedArray = userStorage.makeSortedUserArray(id, dataSet);
//   return sortedArray[Math.floor(Math.random() * sortedArray.length + 1)].date

// }

// function addHydrationInfo(id, hydrationInfo, dateString, userStorage, laterDateString) {
//hydrationToday.insertAdjacentHTML('afterBegin', `<p>You drank</p><p><span class="number">${hydrationInfo.calculateDailyOunces(id, dateString)}</span></p><p>oz water today.</p>`);
//hydrationAverage.insertAdjacentHTML('afterBegin', `<p>Your average water intake is</p><p><span class="number">${hydrationInfo.calculateAverageOunces(id)}</span></p> <p>oz per day.</p>`)
//hydrationAverage.insertAdjacentHTML('afterBegin', `<p>Your average water intake is</p><p><span class="number">${hydrationInfo.calculateAverageOunces(id)}</span></p> <p>oz per day.</p>`)
//hydrationThisWeek.insertAdjacentHTML('afterBegin', makeHydrationHTML(id, hydrationInfo, userStorage, hydrationInfo.calculateFirstWeekOunces(userStorage, id)));
// hydrationEarlierWeek.insertAdjacentHTML('afterBegin', makeHydrationHTML(id, hydrationInfo, userStorage, hydrationInfo.calculateRandomWeekOunces(laterDateString, id, userStorage)));
// }


// function addSleepInfo(id, sleepInfo, dateString, userStorage, laterDateString) {
//   // sleepThisWeek.insertAdjacentHTML('afterBegin', makeSleepHTML(id, sleepInfo, userStorage, sleepInfo.calculateWeekSleep(dateString, id, userStorage)));
//   // sleepEarlierWeek.insertAdjacentHTML('afterBegin', makeSleepHTML(id, sleepInfo, userStorage, sleepInfo.calculateWeekSleep(laterDateString, id, userStorage)));
// }

// function makeSleepHTML(id, sleepInfo, userStorage, method) {
//   return method.map(sleepData => `<li class="historical-list-listItem">On ${sleepData} hours</li>`).join('');
// }

// function makeSleepQualityHTML(id, sleepInfo, userStorage, method) {
//   return method.map(sleepQualityData => `<li class="historical-list-listItem">On ${sleepQualityData}/5 quality of sleep</li>`).join('');
// }

// function addActivityInfo(id, activityInfo, dateString, userStorage, laterDateString, user, winnerId) {
// userStairsToday.insertAdjacentHTML("afterBegin", `<p>Stair Count:</p><p>You</><p><span class="number">${activityInfo.userDataForToday(id, dateString, userStorage, 'flightsOfStairs')}</span></p>`)
// avgStairsToday.insertAdjacentHTML("afterBegin", `<p>Stair Count: </p><p>All Users</p><p><span class="number">${activityInfo.getAllUserAverageForDay(dateString, userStorage, 'flightsOfStairs')}</span></p>`)
// userStepsToday.insertAdjacentHTML("afterBegin", `<p>Step Count:</p><p>You</p><p><span class="number">${activityInfo.userDataForToday(id, dateString, userStorage, 'numSteps')}</span></p>`)
// avgStepsToday.insertAdjacentHTML("afterBegin", `<p>Step Count:</p><p>All Users</p><p><span class="number">${activityInfo.getAllUserAverageForDay(dateString, userStorage, 'numSteps')}</span></p>`)
// userMinutesToday.insertAdjacentHTML("afterBegin", `<p>Active Minutes:</p><p>You</p><p><span class="number">${activityInfo.userDataForToday(id, dateString, userStorage, 'minutesActive')}</span></p>`)
// avgMinutesToday.insertAdjacentHTML("afterBegin", `<p>Active Minutes:</p><p>All Users</p><p><span class="number">${activityInfo.getAllUserAverageForDay(dateString, userStorage, 'minutesActive')}</span></p>`)
// userStepsThisWeek.insertAdjacentHTML("afterBegin", makeStepsHTML(id, activityInfo, userStorage, activityInfo.userDataForWeek(id, dateString, userStorage, "numSteps")));
// userStairsThisWeek.insertAdjacentHTML("afterBegin", makeStairsHTML(id, activityInfo, userStorage, activityInfo.userDataForWeek(id, dateString, userStorage, "flightsOfStairs")));
// userMinutesThisWeek.insertAdjacentHTML("afterBegin", makeMinutesHTML(id, activityInfo, userStorage, activityInfo.userDataForWeek(id, dateString, userStorage, "minutesActive")));
/////bestUserSteps.insertAdjacentHTML("afterBegin", makeStepsHTML(user, activityInfo, userStorage, activityInfo.userDataForWeek(winnerId, dateString, userStorage, "numSteps")));
// }

// function makeStepsHTML(id, activityInfo, userStorage, method) {
//   return method.map(activityData => `<li class="historical-list-listItem">On ${activityData} steps</li>`).join('');
// }
// function makeStepsHTML(method) {
//   return method.map(activityData => `<li class="historical-list-listItem">On ${activityData} steps</li>`).join('');
// }

// function makeStairsHTML(id, activityInfo, userStorage, method) {
//   return method.map(data => `<li class="historical-list-listItem">On ${data} flights</li>`).join('');
// }

// function makeMinutesHTML(id, activityInfo, userStorage, method) {
//   return method.map(data => `<li class="historical-list-listItem">On ${data} minutes</li>`).join('');
// }

// function addFriendGameInfo(id, activityInfo, userStorage, dateString, laterDateString, user) {
//   friendChallengeListToday.insertAdjacentHTML("afterBegin", makeFriendChallengeHTML(id, activityInfo, userStorage, activityInfo.showChallengeListAndWinner(user, dateString, userStorage)));
//   streakList.insertAdjacentHTML("afterBegin", makeStepStreakHTML(id, activityInfo, userStorage, activityInfo.getStreak(userStorage, id, 'numSteps')));
//   streakListMinutes.insertAdjacentHTML("afterBegin", makeStepStreakHTML(id, activityInfo, userStorage, activityInfo.getStreak(userStorage, id, 'minutesActive')));
//   friendChallengeListHistory.insertAdjacentHTML("afterBegin", makeFriendChallengeHTML(id, activityInfo, userStorage, activityInfo.showChallengeListAndWinner(user, dateString, userStorage)));
//   bigWinner.insertAdjacentHTML('afterBegin', `THIS WEEK'S WINNER! ${activityInfo.showcaseWinner(user, dateString, userStorage)} steps`)
// }

// function makeFriendChallengeHTML(id, activityInfo, userStorage, method) {
//   return method.map(friendChallengeData => `<li class="historical-list-listItem">Your friend ${friendChallengeData} average steps.</li>`).join('');
// }

// function makeStepStreakHTML(id, activityInfo, userStorage, method) {
//   return method.map(streakData => `<li class="historical-list-listItem">${streakData}!</li>`).join('');
// }

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

