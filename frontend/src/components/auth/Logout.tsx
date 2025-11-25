import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import useAuthStore from "@/stores/authStore";
import { useNavigate } from "react-router";

const Logout = () => {
  const { signOut } = useAuthStore();
  const navigate = useNavigate();
  const handleSignout = async () => {
    try {
        await signOut();
        navigate("/signin");
    } catch (error) {
        console.error(error);
    }
  };
  return (
    <div>
      <Button variant='completedGhost' onClick={handleSignout}>
        <LogOut className="text-destructive"/>
        Log out</Button>
    </div>
  );
};

export default Logout;
