import User from "./User";

class UserRepo {
  constructor(allData) {
    this.users = allData.userData.map((userInfo) => new User(userInfo, allData))
  };

  calculateAverageStepGoal() {
    return this.users.map(user => user.dailyStepGoal).reduce((total, goal) => total += goal, 0) / this.users.length;
  }
}

export default UserRepo;
