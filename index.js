import { ApolloServer, UserInputError, gql } from 'apollo-server'
import {v1 as uuid} from 'uuid'

const personas = [
  {
    name: 'GTO',
    age: '25',
    phone: '040-123543',
    street: 'Tapiolankatu 5 A',
    city: 'Espoo',
    id: '3d594650-3436-11e9-bc57-8b80ba54c431'
  },
  {
    name: 'Pepe',
    phone: '040-432342',
    street: 'Malminkaari 10 A',
    city: 'Helsinki',
    id: '3d599470-3436-11e9-bc57-8b80ba54c431'
  },
  {
    name: 'Paco',
    street: 'Nallemäentie 22 C',
    city: 'Helsinki',
    id: '3d599471-3436-11e9-bc57-8b80ba54c431'
  },
]


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
  }
`

const resolvers = {
  Query: {
    personCount: () => personas.length,
    allPersons: (root, args) => {
      if (!args.phone) return personas
      const byPhone = (person) => args.phone === 'YES' ? person.phone : !person.phone
  
      return personas.filter(byPhone)
    },
    findPerson: (root, args) => {
      const { name } = args
      return personas.find(p => p.name === name)
    }
  },
  Mutation: {
    addPerson: (root, args) => {
      if(personas.find(p => p.name === args.name)) {
        throw new UserInputError('Person already exists', {
          invalidArgs: args.name,
        })
      }
      const person = { ...args, id: uuid() }
      personas.push(person) // update databa with new person
      return person
    }
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