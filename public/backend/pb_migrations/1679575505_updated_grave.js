migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("f3pham7ghwlh64h")

  // remove
  collection.schema.removeField("al6a6ody")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "r5klg9e9",
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
    "id": "oldd17fw",
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
    "id": "ywi7mmec",
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
    "id": "wah6kl6r",
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
  collection.schema.removeField("r5klg9e9")

  // remove
  collection.schema.removeField("oldd17fw")

  // remove
  collection.schema.removeField("ywi7mmec")

  // remove
  collection.schema.removeField("wah6kl6r")

  return dao.saveCollection(collection)
})
