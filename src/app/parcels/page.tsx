import OrdersHeader from "./components/OrdersHeader";
import FiltersBar from "../../components/FiltersBar";
import OrdersTable from "./components/OrdersTable";
import Pagination from "./components/Pagination";

const OrdersPage = () => {
	return (
		<div className="p-5 w-full">
			<OrdersHeader />
			<div className="mt-2">
				<FiltersBar />

				<div className="mt-4">
					<OrdersTable />
					<Pagination />
				</div>
			</div>
		</div>
	);
};

export default OrdersPage;

