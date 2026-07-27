import React, { useEffect, useMemo, useRef, useState } from 'react';
import './SearchableSelect.css';

// Combobox com busca: digita pra filtrar as opções existentes, e se não
// encontrar nada, oferece criar um novo valor (com confirmação, pra evitar
// que um typo em algo já existente vire um registro novo sem querer).
function SearchableSelect({
  id,
  value,
  onChange,
  options,
  placeholder,
  entityLabel,
  required = false,
  disabled = false,
}) {
  const [inputValue, setInputValue] = useState(value || '');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    const query = inputValue.trim().toLowerCase();
    if (!query) return options;
    return options.filter((opt) => opt.toLowerCase().includes(query));
  }, [inputValue, options]);

  const exactMatch = options.some(
    (opt) => opt.toLowerCase() === inputValue.trim().toLowerCase()
  );
  const showCreateOption = inputValue.trim().length > 0 && !exactMatch;

  const selectOption = (option) => {
    setInputValue(option);
    onChange(option);
    setIsOpen(false);
  };

  const handleCreateNew = () => {
    const newValue = inputValue.trim();
    const confirmed = window.confirm(
      `${entityLabel} "${newValue}" não existe ainda. Deseja criar como nova ${entityLabel.toLowerCase()}?`
    );
    if (confirmed) {
      selectOption(newValue);
    }
  };

  return (
    <div className="searchable-select" ref={containerRef}>
      <input
        type="text"
        id={id}
        value={inputValue}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        onFocus={() => setIsOpen(true)}
        onChange={(e) => {
          setInputValue(e.target.value);
          setIsOpen(true);
        }}
        onBlur={() => {
          // Se o usuário digitou algo e saiu do campo sem selecionar nada
          // da lista, mantém o texto digitado como valor (permite colar/editar livremente).
          onChange(inputValue.trim());
        }}
        autoComplete="off"
      />
      {isOpen && (filteredOptions.length > 0 || showCreateOption) && (
        <ul className="searchable-select-list">
          {filteredOptions.map((option) => (
            <li key={option}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectOption(option)}
              >
                {option}
              </button>
            </li>
          ))}
          {showCreateOption && (
            <li className="searchable-select-create">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={handleCreateNew}
              >
                + Criar {entityLabel.toLowerCase()}: "{inputValue.trim()}"
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

export default SearchableSelect;
