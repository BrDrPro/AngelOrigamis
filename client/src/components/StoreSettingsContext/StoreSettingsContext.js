import React, { createContext, useEffect, useState } from 'react';
import { fetchSettings } from '../../api/settings';

// Usados enquanto a configuração real ainda não carregou (ou se a busca falhar),
// para os links de WhatsApp/e-mail/horário nunca ficarem quebrados.
const DEFAULT_SETTINGS = {
  whatsappPhone: '5531971842477',
  contactEmail: 'amgoulart@hotmail.com',
  hoursWeekdays: 'Seg a Sex: 9h - 18h',
  hoursSaturday: 'Sábado: 10h - 14h',
  hoursSunday: 'Domingo: Fechado',
};

export const StoreSettingsContext = createContext(DEFAULT_SETTINGS);

export function StoreSettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    fetchSettings()
      .then((data) => setSettings((prev) => ({ ...prev, ...data })))
      .catch((error) => console.error('Erro ao buscar configurações da loja:', error));
  }, []);

  return (
    <StoreSettingsContext.Provider value={settings}>
      {children}
    </StoreSettingsContext.Provider>
  );
}
