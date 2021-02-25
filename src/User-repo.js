import User from "./User";

class UserRepo {
  constructor(allData) {
    this.users = allData.userData.map((userInfo) => new User(userInfo, allData))
  };
}

export default UserRepo;
