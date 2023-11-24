"use client";
import React, { useState, useEffect, useCallback } from "react";
import { mockData } from "./mockData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowsUpDown } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";

// Interface pour les résultats de recherche. Inclut les informations clés sur les sociétés.
interface Result {
  societe: string;
  statuts: string;
  notes: string;
  chiffreAffaire: string;
  adresse: string;
  gerant: string;
  secteurActivite: string;
}
// Configuration utilisée pour le filtrage des résultats. Inclut les critères de filtrage.
interface Configuration {
  name: string;
  apiCode: string;
  sector: string;
  minExperience: string;
  maxExperience: string;
  minRevenue: string;
  maxRevenue: string;
  createdAt?: string;
}

// TODO: Remplacer mockData par des appels API réels
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
  const [statusFilter, setStatusFilter] = useState("");

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

  // Récupère la configuration actuelle de sessionStorage au chargement initial et vérifie également, à chaque mise à jour de currentConfiguration, si elle est enregistrée dans localStorage.
  useEffect(() => {
    let configuration = currentConfiguration;

    if (!configuration) {
      const tempConfig = sessionStorage.getItem("currentConfiguration");
      if (tempConfig) {
        configuration = JSON.parse(tempConfig);
        setCurrentConfiguration(configuration);
      }
    }

    if (configuration) {
      const savedConfigs = JSON.parse(
        localStorage.getItem("savedConfigurations") ?? "[]"
      );
      const isSaved = isConfigurationSaved(configuration, savedConfigs);
      setIsFilterSaved(isSaved);
    }
  }, [currentConfiguration]);

  // Charge les statuts enregistrés dans localStorage au chargement initial du composant.
  useEffect(() => {
    const savedStatuts = JSON.parse(localStorage.getItem("statuts") ?? "{}");
    setStatuts(savedStatuts);
  }, []);

  // Fonction pour enregistrer la configuration actuelle dans localStorage
  const saveConfiguration = () => {
    const tempConfig = sessionStorage.getItem("currentConfiguration");
    if (tempConfig && configurationName) {
      const configuration = JSON.parse(tempConfig);
      const newConfiguration = {
        ...configuration,
        name: configurationName,
        createdAt: new Date().toISOString(),
      };

      const savedConfigs = JSON.parse(
        localStorage.getItem("savedConfigurations") ?? "[]"
      );
      savedConfigs.push(newConfiguration);
      localStorage.setItem("savedConfigurations", JSON.stringify(savedConfigs));

      setIsFilterSaved(true);
      sessionStorage.removeItem("currentConfiguration");
    }
  };
  // Fonction pour gérer le changement de date de rappel.
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

  // Fonction pour trier les données en fonction de la clé et de la direction de tri.
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
  // Fonction pour trier les données en fonction de la clé et de la direction de tri.
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

  // Fonction pour trier les données en fonction de la clé et de la direction de tri.
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

  // Fonction pour gérer le changement de statuts. À l'avenir, cela pourrait inclure un appel API.
  const handleStatutChange = (
    id: string,
    key: string,
    value: string | boolean
  ) => {
    const newStatuts = {
      ...statuts,
      [id]: {
        ...statuts[id],
        [key]: value,
      },
    };
    setStatuts(newStatuts);
    localStorage.setItem("statuts", JSON.stringify(newStatuts));
  };

  // Logique de filtrage des données selon le statut sélectionné
  const filterData = useCallback(() => {
    switch (statusFilter) {
      case "appelsDesc":
        return [...data].sort(
          (a, b) =>
            (statuts[b.societe]?.appels || 0) -
            (statuts[a.societe]?.appels || 0)
        );
      case "appelsAsc":
        return [...data].sort(
          (a, b) =>
            (statuts[a.societe]?.appels || 0) -
            (statuts[b.societe]?.appels || 0)
        );
      case "interesse":
        return data.filter(
          (item) => statuts[item.societe]?.interesse === "oui"
        );
      case "joignable":
        return data.filter(
          (item) => statuts[item.societe]?.joignable === "oui"
        );
      case "aRappeler":
        // Tri par les dates les plus proches de la date actuelle
        return [...data]
          .filter((item) => rappelDates[item.societe])
          .sort(
            (a, b) =>
              new Date(rappelDates[a.societe]).getTime() -
              new Date(rappelDates[b.societe]).getTime()
          );
      default:
        return data;
    }
  }, [statusFilter, statuts, rappelDates]);

  // Met à jour les données triées à chaque fois que le filtre de statut change
  useEffect(() => {
    setSortedData(filterData());
  }, [filterData]);

  //vérifie si la date est passée
  const isDatePassed = (date: string) => {
    const today = new Date();
    const inputDate = new Date(date);
    return inputDate < today;
  };
  // Génère la classe CSS appropriée pour les statuts en fonction de leur valeur
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

  // Génère la classe CSS appropriée pour les dates de rappel en fonction de si elles sont passées ou non
  const getInputDateClass = (societe: string) => {
    const rappelDate = rappelDates[societe];
    if (rappelDate) {
      return isDatePassed(rappelDate)
        ? "form-input block w-full flex-1 h-[22px] py-1 border  bg-red-500 text-white shadow-sm focus:outline-none focus:ring-indigo-500"
        : "form-input block w-full flex-1 h-[22px] py-1 border bg-purple-500 text-white shadow-sm focus:outline-none focus:ring-indigo-500";
    }
    return "form-input block w-full flex-1 h-[22px] py-1 border border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500";
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
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-between">
              Statuts
              <select
                className="inline-block ml-2 border border-gray-300  shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Filtrer par</option>
                <option value="appelsDesc">Appels Descendant</option>
                <option value="appelsAsc">Appels Ascendant</option>
                <option value="interesse">Intéressé</option>
                <option value="joignable">Joignable</option>
                <option value="aRappeler">À Rappeler</option>
              </select>
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
                        className="flex-1 border-solid border-1 border-gray-300"
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
                        <option value="">option</option>
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
                        <option value="">option</option>
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
                        className={getInputDateClass(item.societe)}
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
