"use client";

import { useState } from "react";

const intents = [
  { label: "Anxiety-related sleep issues", value: "anxiety-related sleep issues" },
  { label: "Hot sleeper", value: "hot sleeper" },
  { label: "Eco-conscious", value: "eco-conscious" },
  { label: "Budget-friendly", value: "budget-friendly" },
  { label: "Premium & luxury", value: "premium & luxury" },
  { label: "Versatile everyday use", value: "versatile everyday use" }
];

// Add interface for product type
interface Product {
  "Product Name": string;
  Brand: string;
  "Product URL": string;
  "Social Profile URL": string | null;
  Type: string;
  Subtype: string;
  "Wellness Pillar": string;
  "Wellness Goal": string;
  "Price Low": number;
  "Price High": number;
  Currency: string;
  "Image URL": string;
  "Affiliate Ready": string;
  "Affiliate Program URL": string | null;
  "Sustainability Score": number;
  "Sustainability Notes": string;
  "Sustainability Verified": string;
  "Sustainability Verification Details": string;
  "Delivery Method": string;
  "Availability Region(s)": string;
  "lucient Fit Score": number;
  "lucient Fit Notes": string;
  "Category Reference ID": string;
}

// Category information components
const WeightedSleepBlanketInfo = () => (
  <div className="bg-gray-50 p-6 rounded-lg mb-8">
    <h2 className="text-xl font-semibold mb-4">Weighted Sleep Blankets</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <p className="mb-3">
          <span className="font-medium">What they are:</span> Therapeutic blankets with evenly distributed weight throughout, typically ranging from 5 to 25 pounds.
        </p>
        <p className="mb-3">
          <span className="font-medium">How they work:</span> Uses deep pressure stimulation to promote relaxation, reduce anxiety, and improve sleep quality.
        </p>
        <p className="mb-2">
          <span className="font-medium">Key Benefits:</span>
        </p>
        <ul className="list-disc pl-5 space-y-1 mb-3">
          <li>Reduces anxiety and stress</li>
          <li>Improves sleep quality</li>
          <li>Helps with insomnia</li>
          <li>Promotes natural melatonin production</li>
          <li>Provides comfort and security</li>
        </ul>
      </div>
      <div>
        <p className="mb-3">
          <span className="font-medium">Choosing the right weight:</span> Generally recommended to select a blanket that&apos;s approximately 10% of your body weight.
        </p>
        <p className="mb-3">
          <span className="font-medium">Materials:</span> Usually made with glass beads or plastic pellets for weight, encased in breathable fabrics like cotton, bamboo, or cooling materials.
        </p>
      </div>
    </div>
  </div>
);

export default function Home() {
  const [intent, setIntent] = useState("");
  const [results, setResults] = useState<Product[]>([]);

  const handleSearch = async (selectedIntent: string) => {
    if (!selectedIntent) {
      setResults([]);
      return;
    }

    const [intentMapRes, productRes] = await Promise.all([
      fetch("/data/intent_mapping.json"),
      fetch("/data/lucient_weighted_blankets.json")
    ]);

    const intentMap = await intentMapRes.json();
    const products = await productRes.json();

    const matchingNames = intentMap[selectedIntent];
    const matches = products.filter((p: Product) => matchingNames.includes(p["Product Name"]));
    setResults(matches);
  };

  const handleIntentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newIntent = e.target.value;
    setIntent(newIntent);
    handleSearch(newIntent);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">lucient Sleep Concierge</h1>

      <select
        value={intent}
        onChange={handleIntentChange}
        className="p-2 border rounded mb-4 w-full"
      >
        <option value="">Select a wellness sleep goal...</option>
        {intents.map((i) => (
          <option key={i.value} value={i.value}>{i.label}</option>
        ))}
      </select>

      {results.length > 0 && (
        <div>
          <WeightedSleepBlanketInfo />
          <div className="space-y-4">
            {results.map((product) => (
              <div key={product["Product Name"]} className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-2">{product["Product Name"]}</h3>
                <p className="text-gray-600 mb-4">{product["Wellness Goal"]}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="mb-2">
                      <span className="font-medium">Brand:</span> {product.Brand}
                    </p>
                    <p className="mb-2">
                      <span className="font-medium">Price:</span> {product.Currency} {product["Price Low"]} - {product["Price High"]}
                    </p>
                    <p className="mb-2">
                      <span className="font-medium">Sustainability Score:</span> {product["Sustainability Score"]}/5
                    </p>
                  </div>
                  <div>
                    <p className="mb-2">
                      <span className="font-medium">Type:</span> {product.Type}
                    </p>
                    <p className="mb-2">
                      <span className="font-medium">Subtype:</span> {product.Subtype}
                    </p>
                    <p className="mb-2">
                      <span className="font-medium">lucient Fit Score:</span> {product["lucient Fit Score"]}/10
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="mb-2">
                    <span className="font-medium">Sustainability Notes:</span> {product["Sustainability Notes"]}
                  </p>
                  <p className="mb-2">
                    <span className="font-medium">lucient Fit Notes:</span> {product["lucient Fit Notes"]}
                  </p>
                </div>
                <div className="mt-4 flex gap-4">
                  <a
                    href={product["Product URL"]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View Product
                  </a>
                  {product["Social Profile URL"] && (
                    <a
                      href={product["Social Profile URL"]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View Social Profile
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
