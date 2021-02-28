class Hydration {
  constructor(hydrationData, userNow, date, userRepo) {
    this.hydrationData = hydrationData;
    this.user = userNow;
    this.date = date;
    this.userRepo = userRepo;
  }
  calculateAverageOunces() {
    let perDayUserHydration = this.hydrationData.filter((data) => this.user.id === data.userID);

    const userHydration = perDayUserHydration.reduce((sum, data) => {
      return sum += data.numOunces;
    }, 0) / perDayUserHydration.length
    return Math.floor(userHydration);
  }
  calculateDailyOunces() {
    let findOuncesByDate = this.hydrationData.find((data) => this.user.id === data.userID && this.date === data.date);
    return findOuncesByDate.numOunces;
  }
  calculateFirstWeekOunces() {
    return this.userRepo.getFirstWeek(this.user.id, this.hydrationData).map((data) => {
      return {[data.date]: data.numOunces};
    });
  }
  // hydration data only has numOunces, what is this argument for?
  // returns proper array unlike above
  userDataForWeek(releventData) {
    // console.log(this.userRepo.getWeekFromDate(this.date, this.user.id, this.hydrationData).map((data) => {
    //   return {[data.date]: data[releventData]};}))
    return this.userRepo.getWeekFromDate(this.date, this.user.id, this.hydrationData).map((data) => {
      return {[data.date]: data[releventData]};
    });
  }

  //---marked for deletion
  calculateRandomWeekOunces() {
    //console.log(this.userRepo.getWeekFromDate(this.date, this.user.id, this.hydrationData).map((data) => `${data.date}: ${data.numOunces}`))

    return this.userRepo.getWeekFromDate(this.date, this.user.id, this.hydrationData).map((data) => `${data.date}: ${data.numOunces}`);
  }
}


export default Hydration;
