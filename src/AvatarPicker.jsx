import React, { useState } from "react";
import './AvatarPicker.css';

const colorOptions = [
  "#3b2314", "#a0522d", "#d2b48c", "#fff", "#f00", "#ff0", "#0af", "#6a4e35", "#b87333", "#e5c07b"
];
const skinColors = colorOptions;
const hairColors = colorOptions;
const eyeColors = colorOptions;
const shirtColors = colorOptions;
const bgColors = [
  "#fff", "#f5f5f5", "#e0e0e0", "#d0e6fa", "#ffe4e1", "#e1ffe4", "#f9e1ff", "#232946", "#5b5fc7", "#fffae3"
];

const hairstyles = [
  "krótkie", // short
  "długie", // long
  "kręcone", // curly
  "łysy", // bald
  "kucyk", // ponytail
  "kok", // bun
  "irokez" // mohawk
];
const accessories = [
  "brak", // none
  "okulary", // glasses
  "czapka", // hat
  "kolczyki", // earrings
  "wąsy", // mustache
  "słuchawki" // headphones
];

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function AvatarPreview({ skinColor, hairColor, hairstyle, accessory, eyeColor, shirtColor, bgColor }) {
  return (
    <svg width="80" height="110" viewBox="0 0 80 110">
      <rect x="0" y="0" width="80" height="110" fill={bgColor || '#fff'} />
      {/* Ponytail behind the head */}
      {hairstyle === "kucyk" && (
        <ellipse cx="20" cy="55" rx="10" ry="40" fill={hairColor} />
      )}
        {/* hair behind the head */}
      {hairstyle === "długie" && (
        <ellipse cx="40" cy="55" rx="35" ry="50" fill={hairColor} />
      )}
      {/* Head */}
      {/* Ears */}
      <ellipse cx="12" cy="42" rx="6" ry="10" fill={skinColor} />
      <ellipse cx="68" cy="42" rx="6" ry="10" fill={skinColor} />
      <ellipse cx="40" cy="40" rx="30" ry="35" fill={skinColor} />
      {/* Hair*/}
      {hairstyle === "krótkie" && (
        <>
        <ellipse cx="40" cy="20" rx="28" ry="18" fill={hairColor} />
        <ellipse cx="40" cy="23" rx="27" ry="18" fill={hairColor} />
          <ellipse cx="14" cy="30" rx="7" ry="15" fill={hairColor} transform="rotate(10 18 42)" />
          <ellipse cx="67" cy="30" rx="7" ry="15" fill={hairColor} transform="rotate(-10 62 42)" />
        </>
      )}
      {hairstyle === "długie" && (
        <>
          <ellipse cx="40" cy="23" rx="27" ry="18" fill={hairColor} />
          <ellipse cx="14" cy="35" rx="7" ry="15" fill={hairColor} transform="rotate(10 18 42)" />
          <ellipse cx="67" cy="35" rx="7" ry="15" fill={hairColor} transform="rotate(-10 62 42)" />
        </>
      )}
      {hairstyle === "kręcone" && (
        <g>
          <ellipse cx="40" cy="24" rx="28" ry="18" fill={hairColor} />
          <ellipse cx="15" cy="30" rx="7" ry="7" fill={hairColor} />
          <ellipse cx="65" cy="30" rx="7" ry="7" fill={hairColor} />
          <ellipse cx="25" cy="14" rx="6" ry="6" fill={hairColor} />
          <ellipse cx="55" cy="14" rx="6" ry="6" fill={hairColor} />
          <ellipse cx="40" cy="8" rx="12" ry="7" fill={hairColor} />
        </g>
      )}
      {hairstyle === "kucyk" && (
        <>
          <ellipse cx="40" cy="23" rx="30" ry="18" fill={hairColor} />
          <ellipse cx="14" cy="32" rx="7" ry="15" fill={hairColor} transform="rotate(10 18 42)" />
          <ellipse cx="67" cy="32" rx="7" ry="15" fill={hairColor} transform="rotate(-10 62 42)" />
        </>
      )}
      {hairstyle === "kok" && (
        <>
          <ellipse cx="40" cy="15" rx="18" ry="10" fill={hairColor} />
          <ellipse cx="40" cy="6" rx="10" ry="6" fill={hairColor} />
        </>
      )}
      {hairstyle === "irokez" && (
        <rect x="36" y="2" width="8" height="35" rx="4" fill={hairColor} />
      )}
      {/* Eyes */}
      <ellipse cx="30" cy="45" rx="4" ry="3" fill={eyeColor} />
      <ellipse cx="50" cy="45" rx="4" ry="3" fill={eyeColor} />
      {/* Nose */}
      <ellipse cx="40" cy="54" rx="2.2" ry="4" fill="#b97a56" opacity="0.7" />
      {/* Mouth */}
      <path d="M32,62 Q40,69 48,62" stroke="#a0522d" strokeWidth="2" fill="none" />
      {/* Accessories */}
      {accessory === "okulary" && (
        <g>
          <ellipse cx="28" cy="45" rx="8" ry="5" fill="none" stroke="#222" strokeWidth="2" />
          <ellipse cx="52" cy="45" rx="8" ry="5" fill="none" stroke="#222" strokeWidth="2" />
          <rect x="36" y="44" width="8" height="2" fill="#222" />
        </g>
      )}
      {accessory === "czapka" && (
        <rect x="10" y="2" width="60" height="20" rx="8" fill="#333" />
      )}
      {accessory === "kolczyki" && (
        <>
          <circle cx="12" cy="54" r="3" fill="#ffd700" />
          <circle cx="68" cy="54" r="3" fill="#ffd700" />
        </>
      )}
      {accessory === "wąsy" && (
        <>
          <ellipse cx="34" cy="60" rx="7" ry="2.2" fill="#6a4e35" transform="rotate(-17 34 57)" />
          <ellipse cx="46" cy="60" rx="7" ry="2.2" fill="#6a4e35" transform="rotate(17 46 57)" />
        </>
      )}
      {accessory === "słuchawki" && (
        <g>
          <rect x="5" y="15" width="10" height="35" rx="5" fill="#222" />
          <rect x="65" y="15" width="10" height="35" rx="5" fill="#222" />
          <rect x="10" y="10" width="60" height="10" rx="5" fill="#888" />
        </g>
      )}
      {/* Shirt */}
      <rect x="15" y="75" width="50" height="30" rx="12" fill={shirtColor} />
    </svg>
  );
}

