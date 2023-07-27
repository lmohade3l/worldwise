import {Link} from 'react-router-dom'
import PageNav from '../components/PageNav'

function HomePage() {
  return (
    <div>
        <PageNav />
        {/* <a href='/pricing'>pricing</a> */}
        <Link to='/app'>Go to the app</Link>
        
    </div>
  )
}

export default HomePage