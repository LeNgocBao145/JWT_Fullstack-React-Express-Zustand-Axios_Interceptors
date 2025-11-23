import useChatStore from '@/stores/chatStore'
import DirectMessageCard from './DirectMessageCard';


const DirectMessageList = () => {
  const {conversations} = useChatStore();

  if(!conversations) return null;

  const directConversations = conversations.filter((conver) => conver.type === 'direct');

  return (
    <div className='flex-1 overflow-y-auto p-2 space-y-2'>
      {
        directConversations.map((conver) => (
          <DirectMessageCard
            key={conver._id}
            conversation={conver}
          />
        ))
      }
    </div>
  );
}

export default DirectMessageList
