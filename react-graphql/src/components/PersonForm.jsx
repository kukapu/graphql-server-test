import { gql, useMutation } from '@apollo/client'
import { useState } from 'react'
import { ALL_PERSON } from '../persons/graphql-queries'
import { CREATE_PERSON } from '../persons/graphql-mutations'


export const PersonForm = ({ notifyError }) => {

  const [ name, setName ] = useState('')
  const [ phone, setPhone ] = useState('')
  const [ street, setStreet ] = useState('')
  const [ city, setCity ] = useState('')

  const [ createPerson ] = useMutation(CREATE_PERSON, {
    // refetchQueries: [ { query: ALL_PERSON } ],
    onError: (error) => {
      console.log('PersonFrom Error')
      notifyError(error.graphQLErrors[0].message)
    },
    update: (store, response) => {
      const dataInStore = store.readQuery({ query: ALL_PERSON })
      store.writeQuery({
        query: ALL_PERSON,
        data: {
          ...dataInStore,
          allPersons: [ ...dataInStore.allPersons, response.data.addPerson ]
        }
      })
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    createPerson({ variables: { name, phone, street, city } })

    setName('')
    setPhone('')
    setStreet('')
    setCity('')
  }

  return (
    <div>
      <h2>Create New Person</h2>
      <form onSubmit={ handleSubmit }>
        <input value={ name } onChange={({ target }) => setName(target.value)} placeholder='name' />< br />
        <input value={ phone } onChange={({ target }) => setPhone(target.value)} placeholder='phone' />< br />
        <input value={ street } onChange={({ target }) => setStreet(target.value)} placeholder='street' />< br />
        <input value={ city } onChange={({ target }) => setCity(target.value)} placeholder='city' />< br />
        <br /><button type='submit'>Add Person</button>
      </form>
    </div>
  )
}

