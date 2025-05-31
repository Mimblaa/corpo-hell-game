export function AvatarDisplay({
  skinColor,
  hairColor,
  hairstyle,
  accessory,
  eyeColor,
  shirtColor,
  bgColor,
  width = 80,
  height = 110,
  preserveAspectRatio = "xMidYMid meet",
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 80 110"
      preserveAspectRatio={preserveAspectRatio}
      style={{ display: "block" }}
    >
      <rect x="0" y="0" width="80" height="110" fill={bgColor || "#fff"} />
      {/* Kucyk za głową */}
      {hairstyle === "kucyk" && (
        <ellipse cx="20" cy="55" rx="10" ry="40" fill={hairColor} />
      )}
      {/* Długie włosy za głową */}
      {hairstyle === "długie" && (
        <ellipse cx="40" cy="55" rx="35" ry="50" fill={hairColor} />
      )}
      {/* Uszy - rysowane pod główną częścią głowy, ale nad tylnymi włosami */}
      <ellipse cx="12" cy="42" rx="6" ry="10" fill={skinColor} />
      <ellipse cx="68" cy="42" rx="6" ry="10" fill={skinColor} />
      {/* Głowa */}
      <ellipse cx="40" cy="40" rx="30" ry="35" fill={skinColor} />
      {/* Włosy na głowie */}
      {hairstyle === "krótkie" && (
        <>
          <ellipse cx="40" cy="20" rx="28" ry="18" fill={hairColor} />
          <ellipse cx="40" cy="23" rx="27" ry="18" fill={hairColor} />
          <ellipse
            cx="14"
            cy="30"
            rx="7"
            ry="15"
            fill={hairColor}
            transform="rotate(10 18 42)"
          />
          <ellipse
            cx="67"
            cy="30"
            rx="7"
            ry="15"
            fill={hairColor}
            transform="rotate(-10 62 42)"
          />
        </>
      )}
      {hairstyle === "długie" && ( // Włosy na głowie dla długich włosów
        <>
          <ellipse cx="40" cy="23" rx="27" ry="18" fill={hairColor} />
          <ellipse
            cx="14"
            cy="35"
            rx="7"
            ry="15"
            fill={hairColor}
            transform="rotate(10 18 42)"
          />
          <ellipse
            cx="67"
            cy="35"
            rx="7"
            ry="15"
            fill={hairColor}
            transform="rotate(-10 62 42)"
          />
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
      {hairstyle === "kucyk" && ( // Włosy na głowie dla kucyka
        <>
          <ellipse cx="40" cy="23" rx="30" ry="18" fill={hairColor} />
          <ellipse
            cx="14"
            cy="32"
            rx="7"
            ry="15"
            fill={hairColor}
            transform="rotate(10 18 42)"
          />
          <ellipse
            cx="67"
            cy="32"
            rx="7"
            ry="15"
            fill={hairColor}
            transform="rotate(-10 62 42)"
          />
        </>
      )}
      {hairstyle === "kok" && (
        <>
          <ellipse cx="40" cy="15" rx="18" ry="10" fill={hairColor} />{" "}
          {/* Główna część koka */}
          <ellipse cx="40" cy="6" rx="10" ry="6" fill={hairColor} />{" "}
          {/* Mniejsza część na górze */}
        </>
      )}
      {hairstyle === "irokez" && (
        <rect x="36" y="2" width="8" height="35" rx="4" fill={hairColor} />
      )}
      {/* Oczy */}
      <ellipse cx="30" cy="45" rx="4" ry="3" fill={eyeColor} />
      <ellipse cx="50" cy="45" rx="4" ry="3" fill={eyeColor} />
      {/* Nos */}
      <ellipse cx="40" cy="54" rx="2.2" ry="4" fill="#b97a56" opacity="0.7" />
      {/* Usta */}
      <path
        d="M32,62 Q40,69 48,62"
        stroke="#a0522d"
        strokeWidth="2"
        fill="none"
      />
      {/* Akcesoria - rysowane na wierzchu */}
      {accessory === "okulary" && (
        <g>
          <ellipse
            cx="28"
            cy="45"
            rx="8"
            ry="5"
            fill="none"
            stroke="#222"
            strokeWidth="2"
          />
          <ellipse
            cx="52"
            cy="45"
            rx="8"
            ry="5"
            fill="none"
            stroke="#222"
            strokeWidth="2"
          />
          <rect x="36" y="44" width="8" height="2" fill="#222" />
        </g>
      )}
      {accessory === "czapka" && ( // Czapka na włosach
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
          <ellipse
            cx="34"
            cy="60"
            rx="7"
            ry="2.2"
            fill="#6a4e35"
            transform="rotate(-17 34 57)"
          />
          <ellipse
            cx="46"
            cy="60"
            rx="7"
            ry="2.2"
            fill="#6a4e35"
            transform="rotate(17 46 57)"
          />
        </>
      )}
      {accessory === "słuchawki" && ( // Słuchawki na włosach/uszach
        <g>
          <rect x="5" y="15" width="10" height="35" rx="5" fill="#222" />{" "}
          {/* Lewa słuchawka */}
          <rect x="65" y="15" width="10" height="35" rx="5" fill="#222" />{" "}
          {/* Prawa słuchawka */}
          <rect x="10" y="10" width="60" height="10" rx="5" fill="#888" />{" "}
          {/* Pałąk */}
        </g>
      )}
      {/* Koszulka - pod głową */}
      <rect x="15" y="75" width="50" height="30" rx="12" fill={shirtColor} />
    </svg>
  );
}
