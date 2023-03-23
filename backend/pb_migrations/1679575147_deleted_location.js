migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("od39z33t3izqwap");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "od39z33t3izqwap",
    "created": "2023-02-15 08:18:15.571Z",
    "updated": "2023-03-05 03:18:19.476Z",
    "name": "location",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "oqhi2tba",
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
        "id": "xmsfllxq",
        "name": "longitude",
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
        "id": "dvvxlkbw",
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
      }
    ],
    "listRule": "",
    "viewRule": "",
    "createRule": "",
    "updateRule": "",
    "deleteRule": "",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
})
