"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { faArrowsUpDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface SavedFilter {
  name: string;
  apiCode: string;
  sector: string;
  minExperience: string;
  maxExperience: string;
  minRevenue: string;
  maxRevenue: string;
  createdAt: string;
}

const SavedFiltersComponent: React.FC = () => {
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [nameSortOrder, setNameSortOrder] = useState("asc");
  const [dateSortOrder, setDateSortOrder] = useState("desc"); // Valeurs possibles : "asc" ou "desc"

  useEffect(() => {
    const loadedFilters = localStorage.getItem("savedConfigurations");
    if (loadedFilters) {
      setSavedFilters(JSON.parse(loadedFilters));
    }
  }, []);

  const handleSearch = (filter: SavedFilter) => {
    // Logique de recherche avec le filtre sélectionné
  };

  const handleDelete = (filterName: string) => {
    // Logique pour supprimer un filtre
    const updatedFilters = savedFilters.filter(
      (filter) => filter.name !== filterName
    );
    setSavedFilters(updatedFilters);
    localStorage.setItem("savedConfigurations", JSON.stringify(updatedFilters));
  };

  const sortByDate = () => {
    const sorted = [...savedFilters].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateSortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
    setSavedFilters(sorted);
    setDateSortOrder(dateSortOrder === "asc" ? "desc" : "asc");
  };

  const sortByName = () => {
    const sorted = [...savedFilters].sort((a, b) => {
      return nameSortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    });
    setSavedFilters(sorted);
    setNameSortOrder(nameSortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Filtres Sauvegardés</h2>
      <table className="min-w-full bg-white divide-y divide-gray-200">
        <thead className="bg-gray-50 ">
          <tr>
            <th className="px-6 py-3 text-left font-bold text-xs uppercase tracking-wider">
              <button
                className="flex items-center cursor-pointer focus:outline-none"
                onClick={() => sortByName()}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sortByName();
                  }
                }}
              >
                <FontAwesomeIcon icon={faArrowsUpDown} className="mr-2" />
                Nom
              </button>
            </th>
            <th className="px-6 py-3 text-left font-bold text-xs uppercase tracking-wider">
              <button
                className="flex items-center cursor-pointer focus:outline-none"
                onClick={() => sortByDate()}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sortByName();
                  }
                }}
              >
                <FontAwesomeIcon icon={faArrowsUpDown} className="mr-2" />
                Date
              </button>
            </th>
            <th className="px-6 py-3 text-left font-bold text-xs uppercase tracking-wider">
              Code API
            </th>
            <th className="px-6 py-3 text-left font-bold text-xs uppercase tracking-wider">
              Secteur
            </th>
            <th className="px-6 py-3 text-left font-bold text-xs uppercase tracking-wider">
              Ancienneté Min
            </th>
            <th className="px-6 py-3 text-left font-bold text-xs uppercase tracking-wider">
              Ancienneté Max
            </th>
            <th className="px-6 py-3 text-left font-bold text-xs uppercase tracking-wider">
              CA Min
            </th>
            <th className="px-6 py-3 text-left font-bold text-xs uppercase tracking-wider">
              CA Max
            </th>
            <th className="px-6 py-3 text-left font-bold text-xs uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {savedFilters.map((filter, index) => (
            <tr key={index}>
              <td className="px-6  whitespace-nowrap text-sm text-gray-500">
                {filter.name}
              </td>
              <td className="px-6  whitespace-nowrap text-sm text-gray-500">
                {new Date(filter.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6  whitespace-nowrap text-sm text-gray-500">
                {filter.apiCode}
              </td>
              <td className="px-6  whitespace-nowrap text-sm text-gray-500">
                {filter.sector}
              </td>
              <td className="px-6  whitespace-nowrap text-sm text-gray-500">
                {filter.minExperience}
              </td>
              <td className="px-6  whitespace-nowrap text-sm text-gray-500">
                {filter.maxExperience}
              </td>
              <td className="px-6  whitespace-nowrap text-sm text-gray-500">
                {filter.minRevenue}
              </td>
              <td className="px-6  whitespace-nowrap text-sm text-gray-500">
                {filter.maxRevenue}
              </td>
              <td className="px-6 py-4 whitespace-nowrap flex items-center justify-end">
                <Button
                  variant="default"
                  size="lg"
                  className="bg-green-500 hover:bg-green-700"
                  onClick={() => handleSearch(filter)}
                >
                  Rechercher
                </Button>
                <Button
                  variant="default"
                  size="lg"
                  onClick={() => handleDelete(filter.name)}
                  className="ml-4 bg-red-500 hover:bg-red-700"
                >
                  Effacer
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SavedFiltersComponent;
