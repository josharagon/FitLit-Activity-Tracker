import { expect } from 'chai';
import usersTestData from '../test_data/users-data';
import UserRepo from '../src/User-repo';
import User from '../src/User';

describe.only('User', function() {
  let users = usersTestData;
  let userRepo;
  let sleep;
  let user;
  let user2;
  let user3;
  let user4;
  let user5;

  beforeEach(function() {
    user = new User(users[0]);
    user2 = new User(users[1]);
    user3 = new User(users[2]);
    user4 = new User(users[3]);
    user5 = new User(users[4]);
    users = [user, user2, user3, user4, user5];
    userRepo = new UserRepo(users, user);
  });

  it('should be a function', function() {

    expect(User).to.be.a('function');
  });

  it('should be an instance of User', function() {

    expect(user).to.be.an.instanceof(User);
  });

  it('should take a user data object', function() {

    expect(user.dailyStepGoal).to.deep.equal(10000);
    expect(user.friends).to.deep.equal([2, 3, 4]);
    expect(user.id).to.deep.equal(1);
    expect(user.name).to.deep.equal("Alex Roth");
  });

  it('should take a different user data object', function() {

    expect(user2.dailyStepGoal).to.deep.equal(9000);
    expect(user2.friends).to.deep.equal([1, 3, 4]);
    expect(user2.id).to.deep.equal(2);
    expect(user2.name).to.deep.equal("Allie McCarthy");
  });

  it('should return user first name', function() {

    expect(user2.getFirstName()).to.deep.equal("Allie");
    expect(user.getFirstName()).to.deep.equal("Alex");
  });

  it('should return list of friend names from user repository', function() {

    expect(user.getFriendsNames(userRepo)).to.deep.equal(['Allie McCarthy', 'The Rock', 'Rainbow Dash']);
    expect(user2.getFriendsNames(userRepo)).to.deep.equal(['Alex Roth', 'The Rock', 'Rainbow Dash']);
  });
});
