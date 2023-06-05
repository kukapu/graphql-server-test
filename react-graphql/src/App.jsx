import { useApolloClient } from '@apollo/client'
import './App.css'
import { Persons } from './components/Persons'
import { PersonForm } from './components/PersonForm'
import { LoginForm } from './components/LoginForm'
import { ALL_PERSON } from './persons/graphql-queries'
import { usePersons } from './persons/custom-hooks'
import { useState } from 'react'
import { Notify } from './components/Notify'
import { PhoneForm } from './components/PhoneForm'



function App() {
  // useEffect(() => {
  //   fetch('http://localhost:4000', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({
  //       query: `
  //         query {
  //           allPersons {
  //             name
  //             phone
  //           }
  //         }
  //       `,
  //     }),
  //   })
  //     .then((res) => res.json())
  //     .then((res) => console.log(res.data))
  // }, [])

  // console.log(result)

  const { loading, error, data } = usePersons(ALL_PERSON)

  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('phonenumbers-user-token'))
  const client = useApolloClient()

  const notifyError = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  return (

    <div className='App'>
      <h1>React + GraphQL</h1>
      <Notify errorMessage={ errorMessage } />
      { token 
        ? <button onClick={ logout }>Logout</button>
        : <LoginForm notifyError={ notifyError } setToken={ setToken } /> 
      }
      {
        loading 
          ? <span>Loading...</span>
          : (
            <Persons persons={ data?.allPersons }/>
          )
      }
      <PersonForm notifyError={ notifyError } />
      <PhoneForm notifyError={ notifyError } />
    </div>

  )
}

export default App 
