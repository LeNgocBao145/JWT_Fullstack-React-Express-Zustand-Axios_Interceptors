import Logout from '@/components/auth/logout'
import useAuthStore from '@/stores/authStore'
import React from 'react'

const ChatAppPage = () => {
  const user = useAuthStore((s) => s.user);
  return (
    <div>
      {user?.username}
      <Logout />
    </div>
  )
}

export default ChatAppPage
