class Sleep {
  constructor(sleepData, userNow, date, userRepo) {
    this.sleepData = sleepData;
    this.user = userNow;
    this.date = date;
    this.userRepo = userRepo;
  }
  
  calculateAverageSleep() {
    let perDaySleep = this.sleepData.filter((data) => this.user.id === data.userID);
    const userSleep = perDaySleep.reduce((sum, data) => {
      return sum += data.hoursSlept;
    }, 0) / perDaySleep.length;
    return Math.floor(userSleep);
  }

  calculateAverageSleepQuality() {
    let perDaySleepQuality = this.sleepData.filter((data) => this.user.id === data.userID);
    const userAverage = perDaySleepQuality.reduce((sum, data) => {
      return sum += data.sleepQuality;
    }, 0) / perDaySleepQuality.length;
    return Math.floor(userAverage)
  }

  calculateDailySleep() {
    let findSleepByDate = this.sleepData.find((data) => this.user.id === data.userID && this.date === data.date);
    return findSleepByDate.hoursSlept;
  }

  calculateDailySleepQuality() {
    let findSleepQualityByDate = this.sleepData.find((data) => {
    return this.user.id === data.userID && this.date === data.date
    });
    return findSleepQualityByDate.sleepQuality;
  }
  
  userDataForWeek(relevantData) {
    return this.userRepo.getWeekFromDate(this.date, this.user.id, this.sleepData).map((data) => {
      return {x: data.date, y: data[relevantData]}
    });
  }

  calculateAllUserSleepQuality() {
    var totalSleepQuality = this.sleepData.reduce((sum, dataItem) => {
      sum += dataItem.sleepQuality;
      return sum;
    }, 0)
    let total = totalSleepQuality / this.sleepData.length;
    return parseFloat(total.toFixed(2));
  }

}


export default Sleep;
