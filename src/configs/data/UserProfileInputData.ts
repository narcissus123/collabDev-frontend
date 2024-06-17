const ProfileDetailsInputData = [
  {
    sx: {},
    margin: "dense",
    labelText: "About",
    id: "about",
    name: "about",
    autoComplete: "email",
    placeholder:
      "Share a brief description about yourself, your interests, and what you do.",
    type: "text",
    required: true,
    fullWidth: true,
    multiline: true,
    variant: "standard",
    register: {
      name: "about",
      schema: {
        required: "This is required.",
      },
    },
  },
];

export { ProfileDetailsInputData };
