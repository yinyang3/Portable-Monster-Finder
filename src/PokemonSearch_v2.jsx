import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PokemonSearch_v2 = () => {
  const [pokemonName, setPokemonName] = useState('');
  const [pokemonData, setPokemonData] = useState(null);
  const [pokemonSpeciesData, setPokemonSpeciesData] = useState(null);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);

  const handleInputChange = (e) => {
    setPokemonName(e.target.value);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Se l'input è vuoto, si compie un return per fermare il codice prima delle chiamate api
    if (!pokemonName.trim()) {
      return;
    }

    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
      setPokemonData(response.data);
      setPokemonSpeciesData(null); //Ad una nuova ricerca resetta PokémonSpeciesData a Null
      setShowAdditionalInfo(false); //Ad una nuova ricerca resetta ShowAdditionalInfo a Null
    } catch (error) {
      console.error('Error fetching Pokemon data:', error);

      // Controlla se è not found (404)
      if (error.response && error.response.status === 404) {
        alert(`"${pokemonName}" not found. Try another name.`);
      } else {
        alert('Error while fetching data. Please try again.');
      }
    }
  };

  useEffect(() => {
    const fetchPokemonSpeciesData = async () => {
      if (pokemonData) {
        try {
          const response = await axios.get(pokemonData.species.url);
          setPokemonSpeciesData(response.data);
        } catch (error) {
          console.error('Error fetching Pokemon species data:', error);
        }
      }
    };

    fetchPokemonSpeciesData();
  }, [pokemonData]);

  const getDescription = (pokemonSpeciesData) => {
    const flavorTextEntry = pokemonSpeciesData.flavor_text_entries.find(
      (entry) => entry.language.name === 'en' && entry.version.name === 'sword'
    );

    return flavorTextEntry ? cleanupDescription(flavorTextEntry.flavor_text) : 'No description available.';
  };

  const cleanupDescription = (text) => {
    // Vengono rimossi spazi e altra roba
    return text.replace(/(\r\n|\n|\r|\f)/gm, ' ').replace(/\s+/g, ' ').trim();
  };

  const handleInfoButtonClick = () => {
    // Toggle
    setShowAdditionalInfo((prev) => !prev);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Insert Name"
          value={pokemonName}
          onChange={handleInputChange}
        />
        <button type="submit" className="button">
          GO
        </button>
      </form>
      {pokemonData && (
        <div className="pokemon-container">
          <h2>N° {pokemonData.order}</h2>
          <h1>{pokemonData.name.toUpperCase()}</h1>
          <img
            src={pokemonData.sprites.front_default}
            alt={pokemonData.name}
            className="pokemon-img"
          />
          <h2>Types: {pokemonData.types.map((type) => type.type.name).join(', ')}</h2>
          <button type="button" className="button" onClick={handleInfoButtonClick}>
            info
          </button>
          {showAdditionalInfo && (
            <>
              <h3>{getDescription(pokemonSpeciesData)}</h3>
              <p>Height: {pokemonData.height / 10} m</p>
              <p>Weight: {pokemonData.weight / 10} kg</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PokemonSearch_v2;