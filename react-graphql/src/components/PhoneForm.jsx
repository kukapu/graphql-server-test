import { gql, useMutation } from '@apollo/client'
import { useEffect, useState } from 'react'
import { EDIT_NUMBER } from '../persons/graphql-mutations'


export const PhoneForm = ({ notifyError }) => {

  const [ name, setName ] = useState('')
  const [ phone, setPhone ] = useState('')

  const [ changePhone ] = useMutation(EDIT_NUMBER)


  const handleSubmit = (e) => {
    e.preventDefault()

    changePhone({ variables: { name, phone } })

    setName('')
    setPhone('')
  }

  return (
    <div>
      <h2>Edit Phone Number</h2>
      <form onSubmit={ handleSubmit }>
        <input value={ name } onChange={({ target }) => setName(target.value)} placeholder='name' />< br />
        <input value={ phone } onChange={({ target }) => setPhone(target.value)} placeholder='phone' />< br />
        <br /><button type='submit'>Change Phone</button>
      </form>
    </div>
  )
}

