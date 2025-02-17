import {useEffect} from 'react'
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const navigate=useNavigate()
  //I didnot used the UseLayout effect because that will not work
  useEffect(() => {
   
      navigate('/Error')
     
   
  }, [])
  

  return (
    <div>Page not Founds :Contact Rizwan Sabir</div>
  )
}

export default ErrorPage