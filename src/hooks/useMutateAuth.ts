import axios from './axios'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import useStore from '../store'
import { Credential } from '../types'
import { useError } from '../hooks/useError'

export const useMutateAuth = () => {
  const navigate = useNavigate()
  const resetEditedTask = useStore((state) => state.resetEditedTask)
  const { switchErrorHandling } = useError()

  const loginMutation = useMutation(
    async (user: Credential) => await axios.post(`/login`, user),
    {
      onSuccess: (res) => {
        // 백엔드 응답에 JWT 토큰이 포함되어 있다고 가정합니다 (예: res.data.token)
        if (res.data.token) {
          localStorage.setItem('jwt_token', res.data.token)
        }
        navigate('/todo')
      },
      onError: (err: any) => {
        if (err.response.data.message) {
          switchErrorHandling(err.response.data.message)
        } else {
          switchErrorHandling(err.response.data)
        }
      },
    },
  )
  const registerMutation = useMutation(
    async (user: Credential) => await axios.post(`/signup`, user),
    {
      onError: (err: any) => {
        if (err.response.data.message) {
          switchErrorHandling(err.response.data.message)
        } else {
          switchErrorHandling(err.response.data)
        }
      },
    },
  )
  const logoutMutation = useMutation(async () => await axios.post(`/logout`), {
    onSuccess: () => {
      resetEditedTask()
      localStorage.removeItem('jwt_token')
      navigate('/')
    },
    onError: (err: any) => {
      if (err.response.data.message) {
        switchErrorHandling(err.response.data.message)
      } else {
        switchErrorHandling(err.response.data)
      }
    },
  })
  return { loginMutation, registerMutation, logoutMutation }
}
