const pb = new PocketBase('http://localhost:8090');
const ADMIN = 'admin'
const BURIAL_TYPE = 'burial_type'
const CEMETERY = 'cemetery'
const CONTRACT = 'contract'
const DECEASED = 'deceased'
const GRAVE = 'grave'
const GRAVE_TYPE = 'grave_type'
const LEGAL_DOCUMENT = 'legal_document'
const MAP = 'map'
const POLYGON = 'polygon'
const SUBSCRIPTION = 'subscription'

function isLoggedIn() {
  return pb.authStore?.isValid
}

function getSessionAdmin() {
  return pb.authStore?.model
}

function create(collectionName, collection) {
  return pb.collection(collectionName).create(collection)
}

function update(collectionName, collection) {
  const { id, ... data } = collection 
  return pb.collection(collectionName).update(collection.id, data)
}

function signin(data) {
  return pb.collection(ADMIN).authWithPassword(
      data.username,
      data.password
  )
}

function signout() {
  pb.authStore?.clear()
}

/** 
  registerAdmin({  
    "username": "test_username1223",
    "email": "test_username1223@gmail.com"
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
  return create(ADMIN, user)
    .then(function(data) {
      return signin(user)
    }).then(function(data) {
      return create(SUBSCRIPTION, subscription)
    }).then(function(data) {
      return create(CEMETERY, {...cemetery, subscription_id: data.id})
    }).then(function(data) {
      const {signinedUser, oldPassword } = user
      return update(ADMIN, {...signinedUser, id: pb.authStore?.model.id , cemetery_id: data.id})
        .then(function(data) {
          signout()
          return data
        })
    });
}

function findMyCemetery() {
  return pb.collection('admin').getOne(pb.authStore?.model.id, {
    expand: 'cemetery_id'
  })
}
