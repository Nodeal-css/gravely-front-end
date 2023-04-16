migrate((db) => {
  const collection = new Collection({
    "id": "pu2zew66nydcot5",
    "created": "2023-03-14 13:21:16.695Z",
    "updated": "2023-03-14 13:21:16.695Z",
    "name": "journal",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "z1pzzb6a",
        "name": "cemeter_id",
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
        "id": "8ai4rjqk",
        "name": "entry_date",
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
        "id": "7zshgh07",
        "name": "particular",
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
        "id": "odp1ejrz",
        "name": "debit",
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
        "id": "gi74ewky",
        "name": "credit",
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
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("pu2zew66nydcot5");

  return dao.deleteCollection(collection);
})
