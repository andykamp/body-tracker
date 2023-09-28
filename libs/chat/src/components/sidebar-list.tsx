import { getChats, removeChat, shareChat } from '@/chat/actions'
import { SidebarActions } from '@/chat/components/sidebar-actions'
import { SidebarItem } from '@/chat/components/sidebar-item'
// import * as f from '@/lib/__support__/fixtures/chat.fixtures'

export interface SidebarListProps {
  userId?: string
}

export async function SidebarList({ userId }: SidebarListProps) {
  const chats =  await getChats(userId)

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
        <div className="p-8 w-full h-full flex justify-center items-center">
          <p className="text-sm text-muted-foreground">No chat history</p>
        </div>
      )}
    </div>
  )
}
