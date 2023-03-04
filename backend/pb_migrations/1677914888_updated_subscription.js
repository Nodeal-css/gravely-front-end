migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("nzrzumxmlvved6x")

  collection.listRule = ""
  collection.viewRule = ""
  collection.deleteRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("nzrzumxmlvved6x")

  collection.listRule = null
  collection.viewRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})
