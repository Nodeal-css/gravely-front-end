migrate((db) => {
  const snapshot = [
    {
      "id": "_pb_users_auth_",
      "created": "2023-02-10 10:56:49.720Z",
      "updated": "2023-02-21 10:10:47.887Z",
      "name": "admin",
      "type": "auth",
      "system": false,
      "schema": [
        {
          "system": false,
          "id": "cjjchf7b",
          "name": "firstname",
          "type": "text",
          "required": true,
          "unique": false,
          "options": {
            "min": 1,
            "max": 60,
            "pattern": ""
          }
        },
        {
          "system": false,
          "id": "7easifye",
          "name": "lastname",
          "type": "text",
          "required": true,
          "unique": false,
          "options": {
            "min": 1,
            "max": 60,
            "pattern": ""
          }
        },
        {
          "system": false,
          "id": "1ggklhvy",
          "name": "mi",
          "type": "text",
          "required": false,
          "unique": false,
          "options": {
            "min": 1,
            "max": 2,
            "pattern": ""
          }
        },
        {
          "system": false,
          "id": "zxi8rxlt",
          "name": "cemetery_id",
          "type": "relation",
          "required": false,
          "unique": false,
          "options": {
            "collectionId": "0ydhrqqjnz19cfu",
            "cascadeDelete": false,
            "maxSelect": 1,
            "displayFields": [
              "id"
            ]
          }
        }
      ],
      "listRule": "@request.auth.id = id",
      "viewRule": "@request.auth.id = id",
      "createRule": "",
      "updateRule": "@request.auth.id = id",
      "deleteRule": "",
      "options": {
        "allowEmailAuth": true,
        "allowOAuth2Auth": true,
        "allowUsernameAuth": true,
        "exceptEmailDomains": null,
        "manageRule": null,
        "minPasswordLength": 8,
        "onlyEmailDomains": null,
        "requireEmail": false
      }
    },
    {
      "id": "0ydhrqqjnz19cfu",
      "created": "2023-02-14 01:20:47.792Z",
      "updated": "2023-02-21 10:10:47.888Z",
      "name": "cemetery",
      "type": "base",
      "system": false,
      "schema": [
        {
          "system": false,
          "id": "iujn33wc",
          "name": "name",
          "type": "text",
          "required": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null,
            "pattern": ""
          }
        },
        {
          "system": false,
          "id": "84bdbfam",
          "name": "address",
          "type": "text",
          "required": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null,
            "pattern": ""
          }
        },
        {
          "system": false,
          "id": "nwxnrvak",
          "name": "tel1",
          "type": "text",
          "required": false,
          "unique": false,
          "options": {
            "min": 1,
            "max": 15,
            "pattern": ""
          }
        },
        {
          "system": false,
          "id": "zjfmzcra",
          "name": "tel2",
          "type": "text",
          "required": false,
          "unique": false,
          "options": {
            "min": 1,
            "max": 15,
            "pattern": ""
          }
        },
        {
          "system": false,
          "id": "d6wv0jog",
          "name": "contact",
          "type": "text",
          "required": false,
          "unique": false,
          "options": {
            "min": 1,
            "max": 12,
            "pattern": ""
          }
        },
        {
          "system": false,
          "id": "zxrapzyt",
          "name": "subscription_id",
          "type": "relation",
          "required": false,
          "unique": false,
          "options": {
            "collectionId": "nzrzumxmlvved6x",
            "cascadeDelete": false,
            "maxSelect": 1,
            "displayFields": [
              "id"
            ]
          }
        }
      ],
      "listRule": " id = @request.auth.cemetery_id && @request.auth.id ?= @collection.admin.id",
      "viewRule": "id = @request.auth.cemetery_id && @request.auth.id ?= @collection.admin.id",
      "createRule": "@request.auth.id != \"\" && @request.data.subscription_id ?= @collection.subscription.id",
      "updateRule": "@request.auth.id != \"\" && @request.data.subscription_id ?= @collection.subscription.id",
      "deleteRule": null,
      "options": {}
    },
    {
      "id": "nzrzumxmlvved6x",
      "created": "2023-02-15 08:11:00.998Z",
      "updated": "2023-02-21 10:10:47.889Z",
      "name": "subscription",
      "type": "base",
      "system": false,
      "schema": [
        {
          "system": false,
          "id": "3q9bcv7e",
          "name": "payment",
          "type": "number",
          "required": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null
          }
        },
        {
          "system": false,
          "id": "oyvvsjpx",
          "name": "status",
          "type": "text",
          "required": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null,
            "pattern": ""
          }
        },
        {
          "system": false,
          "id": "ls20lwmz",
          "name": "expiry_date",
          "type": "date",
          "required": false,
          "unique": false,
          "options": {
            "min": "",
            "max": ""
          }
        }
      ],
      "listRule": null,
      "viewRule": null,
      "createRule": "",
      "updateRule": "",
      "deleteRule": null,
      "options": {}
    },
    {
      "id": "f3pham7ghwlh64h",
      "created": "2023-02-15 08:12:43.305Z",
      "updated": "2023-02-21 10:10:47.889Z",
      "name": "grave",
      "type": "base",
      "system": false,
      "schema": [
        {
          "system": false,
          "id": "8dm9oemj",
          "name": "cemetery_id",
          "type": "relation",
          "required": false,
          "unique": false,
          "options": {
            "collectionId": "0ydhrqqjnz19cfu",
            "cascadeDelete": false,
            "maxSelect": 1,
            "displayFields": [
              "id"
            ]
          }
        },
        {
          "system": false,
          "id": "klhyr5kk",
          "name": "deceased_id",
          "type": "relation",
          "required": false,
          "unique": false,
          "options": {
            "collectionId": "4s53ijg6jrj3345",
            "cascadeDelete": false,
            "maxSelect": 1,
            "displayFields": [
              "id"
            ]
          }
        },
        {
          "system": false,
          "id": "nagpkb8e",
          "name": "contract_id",
          "type": "relation",
          "required": false,
          "unique": false,
          "options": {
            "collectionId": "j6iaz50tjdree0d",
            "cascadeDelete": false,
            "maxSelect": 1,
            "displayFields": [
              "id"
            ]
          }
        },
        {
          "system": false,
          "id": "al6a6ody",
          "name": "map_id",
          "type": "relation",
          "required": false,
          "unique": false,
          "options": {
            "collectionId": "nfhldd49bkwqia9",
            "cascadeDelete": false,
            "maxSelect": 1,
            "displayFields": [
              "id"
            ]
          }
        },
        {
          "system": false,
          "id": "u3ghceun",
          "name": "grave_type",
          "type": "relation",
          "required": false,
          "unique": false,
          "options": {
            "collectionId": "n813ozitszjkhkd",
            "cascadeDelete": false,
            "maxSelect": 1,
            "displayFields": [
              "id"
            ]
          }
        },
        {
          "system": false,
          "id": "caipl5m4",
          "name": "location_description",
          "type": "text",
          "required": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null,
            "pattern": ""
          }
        },
        {
          "system": false,
          "id": "pc0ougrx",
          "name": "place",
          "type": "text",
          "required": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null,
            "pattern": ""
          }
        },
        {
          "system": false,
          "id": "wcv37jom",
          "name": "status",
          "type": "text",
          "required": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null,
            "pattern": ""
          }
        }
      ],
      "listRule": null,
      "viewRule": null,
      "createRule": null,
      "updateRule": null,
      "deleteRule": null,
      "options": {}
    },
    {
      "id": "j6iaz50tjdree0d",
      "created": "2023-02-15 08:14:53.789Z",
      "updated": "2023-02-21 10:10:47.890Z",
      "name": "contract",
      "type": "base",
      "system": false,
      "schema": [
        {
          "system": false,
          "id": "oy7whgt3",
          "name": "fname",
          "type": "text",
          "required": false,
          "unique": false,
          "options": {
            "min": 1,
            "max": 60,
            "pattern": ""
          }
        },
        {
          "system": false,
          "id": "yz8cvxvz",
          "name": "lname",
          "type": "text",
          "required": false,
          "unique": false,
          "options": {
            "min": 1,
            "max": 60,
            "pattern": ""
          }
        },
        {
          "system": false,
          "id": "b7xg9rgx",
          "name": "mi",
          "type": "text",
          "required": false,
          "unique": false,
          "options": {
            "min": 1,
            "max": 2,
            "pattern": ""
          }
        },
        {
          "system": false,
          "id": "vsije433",
          "name": "date",
          "type": "date",
          "required": false,
          "unique": false,
          "options": {
            "min": "",
            "max": ""
          }
        },
        {
          "system": false,
          "id": "i5obztln",
          "name": "address",
          "type": "text",
          "required": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null,
            "pattern": ""
          }
        },
        {
          "system": false,
          "id": "1zrlnwko",
          "name": "tel",
          "type": "text",
          "required": false,
          "unique": false,
          "options": {
            "min": 1,
            "max": 20,
            "pattern": ""
          }
        }
      ],
      "listRule": null,
      "viewRule": null,
      "createRule": null,
      "updateRule": null,
      "deleteRule": null,
      "options": {}
    },
    {
      "id": "od39z33t3izqwap",
      "created": "2023-02-15 08:18:15.571Z",
      "updated": "2023-02-21 10:10:47.890Z",
      "name": "polygon",
      "type": "base",
      "system": false,
      "schema": [
        {
          "system": false,
          "id": "oqhi2tba",
          "name": "lat_a",
          "type": "number",
          "required": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null
          }
        },
        {
          "system": false,
          "id": "xmsfllxq",
          "name": "lng_a",
          "type": "number",
          "required": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null
          }
        },
        {
          "system": false,
          "id": "cskrrlzi",
          "name": "lat_b",
          "type": "number",
          "required": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null
          }
        },
        {
          "system": false,
          "id": "ku2pvkvl",
          "name": "lng_b",
          "type": "number",
          "required": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null
          }
        },
        {
          "system": false,
          "id": "bubfxs6r",
          "name": "lat_c",
          "type": "number",
          "required": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null
          }
        },
        {
          "system": false,
          "id": "adq270hv",
          "name": "lng_c",
          "type": "number",
          "required": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null
          }
        },
        {
          "system": false,
          "id": "8nyle0v7",
          "name": "lat_d",
          "type": "number",
          "required": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null
          }
        },
        {
          "system": false,
          "id": "w7j8hjlj",
          "name": "lng_d",
          "type": "number",
          "required": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null
          }
        }
      ],
      "listRule": null,
      "viewRule": null,
      "createRule": null,
      "updateRule": null,
      "deleteRule": null,
      "options": {}
    },
    {
      "id": "nfhldd49bkwqia9",
      "created": "2023-02-15 08:19:08.382Z",
      "updated": "2023-02-21 10:10:47.891Z",
      "name": "map",
      "type": "base",
      "system": false,
      "schema": [
        {
          "system": false,
          "id": "3bwip1bq",
          "name": "address",
          "type": "text",
          "required": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null,
            "pattern": ""
          }
        },
        {
          "system": false,
          "id": "wdw9o3yi",
          "name": "latitude",
          "type": "number",
          "required": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null
          }
        },
        {
          "system": false,
          "id": "u1cio0ip",
          "name": "longitude",
          "type": "number",
          "required": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null
          }
        }
      ],
      "listRule": null,
      "viewRule": null,
      "createRule": null,
      "updateRule": null,
      "deleteRule": null,
      "options": {}
    },
    {
      "id": "n813ozitszjkhkd",
      "created": "2023-02-15 08:19:42.604Z",
      "updated": "2023-02-21 10:10:47.891Z",
      "name": "grave_type",
      "type": "base",
      "system": false,
      "schema": [
        {
          "system": false,
          "id": "vxfp22rq",
          "name": "type",
          "type": "text",
          "required": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null,
            "pattern": ""
          }
        },
        {
          "system": false,
          "id": "ug4t1f6n",
          "name": "rule",
          "type": "text",
          "required": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null,
            "pattern": ""
          }
        }
      ],
      "listRule": null,
      "viewRule": null,
      "createRule": null,
      "updateRule": null,
      "deleteRule": null,
      "options": {}
    },
    {
      "id": "5regl62nrrpmoih",
      "created": "2023-02-15 08:21:35.323Z",
      "updated": "2023-02-21 10:10:47.891Z",
      "name": "burial_type",
      "type": "base",
      "system": false,
      "schema": [
        {
          "system": false,
          "id": "bktzkxdr",
          "name": "type",
          "type": "text",
          "required": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null,
            "pattern": ""
          }
        },
        {
          "system": false,
          "id": "i3bdtvjb",
          "name": "cost",
          "type": "number",
          "required": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null
          }
        }
      ],
      "listRule": null,
      "viewRule": null,
      "createRule": null,
      "updateRule": null,
      "deleteRule": null,
      "options": {}
    },
    {
      "id": "4s53ijg6jrj3345",
      "created": "2023-02-15 08:24:31.804Z",
      "updated": "2023-02-21 10:10:47.891Z",
      "name": "deceased",
      "type": "base",
      "system": false,
      "schema": [
        {
          "system": false,
          "id": "kpadcihh",
          "name": "lastname",
          "type": "text",
          "required": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null,
            "pattern": ""
          }
        },
        {
          "system": false,
          "id": "pnlbejga",
          "name": "firstname",
          "type": "text",
          "required": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null,
            "pattern": ""
          }
        },
        {
          "system": false,
          "id": "99d20tpg",
          "name": "mi",
          "type": "text",
          "required": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null,
            "pattern": ""
          }
        },
        {
          "system": false,
          "id": "0m7ygwfp",
          "name": "date_birth",
          "type": "date",
          "required": false,
          "unique": false,
          "options": {
            "min": "",
            "max": ""
          }
        },
        {
          "system": false,
          "id": "mbhkxcfr",
          "name": "date_death",
          "type": "date",
          "required": false,
          "unique": false,
          "options": {
            "min": "",
            "max": ""
          }
        },
        {
          "system": false,
          "id": "xnjkgnmn",
          "name": "date_burial",
          "type": "date",
          "required": false,
          "unique": false,
          "options": {
            "min": "",
            "max": ""
          }
        },
        {
          "system": false,
          "id": "hauf5x6g",
          "name": "cause_of_death",
          "type": "text",
          "required": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null,
            "pattern": ""
          }
        },
        {
          "system": false,
          "id": "e1my0tpy",
          "name": "memorial",
          "type": "text",
          "required": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null,
            "pattern": ""
          }
        },
        {
          "system": false,
          "id": "murouwqc",
          "name": "image",
          "type": "file",
          "required": false,
          "unique": false,
          "options": {
            "maxSelect": 1,
            "maxSize": 5242880,
            "mimeTypes": [],
            "thumbs": []
          }
        },
        {
          "system": false,
          "id": "5ugvkxrv",
          "name": "burial_type",
          "type": "relation",
          "required": false,
          "unique": false,
          "options": {
            "collectionId": "5regl62nrrpmoih",
            "cascadeDelete": false,
            "maxSelect": 1,
            "displayFields": [
              "id"
            ]
          }
        }
      ],
      "listRule": null,
      "viewRule": null,
      "createRule": null,
      "updateRule": null,
      "deleteRule": null,
      "options": {}
    },
    {
      "id": "iot5o9pnskreoi3",
      "created": "2023-02-15 08:25:27.410Z",
      "updated": "2023-02-21 10:17:09.310Z",
      "name": "legal_document",
      "type": "base",
      "system": false,
      "schema": [
        {
          "system": false,
          "id": "omip4yns",
          "name": "deceased_id",
          "type": "relation",
          "required": false,
          "unique": false,
          "options": {
            "collectionId": "4s53ijg6jrj3345",
            "cascadeDelete": false,
            "maxSelect": 1,
            "displayFields": [
              "id"
            ]
          }
        },
        {
          "system": false,
          "id": "2epffuct",
          "name": "file",
          "type": "file",
          "required": false,
          "unique": false,
          "options": {
            "maxSelect": 1,
            "maxSize": 5242880,
            "mimeTypes": [],
            "thumbs": []
          }
        },
        {
          "system": false,
          "id": "2eqxc5q0",
          "name": "date_added",
          "type": "date",
          "required": false,
          "unique": false,
          "options": {
            "min": "",
            "max": ""
          }
        }
      ],
      "listRule": null,
      "viewRule": null,
      "createRule": null,
      "updateRule": null,
      "deleteRule": null,
      "options": {}
    }
  ];

  const collections = snapshot.map((item) => new Collection(item));

  return Dao(db).importCollections(collections, true, null);
}, (db) => {
  return null;
})
