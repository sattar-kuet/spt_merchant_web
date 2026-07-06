import { AxiosInstance } from "axios";

// Sheet/Excel template headers (see src/app/api/google-sheets/create/route.ts)
export const TEMPLATE_HEADERS = {
  customerName: "Customer Name",
  customerPhone: "Customer Phone",
  customerAddress: "Customer Address",
  district: "District",
  city: "City",
  pickupPoint: "Pickup Point",
  weight: "Parcel Weight (kg)",
  parcelType: "Parcel Type",
  codAmount: "COD Amount",
};

export interface BulkOrder {
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  customer_city_id: number;
  customer_district_id: number;
  parcel_type_id: number;
  delivery_speed_id: number;
  total_weight: number;
  cod_amount: number;
  pickup_point_id: number;
  order_type: string;
}

export interface RowError {
  row: number;
  message: string;
}

const normalizeList = (payload: any, ...extraKeys: string[]): any[] => {
  if (payload == null) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  for (const key of extraKeys) {
    if (Array.isArray(payload[key])) return payload[key];
  }
  return [];
};

const byName = (list: any[]) => {
  const map = new Map<string, any>();
  for (const item of list) {
    if (item?.name != null) {
      map.set(String(item.name).trim().toLowerCase(), item);
    }
  }
  return map;
};

// Header lookup is case/space insensitive so both the Google Sheet and
// hand-edited Excel files resolve to the same columns
const cell = (row: Record<string, any>, header: string): string => {
  const want = header.trim().toLowerCase();
  for (const key of Object.keys(row)) {
    if (key.trim().toLowerCase() === want) {
      const value = row[key];
      return value == null ? "" : String(value).trim();
    }
  }
  return "";
};

// Excel stores "01711223344" as the number 1711223344; restore the leading zero
const asPhone = (value: string) => (/^1\d{9}$/.test(value) ? `0${value}` : value);

const isEmptyRow = (row: Record<string, any>) =>
  Object.values(row).every((value) => value == null || String(value).trim() === "");

export interface BuildOrdersResult {
  orders: BulkOrder[];
  errors: RowError[];
}

// Resolves the human-readable sheet columns (District, City, Parcel Type,
// Pickup Point) into the numeric ids the orders API expects
export async function buildOrdersFromRows(
  rows: Record<string, any>[],
  axios: AxiosInstance
): Promise<BuildOrdersResult> {
  const [parcelTypesResp, districtsResp, pickupPointsResp] = await Promise.all([
    axios.get("/parcel-types"),
    axios.get("/locations/districts"),
    axios.get("/pickup-points"),
  ]);

  const parcelTypes = byName(
    normalizeList(parcelTypesResp.data, "parcel_types", "parcelTypes")
  );
  const districts = byName(normalizeList(districtsResp.data, "districts"));
  const pickupPoints = byName(
    normalizeList(pickupPointsResp.data, "pickup_points", "pickupPoints")
  );

  const dataRows = rows.filter((row) => !isEmptyRow(row));

  // Cities depend on the district, so resolve districts first and fetch
  // cities once per distinct district
  const districtIds = new Set<number>();
  for (const row of dataRows) {
    const district = districts.get(cell(row, TEMPLATE_HEADERS.district).toLowerCase());
    if (district) districtIds.add(Number(district.id));
  }

  const cityMaps = new Map<number, Map<string, any>>();
  await Promise.all(
    Array.from(districtIds).map(async (districtId) => {
      const resp = await axios.get("/locations/cities", {
        params: { district_id: districtId },
      });
      cityMaps.set(districtId, byName(normalizeList(resp.data, "cities")));
    })
  );

  const orders: BulkOrder[] = [];
  const errors: RowError[] = [];

  dataRows.forEach((row, index) => {
    // +2 = sheet rows are 1-indexed and row 1 is the header
    const rowNumber = index + 2;
    const problems: string[] = [];

    const customerName = cell(row, TEMPLATE_HEADERS.customerName);
    const customerPhone = asPhone(cell(row, TEMPLATE_HEADERS.customerPhone));
    const customerAddress = cell(row, TEMPLATE_HEADERS.customerAddress);
    const districtName = cell(row, TEMPLATE_HEADERS.district);
    const cityName = cell(row, TEMPLATE_HEADERS.city);
    const pickupPointName = cell(row, TEMPLATE_HEADERS.pickupPoint);
    const parcelTypeName = cell(row, TEMPLATE_HEADERS.parcelType);
    const weightText = cell(row, TEMPLATE_HEADERS.weight);
    const codText = cell(row, TEMPLATE_HEADERS.codAmount);

    if (!customerName) problems.push("Customer Name is required");
    if (!customerPhone) problems.push("Customer Phone is required");
    if (!customerAddress) problems.push("Customer Address is required");

    const district = districtName ? districts.get(districtName.toLowerCase()) : undefined;
    if (!district) {
      problems.push(
        districtName ? `Unknown district "${districtName}"` : "District is required"
      );
    }

    let city: any;
    if (district) {
      city = cityName
        ? cityMaps.get(Number(district.id))?.get(cityName.toLowerCase())
        : undefined;
      if (!city) {
        problems.push(
          cityName
            ? `Unknown city "${cityName}" in district "${districtName}"`
            : "City is required"
        );
      }
    }

    const pickupPoint = pickupPointName
      ? pickupPoints.get(pickupPointName.toLowerCase())
      : undefined;
    if (!pickupPoint) {
      problems.push(
        pickupPointName
          ? `Unknown pickup point "${pickupPointName}"`
          : "Pickup Point is required"
      );
    }

    const parcelType = parcelTypeName
      ? parcelTypes.get(parcelTypeName.toLowerCase())
      : undefined;
    if (!parcelType) {
      problems.push(
        parcelTypeName
          ? `Unknown parcel type "${parcelTypeName}"`
          : "Parcel Type is required"
      );
    }

    const weight = Number(weightText);
    if (!weightText || Number.isNaN(weight) || weight <= 0) {
      problems.push("Parcel Weight (kg) must be a positive number");
    }

    const codAmount = codText === "" ? 0 : Number(codText);
    if (Number.isNaN(codAmount) || codAmount < 0) {
      problems.push("COD Amount must be a non-negative number");
    }

    if (problems.length > 0) {
      errors.push({ row: rowNumber, message: problems.join("; ") });
      return;
    }

    orders.push({
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_address: customerAddress,
      customer_city_id: Number(city.id),
      customer_district_id: Number(district.id),
      parcel_type_id: Number(parcelType.id),
      delivery_speed_id: 1,
      total_weight: weight,
      cod_amount: codAmount,
      pickup_point_id: Number(pickupPoint.id),
      order_type: "delivery",
    });
  });

  return { orders, errors };
}
