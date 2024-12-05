import {
  Checkbox,
  FormControlLabel,
  Link,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

import { SignUpInputData } from "../../../configs/data/RegistrationInputData";
import { SignUpDeveloper } from "../../../core/services/api/developer-authentication.api";
import Input from "../../common/Input/Input";
import { useAuth } from "../../../context/AuthContext/AuthContext";

interface FormValues {
  name: string;
  email: string;
  password: string;
}

interface SignUpContainerProps {
  handleSignIn: (signIn: boolean) => void;
}

export default function SignUpContainer({
  handleSignIn,
}: SignUpContainerProps) {
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
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const response = await SignUpDeveloper(data);
      if (response.status === "success") {
        toast.success("You are successfully signed up!");
        const user = response.data.userWithoutPassword;
        setCurrentUser(user);
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
          alt="Logo"
        >
          <img
            src={`${process.env.PUBLIC_URL}/assets/logo/logo-light.webp`}
            alt="Logo"
            width={isMediumScreen ? "135" : "135"}
            height={isMediumScreen ? "45" : "45"}
          />
        </Avatar>

        <Typography
          variant="h4"
          fontWeight="700"
          sx={{ textTransform: "none" }}
        >
          Create account
        </Typography>

        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={{ width: "100%" }}
        >
          <Grid container spacing={2}>
            {SignUpInputData.map((data, index) => (
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
            Create Account
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
              onClick={() => handleSignIn(true)}
              sx={{ whiteSpace: "nowrap" }}
            >
              {"Already have an account? Sign in"}
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
          </Stack> */}
        </Box>
      </Stack>
    </Box>
  );
}
