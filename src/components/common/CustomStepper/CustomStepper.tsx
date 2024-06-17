import { useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import { useEffect } from "react";

import { InputStyles, getStepStyles } from "../InputStyles/InputStyles";

interface StepperProps {
  children: React.ReactNode;
  handleActiveStep: (step: string) => void;
  steps: string[];
  activeStep: number;
}

export default function CustomStepper({
  children,
  handleActiveStep,
  steps,
  activeStep,
}: StepperProps) {
  const theme = useTheme();
  useEffect(() => {}, [activeStep]);

  const handleReset = () => {
    handleActiveStep(steps[0]);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper
        activeStep={activeStep}
        sx={{ mb: "4rem", ...InputStyles(theme) }}
      >
        {steps.map((label, index) => {
          const isActive = index === activeStep;
          const isCompleted = index < activeStep;
          return (
            <Step
              key={label}
              sx={{
                ...InputStyles(theme),
                ...getStepStyles(theme, isActive, isCompleted),
              }}
            >
              <StepLabel sx={{ ...InputStyles(theme) }}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <>
          <Typography sx={{ mt: 2, mb: 1, color: "text.secondary" }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </>
      ) : (
        <Box>{children}</Box>
      )}
    </Box>
  );
}
