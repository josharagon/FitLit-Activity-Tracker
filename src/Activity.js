class Activity {
  constructor(activityData, date, user, userRepo) {
    this.activityData = activityData;
    this.userStepsByDate = {}
    this.date = date;
    this.user = user;
    this.userRepo = userRepo;
  }

  returnUserStepsByDate() {
    return this.activityData.find(data => this.user.id === data.userID && this.date === data.date);
  }

  getMilesFromStepsByDate() {
    let userStepsByDate = this.returnUserStepsByDate()
    return parseFloat(((userStepsByDate.numSteps * this.user.strideLength) / 5280).toFixed(1));
  }

  getActiveMinutesByDate() {
    let userActivityByDate = this.returnUserStepsByDate();
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

  // this function doesn't get displayed as far as I can tell
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
    let selectedDayData = this.activityData.filter(entry => entry.date === this.date);
    return parseFloat((selectedDayData.reduce((acc, elem) => acc += elem[relevantData], 0) / selectedDayData.length).toFixed(1));
  }

  userDataForToday(relevantData) {
    let userData = this.userRepo.getDataFromUserID(this.user.id, this.activityData);
    return userData.find(data => data.date === this.date)[relevantData];
  }

  userDataForWeek(relevantData) {
    return this.userRepo.getWeekFromDate(this.date, this.user.id, this.activityData).map((data) => {
      return {x: data.date, y: data[relevantData]}
    });
  }

}



export default Activity
