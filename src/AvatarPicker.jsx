import React, { useState, useEffect } from "react";

import './styles/AvatarPicker.css';

const namedColors = [
  { name: "dark brown", hex: "#3b2314" }, { name: "sienna", hex: "#a0522d" },
  { name: "tan", hex: "#d2b48c" }, { name: "white", hex: "#fff" },
  { name: "red", hex: "#f00" }, { name: "yellow", hex: "#ff0" },
  { name: "blue", hex: "#0af" }, { name: "brown", hex: "#6a4e35" },
  { name: "copper", hex: "#b87333" }, { name: "lime green", hex: "#8ACE00" }
];

const bgColors = [
  { name: "white", hex: "#ffffff" }, { name: "black", hex: "#000000" },
  { name: "gray", hex: "#707070" }, { name: "light blue", hex: "#3a8dde" },
  { name: "pink", hex: "#ff5c8d" }, { name: "mint", hex: "#3ee08a" },
  { name: "lavender", hex: "#b05aff" }, { name: "dark blue", hex: "#1a254b" },
  { name: "indigo", hex: "#3f44c0" }, { name: "lime green", hex: "#8ace00" }
];

const skinColors = namedColors;
const hairColors = namedColors;
const eyeColors = namedColors;
const shirtColors = namedColors;

const hairstyleOptions = {
  "krótkie": "short", "długie": "long", "kręcone": "curly",
  "łysy": "bald", "kucyk": "ponytail", "kok": "bun", "irokez": "mohawk"
};
const hairstyles = Object.keys(hairstyleOptions);

const accessoriesOptions = {
  "brak": "none", "okulary": "black glasses", "czapka": "hat",
  "kolczyki": "earrings", "wąsy": "mustache", "słuchawki": "headphones"
};
const accessories = Object.keys(accessoriesOptions);

function getRandom(arrOrObj) {
  if (Array.isArray(arrOrObj)) {
    return arrOrObj[Math.floor(Math.random() * arrOrObj.length)];
  }
  const keys = Object.keys(arrOrObj);
  return keys[Math.floor(Math.random() * keys.length)];
}


