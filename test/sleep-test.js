import { expect } from 'chai';
import sleepTestData from '../test_data/sleep-data';
import usersTestData from '../test_data/users-data';
import Sleep from '../src/Sleep';
import UserRepo from '../src/User-repo';
import User from '../src/User';

describe('Sleep', function() {
  const sleepData = sleepTestData;
  let users = usersTestData;
  let userRepo;
  let sleep;
  let user1;
  let user2;
  let user3;
  let user4;
  let user5;

  beforeEach(function() {
    user1 = new User(users[0]);
    user2 = new User(users[1]);
    user3 = new User(users[2]);
    user4 = new User(users[3]);
    user5 = new User(users[4]);
    users = [user1, user2, user3, user4, user5];
    userRepo = new UserRepo(users, user1);
    sleep = new Sleep(sleepData, user1, sleepData[0].date, userRepo);
  });

  describe('Data Storage', function() {

    it('should hold a user\'s ID', () => {

      expect(sleep.sleepData[1].userID).to.deep.equal(2);
      expect(sleep.sleepData[4].userID).to.deep.equal(1);
    });

    it('should have a date', () => {

      expect(sleep.sleepData[1].date).to.deep.equal("2017/06/15");
      expect(sleep.sleepData[7].date).to.deep.equal('2018/07/23');
    });

    it('should keep the hours slept', () => {

      expect(sleep.sleepData[3].hoursSlept).to.deep.equal(5.4);
      expect(sleep.sleepData[2].hoursSlept).to.deep.equal(2);
    });

    it('should hold the sleep quality', () => {

      expect(sleep.sleepData[6].sleepQuality).to.deep.equal(3);
      expect(sleep.sleepData[4].sleepQuality).to.deep.equal(3.6);
    });
  });

  it('should find the average sleep hours per day for a user', function() {

    expect(sleep.calculateAverageSleep()).to.deep.equal(7);
  });

  it('should find the average sleep quality per day for a user', function() {

    expect(sleep.calculateAverageSleepQuality()).to.deep.equal(2);
  });

  it('should find the sleep hours for a user on a specified date', function() {

    expect(sleep.calculateDailySleep()).to.deep.equal(6.1);
  });

  it('should find the sleep quality for a user on a specified date', function() {

    expect(sleep.calculateDailySleepQuality()).to.deep.equal(2.2);
  });

  it('should find hours slept over the past week, returning data in chart coordinate form', function() {

    expect(sleep.userDataForWeek('hoursSlept')).to.deep.equal([{x: '2017/06/15', y: 6.1}]);
  });

  it('should find sleep quality for each day over the last week, returning data in chart coordinate form', function() {

    expect(sleep.userDataForWeek('sleepQuality')).to.deep.eql([{x: '2017/06/15', y: 2.2}]);
  });

  it('should find average sleep quality for all users for all time', function() {

    expect(sleep.calculateAllUserSleepQuality()).to.deep.eql(2.98);
  });

  // it('should determine the best quality sleepers for a week', function() {
  //
  //   expect(sleep.determineBestSleepers("2019/06/21", userRepo)).to.eql(["Allie McCarthy", "Bugs Bunny"]);
  // })
  // it('should return person with best quality sleep for the week', function() {
  //
  //   expect(sleep.determineSleepWinnerForWeek("2019/06/21", userRepo)).to.eql(["Bugs Bunny"]);
  // })
  // it('should return all qualifying users if best quality sleep is a tie', function() {
  //   sleepData = sleepData.push({
  //     "userID": 6,
  //     "date": "2019/06/15",
  //     "hoursSlept": 9,
  //     "sleepQuality": 4
  //   })
  //   let user6 = new User({
  //     id: 6,
  //     name: "Richmond",
  //     address: "1234 Looney Street, Denver CO 80301-1697",
  //     email: "BugsB1@hotmail.com",
  //     strideLength: 3.8,
  //     dailyStepGoal: 7000,
  //     friends: [1, 2, 3]
  //   });
  //   users = [user1, user2, user3, user4, user5, user6];
  //   userRepo = new UserRepo(users);
  //
  //   expect(sleep.determineSleepWinnerForWeek("2019/06/21", userRepo)).to.eql(["Bugs Bunny", "Richmond"]);
  // })

  // it('should return person with longest sleep for the day', function() {
  //
  //   expect(sleep.determineSleepHoursWinnerForDay('2019/06/21', userRepo)).to.eql(["Bugs Bunny"]);
  // })
  // it.skip('should return all qualifying users if longest sleep is a tie', function() {
  //   sleepData = sleepData.push({
  //     "userID": 6,
  //     "date": "2019/06/21",
  //     "hoursSlept": 9,
  //     "sleepQuality": 4
  //   })
  //   let user6 = new User({
  //     id: 6,
  //     name: "Richmond",
  //     address: "1234 Looney Street, Denver CO 80301-1697",
  //     email: "BugsB1@hotmail.com",
  //     strideLength: 3.8,
  //     dailyStepGoal: 7000,
  //     friends: [1, 2, 3]
  //   });
  //   users = [user1, user2, user3, user4, user5, user6];
  //   userRepo = new UserRepo(users);
  //
  //   expect(sleep.determineSleepHoursWinnerForDay('2019/06/21', userRepo)).to.eql(["Bugs Bunny", "Richmond"]);
  // })
  //make this test fail when user is NOT best in week
});
