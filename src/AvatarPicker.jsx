import React, { useState } from "react";
import './styles/AvatarPicker.css';

const namedColors = [
  { name: "dark brown", hex: "#3b2314" },
  { name: "sienna", hex: "#a0522d" },
  { name: "tan", hex: "#d2b48c" },
  { name: "white", hex: "#fff" },
  { name: "red", hex: "#f00" },
  { name: "yellow", hex: "#ff0" },
  { name: "blue", hex: "#0af" },
  { name: "brown", hex: "#6a4e35" },
  { name: "copper", hex: "#b87333" },
  { name: "lime green", hex: "#8ACE00" }
];

const bgColors = [
  { name: "white", hex: "#ffffff" },
  { name: "black", hex: "#000000" },
  { name: "gray", hex: "#707070" },
  { name: "light blue", hex: "#3a8dde" },
  { name: "pink", hex: "#ff5c8d" },
  { name: "mint", hex: "#3ee08a" },
  { name: "lavender", hex: "#b05aff" },
  { name: "dark blue", hex: "#1a254b" },
  { name: "indigo", hex: "#3f44c0" },
  { name: "lime green", hex: "#8ace00" }
];

const skinColors = namedColors;
const hairColors = namedColors;
const eyeColors = namedColors;
const shirtColors = namedColors;

// Mapowanie nazw PL -> EN
const hairstyleOptions = {
  "krótkie": "short",
  "długie": "long",
  "kręcone": "curly",
  "łysy": "bald",
  "kucyk": "ponytail",
  "kok": "bun",
  "irokez": "mohawk"
};

const accessoriesOptions = {
  "brak": "none",
  "okulary": "black glasses",
  "czapka": "hat",
  "kolczyki": "earrings",
  "wąsy": "mustache",
  "słuchawki": "headphones"
};

function getRandom(objOrArr) {
  const keys = Array.isArray(objOrArr) ? objOrArr : Object.keys(objOrArr);
  return keys[Math.floor(Math.random() * keys.length)];
}

export default function AvatarPicker({ onComplete }) {
  const [gender, setGender] = useState("male");
  const [skinColor, setSkinColor] = useState(() => getRandom(skinColors).name);
  const [hairColor, setHairColor] = useState(() => getRandom(hairColors).name);
  const [hairstyle, setHairstyle] = useState(() => getRandom(Object.keys(hairstyleOptions)));
  const [accessory, setAccessory] = useState(() => getRandom(Object.keys(accessoriesOptions)));
  const [eyeColor, setEyeColor] = useState(() => getRandom(eyeColors).name);
  const [shirtColor, setShirtColor] = useState(() => getRandom(shirtColors).name);
  const [bgColor, setBgColor] = useState(() => getRandom(bgColors).name);

  const [avatarImageUrl, setAvatarImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const avatarData = {
    gender,
    skin_color: skinColor,
    hair_color: hairColor,
    hairstyle: hairstyleOptions[hairstyle],
    accessories: accessoriesOptions[accessory],
    eye_color: eyeColor,
    shirt_color: shirtColor,
    background_color: bgColor,
  };

  const handleGenerateAvatar = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8000/generate-avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(avatarData),
      });

      if (!response.ok) throw new Error("Błąd serwera");

      const result = await response.json();
      setAvatarImageUrl(result.image_url);
      localStorage.setItem("playerAvatar", result.image_url);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("playerAvatarData", JSON.stringify(avatarData));
    onComplete && onComplete(avatarData);
  };

  return (
    <div className="avatar-picker">
      <h2>Stwórz swój awatar</h2>

      {/* Awatar */}
      {avatarImageUrl ? (
        <img
          src={avatarImageUrl}
          alt="Wygenerowany awatar"
          style={{ width: 160, height: 160, borderRadius: 12, border: '2px solid #5b5fc7', marginBottom: '1rem', objectFit: 'cover' }}
        />
      ) : (
        <div
          style={{
            width: 160,
            height: 160,
            border: "2px dashed #7476bb",
            borderRadius: 12,
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#7476bb",
          }}
        >
          Twój awatar pojawi się po wygenerowaniu
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Płeć */}
        <label style={{ display: "block", marginTop: "12px" }}>
          Płeć:
          <select value={gender} onChange={(e) => setGender(e.target.value)} style={{ marginLeft: "8px", padding: "4px" }}>
            <option value="male">Mężczyzna</option>
            <option value="female">Kobieta</option>
            <option value="other">Inna</option>
          </select>
        </label>

        {/* Kolory */}
        {[
          { label: "Kolor skóry", colors: skinColors, selected: skinColor, setter: setSkinColor },
          { label: "Kolor włosów", colors: hairColors, selected: hairColor, setter: setHairColor },
          { label: "Kolor oczu", colors: eyeColors, selected: eyeColor, setter: setEyeColor },
          { label: "Kolor koszulki", colors: shirtColors, selected: shirtColor, setter: setShirtColor },
          { label: "Kolor tła", colors: bgColors, selected: bgColor, setter: setBgColor },
        ].map(({ label, colors, selected, setter }) => (
          <label key={label} style={{ display: "block", marginTop: "12px" }}>
            {label}:
            <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
              {colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setter(c.name)}
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    border: selected === c.name ? "2px solid #fff" : "2px solid #7476bb",
                    background: c.hex,
                    cursor: "pointer",
                    outline: "none",
                    boxShadow: selected === c.name ? "0 0 0 2px #5b5fc7" : "none",
                  }}
                  aria-label={`${label} ${c.name}`}
                />
              ))}
            </div>
          </label>
        ))}

        {/* Fryzura */}
        <label style={{ display: "block", marginTop: "12px" }}>
          Fryzura:
          <select
            value={hairstyle}
            onChange={(e) => setHairstyle(e.target.value)}
            style={{ marginLeft: "8px", padding: "4px" }}
          >
            {Object.keys(hairstyleOptions).map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
        </label>

        {/* Akcesoria */}
        <label style={{ display: "block", marginTop: "12px" }}>
          Akcesoria:
          <select
            value={accessory}
            onChange={(e) => setAccessory(e.target.value)}
            style={{ marginLeft: "8px", padding: "4px" }}
          >
            {Object.keys(accessoriesOptions).map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </label>

        {/* Przyciski */}
        <button
          type="button"
          onClick={handleGenerateAvatar}
          disabled={loading}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#5b5fc7",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: loading ? "default" : "pointer",
            marginRight: "10px",
          }}
        >
          {loading ? "Generowanie..." : "Generuj awatar"}
        </button>

        <button
          type="submit"
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#3b8beb",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Zatwierdź i przejdź dalej
        </button>
      </form>

      {error && (
        <p style={{ color: "red", marginTop: "1rem" }}>Błąd: {error}</p>
      )}
    </div>
  );
}