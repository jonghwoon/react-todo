import { useNavigate } from 'react-router-dom'
import useStore from '../store'

export const useError = () => {
  const navigate = useNavigate()
  const resetEditedTask = useStore((state) => state.resetEditedTask)
  const switchErrorHandling = (msg: string) => {
    switch (msg) {
      case 'invalid or expired jwt':
        alert('access token expired, please login')
        resetEditedTask()
        localStorage.removeItem('jwt_token')
        navigate('/')
        break
      case 'missing or malformed jwt':
        alert('access token is not valid, please login')
        resetEditedTask()
        localStorage.removeItem('jwt_token')
        navigate('/')
        break
      case 'duplicated key not allowed':
        alert('email already exist, please use another one')
        break
      case 'crypto/bcrypt: hashedPassword is not the hash of the given password':
        alert('password is not correct')
        break
      case 'record not found':
        alert('email is not correct')
        break
      default:
        alert(msg)
    }
  }
  return { switchErrorHandling }
}
