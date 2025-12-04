import LeftBar from "./dashboard/components/LeftBar";
import Rightside from "./dashboard/components/RightSide";


export default function Home() {
  return (
    <div className="flex">
      <LeftBar/>
      <div className="w-full">
        <Rightside/>
      </div>
    </div>
  );
}
