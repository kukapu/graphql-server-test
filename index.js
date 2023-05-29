import { ApolloServer, UserInputError, gql } from 'apollo-server'
import './db.js'
import Person from './models/person.js'
import User from './models/user.js'

// const personas = [
//   {
//     name: 'GTO',
//     age: '25',
//     phone: '040-123543',
//     street: 'Tapiolankatu 5 A',
//     city: 'Espoo',
//     id: '3d594650-3436-11e9-bc57-8b80ba54c431'
//   },
//   {
//     name: 'Pepe',
//     phone: '040-432342',
//     street: 'Malminkaari 10 A',
//     city: 'Helsinki',
//     id: '3d599470-3436-11e9-bc57-8b80ba54c431'
//   },
//   {
//     name: 'Paco',
//     street: 'Nallemäentie 22 C',
//     city: 'Helsinki',
//     id: '3d599471-3436-11e9-bc57-8b80ba54c431'
//   },
// ]

const typeDefs = gql`
  enum YesNo {
    YES
    NO
  }

  type Address {
    street: String!
    city: String!
  }

  type Person {
    name: String!
    phone: String
    age: String
    address: Address!
    id: ID!
    canDrink: Boolean!
  }

  type Query {
    personCount: Int!
    allPersons(phone: YesNo): [Person]!
    findPerson(name: String!): Person
  }

  type Mutation {
    addPerson(
      name: String!
      phone: String
      street: String!
      city: String!
    ): Person
    editNumber(
      name: String!
      phone: String!
    ) : Person
  }
`

const resolvers = {
  Query: {
    personCount: () => Person.collection.countDocuments(),
    allPersons: async (root, args) => {
      if( !args.phone ) return await Person.find({})
      return Person.find({ phone: { $exists: args.phone === 'YES' } })
    },
    findPerson: async (root, args) => {
      const { name } = args
      return await Person.findOne({ name })
    }
  },
  Mutation: {
    addPerson: async (root, args) => {
      const person = new Person({ ...args })
      try {
        await person.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      return person
    },
    editNumber: async (root, args) => {
      const person = await Person.findOne({ name: args.name })
      if (!person) return

      person.phone = args.phone
      try {
        await person.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      return person
    },
  },
  Person: {
    address: (root) => {
      return {
        street: root.street,
        city: root.city
      }
    },
    canDrink: (root) => (root.age) ? (root.age >= 18) : false,
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})