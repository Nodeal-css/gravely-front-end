migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("f3pham7ghwlh64h")

  // remove
  collection.schema.removeField("al6a6ody")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "xhr7ymhc",
    "name": "price",
    "type": "number",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ymu4xtjm",
    "name": "column",
    "type": "number",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "b8c1oyqw",
    "name": "latitude",
    "type": "number",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "cmjys2q9",
    "name": "longitude",
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

  // add
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

  // remove
  collection.schema.removeField("xhr7ymhc")

  // remove
  collection.schema.removeField("ymu4xtjm")

  // remove
  collection.schema.removeField("b8c1oyqw")

  // remove
  collection.schema.removeField("cmjys2q9")

  return dao.saveCollection(collection)
})
