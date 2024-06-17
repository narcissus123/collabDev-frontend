import {
  Box,
  Chip,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";

import CustomModal from "../../../common/CustomModal/CustomModal";

interface SkillsModalProps {
  openSkillsModal: boolean;
  handleClose: () => void;
  skills: string[];
}

export default function SkillsModal({
  openSkillsModal,
  handleClose,
  skills,
}: SkillsModalProps) {
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <CustomModal
      open={openSkillsModal}
      handleClose={() => handleClose()}
      framesx={{
        width: 600,
        border: "2px solid #000",
      }}
      headersx={{
        borderBottom: "1px solid",
        borderColor:
          theme.palette.mode === "dark" ? "secondary.main" : "border.secondary",
      }}
    >
      <Box>
        <Typography
          variant="h5"
          sx={{
            fontWeight: "600",
            mb: 3,
            pt: 2,
            color:
              theme.palette.mode === "dark" ? "text.secondary" : "text.primary",
          }}
        >
          Tech Skills
        </Typography>
        <Stack direction="row" gap={1} flexWrap="wrap">
          {skills && (
            <>
              {skills.map((skill) => (
                <Chip
                  key={uuidv4()}
                  label={skill}
                  variant="outlined"
                  size={isMediumScreen ? "small" : "medium"}
                  sx={{
                    borderColor:
                      theme.palette.mode === "dark"
                        ? "secondary.main"
                        : "border.secondary",
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "background.secondary"
                        : "background.default",
                    color:
                      theme.palette.mode === "dark"
                        ? "text.secondary"
                        : "secondary.main",
                    fontSize: isMediumScreen ? "0.7rem" : "0.8rem",
                  }}
                />
              ))}
            </>
          )}
        </Stack>
      </Box>
    </CustomModal>
  );
}
