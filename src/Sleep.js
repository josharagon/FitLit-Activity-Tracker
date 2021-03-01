import sleepData from './data/sleep';

class Sleep {
  constructor(sleepData, userNow, date, userRepo) {
    this.sleepData = sleepData;
    this.user = userNow;
    this.date = date;
    this.userRepo = userRepo;
  }
  calculateAverageSleep() {
    console.log(this.user)
    let perDaySleep = this.sleepData.filter((data) => this.user.id === data.userID);
    const userSleep = perDaySleep.reduce((sumSoFar, data) => {
      return sumSoFar += data.hoursSlept;
    }, 0) / perDaySleep.length;
    return Math.floor(userSleep);
  }
  calculateAverageSleepQuality() {
    let perDaySleepQuality = this.sleepData.filter((data) => this.user.id === data.userID);
    const userAverage = perDaySleepQuality.reduce((sumSoFar, data) => {
      return sumSoFar += data.sleepQuality;
    }, 0) / perDaySleepQuality.length;
    return Math.floor(userAverage)
  }
  calculateDailySleep() {
    console.log(this.user.id)
    let findSleepByDate = this.sleepData.find((data) => this.user.id === data.userID && this.date === data.date);
    return findSleepByDate.hoursSlept;
  }
  calculateDailySleepQuality() {
    let findSleepQualityByDate = this.sleepData.find((data) => this.user.id === data.userID && this.date === data.date);
    return findSleepQualityByDate.sleepQuality;
  }
  
  userDataForWeek(relevantData) {
    return this.userRepo.getWeekFromDate(this.date, this.user.id, this.sleepData).map((data) => {
      return {x: data.date, y: data[relevantData]}
    });
  }
  // calculateWeekSleep() {
  //   return this.userRepo.getWeekFromDate(this.date, this.user.id, this.sleepData).map((data) => `${data.date}: ${data.hoursSlept}`);
  // }
  // calculateWeekSleepQuality() {
  //   return this.userRepo.getWeekFromDate(this.date, this.user.id, this.sleepData).map((data) => `${data.date}: ${data.sleepQuality}`);
  // }
  calculateAllUserSleepQuality() {
    var totalSleepQuality = this.sleepData.reduce(function(sumSoFar, dataItem) {
      sumSoFar += dataItem.sleepQuality;
      return sumSoFar;
    }, 0)
    let total = totalSleepQuality / sleepData.length;
    return parseFloat(total.toFixed(2));
  }
//   determineBestSleepers(date, userRepo) {
//     let timeline = userRepo.chooseWeekDataForAllUsers(this.sleepData, date);
//     let userSleepObject = userRepo.isolateUsernameAndRelevantData(this.sleepData, date, 'sleepQuality', timeline);

//     return Object.keys(userSleepObject).filter(function(key) {
//       return (userSleepObject[key].reduce(function(sumSoFar, sleepQualityValue) {
//         sumSoFar += sleepQualityValue
//         return sumSoFar;
//       }, 0) / userSleepObject[key].length) > 3
//     }).map(function(sleeper) {
//       return userRepo.getDataFromID(parseInt(sleeper)).name;
//     })
//   }
//   determineSleepWinnerForWeek(date, userRepo) {
//     let timeline = userRepo.chooseWeekDataForAllUsers(this.sleepData, date);
//     let sleepRankWithData = userRepo.combineRankedUserIDsAndAveragedData(this.sleepData, date, 'sleepQuality', timeline);

//     return this.getWinnerNamesFromList(sleepRankWithData, userRepo);
//   }
//   determineSleepHoursWinnerForDay(date, userRepo) {
//     let timeline = userRepo.chooseDayDataForAllUsers(this.sleepData, date);
//     let sleepRankWithData = userRepo.combineRankedUserIDsAndAveragedData(this.sleepData, date, 'hoursSlept', timeline);

//     return this.getWinnerNamesFromList(sleepRankWithData, userRepo);
//   }
//   getWinnerNamesFromList(sortedArray, userRepo) {
//     let bestSleepers = sortedArray.filter(function(element) {
//       return element[Object.keys(element)] === Object.values(sortedArray[0])[0]
//     });

//     let bestSleeperIds = bestSleepers.map(function(bestSleeper) {
//       return (Object.keys(bestSleeper));
//     });

//     return bestSleeperIds.map(function(sleepNumber) {
//       return userRepo.getDataFromID(parseInt(sleepNumber)).name;
//     });
//   }
}


export default Sleep;
