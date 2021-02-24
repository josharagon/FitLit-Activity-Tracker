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

  getFirstName() {
    console.log(this.name)
    return this.name.split(' ', 1).join();
  }
  getFriendsNames(userStorage) {
    return this.friends.map((friendId) => (userStorage.getDataFromID(friendId).name));
  }
}

export default User;
