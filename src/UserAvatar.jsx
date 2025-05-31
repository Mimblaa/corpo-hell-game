import React, { useState, useEffect } from "react";

export default function UserAvatar({ size = 40, avatarData }) {
  const [avatarSrc, setAvatarSrc] = useState(null);

  useEffect(() => {
    if (avatarData) {
      setAvatarSrc(avatarData);
    } else {
      try {
        const storedAvatar = localStorage.getItem("playerAvatar");
        setAvatarSrc(storedAvatar);
      } catch {
        setAvatarSrc(null);
      }
    }
  }, [avatarData]);

  if (!avatarSrc) {
    return (
      <div
        style={{
          width: size,
          height: size,
          backgroundColor: "#ccc",
          borderRadius: "50%",
        }}
      />
    );
  }

  return (
    <img
      src={avatarSrc}
      alt="User Avatar"
      width={size}
      height={size}
      style={{ borderRadius: "50%", objectFit: "cover" }}
    />
  );
}
