"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Configuration {
  name: string;
  apiCode: string;
  sector: string;
  minExperience: string;
  maxExperience: string;
  minRevenue: string;
  maxRevenue: string;
}

export default function Form() {
  const [name, setName] = useState("");
  const [apiCode, setApiCode] = useState("");
  const [sector, setSector] = useState("");
  const [minExperience, setMinExperience] = useState("");
  const [maxExperience, setMaxExperience] = useState("");
  const [minRevenue, setMinRevenue] = useState("");
  const [maxRevenue, setMaxRevenue] = useState("");
  const [configurations, setConfigurations] = useState<Configuration[]>([]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("submit");
    const currentConfiguration: Configuration = {
      name: "",
      apiCode,
      sector,
      minExperience,
      maxExperience,
      minRevenue,
      maxRevenue,
    };
    // Stockage temporaire dans sessionStorage
    sessionStorage.setItem(
      "currentConfiguration",
      JSON.stringify(currentConfiguration)
    );

    setConfigurations([...configurations, currentConfiguration]);
    setName("");
    setApiCode("");
    setSector("");
    setMinExperience("");
    setMaxExperience("");
    setMinRevenue("");
    setMaxRevenue("");

    window.location.href = "/results";
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Filtres</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Société:
        </label>
        <input
          type="text"
          id="name"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoComplete="name"
        />

        <label
          htmlFor="apiCode"
          className="block text-sm font-medium text-gray-700"
        >
          Code API:
        </label>
        <input
          type="text"
          id="apiCode"
          value={apiCode}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          onChange={(event) => setApiCode(event.target.value)}
        />

        <label
          htmlFor="sector"
          className="block text-sm font-medium text-gray-700"
        >
          Secteur:
        </label>
        <input
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          type="text"
          id="sector"
          value={sector}
          onChange={(event) => setSector(event.target.value)}
        />

        <div className="flex space-x-4">
          <div>
            <label
              htmlFor="minExperience"
              className="block text-sm font-medium text-gray-700 pb-4"
            >
              Ancienneté (min):
            </label>
            <input
              type="text"
              id="minExperience"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={minExperience}
              onChange={(event) => setMinExperience(event.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="maxExperience"
              className="block text-sm font-medium text-gray-700 pb-4"
            >
              Ancienneté (max):
            </label>
            <input
              type="text"
              id="maxExperience"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={maxExperience}
              onChange={(event) => setMaxExperience(event.target.value)}
            />
          </div>
        </div>

        <div className="flex space-x-4">
          <div>
            <label
              htmlFor="minRevenue"
              className="block text-sm font-medium text-gray-700 pb-4"
            >
              {` Chiffre d'affaires (min):`}
            </label>
            <input
              type="text"
              id="minRevenue"
              className=" block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={minRevenue}
              onChange={(event) => setMinRevenue(event.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="maxRevenue"
              className="block text-sm font-medium text-gray-700 pb-4"
            >
              {`Chiffre d'affaires (max):`}
            </label>
            <input
              type="text"
              id="maxRevenue"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={maxRevenue}
              onChange={(event) => setMaxRevenue(event.target.value)}
            />
          </div>
        </div>
        <Button
          variant="default"
          size="lg"
          className="mt-4 bg-sky-500 hover:bg-sky-700"
          type="submit"
        >
          Rechercher
        </Button>
      </form>
    </div>
  );
}
