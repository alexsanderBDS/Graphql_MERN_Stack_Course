const { ApolloServer } = require('apollo-server-express')
const express = require('express')
const http = require('http')

require('dotenv').config()

const app = express()

const users = [{
    name: 'alexsander',
    age: 25,
    city: 'Aruja',
    text: 'Hello World'
},
{
    name: 'bruna',
    age: 20,
    city: 'Guarulhos',
    text: 'Hello City!'
}]

const typeDefs = `

    type Query {
        user(query: String): [User!]!
    }

    type User {
        name: String!
        age: Int!
        city: String!
        text: String!
    }

    input UserInput {
        name: String!
        age: Int!
        city: String!
        text: String!
    }

    type Mutation {
        newUser(input: UserInput!): User!
    }

`

const resolvers = {
    Query: {
        user: (parent, args, ctx, info) => {
            
            const user = users.find((one) => one.name === args.query)
            
            if (!user) {
                return users
            }
            return user
        }
    },
    Mutation: {
        
    }
}

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers
})

apolloServer.applyMiddleware({ app })

const httpServer = http.createServer(app)

app.get('/', (req, res) => {
    res.json({ users })
})

httpServer.listen(process.env.PORT, () => {
    console.log(`Server running up! port ${process.env.PORT}`)
    console.log('graphql server on ' + apolloServer.graphqlPath)
})