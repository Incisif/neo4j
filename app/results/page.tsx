"use client";
import React, { useState, useEffect } from "react";
import { mockData } from "./mockData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowsUpDown } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";

interface Result {
  societe: string;
  statuts: string;
  notes: string;
  chiffreAffaire: string;
  adresse: string;
  gerant: string;
  secteurActivite: string;
}
interface Configuration {
  name: string;
  apiCode: string;
  sector: string;
  minExperience: string;
  maxExperience: string;
  minRevenue: string;
  maxRevenue: string;
}

const data = mockData;

const ResultsPage: React.FC = () => {
  const [sortedData, setSortedData] = useState<Result[]>(data);
  const [sortConfig, setSortConfig] = useState({
    key: null as keyof Result | null,
    direction: "ascending",
  });
  const [modalOpen, setModalOpen] = useState<number | null>(null);
  const [savedNotes, setSavedNotes] = useState<{ [key: number]: boolean }>({});
  const [statuts, setStatuts] = useState<{ [key: string]: any }>({});
  const [rappelDates, setRappelDates] = useState<{ [key: string]: string }>({});
  const [currentConfiguration, setCurrentConfiguration] =
    useState<Configuration | null>(null);
  const [configurationName, setConfigurationName] = useState<string>("");
  const [isFilterSaved, setIsFilterSaved] = useState(false);

  const isConfigurationSaved = (
    config: Configuration,
    savedConfigs: Configuration[]
  ) => {
    return savedConfigs.some(
      (savedConfig) =>
        savedConfig.apiCode === config.apiCode &&
        savedConfig.sector === config.sector &&
        savedConfig.minExperience === config.minExperience &&
        savedConfig.maxExperience === config.maxExperience &&
        savedConfig.minRevenue === config.minRevenue &&
        savedConfig.maxRevenue === config.maxRevenue
    );
  };
  useEffect(() => {
    const tempConfig = sessionStorage.getItem("currentConfiguration");
    if (tempConfig) {
      const configuration = JSON.parse(tempConfig);
      setCurrentConfiguration(configuration);

    }
  }, []);

  useEffect(() => {
    const tempConfig = sessionStorage.getItem("currentConfiguration");
    if (tempConfig) {
      const configuration = JSON.parse(tempConfig);
      setCurrentConfiguration(configuration);
      const savedConfigs = JSON.parse(
        localStorage.getItem("savedConfigurations") ?? "[]"
      );
      const isSaved = savedConfigs.some(
        (config: Configuration) =>
          JSON.stringify(config) === JSON.stringify(configuration)
      );
      setIsFilterSaved(isSaved);
    }
  }, []);

  useEffect(() => {
    if (currentConfiguration) {
      const savedConfigs = JSON.parse(
        localStorage.getItem("savedConfigurations") ?? "[]"
      );
      setIsFilterSaved(
        isConfigurationSaved(currentConfiguration, savedConfigs)
      );
    }
  }, [currentConfiguration]);

  const saveConfiguration = () => {
    const tempConfig = sessionStorage.getItem("currentConfiguration");
    if (tempConfig && configurationName) {
      const configuration = JSON.parse(tempConfig);

      const savedConfigs = JSON.parse(
        localStorage.getItem("savedConfigurations") ?? "[]"
      );
      savedConfigs.push({ ...configuration, name: configurationName });
      localStorage.setItem("savedConfigurations", JSON.stringify(savedConfigs));

      setIsFilterSaved(true);

      // Supprimer la configuration temporaire de sessionStorage
      sessionStorage.removeItem("currentConfiguration");
    }
  };

  const handleRappelDateChange = (societe: string, newDate: string) => {
    setRappelDates((prevDates) => ({
      ...prevDates,
      [societe]: newDate,
    }));
  };

  const openModal = (index: number) => {
    setModalOpen(index);
  };
  const closeModal = () => {
    setModalOpen(null);
  };
  const saveNote = () => {
    if (modalOpen !== null) {
      setSavedNotes({ ...savedNotes, [modalOpen]: true });
      setModalOpen(null);
    }
  };

  useEffect(() => {
    setSortedData(data);
  }, []);

  const sortNumber = (
    a: Result,
    b: Result,
    key: keyof Result,
    direction: string
  ) => {
    const numA = parseFloat(a[key]);
    const numB = parseFloat(b[key]);
    return direction === "ascending" ? numA - numB : numB - numA;
  };

  const sortString = (
    a: Result,
    b: Result,
    key: keyof Result,
    direction: string
  ) => {
    if (a[key] < b[key]) {
      return direction === "ascending" ? -1 : 1;
    }
    if (a[key] > b[key]) {
      return direction === "ascending" ? 1 : -1;
    }
    return 0;
  };

  const sortData = (key: keyof Result) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "ascending"
        ? "descending"
        : "ascending";
    setSortConfig({ key, direction });

    const sorted = [...data].sort((a, b) =>
      key === "chiffreAffaire"
        ? sortNumber(a, b, key, direction)
        : sortString(a, b, key, direction)
    );
    setSortedData(sorted);
  };

  const handleStatutChange = (id: string, key: string, value: any) => {
    setStatuts((prevStatuts) => ({
      ...prevStatuts,
      [id]: {
        ...prevStatuts[id],
        [key]: value,
      },
    }));
  };

  const determineClass = (value: string, type: string) => {
    if ((type === "interesse" || type === "joignable") && value === "oui") {
      return "bg-green-500";
    } else if (
      (type === "interesse" || type === "joignable") &&
      value === "non"
    ) {
      return "bg-red-500";
    } else {
      return "";
    }
  };

  return (
    <div className="container mx-auto p-4">
      <a href="/" className="text-blue-500">
        <FontAwesomeIcon
          icon={faArrowLeft}
          className="w-10 h-10 p-2 cursor-pointer"
        />
      </a>
      <div className="filters my-4 p-4 border border-gray-200 rounded">
        <div className="title text-lg font-bold mb-2">Filtres actuels :</div>
        <div className="api mb-1">
          Code API:{" "}
          <span className="text-gray-600">{currentConfiguration?.apiCode}</span>
        </div>
        <div className="sector mb-1">
          Secteur:{" "}
          <span className="text-gray-600">{currentConfiguration?.sector}</span>
        </div>
        <div className="experience mb-1">
          Expérience:{" "}
          <span className="text-gray-600">
            {currentConfiguration?.minExperience} à{" "}
            {currentConfiguration?.maxExperience}
          </span>
        </div>
        <div className="revenue mb-1">
          {`Chiffre d'affaire:`}{" "}
          <span className="text-gray-600">
            {currentConfiguration?.minRevenue} à{" "}
            {currentConfiguration?.maxRevenue}
          </span>
        </div>

        {!isFilterSaved ? (
          <>
            <input
              type="text"
              value={configurationName}
              onChange={(e) => setConfigurationName(e.target.value)}
              placeholder="Nom de la configuration"
              className="mt-2 mb-2 border border-gray-300 p-2 w-full"
            />
            <Button
              onClick={saveConfiguration}
              className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-700 mt-2"
              disabled={!configurationName}
            >
              Sauvegarder
            </Button>
          </>
        ) : (
          <div className="saved-filter-name text-gray-600 mt-2">
            Filtre sauvegardé : {configurationName}
          </div>
        )}
      </div>
      <h1 className="text-2xl font-bold mb-4">Résultats</h1>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Société
              <FontAwesomeIcon
                icon={faArrowsUpDown}
                className="w-5 h-5 ml-2 cursor-pointer"
                onClick={() => sortData("societe")}
              />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statuts
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Notes
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              CA
              <FontAwesomeIcon
                icon={faArrowsUpDown}
                className="w-5 h-5 ml-2 cursor-pointer"
                onClick={() => sortData("chiffreAffaire")}
              />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Adresse
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Gérant
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {"Secteur d'activité"}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200" key="status">
          {sortedData.map((item, idx) => (
            <React.Fragment key={idx}>
              <tr className={idx % 2 === 0 ? "bg-gray-50" : ""}>
                <td className="px-6 py-4 whitespace-wrap w-10">
                  {item.societe}
                </td>
                <td className="px-6 py-4 whitespace-nowrap ">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center ">
                      <label
                        htmlFor={`appels-${item.societe}`}
                        className="mr-2 w-1/2"
                      >
                        Appels
                      </label>
                      <select
                        id={`appels-${item.societe}`}
                        name={`appels-${item.societe}`}
                        value={statuts[item.societe]?.appels || 0}
                        onChange={(e) =>
                          handleStatutChange(
                            item.societe,
                            "appels",
                            e.target.value
                          )
                        }
                        className="flex-1"
                      >
                        {[...Array(11).keys()].map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center">
                      <label
                        htmlFor={`interesse-${item.societe}`}
                        className="mr-2 w-1/2"
                      >
                        Intéressé
                      </label>
                      <select
                        id={`interesse-${item.societe}`}
                        name={`interesse-${item.societe}`}
                        value={statuts[item.societe]?.interesse || ""}
                        onChange={(e) =>
                          handleStatutChange(
                            item.societe,
                            "interesse",
                            e.target.value
                          )
                        }
                        className={`${determineClass(
                          statuts[item.societe]?.interesse,
                          "interesse"
                        )} flex-1`}
                      >
                        <option value="" disabled>
                          option
                        </option>
                        <option value="oui">Oui</option>
                        <option value="non">Non</option>
                      </select>
                    </div>

                    <div className="flex items-center">
                      <label
                        htmlFor={`joignable-${item.societe}`}
                        className="mr-2 w-1/2"
                      >
                        Joignable
                      </label>
                      <select
                        id={`joignable-${item.societe}`}
                        name={`joignable-${item.societe}`}
                        value={statuts[item.societe]?.joignable || ""}
                        onChange={(e) =>
                          handleStatutChange(
                            item.societe,
                            "joignable",
                            e.target.value
                          )
                        }
                        className={`${determineClass(
                          statuts[item.societe]?.joignable,
                          "joignable"
                        )} flex-1`}
                      >
                        <option value="" disabled>
                          option
                        </option>
                        <option value="oui">Oui</option>
                        <option value="non">Non</option>
                      </select>
                    </div>
                    <div className="flex ">
                      <label
                        htmlFor={`rappel-${item.societe}`}
                        className="mr-2 w-1/2"
                      >
                        À Rappeler
                      </label>

                      <input
                        type="date"
                        id={`rappel-${item.societe}`}
                        name={`rappel-${item.societe}`}
                        value={rappelDates[item.societe] || ""}
                        onChange={(e) =>
                          handleRappelDateChange(item.societe, e.target.value)
                        }
                        className={`form-input block w-full flex-1 h-[22px] py-1 border border-gray-300  shadow-sm focus:outline-none focus:ring-indigo-500 ${
                          rappelDates[item.societe]
                            ? "bg-purple-500 text-white"
                            : ""
                        }`}
                      />
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <Button
                    onClick={() => openModal(idx)}
                    className={`px-4 py-2  ${
                      savedNotes[idx]
                        ? "bg-green-500 hover:bg-green-700"
                        : "bg-blue-500 hover:bg-blue-700"
                    }`}
                  >
                    {"Note"}
                  </Button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.chiffreAffaire} €
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{item.adresse}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.gerant}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.secteurActivite}
                </td>
              </tr>
              {modalOpen === idx && (
                <tr className="bg-white">
                  <td colSpan={7}>
                    <div className="relative w-full">
                      <div className="absolute left-0 top-0 mx-auto w-full max-w-600 h-400 bg-white shadow-md overflow-auto p-4">
                        <textarea
                          className="w-full h-full p-2 border border-gray-300"
                          defaultValue={item.notes}
                          style={{
                            height: "calc(400px - 40px)",
                            maxHeight: "calc(400px - 40px)",
                          }}
                        ></textarea>
                        <div className="flex justify-end mt-2">
                          <Button
                            onClick={saveNote}
                            className="bg-blue-500 text-white px-4 py-2 mr-2 hover:bg-blue-700"
                          >
                            Save
                          </Button>
                          <Button
                            onClick={closeModal}
                            className="bg-red-500 text-white px-4 py-2 hover:bg-red-700"
                          >
                            Close
                          </Button>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsPage;