export default function AvatarPicker({ onComplete }) {
  const [skinColor, setSkinColor] = useState(() => getRandom(skinColors));
  const [hairColor, setHairColor] = useState(() => getRandom(hairColors));
  const [hairstyle, setHairstyle] = useState(() => getRandom(hairstyles));
  const [accessory, setAccessory] = useState(() => getRandom(accessories));
  const [eyeColor, setEyeColor] = useState(() => getRandom(eyeColors));
  const [shirtColor, setShirtColor] = useState(() => getRandom(shirtColors));
  const [bgColor, setBgColor] = useState(() => getRandom(bgColors));

  const handleSubmit = (e) => {
    e.preventDefault();
    const avatarData = { skinColor, hairColor, hairstyle, accessory, eyeColor, shirtColor, bgColor };
    localStorage.setItem("playerAvatar", JSON.stringify(avatarData));
    onComplete(avatarData);
  };

  return (
    <div className="avatar-picker">
      <h2>Stwórz swój awatar</h2>
      <AvatarPreview skinColor={skinColor} hairColor={hairColor} hairstyle={hairstyle} accessory={accessory} eyeColor={eyeColor} shirtColor={shirtColor} bgColor={bgColor} />
      <form onSubmit={handleSubmit}>
        <label>Kolor skóry:
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px', justifyContent: 'center' }}>
            {skinColors.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setSkinColor(c)}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  border: skinColor === c ? '2px solid #fff' : '2px solid #7476bb',
                  background: c,
                  cursor: 'pointer',
                  outline: 'none',
                  boxShadow: skinColor === c ? '0 0 0 2px #5b5fc7' : 'none',
                }}
                aria-label={c}
              />
            ))}
          </div>
        </label>
        <label>Kolor włosów:
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px', justifyContent: 'center' }}>
            {hairColors.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setHairColor(c)}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  border: hairColor === c ? '2px solid #fff' : '2px solid #7476bb',
                  background: c,
                  cursor: 'pointer',
                  outline: 'none',
                  boxShadow: hairColor === c ? '0 0 0 2px #5b5fc7' : 'none',
                }}
                aria-label={c}
              />
            ))}
          </div>
        </label>
        <label>Fryzura:
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px', justifyContent: 'center' }}>
            {hairstyles.map(h => (
              <button
                key={h}
                type="button"
                onClick={() => setHairstyle(h)}
                style={{
                  padding: '0 12px',
                  height: '28px',
                  borderRadius: '14px',
                  border: hairstyle === h ? '2px solid #fff' : '2px solid #7476bb',
                  background: hairstyle === h ? '#5b5fc7' : '#232946',
                  color: '#fff',
                  cursor: 'pointer',
                  outline: 'none',
                  fontWeight: hairstyle === h ? 'bold' : 'normal',
                  boxShadow: hairstyle === h ? '0 0 0 2px #5b5fc7' : 'none',
                }}
              >{h}</button>
            ))}
          </div>
        </label>
        <label>Akcesoria:
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {accessories.map(a => (
              <button
                key={a}
                type="button"
                onClick={() => setAccessory(a)}
                style={{
                  padding: '0 12px',
                  height: '28px',
                  borderRadius: '14px',
                  border: accessory === a ? '2px solid #fff' : '2px solid #7476bb',
                  background: accessory === a ? '#5b5fc7' : '#232946',
                  color: '#fff',
                  cursor: 'pointer',
                  outline: 'none',
                  fontWeight: accessory === a ? 'bold' : 'normal',
                  boxShadow: accessory === a ? '0 0 0 2px #5b5fc7' : 'none',
                  marginBottom: '4px',
                }}
              >{a}</button>
            ))}
          </div>
        </label>
        <label>Kolor oczu:
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px', justifyContent: 'center' }}>
            {eyeColors.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setEyeColor(c)}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  border: eyeColor === c ? '2px solid #fff' : '2px solid #7476bb',
                  background: c,
                  cursor: 'pointer',
                  outline: 'none',
                  boxShadow: eyeColor === c ? '0 0 0 2px #5b5fc7' : 'none',
                }}
                aria-label={c}
              />
            ))}
          </div>
        </label>
        <label>Kolor koszulki:
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px', justifyContent: 'center' }}>
            {shirtColors.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setShirtColor(c)}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  border: shirtColor === c ? '2px solid #fff' : '2px solid #7476bb',
                  background: c,
                  cursor: 'pointer',
                  outline: 'none',
                  boxShadow: shirtColor === c ? '0 0 0 2px #5b5fc7' : 'none',
                }}
                aria-label={c}
              />
            ))}
          </div>
        </label>
        <label>Kolor tła:
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px', justifyContent: 'center' }}>
            {bgColors.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setBgColor(c)}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  border: bgColor === c ? '2px solid #fff' : '2px solid #7476bb',
                  background: c,
                  cursor: 'pointer',
                  outline: 'none',
                  boxShadow: bgColor === c ? '0 0 0 2px #5b5fc7' : 'none',
                }}
                aria-label={c}
              />
            ))}
          </div>
        </label>
        <button type="submit">Zatwierdź awatar</button>
      </form>
    </div>
  );
}
