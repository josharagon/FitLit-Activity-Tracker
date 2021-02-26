class Hydration {
  constructor(hydrationData, userNow) {
    this.hydrationData = hydrationData;
    this.user = userNow;
  }
  calculateAverageOunces() {
    let perDayUserHydration = this.hydrationData.filter((data) => this.user.id === data.userID);
    const userHydration = perDayUserHydration.reduce((sum, data) => {
      return sum += data.numOunces;
    }, 0) / perDayUserHydration.length
    return Math.floor(userHydration);
  }
  calculateDailyOunces(date) {
    //this.hydrationData[0].date)
    let findOuncesByDate = this.hydrationData.find((data) => this.user.id === data.userID && date === data.date);
    return findOuncesByDate.numOunces;
  }
  calculateFirstWeekOunces(userRepo) {
    //console.log(this.user.id)
    return userRepo.getFirstWeek(this.user.id, this.hydrationData).map((data) => `${data.date}: ${data.numOunces}`);
  }
  calculateRandomWeekOunces(date, userRepo) {
    console.log(userRepo)
    return userRepo.getWeekFromDate(date, this.user.id, this.hydrationData).map((data) => `${data.date}: ${data.numOunces}`);
  }
}


export default Hydration;
