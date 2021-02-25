import Activity from "./Activity";
import Hydration from "./Hydration";
import Sleep from "./Sleep";

class User {
  constructor(userDetails, allData) {
    this.id = userDetails.id;
    this.name = userDetails.name;
    this.address = userDetails.address;
    this.email = userDetails.email;
    this.strideLength = userDetails.strideLength;
    this.dailyStepGoal = userDetails.dailyStepGoal;
    this.friends = userDetails.friends;
    this.activities = allData.activityData.filter(activity => activity.userID === this.id).map(activity => new Activity(activity))
    this.sleep = allData.sleepData.filter(activity => activity.userID === this.id).map(sleep => new Sleep(sleep))
    this.hydration = allData.hydrationData.filter(hydration => hydration.userID === this.id).map(hydration => new Hydration(hydration))
  }

  calculateAverageHydration() {
    return Math.floor(this.hydration.reduce((total, hydration) => total += hydration.numOunces, 0) / this.hydration.length);
  }

  returnHydrationHistory() {
    let result = []
    for (var i = this.hydration.length - 1; i >= this.hydration.length - 7; i--) {
      result.push({ x: `${this.hydration[i].date}`, y: this.hydration[i].numOunces})
    }
    return result;
  }

  returnSleepHistory() {
    let result = []
    for (var i = this.sleep.length - 1; i >= this.sleep.length - 7; i--) {
      result.push({ x: `${this.sleep[i].date}`, y: this.sleep[i].hoursSlept})
    }
    return result;
  }

  returnLastSleepDuration() {
    let total = this.sleep[this.sleep.length - 1].hoursSlept;
    let hours = Math.floor(total)
    let minutes = Math.floor((total - hours) * 60)
    return this.formatSleepTimer(hours, minutes);
  }

  calculateAverageSleepHours() {
    let total = this.sleep.reduce((total, sleep) => total += sleep.hoursSlept, 0) / this.sleep.length;
    let hours = Math.floor(total)
    let minutes = Math.floor((total - hours) * 60)
    return this.formatSleepTimer(hours, minutes);
  }

  formatSleepTimer(hours, minutes) {
    if (minutes < 10) {
      return `${hours}h 0${minutes}m`
    } else {
      return `${hours}h ${minutes}m`
    }
  }

  calculateAverageSleepQuality() {
    let average = this.sleep.reduce((total, sleep) => total += sleep.sleepQuality, 0) / this.sleep.length
    return Math.round((average + Number.EPSILON) * 100) / 100
  }
}

export default User;
