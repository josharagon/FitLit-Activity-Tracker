import Activity from "./Activity";

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
  }

  compileActivities(activityDatabase) {
    this.activities = activityDatabase.filter(activity => activity.userID === this.id).map(activity => new Activity(activity))
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
