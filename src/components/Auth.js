import { auth, provider } from "../firebase-config.js";
import { signInWithPopup } from "firebase/auth";
import Cookies from "universal-cookie";

import "../styles/Auth.css";

const cookies = new Cookies();

export const Auth = ({ setIsAuth }) => {

  const signInWithGoogle = async () => {

    try {
      const result = await signInWithPopup(auth, provider);
      cookies.set("auth-token", result.user.refreshToken);
      setIsAuth(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="auth">
      <p className="headline"> Welcome to ChatHub </p>
      <button onClick={signInWithGoogle} className="headline"> 
        Sign In With Google 
      </button>
    </div>
  );

};
