const express = require('express')
const { buildSchema } = require('graphql')
const { default: build } = require('next/dist/build')

const express_graphQL = require('express-graphql').graphqlHTTP

const app = express()

//Cargar el archivo de datos
const {books} = require('./resources/books.json')


// id de tipo int "!" quiere decir que es obligatorio
const schema = buildSchema(`
	type Query {
		books:[Book]
		book(id:Int!):Book
	},
	type Mutation {
		updateBook(id:Int!,title:String!,author:String!,pages:Int!,year:Int!):Book
	},
	type Book {
		id:Int!
		title:String!
		author:String!
		pages:Int!
		year:Int!
	}
`)

let getBooks = () => {
    return books
}

let bookById = (args) => {
	if (args.id) {
		return books.find(book => book.id == args.id)
	}

  return null
}

//funcion para actualizar un libro, resibe unos argumentos (args) o se puede desestructurarlo ({id, title, author, pages, year})
let updateBook = ({id, title, author, pages, year}) => {
    books.map( book =>{
    	if (book.id == id) {
    	book.title = title
    	book.author = author
    	book.pages = pages
    	book.year = year

    	return book
      }
  })
  	return books.find(book => book.id == id)
}	

const root = {
	books: () => books,
	book: bookById,
	updateBook: updateBook
}

app.use("/", express_graphQL({
    schema:schema,
    rootValue: root,
    graphiql: true
}))


app.listen(3000, () => console.log('Server Ready at port 3000'))

