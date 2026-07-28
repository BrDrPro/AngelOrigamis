import React, { useState } from 'react';

// O <select> nativo não expõe estado de "aberto/fechado" via CSS. Alterna a
// classe no mousedown (que abre ou fecha o dropdown) e fecha ao escolher um
// valor ou perder o foco, pra seta acompanhar o estado real na maioria dos casos.
function FilterSelect({ className = '', onChange, ...props }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <select
      {...props}
      className={`${className}${isOpen ? ' select-open' : ''}`.trim()}
      onMouseDown={() => setIsOpen((prev) => !prev)}
      onBlur={() => setIsOpen(false)}
      onChange={(e) => {
        setIsOpen(false);
        onChange(e);
      }}
    />
  );
}

export default FilterSelect;
