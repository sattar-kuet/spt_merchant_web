export interface ParcelDefaults {
  parcelType: string;
  deliverySpeed: string;
  weight: string;
}

const KEY = "spt_parcel_defaults";

export const loadParcelDefaults = (): ParcelDefaults => {
  const empty = { parcelType: "", deliverySpeed: "", weight: "" };
  try {
    return { ...empty, ...JSON.parse(localStorage.getItem(KEY) || "{}") };
  } catch {
    return empty;
  }
};

export const saveParcelDefaults = (d: ParcelDefaults) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(d));
  } catch {}
};
