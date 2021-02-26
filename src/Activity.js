import User from "./User"
class Activity {
  constructor(activityData, date, user, userRepo) {
    this.activityData = activityData;
    this.userStepsByDate = {} //activityData[0].numSteps;
    this.date = date;
    this.user = user;
    this.userRepo = userRepo;
  }

  returnUserStepsByDate() {
    return this.activityData.find(data => this.user.id === data.userID && this.date === data.date);
  }

  getMilesFromStepsByDate() {
    let userStepsByDate = this.returnUserStepsByDate()
    // let userStepsByDate = this.activityData.find(data => this.user.id === data.userID && this.date === data.date);
    return parseFloat(((userStepsByDate.numSteps * this.user.strideLength) / 5280).toFixed(1));
  }

  getActiveMinutesByDate() {
    let userActivityByDate = this.returnUserStepsByDate();
    // let userActivityByDate = this.activityData.find(data => this.user.id === data.userID && this.date === data.date);
    return userActivityByDate.minutesActive;
  }

  calculateActiveAverageForWeek() {
    const totalActiveMinutes = this.userRepo.getWeekFromDate(this.date, this.user.id, this.activityData)
    return parseFloat((totalActiveMinutes.reduce((acc, elem) => {
      return acc += elem.minutesActive;
    }, 0) / 7).toFixed(1));
  }

  accomplishStepGoal() {
    let userStepsByDate = this.returnUserStepsByDate();
    if (userStepsByDate.numSteps === this.userRepo.dailyStepGoal) {
      return true;
    }
    return false
  }

  // this functyion doesn't get displayed as far as I can tell
  getDaysGoalExceeded(id, userRepo) {
    return this.activityData.filter(data => id === data.userID && data.numSteps > userRepo.dailyStepGoal).map(data => data.date);
  }

  getStairRecord() {
    return this.activityData.filter(data => this.user.id === data.userID).reduce((acc, elem) => {
      (elem.flightsOfStairs > acc) ? acc = elem.flightsOfStairs : acc
      return acc
    }, 0);
  }

  getAllUserAverageForDay(relevantData) {
    let selectedDayData = this.userRepo.chooseDayDataForAllUsers(this.activityData, this.date);
    return parseFloat((selectedDayData.reduce((acc, elem) => acc += elem[relevantData], 0) / selectedDayData.length).toFixed(1));
  }

  userDataForToday(relevantData) {
    let userData = this.userRepo.getDataFromUserID(this.user.id, this.activityData);
    return userData.find(data => data.date === this.date)[relevantData];
  }

  userDataForWeek(releventData) {
    return this.userRepo.getWeekFromDate(this.date, this.user.id, this.activityData).map((data) => `${data.date}: ${data[releventData]}`);
  }

  // Friends

  getFriendsActivity(user, userRepo) {
    let data = this.activityData;
    let userDatalist = user.friends.map(function(friend) {
      return userRepo.getDataFromUserID(friend, data)
    });
    return userDatalist.reduce(function(arraySoFar, listItem) {
      return arraySoFar.concat(listItem);
    }, []);
  }
  getFriendsAverageStepsForWeek(user, date, userRepo) {
    let friendsActivity = this.getFriendsActivity(user, userRepo);
    let timeline = userRepo.chooseWeekDataForAllUsers(friendsActivity, date);
    return userRepo.combineRankedUserIDsAndAveragedData(friendsActivity, date, 'numSteps', timeline)
  }
  showChallengeListAndWinner(user, date, userRepo) {
    let rankedList = this.getFriendsAverageStepsForWeek(user, date, userRepo);

    return rankedList.map(function(listItem) {
      let userID = Object.keys(listItem)[0];
      let userName = userRepo.getDataFromID(parseInt(userID)).name;
      return `${userName}: ${listItem[userID]}`
    })
  }
  showcaseWinner(user, date, userRepo) {
    let namedList = this.showChallengeListAndWinner(user, date, userRepo);
    let winner = this.showChallengeListAndWinner(user, date, userRepo).shift();
    return winner;
  }
  getStreak(userRepo, id, relevantData) {
    let data = this.activityData;
    let sortedUserArray = (userRepo.makeSortedUserArray(id, data)).reverse();
    let streaks = sortedUserArray.filter(function(element, index) {
      if (index >= 2) {
        return (sortedUserArray[index - 2][relevantData] < sortedUserArray[index - 1][relevantData] && sortedUserArray[index - 1][relevantData] < sortedUserArray[index][relevantData])
      }
    });
    return streaks.map(function(streak) {
      return streak.date;
    })
  }
  getWinnerId(user, date, userRepo) {
    let rankedList = this.getFriendsAverageStepsForWeek(user, date, userRepo);
    let keysList = rankedList.map(listItem => Object.keys(listItem));
    return parseInt(keysList[0].join(''))
  }
}



export default Activity
