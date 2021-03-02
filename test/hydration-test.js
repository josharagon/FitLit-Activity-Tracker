import { expect } from 'chai';
import Hydration from '../src/Hydration';
import UserRepo from '../src/User-repo';
import User from '../src/User';
import Activity from '../src/Activity';
import hydrationTestData from '../test_data/hydration-data';
import usersTestData from '../test_data/users-data';
import activityTestData from '../test_data/activity-data';


describe('Hydration', function() {
  let activityData = activityTestData;
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
  });

  it('should be a function', function() {
    expect(Hydration).to.be.a(`function`);
  });

  it(`should be an instance of Hydration`, function() {
    expect(hydration).to.be.an.instanceOf(Hydration);
  });

  describe('Should store information', function() {

      it('should store an array of hydration data', function() {
        expect(hydrationData).to.be.an('array');
      });

      it('should store a current user object', function() {
        expect(hydration.user).to.deep.equal(user1)
      });

      it('should store the most recent date', function() {

        expect(hydration.date).to.deep.equal(activity.activityData[0].date);
      });

      it('should store an array of users', function() {

        expect(hydration.userRepo.users).to.deep.equal(users)
      });
  });

  it('should take in a list of data', function() {


    expect(hydration.hydrationData[0].userID).to.deep.equal(1);
    expect(hydration.hydrationData[2].numOunces).to.deep.equal(1);
    expect(hydration.hydrationData[4].date).to.deep.equal('2018/10/23');
  });

  it('should find the average water intake per day for a user', function() {
    expect(hydration.calculateAverageOunces()).to.deep.equal(35);
  });

  it('should find the water intake for a user on a specified date', function() {

    expect(hydration.calculateDailyOunces()).to.deep.equal(37);
  });

  it('should find water intake by day for first week', function() {
    expect(hydration.calculateFirstWeekOunces()).to.deep.eql([ { '2019/06/15': 37 }, { '2018/06/16': 39 }, { '2016/08/22': 30 } ]);
    expect(hydration.calculateFirstWeekOunces()).to.deep.eql([ { '2019/06/15': 37 }, { '2018/06/16': 39 }, { '2016/08/22': 30 } ]);
  });

  it('should find any dataset property by key for a week', function() {

    expect(hydration.userDataForWeek('numOunces')).to.deep.eql([{x: '2019/06/15', y: 37}, {x: '2018/06/16', y: 39 }, {x: '2016/08/22', y: 30}]);
  
  });
  // ---marked for deletion
  // it('should find the quantity of oz. drank in any week', function() {
  //   console.log(hydration.calculateRandomWeekOunces())
  //   expect(hydration.calculateRandomWeekOunces()).to.deep.eql('2019/09/18: 40');
  // expect(hydration.calculateRandomWeekOunces('2018/02/01', 4, userRepo)[6]).to.eql('2019/09/16: 30');
  //this is failing because it doesn't exist, need a failure case
  //})
  //day of hydration should not include user 2 or user 1 on August 22
  //week of hydration should not include user 4 not during the week

});
