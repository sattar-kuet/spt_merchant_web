import LeftBar from "@/components/LeftBar";
import Rightside from "@/components/RightSide";

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
