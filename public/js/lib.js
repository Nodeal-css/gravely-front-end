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

function remove(collectionName, recordId) {
  return pb.collection(collectionName).delete(recordId)
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
  return pb.collection(ADMIN).create(user)
}
function subscribe(data) {
  return pb.collection(SUBSCRIPTION).create(data);
}
function findMyCemetery() {
  return pb.collection(ADMIN).getOne(pb.authStore?.model.id, {
    expand: 'cemetery_id'
  });
}
function createCemetery(cemetery) {
  return pb.collection(CEMETERY).create(cemetery);
}
function updateCemetery(cemetery) {
  const { id, ...data } = cemetery
  return pb.collection(CEMETERY).update(cemetery.id, data);
}
function updateAdmin(user) {
  return pb.collection(ADMIN).update(user.id, user);
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
  return pb.collection(ADMIN).getOne(pb.authStore?.model.id, {
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
        filters += "&&";
    }
    if (obj[key].trim() != '')
    filters += key + "?~" + "'"+obj[key] +"'";
  }
  return filters
}

//sample use
// search(DECEASED, 1, 100, { lastname: '', firstname: 'Jac'},  '-created,lastname,firstname', 'burial_type_id')
// remove(DECEASED, 'lfcb4wd34122c74').then(console.log)
// function doupload() {
//   let data = document.getElementById("file").files[0];
//   let formData = new FormData()
//   formData.append('file', data)
//   formData.append('deceased_id', 'mi292b2llkz8twn')
//   create(LEGAL_DOCUMENT, formData).then(console.log)
//   alert('your file has been uploaded');
// }

// For Payment
const CLIENT_ID = 'Aa-Czh3m-Jr9ISTCf7ye7HJWIAPrSPSe4NPERuwLOhb0qKvdnqiYuaVWsQj0in4CcgUtrFRfb6Ln2175'
const SECRET_KEY = 'ED6Qh_nB5l2wutveNxjbSIMfzAwdk2W-WdETOkuM0ZjgOXM_1bORUqF05EGW_bHtDMJL1ILG-HIHWbJn'
const PLAN_ID = 'P-36G65051UA968292WMQOUPLI' 
const RETURN_URL = 'http://localhost:3000/pages/successSub.html'
const CANCEL_URL = 'http://localhost:3000/pages/cancelledSub.html'
const AUTHORIZATION = btoa(`${CLIENT_ID}:${SECRET_KEY}`)

const resource = 'https://api-m.sandbox.paypal.com/v1/billing/subscriptions'


/** Subscribing for the plan
* @param subscriber: Information of the user who wants to subscribe the plan.
*   Example: {
*     name: { give_name: John, surname: Doe }
*     email_address: test@test.com
*     shipping_address: { // Optional
*       name: { full_name: John Doe }
*       address: {
*         address_line_1: 2211 N First Street
*         address_line_2: Building 17
*         admin_area_2: San Jose
*         admin_area_1: CA
*         postal_code: 95131
*         country_code: US
*       }
*     }
*   }
*
* @return response: Refer here: https://developer.paypal.com/docs/api/subscriptions/v1/#subscriptions-create-response
*/      
function subscribe (subscriber) {
  const ONE_HOUR = 3600
  const MILLISECONDS = 1000
  const ADVANCE_ONE_HOUR = Date.now() + ONE_HOUR * MILLISECONDS

  const body = JSON.stringify({
    plan_id: PLAN_ID,
    start_time: new Date(ADVANCE_ONE_HOUR),
    quantity: '1',
    subscriber: subscriber,
    application_context: {
      brand_name: 'Gravely',
      locale: 'en-US',
      user_action: 'SUBSCRIBE_NOW',
      payment_method: {
        payer_selected: 'PAYPAL',
        payee_preferred: 'UNRESTRICTED'
      },
      return_url: RETURN_URL,
      cancel_url: CANCEL_URL
    }
  })

  return fetch(resource, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${AUTHORIZATION}`,
      'Content-Type': 'application/json'
    },
    body: body
  }).then(function (response) { return response.json() })
}

/** Success on payment for subscription
*  Load this function on success payment page and document ready.
*
*  @return subscription_id: Unique subscription id
*  @return ba_token: Approval Token
*  @return token: Success Token
*/
function successPayment () {
  const query = new URLSearchParams(window.location.search)

  return {
    subscription_id: query.get('subscription_id'),
    ba_token: query.get('ba_token'),
    token: query.get('token')
  }
}

/** Cancel on payment for subscription
*  Load this function on cancel payment page and document ready.
*
*  @return subscription_id: Unique subscription id
*  @return ba_token: Approval Token
*  @return token: Cancel Token
*/

function cancelPayment () {
  const query = new URLSearchParams(window.location.search)

  return {
    subscription_id: query.get('subscription_id'),
    ba_token: query.get('ba_token'),
    token: query.get('token')
  }
}

