import { FaBars } from "react-icons/fa6";
import { FaRegBell } from "react-icons/fa";
import Button from "@/components/ui/Button";
import Balance from "@/components/ui/Balance";
import Avatar from "@/components/ui/Avatar";


const imgLink = "https://avatars.githubusercontent.com/u/173485995?v=4&size=64";

const RightSideHeader = () => {
    return (
        <div className="flex justify-between items-center w-full">
            <div>
                <FaBars size={15} />
            </div>
            <div className="flex gap-2 justify-center items-center">
                <Button text="Add Bulk Parcel" url="/parcels/add-parcel/bulk-parcel" focused />
                <Button text="Add Single Parcel" url="/parcels/add-parcel/single-parcel" focused={false} />
                <Balance text="Available Balance" balance="3000" />
                <FaRegBell size={20} />

                <Avatar imgLink={imgLink} />
            </div>
        </div>
    );
}

export default RightSideHeader;
