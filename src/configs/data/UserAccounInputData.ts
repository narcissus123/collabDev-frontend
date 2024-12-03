const UserAccounInputData = [
  {
    sx: {},
    margin: "dense",
    labelText: "Full name",
    id: "name",
    name: "name",
    autoComplete: "name",
    placeholder: "Full name",
    type: "text",
    required: true,
    fullWidth: true,
    multiline: false,
    variant: "outlined",
    ptClassName: {
      labelStyle: {
        width: "100%",
        color: "text.secondary",
        position: "relative",
        "&::after": {
          content: '"*"',
          marginLeft: "4px",
          position: "absolute",
          top: 0,
        },
      },
    },
    register: {
      name: "name",
      schema: {
        required: "This is required.",
        minLength: {
          value: 2,
          message: "Must be 2 characters or more.",
        },
        maxLength: {
          value: 30,
          message: "Must be 30 characters or less.",
        },
      },
    },
  },
  {
    sx: {},
    margin: "dense",
    labelText: "Email Address",
    id: "email",
    name: "email",
    autoComplete: "email",
    placeholder: "Email",
    type: "email",
    required: true,
    fullWidth: true,
    multiline: false,
    variant: "outlined",
    register: {
      name: "email",
      schema: {
        required: "This is required.",
      },
    },
  },
  {
    sx: {},
    margin: "dense",
    labelText: "Bio",
    id: "bio",
    name: "bio",
    autoComplete: "",
    placeholder: "Share your bio",
    type: "text",
    required: true,
    fullWidth: true,
    multiline: true,
    variant: "standard",
    register: {
      name: "bio",
      schema: {
        required: "This is required.",
      },
    },
  },
];

export { UserAccounInputData };
