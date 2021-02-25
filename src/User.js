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

  calculateAverageSleepHours() {
    let total = this.sleep.reduce((total, sleep) => total += sleep.hoursSlept, 0) / this.sleep.length;
    let hours = Math.floor(total)
    let minutes = Math.floor((total - hours) * 60)
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
