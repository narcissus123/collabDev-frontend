const SignInInputData = [
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
    labelText: "Password",
    id: "password",
    name: "password",
    autoComplete: "current-password",
    placeholder: "Password",
    type: "password",
    required: true,
    fullWidth: true,
    multiline: false,
    variant: "outlined",
    register: {
      name: "password",
      schema: {
        required: "This is required.",
        minLength: {
          value: 8,
          message: "Must be 8 characters or more.",
        },
      },
    },
  },
];

const SignUpInputData = [
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
    labelText: "Password",
    id: "password",
    name: "password",
    autoComplete: "current-password",
    placeholder: "Password",
    type: "password",
    required: true,
    fullWidth: true,
    multiline: false,
    variant: "outlined",
    register: {
      name: "password",
      schema: {
        required: "This is required.",
        minLength: {
          value: 8,
          message: "Must be 8 characters or more.",
        },
      },
    },
  },
];

export { SignInInputData, SignUpInputData };
