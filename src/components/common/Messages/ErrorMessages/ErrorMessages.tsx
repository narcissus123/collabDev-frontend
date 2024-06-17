import { ErrorMessage } from "@hookform/error-message";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";

interface ErrorMessagesProps {
  name: string;
  errors: object;
  sx?: any;
}

// This component renders message for invalid inputs in the forms.
const ErrorMessages: React.FC<ErrorMessagesProps> = (props) => {
  return (
    <Box component="span" sx={{ color: "red" }}>
      <ErrorMessage
        errors={props.errors}
        name={props.name}
        render={({ message }) => (
          <Typography component="span">{message}</Typography>
        )}
      />
    </Box>
  );
};

export default ErrorMessages;
