import { useState } from 'react';

interface Configuration {
  name: string;
  apiCode: string;
  sector: string;
  minExperience: string;
  maxExperience: string;
  minRevenue: string;
  maxRevenue: string;
}

export default function ConfigurationForm() {
  const [name, setName] = useState('');
  const [apiCode, setApiCode] = useState('');
  const [sector, setSector] = useState('');
  const [minExperience, setMinExperience] = useState('');
  const [maxExperience, setMaxExperience] = useState('');
  const [minRevenue, setMinRevenue] = useState('');
  const [maxRevenue, setMaxRevenue] = useState('');
  const [configurations, setConfigurations] = useState<Configuration[]>([]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newConfiguration: Configuration = {
      name,
      apiCode,
      sector,
      minExperience,
      maxExperience,
      minRevenue,
      maxRevenue,
    };
    setConfigurations([...configurations, newConfiguration]);
    setName('');
    setApiCode('');
    setSector('');
    setMinExperience('');
    setMaxExperience('');
    setMinRevenue('');
    setMaxRevenue('');
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Nom:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <br />
        <label htmlFor="apiCode">Code API:</label>
        <input
          type="text"
          id="apiCode"
          value={apiCode}
          onChange={(event) => setApiCode(event.target.value)}
        />
        <br />
        <label htmlFor="sector">Secteur:</label>
        <input
          type="text"
          id="sector"
          value={sector}
          onChange={(event) => setSector(event.target.value)}
        />
        <br />
        <label htmlFor="minExperience">Ancienneté minimale:</label>
        <input
          type="text"
          id="minExperience"
          value={minExperience}
          onChange={(event) => setMinExperience(event.target.value)}
        />
        <br />
        <label htmlFor="maxExperience">Ancienneté maximale:</label>
        <input
          type="text"
          id="maxExperience"
          value={maxExperience}
          onChange={(event) => setMaxExperience(event.target.value)}
        />
        <br />
        <label htmlFor="minRevenue">Chiffre d'affaires minimum:</label>
        <input
          type="text"
          id="minRevenue"
          value={minRevenue}
          onChange={(event) => setMinRevenue(event.target.value)}
        />
        <br />
        <label htmlFor="maxRevenue">Chiffre d'affaires maximum:</label>
        <input
          type="text"
          id="maxRevenue"
          value={maxRevenue}
          onChange={(event) => setMaxRevenue(event.target.value)}
        />
        <br />
        <button type="submit">Sauvegarder la configuration</button>
      </form>
      <h2>Configurations sauvegardées:</h2>
      <ul>
        {configurations.map((configuration, index) => (
          <li key={index}>
            Nom: {configuration.name}, Code API: {configuration.apiCode}, Secteur: {configuration.sector}, Ancienneté minimale: {configuration.minExperience}, Ancienneté maximale: {configuration.maxExperience}, Chiffre d'affaires minimum: {configuration.minRevenue}, Chiffre d'affaires maximum: {configuration.maxRevenue}
          </li>
        ))}
      </ul>
    </div>
  );
}
