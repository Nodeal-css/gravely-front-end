const pb = new PocketBase('http://localhost:8090');

function signin(user) {
  return pb.collection('admin').authWithPassword(
      user.username,
      user.password
  )
}

function signout() {
  pb.authStore.clear();
}

function findMyCemetery() {
  return pb.collection('admin').getOne(pb.authStore.model.id, {
    expand: 'cemetery_id'
  });
}