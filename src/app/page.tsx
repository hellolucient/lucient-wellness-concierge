"use client";

import { useState } from "react";
import Image from "next/image";

const intents = [
  { label: "Anxiety-related sleep issues", value: "anxiety-related sleep issues" },
  { label: "Hot sleeper", value: "hot sleeper" },
  { label: "Eco-conscious", value: "eco-conscious" },
  { label: "Budget-friendly", value: "budget-friendly" },
  { label: "Premium & luxury", value: "premium & luxury" },
  { label: "Versatile everyday use", value: "versatile everyday use" }
];

// Single generic image for weighted sleep blankets
const WEIGHTED_BLANKET_IMAGE = "/images/weighted-sleep-blanket.jpg";

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
          <span className="font-medium">Choosing the right weight:</span> Generally recommended to select a blanket that's approximately 10% of your body weight.
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
  const [results, setResults] = useState<any[]>([]);

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
    const matches = products.filter((p: any) => matchingNames.includes(p["Product Name"]));
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
            {results.map((item, idx) => (
              <div key={idx} className="border p-4 rounded shadow">
                <div className="flex gap-4">
                  <div className="relative w-32 h-32 flex-shrink-0">
                    <Image
                      src="/images/weighted-sleep-blanket.svg"
                      alt="Weighted Sleep Blanket"
                      width={128}
                      height={128}
                      className="rounded"
                    />
                  </div>
                  <div className="flex-grow">
                    <h2 className="text-xl font-semibold">{item["Product Name"]}</h2>
                    <p className="text-sm text-gray-600 mb-2">{item["Brand"]}</p>
                    <p className="text-sm mb-2">{item["lucient Fit Notes"]}</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                        ${item["Price Low"]} – ${item["Price High"]} USD
                      </span>
                      <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                        Sustainability: {item["Sustainability Score"]}/5
                      </span>
                      {item["Sustainability Verified"] === "Yes" && (
                        <div className="relative inline-block group">
                          <span className="text-sm text-green-600 flex items-center gap-1">
                            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Verified Sustainable
                          </span>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                            <div className="bg-gray-900 text-white text-xs rounded p-2 shadow-lg">
                              <div className="font-semibold mb-1">Verification Details:</div>
                              <div>{item["Sustainability Verification Details"]}</div>
                              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    {item["Product URL"] && (
                      <a
                        href={item["Product URL"]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline text-sm"
                      >
                        View Product →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
