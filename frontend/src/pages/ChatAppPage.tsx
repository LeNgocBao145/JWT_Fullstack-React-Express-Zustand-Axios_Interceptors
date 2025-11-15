import Logout from '@/components/auth/logout'
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';
import useAuthStore from '@/stores/authStore'
import React from 'react'
import { toast } from 'sonner';

const ChatAppPage = () => {
  const user = useAuthStore((s) => s.user);
  
  const handleOnClick = async () => {
    try {
      await api.get("/users/test", {withCredentials: true});
      toast.success("ok");
    } catch (error) {
      console.error(error);
      toast.error("Fail!!");
    }
  }
  return (
    <div>
      {user?.username}
      <Logout />
      <Button onClick={handleOnClick}>Test</Button>
    </div>
  )
}

export default ChatAppPage