function AvatarPreview({ skinColor, hairColor, hairstyle, accessory, eyeColor, shirtColor, bgColor }) {
  return (
    <svg width="160" height="220" viewBox="0 0 80 110" style={{ borderRadius: 12, border: '2px solid #5b5fc7', marginBottom: '1rem', display: 'block', margin: '1rem auto' }}>
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
  const [avatarType, setAvatarType] = useState('svg'); // 'svg' or 'api'

  const [gender, setGender] = useState("male");
  const [skinColorName, setSkinColorName] = useState(() => getRandom(skinColors).name);
  const [hairColorName, setHairColorName] = useState(() => getRandom(hairColors).name);
  const [hairstyleKey, setHairstyleKey] = useState(() => getRandom(Object.keys(hairstyleOptions)));
  const [accessoryKey, setAccessoryKey] = useState(() => getRandom(Object.keys(accessoriesOptions)));
  const [eyeColorName, setEyeColorName] = useState(() => getRandom(eyeColors).name);
  const [shirtColorName, setShirtColorName] = useState(() => getRandom(shirtColors).name);
  const [bgColorName, setBgColorName] = useState(() => getRandom(bgColors).name);

  const [avatarImageUrl, setAvatarImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getHex = (colorName, colorArray) => colorArray.find(c => c.name === colorName)?.hex;

   useEffect(() => {
    if (avatarType !== 'api') {
      setAvatarImageUrl(null); // Clear image if not in API mode
    }

  }, [avatarType]);


  const avatarDataForApi = { // Used for sending to API
    gender,
    skin_color: skinColorName,
    hair_color: hairColorName,
    hairstyle: hairstyleOptions[hairstyleKey],
    accessories: accessoriesOptions[accessoryKey],
    eye_color: eyeColorName,
    shirt_color: shirtColorName,
    background_color: bgColorName,
  };

  const handleGenerateAvatar = async () => {
    setLoading(true);
    setError(null);
    setAvatarImageUrl(null); // Clear previous image
    try {
      const response = await fetch("http://localhost:8000/generate-avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(avatarDataForApi),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Błąd serwera" }));
        throw new Error(errorData.message || "Błąd serwera");
      }
      const result = await response.json();
      setAvatarImageUrl(result.image_url);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const finalAvatarData = {
      gender,
      skin_color_name: skinColorName,
      hair_color_name: hairColorName,
      hairstyle_key: hairstyleKey, // Polish key for UI/SVG
      hairstyle_value: hairstyleOptions[hairstyleKey], // English value for API
      accessory_key: accessoryKey, // Polish key for UI/SVG
      accessory_value: accessoriesOptions[accessoryKey], // English value for API
      eye_color_name: eyeColorName,
      shirt_color_name: shirtColorName,
      background_color_name: bgColorName,
      avatarType: avatarType,
      // Hex values for convenience if consumer needs them
      skin_color_hex: getHex(skinColorName, skinColors),
      hair_color_hex: getHex(hairColorName, hairColors),
      eye_color_hex: getHex(eyeColorName, eyeColors),
      shirt_color_hex: getHex(shirtColorName, shirtColors),
      background_color_hex: getHex(bgColorName, bgColors),
    };

    localStorage.setItem("playerAvatarData", JSON.stringify(finalAvatarData));

    if (avatarType === 'api' && avatarImageUrl) {
      localStorage.setItem("playerAvatarUrl", avatarImageUrl);
    } else {
      localStorage.removeItem("playerAvatarUrl");
    }

    onComplete && onComplete(finalAvatarData);
  };

  const commonButtonStyle = (isActive) => ({
    padding: '8px 15px',
    border: '1px solid #7476bb',
    backgroundColor: isActive ? '#5b5fc7' : '#f0f0f0',
    color: isActive ? '#fff' : '#333',
    cursor: 'pointer',
    fontWeight: isActive ? 'bold' : 'normal',
  });

  return (
    <div className="avatar-picker">
      <h2>Stwórz swój awatar</h2>

      <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
        <label style={{ marginRight: '10px' }}>Typ awatara: </label>
        <button
          onClick={() => { setAvatarType('svg'); setError(null); }}
          style={{ ...commonButtonStyle(avatarType === 'svg'), borderTopLeftRadius: '4px', borderBottomLeftRadius: '4px' }}
        >
          SVG (Edytor)
        </button>
        <button
          onClick={() => setAvatarType('api')}
          style={{ ...commonButtonStyle(avatarType === 'api'), borderTopRightRadius: '4px', borderBottomRightRadius: '4px', marginLeft: '-1px' }}
        >
          Generowany (AI)
        </button>
      </div>

      {avatarType === 'svg' ? (
        <AvatarPreview
          skinColor={getHex(skinColorName, skinColors) || skinColors[0].hex}
          hairColor={getHex(hairColorName, hairColors) || hairColors[0].hex}
          hairstyle={hairstyleKey}
          accessory={accessoryKey}
          eyeColor={getHex(eyeColorName, eyeColors) || eyeColors[0].hex}
          shirtColor={getHex(shirtColorName, shirtColors) || shirtColors[0].hex}
          bgColor={getHex(bgColorName, bgColors) || bgColors[0].hex}
        />
      ) : (
        avatarImageUrl ? (
          <img
            src={avatarImageUrl}
            alt="Wygenerowany awatar"
            style={{ width: 160, height: 160, borderRadius: 12, border: '2px solid #5b5fc7', marginBottom: '1rem', objectFit: 'cover', display: 'block', margin: '1rem auto' }}
          />
        ) : (
          <div
            style={{
              width: 160, height: 160, border: "2px dashed #7476bb", borderRadius: 12,
              marginBottom: "1rem", display: "flex", alignItems: "center",
              justifyContent: "center", color: "#7476bb", textAlign: 'center', margin: '1rem auto'
            }}
          >
            {loading ? "Ładowanie..." : (error ? "Błąd" : "Awatar pojawi się tutaj po wygenerowaniu")}
          </div>
        )
      )}

      <form onSubmit={handleSubmit}>
        <label style={{ display: "block", marginTop: "12px" }}>
          Płeć:
          <select value={gender} onChange={(e) => setGender(e.target.value)} style={{ marginLeft: "8px", padding: "4px" }}>
            <option value="male">Mężczyzna</option>
            <option value="female">Kobieta</option>
            <option value="other">Inna</option>
          </select>
        </label>

        {[
          { label: "Kolor skóry", colors: skinColors, selected: skinColorName, setter: setSkinColorName },
          { label: "Kolor włosów", colors: hairColors, selected: hairColorName, setter: setHairColorName },
          { label: "Kolor oczu", colors: eyeColors, selected: eyeColorName, setter: setEyeColorName },
          { label: "Kolor koszulki", colors: shirtColors, selected: shirtColorName, setter: setShirtColorName },
          { label: "Kolor tła", colors: bgColors, selected: bgColorName, setter: setBgColorName },
        ].map(({ label, colors, selected, setter }) => (
          <label key={label} style={{ display: "block", marginTop: "12px" }}>
            {label}:
            <div style={{ display: "flex", gap: "8px", marginTop: "8px", flexWrap: 'wrap' }}>
              {colors.map((c) => (
                <button
                  key={c.name} type="button" onClick={() => setter(c.name)}
                  style={{
                    width: "28px", height: "28px", borderRadius: "50%",
                    border: selected === c.name ? "2px solid #fff" : "2px solid #7476bb",
                    background: c.hex, cursor: "pointer", outline: "none",
                    boxShadow: selected === c.name ? "0 0 0 2px #5b5fc7" : "none",
                  }}
                  aria-label={`${label} ${c.name}`}
                />
              ))}
            </div>
          </label>
        ))}

        <label style={{ display: "block", marginTop: "12px" }}>
          Fryzura:
          <select value={hairstyleKey} onChange={(e) => setHairstyleKey(e.target.value)} style={{ marginLeft: "8px", padding: "4px" }}>
            {Object.keys(hairstyleOptions).map((h) => (<option key={h} value={h}>{h}</option>))}
          </select>
        </label>

        <label style={{ display: "block", marginTop: "12px" }}>
          Akcesoria:
          <select value={accessoryKey} onChange={(e) => setAccessoryKey(e.target.value)} style={{ marginLeft: "8px", padding: "4px" }}>
            {Object.keys(accessoriesOptions).map((a) => (<option key={a} value={a}>{a}</option>))}
          </select>
        </label>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          {avatarType === 'api' && (
            <button
              type="button" onClick={handleGenerateAvatar} disabled={loading}
              style={{
                padding: "10px 20px", backgroundColor: loading ? "#aaa" : "#5b5fc7", color: "#fff",
                border: "none", borderRadius: "6px", cursor: loading ? "default" : "pointer", marginRight: "10px",
              }}
            >
              {loading ? "Generowanie..." : "Generuj awatar (AI)"}
            </button>
          )}
          <button
            type="submit"
            style={{
              padding: "10px 20px", backgroundColor: "#3b8beb", color: "#fff",
              border: "none", borderRadius: "6px", cursor: "pointer",
            }}
          >
            Zatwierdź i przejdź dalej
          </button>
        </div>
      </form>

      {avatarType === 'api' && error && (
        <p style={{ color: "red", marginTop: "1rem", textAlign: 'center' }}>Błąd: {error}</p>
      )}
    </div>
  );
}