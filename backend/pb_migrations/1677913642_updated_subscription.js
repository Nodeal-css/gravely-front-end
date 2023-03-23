migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("nzrzumxmlvved6x")

  collection.listRule = ""
  collection.viewRule = ""
  collection.createRule = null
  collection.updateRule = null
  collection.deleteRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("nzrzumxmlvved6x")

  collection.listRule = null
  collection.viewRule = null
  collection.createRule = ""
  collection.updateRule = ""
  collection.deleteRule = null

  return dao.saveCollection(collection)
})
