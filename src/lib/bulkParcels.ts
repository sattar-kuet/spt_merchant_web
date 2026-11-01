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
  deliverySpeed: "Delivery Speed",
  codAmount: "COD Amount",
  merchantReference: "Merchant Reference",
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
  client_order_ref?: string;
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
const cell = (row: Record<string, any>, header: string | string[]): string => {
  const wants = (Array.isArray(header) ? header : [header]).map((h) => h.trim().toLowerCase());
  for (const want of wants) {
    for (const key of Object.keys(row)) {
      if (key.trim().toLowerCase() === want) {
        const value = row[key];
        const text = value == null ? "" : String(value).trim();
        if (text) return text;
      }
    }
  }
  return "";
};

// Alternative column names used by the downloadable BulkImportSample.xlsx
const ALIASES = {
  customerPhone: [TEMPLATE_HEADERS.customerPhone, "Customer Mobile"],
  district: [TEMPLATE_HEADERS.district, "Customer District"],
  city: [TEMPLATE_HEADERS.city, "Customer Area"],
  weight: [TEMPLATE_HEADERS.weight, "Product weight in kg"],
  codAmount: [TEMPLATE_HEADERS.codAmount, "Cash Collection"],
  deliveryHours: ["Delivery time in hour"],
};

const DEFAULT_WEIGHT = 0.5;

// Same rule as the Odoo bulk wizard: exact max_delay_hours, else the
// smallest speed that is slow enough, else Regular
const speedByHours = (speeds: any[], hours: number) => {
  if (!hours || Number.isNaN(hours)) return undefined;
  const exact = speeds.find((s) => Number(s.max_delay_hours) === hours);
  if (exact) return exact;
  return speeds
    .filter((s) => Number(s.max_delay_hours) >= hours)
    .sort((a, b) => Number(a.max_delay_hours) - Number(b.max_delay_hours))[0];
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
  axios: AxiosInstance,
  firstRowNumber = 2,
  // Used when the sheet has no Pickup Point column (e.g. BulkImportSample.xlsx)
  defaultPickupPointName = ""
): Promise<BuildOrdersResult> {
  const [parcelTypesResp, districtsResp, pickupPointsResp, deliverySpeedsResp] = await Promise.all([
    axios.get("/parcel-types"),
    axios.get("/locations/districts"),
    axios.get("/pickup-points"),
    axios.get("/delivery-speeds"),
  ]);

  const parcelTypes = byName(
    normalizeList(parcelTypesResp.data, "parcel_types", "parcelTypes")
  );
  const districts = byName(normalizeList(districtsResp.data, "districts"));
  const pickupPoints = byName(
    normalizeList(pickupPointsResp.data, "pickup_points", "pickupPoints")
  );
  const deliverySpeeds = byName(
    normalizeList(deliverySpeedsResp.data, "delivery_speeds", "deliverySpeeds")
  );

  const speedList = normalizeList(deliverySpeedsResp.data, "delivery_speeds", "deliverySpeeds");
  const regularSpeed = deliverySpeeds.get("regular") ?? speedList[0];
  const defaultParcelType = parcelTypes.get("regular") ?? Array.from(parcelTypes.values())[0];

  const dataRows = rows.filter((row) => !isEmptyRow(row));

  // Cities depend on the district, so resolve districts first and fetch
  // cities once per distinct district
  const districtIds = new Set<number>();
  for (const row of dataRows) {
    const district = districts.get(cell(row, ALIASES.district).toLowerCase());
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
    // default 2 = sheet rows are 1-indexed and row 1 is the header
    const rowNumber = index + firstRowNumber;
    const problems: string[] = [];

    const customerName = cell(row, TEMPLATE_HEADERS.customerName);
    const customerPhone = asPhone(cell(row, ALIASES.customerPhone));
    const customerAddress = cell(row, TEMPLATE_HEADERS.customerAddress);
    const districtName = cell(row, ALIASES.district);
    const cityName = cell(row, ALIASES.city);
    const pickupPointName = cell(row, TEMPLATE_HEADERS.pickupPoint) || defaultPickupPointName;
    const parcelTypeName = cell(row, TEMPLATE_HEADERS.parcelType);
    const deliverySpeedName = cell(row, TEMPLATE_HEADERS.deliverySpeed);
    const weightText = cell(row, ALIASES.weight);
    const codText = cell(row, ALIASES.codAmount);
    const merchantReference = cell(row, TEMPLATE_HEADERS.merchantReference);

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
      : defaultParcelType;
    if (!parcelType) {
      problems.push(
        parcelTypeName
          ? `Unknown parcel type "${parcelTypeName}"`
          : "Parcel Type is required"
      );
    }

    const deliverySpeed = deliverySpeedName
      ? deliverySpeeds.get(deliverySpeedName.toLowerCase())
      : speedByHours(speedList, Number(cell(row, ALIASES.deliveryHours))) ?? regularSpeed;
    if (!deliverySpeed) {
      problems.push(
        deliverySpeedName
          ? `Unknown delivery speed "${deliverySpeedName}"`
          : "Delivery Speed is required"
      );
    }

    const weight = weightText === "" ? DEFAULT_WEIGHT : Number(weightText);
    if (Number.isNaN(weight) || weight <= 0) {
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
      delivery_speed_id: Number(deliverySpeed.id),
      total_weight: weight,
      cod_amount: codAmount,
      pickup_point_id: Number(pickupPoint.id),
      order_type: "normal_delivery",
      ...(merchantReference ? { client_order_ref: merchantReference } : {}),
    });
  });

  return { orders, errors };
}
