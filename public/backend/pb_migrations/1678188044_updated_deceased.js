migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4s53ijg6jrj3345")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "5ugvkxrv",
    "name": "burial_type_id",
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
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4s53ijg6jrj3345")

  // update
  collection.schema.addField(new SchemaField({
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
  }))

  return dao.saveCollection(collection)
})
