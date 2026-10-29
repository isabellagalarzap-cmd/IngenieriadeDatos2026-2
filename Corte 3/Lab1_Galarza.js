//Parte A Entorno y primeros documentos

//A1
db
saborya
db._getCollectionNames()

//A2

print("Restaurantes: " + db.restaurante.countDocuments());
print("Clientes: " + db.clientes.countDocuments());
print("Productos: " + db.producto.countDocuments());
print("Pedidos: " + db.pedidos.countDocuments());


//A3
db.restaurantes.insertOne({
  _id: "R11",
  nombre: "Café Arriero",
  categoria: "Cafetería",
  ciudad: "Medellín",
  barrio: "Laureles",
  calificacion: 4.5,
  domicilio: true,
  ubicacion: {
    type: "Point",
    coordinates: [-75.5925, 6.2442]
  },
  etiquetas: ["café", "postres"]
})


//A4
db.producto.insertMany([
  {
    _id: "P25",
    restaurante_id: "R11",
    nombre: "Tinto campesino",
    tipo: "bebida",
    precio: 3500,
    stock: 100,
    disponible: true,
    volumen_ml: 200
  },
  {
    _id: "P26",
    restaurante_id: "R11",
    nombre: "Torta de zanahoria",
    tipo: "postre",
    precio: 9000,
    stock: 20,
    disponible: true
  }
]) 

//A5
db.restaurante.find({ ciudad: "Medellín" })
db.producto.countDocuments({ restaurante_id: "R11" })

//Parte B Modelado y validación de reseñas

//B1
db.pedidos.countDocuments({ fecha: { $not: { $type: "date" } } })
db.productos.countDocuments({ precio: { $type: "string" } })

//B2

//Guardaría las reseñas en una colección propia, ya que un restuarante famoso puede llegar a recibir miles de reseñas a lo largo del tiempo 
y si se guardan dentro del documento de clientes, en algún momento se va a superar el límite de 16 MB por documento. Los datos del clientes 
que copiaría en cada reseña serían el id y el nombre del clente, porque estos mo van a cambiar en el sistema.  

//B3
db.createCollection("resenas", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["restaurante_id", "cliente", "calificacion", "texto", "fecha"],
      properties: {
        restaurante_id: { bsonType: "string" },
        cliente: {
          bsonType: "object",
          required: ["id", "nombre"],
          properties: {
            id: { bsonType: "string" },
            nombre: { bsonType: "string" }
          }
        },
        calificacion: {
          bsonType: "int",
          minimum: 1,
          maximum: 5,
          description: "Debe ser un entero entre 1 y 5"
        },
        texto: {
          bsonType: "string",
          minLength: 5,
          description: "Debe tener al menos 5 caracteres"
        },
        fecha: { bsonType: "date" },
        fotos: {
          bsonType: "array",
          maxItems: 4,
          items: { bsonType: "string" }
        }
      }
    }
  }
})


//B4

db.resenas.insertMany([
  {
    restaurante_id: "R02",
    cliente: { id: "C01", nombre: "Laura Gómez" },
    calificacion: NumberInt(5),
    texto: "El ramen llegó caliente y bien empacado",
    fecha: new Date("2026-10-15T20:10:00-05:00")
  },
  {
    restaurante_id: "R02",
    cliente: { id: "C08", nombre: "Julián Castro" },
    calificacion: NumberInt(4),
    texto: "Buen sushi, pero tardó 50 minutos",
    fecha: new Date("2026-10-16T21:30:00-05:00")
  },
  {
    restaurante_id: "R10",
    cliente: { id: "C07", nombre: "Daniela Martínez" },
    calificacion: NumberInt(5),
    texto: "La cazuela es abundante",
    fotos: ["https://cdn.saborya.co/r/301.jpg", "https://cdn.saborya.co/r/302.jpg"],
    fecha: new Date("2026-10-17T13:45:00-05:00")
  },
  {
    restaurante_id: "R04",
    cliente: { id: "C03", nombre: "Valentina Ríos" },
    calificacion: NumberInt(2),
    texto: "Las papas llegaron frías",
    fecha: new Date("2026-10-18T19:05:00-05:00")
  }
])


//B5

db.resenas.insertOne({
  restaurante_id: "R01",
  cliente: { id: "C01", nombre: "Laura Gómez" },
  calificacion: NumberInt(6),
  texto: "Excelente servicio y comida",
  fecha: new Date()
})

// El documento falló porque la calificación es 6 y la regla `$jsonSchema` define `maximum: 5` para el campo `calificacion`.


//B6
db.resenas.find({ "cliente.id": "C01" })
db.resenas.find({ "fotos.0": { $exists: true } })

//B7

db.restaurantes.updateOne(
  { _id: "R02" },
  {
    $set: {
      resumen_resenas: {
        promedio: 4.5,
        total: 2
      }
    }
  }
)

//B8
db.resenas.distinct("restaurante_id")



