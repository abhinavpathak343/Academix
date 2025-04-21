import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { userState } from '../store/atoms/user';
import { jwtDecode } from 'jwt-decode'; // Changed from default import to named import

function InitUser() {
  const setUser = useSetRecoilState(userState);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token); // Use the named import
        setUser({
          isLoading: false,
          userEmail: decoded.username || decoded.email,
          token: token,
          isAdmin: decoded.isAdmin || false
        });
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("token");
        setUser({
          isLoading: false,
          userEmail: null,
          token: null,
          isAdmin: false
        });
      }
    }
  }, [setUser]);

  return null;
}

export default InitUser;