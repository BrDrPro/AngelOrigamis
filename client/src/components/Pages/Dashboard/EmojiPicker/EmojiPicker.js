import React, { useEffect, useRef, useState } from 'react';
import './EmojiPicker.css';

const EMOJI_CATEGORIES = [
  {
    label: 'Rostos',
    emojis: ['😀', '😃', '😄', '😁', '😊', '🙂', '😌', '😍', '🥰', '😘', '😉', '😇', '🤗', '🥳', '😎', '🤔', '🙏', '👍'],
  },
  {
    label: 'Natureza',
    emojis: ['🌿', '🌱', '🍃', '🌾', '🌸', '🌺', '🌼', '🌻', '🌷', '🌹', '🥀', '🍀', '🌳', '🌲', '🌵', '🌊', '☀️', '🌙', '⭐', '🌈', '❄️', '🔥', '🦋', '🐦', '🐝', '🐢'],
  },
  {
    label: 'Amor',
    emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💕', '💖', '💗', '💓', '💞', '💘', '💝', '💟', '💐'],
  },
  {
    label: 'Arte',
    emojis: ['🎨', '🎋', '🎭', '📜', '✂️', '🧵', '🪡', '🖌️', '🎀', '🎁', '🧶', '📿', '🖼️', '🧸', '🪅', '🪢'],
  },
  {
    label: 'Símbolos',
    emojis: ['✨', '⭐', '🌟', '💫', '🔆', '💎', '🔮', '🕊️', '☮️', '🙏', '♻️', '🧿', '☯️', '🔯', '♾️'],
  },
  {
    label: 'Casa',
    emojis: ['🏠', '🏡', '🚪', '🛏️', '🪟', '🕯️', '🪴', '🛋️', '🪑', '🧺', '🧹', '🖼️'],
  },
  {
    label: 'Festas',
    emojis: ['🎄', '🎅', '🤶', '🎉', '🎊', '🎈', '🎆', '🎇', '🥳', '🍾', '🎂', '🧨'],
  },
  {
    label: 'Comida',
    emojis: ['☕', '🍵', '🍰', '🧁', '🍫', '🍯', '🍓', '🍇', '🍎', '🍊'],
  },
  {
    label: 'Outros',
    emojis: ['✅', '📦', '💌', '🌍', '👐', '🤲', '⚡', '💡', '🔑', '🎯', '📌', '🔥', '🐇', '🐬', '🦢'],
  },
];

function EmojiPicker({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (emoji) => {
    onChange(emoji);
    setIsOpen(false);
  };

  return (
    <div className="emoji-picker" ref={containerRef}>
      <button
        type="button"
        className="emoji-picker-trigger"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {value || '🙂'}
      </button>

      {isOpen && (
        <div className="emoji-picker-panel">
          <div className="emoji-picker-tabs">
            {EMOJI_CATEGORIES.map((cat, index) => (
              <button
                type="button"
                key={cat.label}
                className={`emoji-picker-tab${activeCategory === index ? ' active' : ''}`}
                onClick={() => setActiveCategory(index)}
              >
                {cat.emojis[0]}
              </button>
            ))}
          </div>
          <div className="emoji-picker-grid">
            {EMOJI_CATEGORIES[activeCategory].emojis.map((emoji) => (
              <button
                type="button"
                key={emoji}
                className="emoji-picker-item"
                onClick={() => handleSelect(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default EmojiPicker;
