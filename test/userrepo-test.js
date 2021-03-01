import { expect } from 'chai';
import Hydration from '../src/Hydration';
import UserRepo from '../src/User-repo';
import User from '../src/User';
import Activity from '../src/Activity';
import Sleep from '../src/Sleep';
import hydrationTestData from '../test_data/hydration-data';
import usersTestData from '../test_data/users-data';
import activityTestData from '../test_data/activity-data';
import sleepTestData from '../test_data/sleep-data';


describe('UserRepo', function() {
  const sleepData = sleepTestData;
  const activityData = activityTestData;
  let activity;
  let hydrationData;
  let hydration;
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
    activity = new Activity(activityData, activityData[0].date, user1, userRepo)
    hydration = new Hydration(hydrationTestData, user1, activity.activityData[0].date, userRepo);
    hydrationData = hydration.hydrationData;
    sleep = new Sleep(sleepData, user1, sleepData[0].date, userRepo);
  });

  describe('should store information', function() {

    it('takes an array of user data', function() {

      expect(userRepo.users).to.include(user2);
    });

    it('should have a parameter to take in user data', function() {

    expect(userRepo.users[0].id).to.deep.equal(1);
    });

    it('should have a current user', function() {

    expect(userRepo.currentUser).to.deep.equal(user1);
    });

    it('should store the average step goal of all users', function() {

    expect(userRepo.averageAllStepGoals).to.deep.equal(18600);
    });
  });
  it('should return user data when given user ID', function() {

    expect(userRepo.getDataFromID(1)).to.deep.eql(user1);
    expect(userRepo.getDataFromID(2)).to.deep.eql(user2);
  });
  //FUNCTION BELOW May be UNUSED-- found a workaround
  it('should return the average of all users step goals', function() {

    userRepo.calculateAverageStepGoal();

    expect(userRepo.calculateAverageStepGoal()).to.deep.eql(18600);
  });

  describe('array prototype methods', function() {

    it('should get a users data from its userID in any data set', function() {
      expect(userRepo.getDataFromUserID(1, hydrationData)).to.eql([{
          "userID": 1,
          "date": "2019/06/15",
          "numOunces": 37
        },
        {
          "userID": 1,
          "date": "2018/06/16",
          "numOunces": 39
        },
        {
          "userID": 1,
          "date": "2016/08/22",
          "numOunces": 30
        }
      ]);
    });

    it('should sort data by id and return users', function() {

      expect(userRepo.makeSortedUserArray(4, hydrationData)).to.deep.eql(
        [
          { userID: 4, date: '2019/09/20', numOunces: 40 },
          { userID: 4, date: '2019/09/19', numOunces: 30 },
          { userID: 4, date: '2019/09/18', numOunces: 40 },
          { userID: 4, date: '2019/09/17', numOunces: 40 },
          { userID: 4, date: '2019/09/16', numOunces: 30 },
          { userID: 4, date: '2019/09/15', numOunces: 30 },
          { userID: 4, date: '2019/04/15', numOunces: 36 },
          { userID: 4, date: '2019/03/15', numOunces: 35 },
          { userID: 4, date: '2018/02/01', numOunces: 28 }
        ]
      );
    });

    it('should get a users most recent date using the app', function() {

      expect(userRepo.getToday(4, hydrationData)).to.eql("2019/09/20");
    });

    it('should sort data by date and extract its week', function() {

      expect(userRepo.getFirstWeek(4, hydrationData)[3].date).to.deep.eql("2019/09/17");
    });

    it('should get a sorted week of data for a single user from a date', function() {
      expect(userRepo.getWeekFromDate('2019/09/17', 4, hydrationData)[3].date).to.eql("2019/04/15");
      expect(userRepo.getWeekFromDate('2019/09/18', 4, hydrationData)[3].date).to.eql("2019/09/15");
    });

    it('should get a week of data for all users in data set', function() {

      expect(userRepo.chooseWeekDataForAllUsers(hydrationData, '2019/09/17')[2].date).to.eql("2019/09/15");
      expect(userRepo.chooseWeekDataForAllUsers(hydrationData, '2019/09/17')[2].userID).to.eql(4);
    });
    //FUNCTION BELOW May be UNUSED-- found a workaround
    it('should get a day of data for all users in data set', function() {
      expect(userRepo.chooseDayDataForAllUsers(sleepData, '2019/06/15')[0].date).to.eql('2019/06/15');
      expect(userRepo.chooseDayDataForAllUsers(sleepData, '2019/06/15')[0].hoursSlept).to.eql(9);
      expect(userRepo.chooseDayDataForAllUsers(sleepData, '2019/06/15')[2].date).to.eql('2019/06/15');
      expect(userRepo.chooseDayDataForAllUsers(sleepData, '2019/06/15')[2].userID).to.eql(5);
    });

    it('should isolate a user ID and its values of any relevant data', function() {
      expect(userRepo.isolateUsernameAndRelevantData(sleepData, "2019/06/21", 'sleepQuality', userRepo.chooseWeekDataForAllUsers(sleepData, "2019/06/21"))).to.eql({
        '2': [3.5, 4, 3.3, 3.6, 3.6, 4, 3.1],
        '4': [3.5, 4, 1.3, 1.6, 1.6, 1, 3.1],
        '5': [4, 4, 4, 4, 4, 4, 4]
      });

      expect(userRepo.isolateUsernameAndRelevantData(hydrationData, "2019/05/09", 'numOunces', userRepo.chooseWeekDataForAllUsers(hydrationData, "2019/05/09"))).to.eql({
        '3': [1]
      })
    });

    it('should rank user ids according to relevant data value averages', function() {

      expect(userRepo.rankUserIDsbyRelevantDataValue(sleepData, "2019/06/21", 'sleepQuality', userRepo.chooseWeekDataForAllUsers(sleepData, "2019/06/21"))).to.eql(['5', '2', '4'])
    });

    it('should show list in order of userID and average of relevant value', function() {

      expect(userRepo.combineRankedUserIDsAndAveragedData(sleepData, "2019/06/21", 'sleepQuality', userRepo.chooseWeekDataForAllUsers(sleepData, "2019/06/21"))[0]).to.eql({
        '5': 4});
    });
  });
});
