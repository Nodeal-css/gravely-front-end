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

function signout() {
  pb.authStore?.clear();
}

function register(user) {
  return pb.collection('admin').create(user);
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
