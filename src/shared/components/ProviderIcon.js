"use client";

import { useState } from "react";
import PropTypes from "prop-types";

export default function ProviderIcon({
  src,
  alt,
  size = 32,
  className = "",
  fallbackText = "?",
  fallbackColor,
}) {
  const [stage, setStage] = useState(src ? "primary" : "default");
  const currentSrc = stage === "primary" ? src : stage === "default" ? "/providers/default-icon.png" : null;

  if (!currentSrc) {
    return (
      <span
        className={`inline-flex items-center justify-center font-bold rounded-lg ${className}`.trim()}
        style={{
          width: size,
          height: size,
          color: fallbackColor,
          fontSize: Math.max(10, Math.floor(size * 0.38)),
        }}
      >
        {fallbackText}
      </span>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      width={size}
      height={size}
      className={className}
      onError={() => setStage(stage === "primary" ? "default" : "text")}
    />
  );
}

ProviderIcon.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  size: PropTypes.number,
  className: PropTypes.string,
  fallbackText: PropTypes.string,
  fallbackColor: PropTypes.string,
};
