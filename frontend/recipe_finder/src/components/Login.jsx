import axios from 'axios'
import { useState } from 'react'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:5000/login', {
            'email': email,
            'password': password
        })

        console.log(response.data.message)
        } catch(error) {
            console.error('Error logging in:', error.response.data.error)
        }
    }
  return (
    <form>
        <label for="email">Email:</label>
        <input
          id='email'
          placeholder='Email'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label for="password">Password:</label>
        <input 
          id='password'
          placeholder='Password'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
    </form>
  )
}

export default Login