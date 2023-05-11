migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("f3pham7ghwlh64h")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jyyn4u7d",
    "name": "block_number",
    "type": "number",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("f3pham7ghwlh64h")

  // remove
  collection.schema.removeField("jyyn4u7d")

  return dao.saveCollection(collection)
})
