const pb = new PocketBase('http://localhost:8090');

// Table Names
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

/** CHeck if user is authenticated
 * 
 * @returns boolean true or false
 */
function isLoggedIn() {
  return pb.authStore?.isValid
}

/** Getting the session of current logged admin
 * 
 * @returns Collection of Admin
 */
function getSessionAdmin() {
  return pb.authStore?.model
}

/** Creation of collection in database table
 * 
 * @param {*} collectionName 
 *  - The database table name.
 * @param {*} collection 
 *  - The fields in the database table.
 * @returns
 *  Ok
 *    - Collection from the database table
 *  Bad request
 *    - Something error in fields or table contraints.
 *    Reponse {
 *     "code": 400,
 *     "message": "Failed to create record.",
 *     "data": {
 *       [FIELD_NAME]: {
 *          "code": "validation_required",
 *          "message": "Missing required value."
 *        }
 *      }
 *    }
 *  Forbidden
 *    - Dont have any access or authorization.
 *    Reponse {
 *     "code": 403,
 *     "message": "Only admins can access this action.",
 *     "data": {}
 *    }
 *  Not found
 *    - No collection or api found.
 *    Reponse {
 *     "code": 404,
 *     "message": "The requested resource wasn't found. Missing collection context.",
 *     "data": {}
 *    }
 */
function create(collectionName, collection) {
  return pb.collection(collectionName).create(collection)
}


/** Creation of collection in database table
 * @param {*} collectionName 
 *  - The database table name.
 * @param {*} collection 
 *  - The fields in the database table.
 * @returns
 *  Ok
 *    - Collection from the database table
 *  Bad request
 *    - Something error in fields or table contraints.
 *    Reponse {
 *     "code": 400,
 *     "message": "Failed to create record.",
 *     "data": {
 *       [FIELD_NAME]: {
 *          "code": "validation_required",
 *          "message": "Missing required value."
 *        }
 *      }
 *    }
 *  Forbidden
 *    - Dont have any access or authorization.
 *    Reponse {
 *     "code": 403,
 *     "message": "Only admins can access this action.",
 *     "data": {}
 *    }
 *  Not found
 *    - No collection or api found.
 *    Reponse {
 *     "code": 404,
 *     "message": "The requested resource wasn't found. Missing collection context.",
 *     "data": {}
 *    }
 */
function update(collectionName, collection) {
  const { id, ... data } = collection 
  return pb.collection(collectionName).update(collection.id, data)
}

/** Signin
 * 
 * @param {*} data
 *  - Object containing username and password
 *  {
 *    username: string;
 *    password: string;
 *  }
 * @returns 
 *  Ok
 *  Response {
 *   "token": [JWT token],
 *   "record": {
 *     "id": "8171022dc95a4ed",
 *     "username": "test_username1223",
 *     "email": "test_username1223@gmail.com"
 *     "emailVisibility": true,
 *     "firstname": "test",
 *     "lastname": "test",
 *     "mi": "tt"
 *   }
 *  }
 */
function signin(data) {
  return pb.collection(ADMIN).authWithPassword(
      data.username,
      data.password
  )
}

// Clearing out the session
function signout() {
  pb.authStore?.clear()
}

function register_acc(user) {
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
function updateAdmin(user) {
  return pb.collection('admin').update(user.id, user);
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
  return register_acc(user).then(function(data) {
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

function findMyCemetery() {
  return pb.collection('admin').getOne(pb.authStore?.model.id, {
    expand: 'cemetery_id'
  })
}

function search(collectionName, page=1, perPage=500, query={}, sortBy='', expand='') {
  let params = objectToParams(query)
  let filters = {}
  if (query) {
    filters = {
      filter: params
    }
  }
  if (sortBy) {
    filters = {
      ...filters,
      sort: sortBy
    }
  }
  if (expand) {
    filters = {
      ...filters,
      expand: expand
    }
  }
  return pb.collection(collectionName).getList(page, perPage, filters)
}

function objectToParams(obj) {
  let filters = ''
  for (let key in obj) {
    if (filters != '' && obj[key].trim() != '') {
        filters += "&";
    }
    if (obj[key].trim() != '')
    filters += key + "?~" + "'"+obj[key] +"'";
  }
  return filters
}
//sample use
// search(DECEASED, 1, 100, { lastname: 'John', firstname: ''},  '-created,lastname,firstname', 'burial_type_id')