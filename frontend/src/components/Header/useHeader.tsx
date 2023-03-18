import { useNavigate } from "react-router-dom"

export const useHeader = () => {
  const navigate = useNavigate()
  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/signin')
  }

  return { handleLogout }
}