import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext/AuthContext";
import { SignOutDeveloper } from "../../core/services/api/developer-authentication.api";
import { getItem } from "../../core/services/storage/Storage";

// Users will lead to this component when they click on the logout button.
// The local storage will be cleared and the public routes will be rendered instead of private routes.
export default function LogoutContainer() {
  const history = useNavigate();
  const user = useAuth();

  useEffect(() => {
    if (Boolean(getItem("user")) === true) {
      SignOutDeveloper();
      user.logout();
      history("/");
    }
  });

  return null;
}
