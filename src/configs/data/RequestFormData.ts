export const RequestInputData = [
  {
    sx: {},
    margin: "dense",
    labelText: "",
    id: "message",
    name: "message",
    autoComplete: "email",
    placeholder: "Leave a message",
    type: "text",
    required: true,
    fullWidth: true,
    multiline: true,
    variant: "standard",
    register: {
      name: "message",
      schema: {
        required: "This is required.",
      },
    },
  },
];
