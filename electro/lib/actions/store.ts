"use server";

export async function getStoreConfig() {
  return {
    currency_code: "KES",
    vat_enabled: false,
    vat_rate: 0,
  };
}

export async function getStoreInfo() {
  return {
    name: "Meat & Spice Ltd",
    logo: "/meatnspiceicon.png",
    email: "sales@meatnspice.co.ke",
    phone: "+254700000000",
    address: "Nairobi, Kenya",
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    whatsapp: "254700000000",
  };
}
