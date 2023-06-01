import { ApolloServer, AuthenticationError, UserInputError, gql } from 'apollo-server'
import './db.js'
import Person from './models/person.js'
import User from './models/user.js'
import jwt from 'jsonwebtoken'

const JWT_SECRET = 'NADIE_CONOCE_A_GTO'

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

  type User {
    username: String!
    friends: [Person!]!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    personCount: Int!
    allPersons(phone: YesNo): [Person]!
    findPerson(name: String!): Person
    me: User
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
    createUser(
      username: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
    addAsFriend(
      name: String!
    ): User
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
    },
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Mutation: {
    addPerson: async (root, args, context) => {
      const { currentUser } = context
      if( !currentUser ) throw new AuthenticationError("not authenticated")

      const person = new Person({ ...args })
      try {
        await person.save()
        currentUser.friends = currentUser.friends.concat(person)
        await currentUser.save()
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
    createUser: (root, args) => {
      const user = new User({ username: args.username })

      return user.save()
        .catch(error => {
          throw new UserInputError(error.message, {
              invalidArgs: args,
            })
          }
        )
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      if(!user || args.password !== 'GTOpass') {
        throw new UserInputError('wrong credentials')
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return {
        value: jwt.sign(userForToken, JWT_SECRET)
      }
    },
    addAsFriend: async (root, args, context) => {

      const { currentUser } = context
      if( !currentUser ) throw new AuthenticationError("not authenticated")

      const person = await Person.findOne({ name: args.name })

      const nonFriendAlready = (person) => !currentUser.friends
        .map(f => f._id)
        .includes(person._id)
      
      if(nonFriendAlready) {
        currentUser.friends = currentUser.friends.concat(person)
        await currentUser.save()
      }

      return currentUser
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
  context: async({ req }) => {
    const auth = req ? req.headers.authorization : null
    if(auth && auth.toLowerCase().startsWith('bearer ')) {
      const token = auth.substring(7)
      const { id } = jwt.verify(token, JWT_SECRET)
      const currentUser = await User.findById(id).populate('friends')
      return { currentUser }
    }
  }
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})