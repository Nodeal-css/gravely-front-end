migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rb37sw8c7g84eu4")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ko0r0myt",
    "name": "section_name",
    "type": "text",
    "required": false,
    "unique": false,
    "options": {
      "min": 0,
      "max": 90,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rb37sw8c7g84eu4")

  // remove
  collection.schema.removeField("ko0r0myt")

  return dao.saveCollection(collection)
})
