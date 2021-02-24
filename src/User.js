import Activity from "./Activity";
import Hydration from "./Hydration";
import Sleep from "./Sleep";

class User {
  constructor(userDetails) {
    this.id = userDetails.id;
    this.name = userDetails.name;
    this.address = userDetails.address;
    this.email = userDetails.email;
    this.strideLength = userDetails.strideLength;
    this.dailyStepGoal = userDetails.dailyStepGoal;
    this.friends = userDetails.friends;
    this.activities = []
    this.sleep = []
  }

  compileActivityRecord(activityDatabase) {
    this.activities = activityDatabase.filter(activity => activity.userID === this.id).map(activity => new Activity(activity))
  }

  compileSleepRecord(sleepDatabase) {
    this.sleep = sleepDatabase.filter(sleep => sleep.userID === this.id).map(sleep => new Sleep(sleep))
  }

  compileHydrationRecord(hydrationDatabase) {
    this.hydration = hydrationDatabase.filter(hydration => hydration.userID === this.id).map(hydration => new Hydration(hydration))
  }

  getFirstName() {
    console.log(this.name)
    return this.name.split(' ', 1).join();
  }
  getFriendsNames(userStorage) {
    return this.friends.map((friendId) => (userStorage.getDataFromID(friendId).name));
  }
}

export default User;
