class Hydration {
  constructor(hydrationData, userNow, date, userRepo) {
    this.hydrationData = hydrationData;
    this.user = userNow;
    this.date = date;
    this.userRepo = userRepo;
  }
  calculateAverageOunces() {
    let perDayUserHydration = this.hydrationData.filter((data) => this.user.id === data.userID);
<<<<<<< HEAD
    const userHydration = perDayUserHydration.reduce((sum, data) => {
      return sum += data.numOunces;
=======
    const userHydration = perDayUserHydration.reduce((sumSoFar, data) => {
      return sumSoFar += data.numOunces;
>>>>>>> main
    }, 0) / perDayUserHydration.length
    return Math.floor(userHydration);
  }
  calculateDailyOunces() {
    let findOuncesByDate = this.hydrationData.find((data) => this.user.id === data.userID && this.date === data.date);
    return findOuncesByDate.numOunces;
  }
  calculateFirstWeekOunces() {
    return this.userRepo.getFirstWeek(this.user.id, this.hydrationData).map((data) => `${data.date}: ${data.numOunces}`);
  }
  calculateRandomWeekOunces() {
    return this.userRepo.getWeekFromDate(this.date, this.user.id, this.hydrationData).map((data) => `${data.date}: ${data.numOunces}`);
  }
}


export default Hydration;
