# Extrae la información de las fuentes y la carga en la BD


# conectar a la bd
import pymongo
client = pymongo.MongoClient("mongodb://root:example@localhost:27017/")
db = client["database"]
collection = db["test"]

collection.insert_one({
    "value" : 31
})


for val in collection.find({"value":31}):
    print(val)