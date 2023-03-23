migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("od39z33t3izqwap")

  collection.name = "location"

  // remove
  collection.schema.removeField("cskrrlzi")

  // remove
  collection.schema.removeField("ku2pvkvl")

  // remove
  collection.schema.removeField("bubfxs6r")

  // remove
  collection.schema.removeField("adq270hv")

  // remove
  collection.schema.removeField("8nyle0v7")

  // remove
  collection.schema.removeField("w7j8hjlj")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dvvxlkbw",
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

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "oqhi2tba",
    "name": "latitude",
    "type": "number",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "xmsfllxq",
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
  const collection = dao.findCollectionByNameOrId("od39z33t3izqwap")

  collection.name = "polygon"

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "cskrrlzi",
    "name": "lat_b",
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
    "id": "ku2pvkvl",
    "name": "lng_b",
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
    "id": "bubfxs6r",
    "name": "lat_c",
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
    "id": "adq270hv",
    "name": "lng_c",
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
    "id": "8nyle0v7",
    "name": "lat_d",
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
    "id": "w7j8hjlj",
    "name": "lng_d",
    "type": "number",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null
    }
  }))

  // remove
  collection.schema.removeField("dvvxlkbw")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "oqhi2tba",
    "name": "lat_a",
    "type": "number",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "xmsfllxq",
    "name": "lng_a",
    "type": "number",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null
    }
  }))

  return dao.saveCollection(collection)
})
