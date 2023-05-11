migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("f3pham7ghwlh64h")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ohnseizz",
    "name": "section_id",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "rb37sw8c7g84eu4",
      "cascadeDelete": false,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("f3pham7ghwlh64h")

  // remove
  collection.schema.removeField("ohnseizz")

  return dao.saveCollection(collection)
})
