import Dashboard from "../Dashboard"
import RightSideHeader from "./RightSideHeader"


const Rightside = () => {
  return (
    <div className='p-5 w-full'>
      <RightSideHeader />
      <Dashboard />
    </div>
  )
}

export default Rightside