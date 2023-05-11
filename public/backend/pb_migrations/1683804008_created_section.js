migrate((db) => {
  const collection = new Collection({
    "id": "rb37sw8c7g84eu4",
    "created": "2023-05-11 11:20:08.002Z",
    "updated": "2023-05-11 11:20:08.002Z",
    "name": "section",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "ldf9h8nu",
        "name": "cemetery_id",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "collectionId": "0ydhrqqjnz19cfu",
          "cascadeDelete": true,
          "maxSelect": 1,
          "displayFields": []
        }
      },
      {
        "system": false,
        "id": "5cychsfv",
        "name": "grave_type_id",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "collectionId": "n813ozitszjkhkd",
          "cascadeDelete": false,
          "maxSelect": 1,
          "displayFields": []
        }
      },
      {
        "system": false,
        "id": "bkwsciiu",
        "name": "total_column",
        "type": "number",
        "required": false,
        "unique": false,
        "options": {
          "min": 0,
          "max": 100
        }
      },
      {
        "system": false,
        "id": "hyyslicq",
        "name": "total_row",
        "type": "number",
        "required": false,
        "unique": false,
        "options": {
          "min": 0,
          "max": 100
        }
      }
    ],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("rb37sw8c7g84eu4");

  return dao.deleteCollection(collection);
})
