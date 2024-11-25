import { GitHub } from "@mui/icons-material";
import { Stack, useMediaQuery, useTheme } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

import { SignUpInputData } from "../../../configs/data/RegistrationInputData";
import { useAuth } from "../../../context/AuthContext/AuthContext";
import { SignUpDeveloper } from "../../../core/services/api/developer-authentication.api";
import { getItem } from "../../../core/services/storage/Storage";
import Input from "../../common/Input/Input";

interface SignUpContainerProps {
  handleSignIn: (signIn: boolean) => void;
}

interface FormValues {
  name: string;
  email: string;
  password: string;
}

export default function SignUpContainer({
  handleSignIn,
}: SignUpContainerProps) {
  const user = useAuth();
  const theme = useTheme();
  const history = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const response = await SignUpDeveloper(data);
      if (response.status === "success") {
        toast.success("You are successfully signed up!");
        user.loginAsUser(Boolean(getItem("user")) === true);
        history("/");
      } else {
        if (response.status === 400 || response.status === 403) {
          toast.error("Email or password is wrong.");
        } else {
          toast.error("Something went wrong! Please try again.");
        }
      }
      reset();
    } catch (error) {
      toast.error(String(error));
      console.error(error);
    }
  };
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      <ToastContainer />
      <Grid
        component={Paper}
        sx={{
          borderTopLeftRadius: "6px",
          background: "#ffffff",
          width: isMediumScreen ? "90%" : "70%",
          height: isMediumScreen ? "83vh" : "90vh",
          position: "absolute",
          bottom: "0",
          right: "0",
          [theme.breakpoints.up("lg")]: {
            borderRadius: "8px",
            width: "48%",
            top: "50%",
            right: { xs: "0.6%", lg: "11%" },
            transform: {
              xs: "translate(-0.6%, -50%)",
              lg: "translate(-11%, -50%)",
            },
          },
        }}
      >
        <Box
          sx={{
            py: { sm: 4, md: 5 },
            px: { sm: 4, md: 7 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Avatar
            sx={{
              m: { sm: 1, md: 1 },
              bgcolor: "secondary.main",
              width: { sm: "40px", md: "57px" },
              height: { sm: "40px", md: "57px" },
            }}
            variant="square"
            alt="Logo"
            onClick={() => history("/")}
          >
            <img
              src={`${process.env.PUBLIC_URL}/assets/logo/logo-light.webp`}
              alt="Logo"
              width={isMediumScreen ? "90" : "135"}
              height={isMediumScreen ? "30" : "45"}
            />
          </Avatar>
          <Typography component="h1" variant={isMediumScreen ? "h5" : "h3"}>
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: { sm: 1, md: 3 }, width: "100%" }}
          >
            {SignUpInputData.map((data, index) => (
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
            ))}

            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size={isMediumScreen ? "medium" : "small"}
              sx={{ mt: 2, mb: 1.5, fontSize: { md: "0.9rem" } }}
            >
              Sign Up
            </Button>
            <Grid container>
              <Grid item>
                <Link
                  href="#"
                  variant="body2"
                  onClick={() => handleSignIn(true)}
                >
                  {"Already have an account? Sign In"}
                </Link>
              </Grid>
            </Grid>
          </Box>
          <Divider sx={{ width: "100%", pt: 1.5, pb: 2 }}>or</Divider>
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
              Sign up with Google
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
              Sign up with GitHub
            </Button>
          </Stack>
        </Box>
      </Grid>
    </>
  );
}
