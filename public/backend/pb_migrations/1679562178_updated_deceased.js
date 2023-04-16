migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4s53ijg6jrj3345")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "rjv2jewu",
    "name": "gender",
    "type": "text",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4s53ijg6jrj3345")

  // remove
  collection.schema.removeField("rjv2jewu")

  return dao.saveCollection(collection)
})
