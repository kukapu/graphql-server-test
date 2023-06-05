import { useMutation } from "@apollo/client"
import { useEffect, useState } from "react"
import { LOGIN } from "../persons/graphql-mutations"

export const LoginForm = ({ notifyError, setToken }) => {

  const [ username, setUsername ] = useState('')
  const [ password, setPassword ] = useState('')

  const [ login, result ] = useMutation(LOGIN, {
    onError: (error) => {
      console.log('loginForm Error')
      notifyError(error.graphQLErrors[0].message)
    }
  })

  useEffect(() => {
    if(result.data) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('phonenumbers-user-token', token)
    }

  }, [result.data])

  const handleSubmit = async (e) => {
    e.preventDefault()

    // console.log({ variables: { username, password } })
    login({ variables: { username, password } })

    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input value={username} onChange={({ target }) => setUsername(target.value)} placeholder='username' />< br />
        <input value={password} onChange={({ target }) => setPassword(target.value)} placeholder='password' />< br />
        <br /><button type='submit'>Login</button>
      </form>
    </div>
  )
}

