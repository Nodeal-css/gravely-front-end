const pb = new PocketBase('http://localhost:8090');

function isLoggedIn() {
  return pb.authStore?.isValid
}

function getSessionAdmin() {
  return pb.authStore?.model
}

function signin(user) {
  return pb.collection('admin').authWithPassword(
      user.username,
      user.password
  );
}

function updateAdmin(user) {
  return pb.collection('admin').update(user.id, user);
}

function signout() {
  pb.authStore?.clear();
}


/** 
  registerAdmin({  
    "username": "test_username1223",
    "email": "test1223@gmail.com",
    "emailVisibility": true,
    "password": "12345678",
    "passwordConfirm": "12345678",
    "firstname": "test",
    "lastname": "test",
    "mi": "tt"}, {   
      "name": "test",
      "address": "test",
      "tel1": "test",
      "tel2": "test",
      "contact": "test"
    }, {    
        "payment": 123,
        "status": "test",
      "expiry_date": "2022-01-01 10:00:00.123Z"
    }
  )
*/
function registerAdmin(user, cemetery, subscription) {
  return register(user)
    .then(function(data) {
      return signin(user)
    }).then(function(data) {
      return subscribe(subscription)
    }).then(function(data) {
      return createCemetery({...cemetery, subscription_id: data.id})
    }).then(function(data) {
      const {signinedUser, oldPassword } = user
      return updateAdmin({...signinedUser, id: pb.authStore?.model.id , cemetery_id: data.id})
        .then(function(data) {
          signout();
          return data;
        })
    });
}

function register(user) {
  return pb.collection('admin').create(user)
}

function subscribe(data) {
  return pb.collection('subscription').create(data);
}

function findMyCemetery() {
  return pb.collection('admin').getOne(pb.authStore?.model.id, {
    expand: 'cemetery_id'
  });
}

function createCemetery(cemetery) {
  return pb.collection('cemetery').create(cemetery);
}

function updateCemetery(cemetery) {
  const { id, ...data } = cemetery 
  return pb.collection('cemetery').update(cemetery.id, data);
}
