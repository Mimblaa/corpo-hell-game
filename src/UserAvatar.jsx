import React, { useState, useEffect } from "react";
import { AvatarDisplay } from './AvatarDisplay';

export default function UserAvatar({ size = 40, avatarData: avatarDataProp }) {
  const [displayMode, setDisplayMode] = useState('fallback');
  const [svgParams, setSvgParams] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [fallbackBgColor, setFallbackBgColor] = useState("#ccc");

  useEffect(() => {
    let effectiveAvatarData = null;

    if (avatarDataProp) {
      effectiveAvatarData = avatarDataProp;
    } else {
      try {
        const storedDataString = localStorage.getItem("playerAvatarData");
        if (storedDataString) {
          effectiveAvatarData = JSON.parse(storedDataString);
        }
      } catch (e) {
        console.error("Failed to load avatar data from localStorage", e);
      }
    }

    if (effectiveAvatarData) {
      setFallbackBgColor(effectiveAvatarData.background_color_hex || "#ccc");
      const type = effectiveAvatarData.avatarType;

      if (type === 'api') {
        const apiUrlFromStorage = localStorage.getItem("playerAvatarUrl");
        if (apiUrlFromStorage) {
          setImageUrl(apiUrlFromStorage);
          setDisplayMode('api_image');
        } else {
          setDisplayMode('fallback');
        }
      } else if (type === 'svg') {
        setSvgParams({
          skinColor: effectiveAvatarData.skin_color_hex,
          hairColor: effectiveAvatarData.hair_color_hex,
          hairstyle: effectiveAvatarData.hairstyle_key,
          accessory: effectiveAvatarData.accessory_key,
          eyeColor: effectiveAvatarData.eye_color_hex,
          shirtColor: effectiveAvatarData.shirt_color_hex,
          bgColor: effectiveAvatarData.background_color_hex,
        });
        setDisplayMode('svg');
      } else {
        setDisplayMode('fallback');
      }
    } else {
      setFallbackBgColor("#ccc");
      setDisplayMode('fallback');
    }
  }, [avatarDataProp]);

  if (displayMode === 'api_image' && imageUrl) {
    return (
      <img
        src={imageUrl}
        alt="User Avatar"
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          display: 'block',
        }}
      />
    );
  } else if (displayMode === 'svg' && svgParams) {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          overflow: "hidden",
        }}
      >
        <AvatarDisplay
          {...svgParams}
          width={size}
          height={size}
          preserveAspectRatio="xMidYMid slice"
        />
      </div>
    );
  } else {
    return (
      <div
        style={{
          width: size,
          height: size,
          backgroundColor: fallbackBgColor,
          borderRadius: "50%",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />
    );
  }
}
