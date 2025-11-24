// components/BeeLogo.tsx - Versão Simples
import * as React from "react";
import Svg, { Path, Circle } from "react-native-svg";

type BeeLogoProps = {
  size?: number;
  color?: string;
};

export function BeeLogo({ size = 32, color = "#F2E28D" }: BeeLogoProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32">
      {/* Corpo com listras */}
      <Path
        d="M8 16C8 10 12 6 16 6C20 6 24 10 24 16C24 22 20 26 16 26C12 26 8 22 8 16Z"
        fill={color}
      />
      
      {/* Listras horizontais */}
      <Path
        d="M9 10H23M9 14H23M9 18H23M9 22H23"
        stroke="#1E1E1E"
        strokeWidth="2"
        strokeLinecap="round"
      />
      
      {/* Cabeça */}
      <Circle cx="16" cy="8" r="3" fill="#1E1E1E" />
      
      {/* Olhos */}
      <Circle cx="14.5" cy="7" r="1" fill="#FFFFFF" />
      <Circle cx="17.5" cy="7" r="1" fill="#FFFFFF" />
      
      {/* Asas */}
      <Path
        d="M20 12C22 10 26 12 26 15C26 18 22 20 20 18"
        fill="#FFFFFF"
        opacity="0.8"
      />
      <Path
        d="M12 12C10 10 6 12 6 15C6 18 10 20 12 18"
        fill="#FFFFFF"
        opacity="0.8"
      />
    </Svg>
  );
}