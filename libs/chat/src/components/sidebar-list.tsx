import { getChats, removeChat, shareChat } from '@/chat/actions'
import { SidebarActions } from '@/chat/components/sidebar-actions'
import { SidebarItem } from '@/chat/components/sidebar-item'
// import * as f from '@/lib/__support__/fixtures/chat.fixtures'
import {
  useQuery,
} from '@tanstack/react-query'

export interface SidebarListProps {
  userId?: string
}

export function SidebarList({ userId }: SidebarListProps) {
  // const chats = await getChats(userId)
  const { data, isFetching } = useQuery({
    queryKey: ['getChats'],
    queryFn: () => getChats(userId)
  })
  const chats = data
  console.log('chats', isFetching, userId, chats);

  return (
    <div className="flex-1 h-full overflow-auto scrollbar-hide ">

      {chats?.length ? (
        <div className="space-y-2">
          {chats.map(
            chat =>
              chat && (
                <SidebarItem key={chat?.id} chat={chat}>
                  <SidebarActions
                    chat={chat}
                    removeChat={removeChat}
                    shareChat={shareChat}
                  />
                </SidebarItem>
              )
          )}
        </div>
      ) : (
        isFetching ?
          <div>Loading...</div>
          :
          <div className="p-8 w-full h-full flex justify-center items-center">
            <p className="text-sm text-muted-foreground">No chat history</p>
          </div>
      )
      }
    </div >
  )
}
