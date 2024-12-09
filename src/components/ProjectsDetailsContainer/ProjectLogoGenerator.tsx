import React, { useState } from "react";
import { Box, IconButton, Stack, styled } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { ArrowBack, ArrowForward } from "@mui/icons-material";

type LogoStylesProps = {
  initials: string;
};

interface ProjectLogoGeneratorProps {
  initial: string;
  onStyleChange?: (style: number) => void;
  initialStyle?: number;
  isOwner: boolean;
}

const LogoContainer = styled(Box)(({ theme }) => ({
  width: "12rem",
  height: "12rem",
  padding: theme.spacing(2),
  backgroundColor: "white",
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[3],
}));

const ProjectLogoGenerator = ({
  initial,
  onStyleChange,
  initialStyle = 0,
  isOwner = false,
}: ProjectLogoGeneratorProps) => {
  const [currentStyle, setCurrentStyle] = useState(initialStyle);

  const LogoStyles = ({ initials }: LogoStylesProps) => {
    const styles = [
      // Style 1: Circuit Board Style
      <svg viewBox="0 0 200 200" width="100%" height="100%" key={uuidv4()}>
        <defs>
          <linearGradient id="techGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
        <rect width="200" height="200" fill="url(#techGradient)" />
        <g transform="translate(50, 50)">
          {initials.split("").map((letter, i) => (
            <g key={i} transform={`translate(${i * 60}, 0)`}>
              <text
                x="0"
                y="50"
                fontSize="2.25rem"
                fontWeight="bold"
                fill="white"
                style={{ fontFamily: "monospace" }}
              >
                {letter}
              </text>
              <path
                d={`M 0 70 L ${40 + Math.random() * 20} 70`}
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="2"
                fill="none"
              />
              <circle cx={40 + Math.random() * 20} cy="70" r="3" fill="white" />
            </g>
          ))}
        </g>
        <path
          d={`M 10 10 L 190 10 L 190 190 L 10 190 L 10 10`}
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="4,4"
        />
      </svg>,

      // Style 2: Brush Stroke Style
      <svg viewBox="0 0 200 200" width="100%" height="100%" key={uuidv4()}>
        <defs>
          <linearGradient id="artGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
        <g transform="translate(20, 20)">
          <path
            d="M10,10 Q80,5 160,80 T160,160"
            fill="url(#artGradient)"
            stroke="none"
          />
          <g transform="translate(90, 60)">
            {initials.split("").map((letter, i) => (
              <text
                key={i}
                x={i * 50}
                y="50"
                fontSize="3rem"
                fontWeight="bold"
                fill="white"
                style={{
                  fontFamily: "serif",
                  transform: `rotate(${Math.random() * 10 - 5}deg)`,
                }}
              >
                {letter}
              </text>
            ))}
          </g>
        </g>
      </svg>,

      // Style 3: Minimal Modern Style
      <svg viewBox="0 0 200 200" width="100%" height="100%" key={uuidv4()}>
        <defs>
          <linearGradient id="modernGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="90" fill="url(#modernGradient)" />
        <g transform="translate(50, 70)">
          {initials.split("").map((letter, i) => (
            <text
              key={i}
              x={i * 45}
              y="50"
              fontSize="3rem"
              fontWeight="bold"
              fill="white"
              style={{
                fontFamily: "sans-serif",
              }}
            >
              {letter}
            </text>
          ))}
        </g>
      </svg>,

      // Style 4: Abstract Shapes Style
      <svg viewBox="0 0 200 200" width="100%" height="100%" key={uuidv4()}>
        <defs>
          <linearGradient
            id="abstractGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
        </defs>
        <polygon
          points="100,10 190,50 190,150 100,190 10,150 10,50"
          fill="url(#abstractGradient)"
        />
        <g transform="translate(50, 70)">
          {initials.split("").map((letter, i) => (
            <text
              key={i}
              x={i * 45}
              y="50"
              fontSize="3rem"
              fontWeight="bold"
              fill="white"
              style={{
                fontFamily: "sans-serif",
              }}
            >
              {letter}
            </text>
          ))}
        </g>
      </svg>,
    ];

    return styles[currentStyle];
  };

  const handleStyleChange = (newStyle: number) => {
    setCurrentStyle(newStyle);
    onStyleChange?.(newStyle);
  };

  return (
    <Stack spacing={3} alignItems="center" sx={{ position: "relative" }}>
      <LogoContainer>
        <LogoStyles initials={initial} />
      </LogoContainer>

      {isOwner && (
        <Box
          sx={{
            position: "absolute",
            bottom: 16,
            display: "flex",
            gap: 2,
            alignItems: "center",
          }}
        >
          <IconButton
            size="small"
            onClick={() => handleStyleChange((currentStyle - 1 + 4) % 4)}
            sx={{
              bgcolor: "background.paper",
              boxShadow: 1,
              "&:hover": { bgcolor: "background.paper" },
            }}
          >
            <ArrowBack sx={{ fontSize: 16 }} />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleStyleChange((currentStyle + 1) % 4)}
            sx={{
              bgcolor: "background.paper",
              boxShadow: 1,
              "&:hover": { bgcolor: "background.paper" },
            }}
          >
            <ArrowForward sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      )}
    </Stack>
  );
};

export default ProjectLogoGenerator;
