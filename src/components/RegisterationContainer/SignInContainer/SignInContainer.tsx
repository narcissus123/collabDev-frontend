import { Stack, useMediaQuery, useTheme } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

import { SignInInputData } from "../../../configs/data/RegistrationInputData";
import { SignInDeveloper } from "../../../core/services/api/developer-authentication.api";
import Input from "../../common/Input/Input";
import { useAuth } from "../../../context/AuthContext/AuthContext";
import { getImageUrl } from "../../../core/utils/ImageUtils/imageUtils";

interface SignInContainerProps {
  handleSignIn: (signIn: boolean) => void;
}

interface FormValues {
  email: string;
  password: string;
}

export default function SignInContainer({
  handleSignIn,
}: SignInContainerProps) {
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));
  const history = useNavigate();
  const { setCurrentUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const response = await SignInDeveloper(data);
      if (response.status === "success") {
        toast.success("You are successfully signed in!");
        const user = response.data.userWithoutPassword;
        setCurrentUser(user);
        history("/");
      }
      reset();
    } catch (error) {
      // console.error(error);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "450px",
        mx: "auto",
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Stack spacing={3} alignItems="center">
        <Avatar
          sx={{
            m: { sm: 1, md: 1 },
            bgcolor: "secondary.main",
            width: { sm: "57px", md: "57px" },
            height: { sm: "57px", md: "57px" },
          }}
          variant="square"
          alt="CollabDev"
        >
          <img
            src={getImageUrl("common/logo-light.webp")}
            alt="CollabDev"
            width={isMediumScreen ? "135" : "135"}
            height={isMediumScreen ? "45" : "45"}
          />
        </Avatar>

        <Typography
          variant="h4"
          fontWeight="700"
          sx={{ textTransform: "none" }}
        >
          Sign in
        </Typography>

        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={{ width: "100%" }}
        >
          <Grid container spacing={2}>
            {SignInInputData.map((data, index) => (
              <Grid item xs={12} key={index}>
                <Input
                  key={index}
                  id={data.id}
                  ty={data.type}
                  placeholder={data.placeholder}
                  labelText={data.labelText}
                  sx={data.sx}
                  margin={data.margin as "normal" | "dense"}
                  inputSize={"small"}
                  required={data.required}
                  fullWidth={data.fullWidth}
                  errors={errors}
                  multiline={data.multiline}
                  variant={data.variant as "standard" | "outlined" | "filled"}
                  {...(register &&
                    register(data.register.name as "email" | "password", {
                      ...data.register.schema,
                    }))}
                />
              </Grid>
            ))}
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="medium"
            sx={{
              mt: 3,
              mb: 2,
              py: 1,
              fontSize: "0.8rem",
              fontWeight: "600",
              borderRadius: 2,
            }}
          >
            Sign in
          </Button>

          <Stack
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: {
                xs: "column",
                sm: "row",
                md: "column",
                lg: "row",
              },
            }}
          >
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
              sx={{ whiteSpace: "nowrap" }}
            />
            <Link
              href="#"
              variant="body2"
              onClick={() => handleSignIn(false)}
              sx={{ whiteSpace: "nowrap" }}
            >
              {"Don't have an account? Sign up"}
            </Link>
          </Stack>
          {/* <Divider sx={{ width: "100%", pt: 1.5, pb: 2 }}>or</Divider>
          <Stack spacing={1}>
            <Button
              type="submit"
              fullWidth
              variant="outlined"
              sx={{
                mb: { xs: 1, md: 1.3, lg: 2 },
                display: "flex",
                justifyContent: "center",
                fontWeight: 600,
                textAlign: "center",
                py: 0.7,
                borderRadius: "6rem",
                fontSize: "#1F1F1F",
              }}
              startIcon={
                <img
                  src={`${process.env.PUBLIC_URL}/assets/icons/google-logo.webp`}
                  alt="Google Logo"
                  style={{
                    width: "22px",
                    marginRight: -3,
                    background: "#FFFFFF",
                  }}
                />
              }
            >
              Sign in with Google
            </Button>
            <Button
              type="submit"
              fullWidth
              variant="outlined"
              sx={{
                mb: 1,
                marginRight: 5,
                display: "flex",
                justifyContent: "center",
                fontWeight: 600,
                py: 0.7,
                fontSize: "#1F1F1F",
                borderRadius: "6rem",
              }}
              startIcon={<GitHub />}
            >
              Sign in with GitHub
            </Button>
          </Stack> */}
        </Box>
      </Stack>
    </Box>
  );
}
