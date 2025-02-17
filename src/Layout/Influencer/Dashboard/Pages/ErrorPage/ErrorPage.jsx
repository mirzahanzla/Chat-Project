import {useEffect} from 'react'
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const navigate=useNavigate()
  useEffect(() => {
      navigate('/Error')
  }, [navigate])
  
  return (
    <div>Page not Founds :Contact Innovators</div>
  )
}

export default ErrorPage;