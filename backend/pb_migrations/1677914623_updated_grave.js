migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("f3pham7ghwlh64h")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "al6a6ody",
    "name": "location_id",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "od39z33t3izqwap",
      "cascadeDelete": false,
      "maxSelect": 1,
      "displayFields": [
        "id"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("f3pham7ghwlh64h")

  // update
  collection.schema.addField(new SchemaField({
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
  }))

  return dao.saveCollection(collection)
})
