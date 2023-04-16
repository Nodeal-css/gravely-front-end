migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("nfhldd49bkwqia9")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "vk0k6v32",
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
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("nfhldd49bkwqia9")

  // remove
  collection.schema.removeField("vk0k6v32")

  return dao.saveCollection(collection)
})
