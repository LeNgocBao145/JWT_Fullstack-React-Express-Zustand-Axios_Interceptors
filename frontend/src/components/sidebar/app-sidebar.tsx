"use client";

import * as React from "react";

import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import CreateNewChat from "../chat/CreateNewChat";
import NewGroupChatModal from "../chat/NewGroupChatModal";
import GroupChatList from "../chat/GroupChatList";
import AddFriendModal from "../chat/AddFriendModal";
import DirectMessageList from "../chat/DirectMessageList";
import useThemeStore from "@/stores/themeStore";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {isDark, toggleTheme} = useThemeStore();
  return (
    <Sidebar variant="inset" {...props}>
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="bg-gradient-primary"
            >
              <a
                href="#"
                className="flex w-full items-center justify-between px-2"
              >
                <h1 className="text-xl text-white font-bold">Moji</h1>
                <div className="flex items-center gap-2">
                  <Sun className="size-4 text-white/80" />
                  <Switch
                    checked={isDark}
                    onCheckedChange={toggleTheme}
                    className="data-[state=checked]:bg-background/80"
                  />
                  <Moon className="size-4 text-white/80"/>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      {/* Content */}
      <SidebarContent>
        {/* New chat */}
        <SidebarGroup>
          <SidebarGroupContent>
            <CreateNewChat/>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* Group chat */}
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase">
            Group Chat
          </SidebarGroupLabel>
          <SidebarGroupAction title="Create group" className="cursor-pointer">
            <NewGroupChatModal/>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <GroupChatList/>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Direct message */}
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase">
            Friends
          </SidebarGroupLabel>
          <SidebarGroupAction title="Add friend" className="cursor-pointer">
            <AddFriendModal/>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <DirectMessageList/>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {/* Footer */}
      <SidebarFooter>{/* <NavUser user={data.user} /> */}</SidebarFooter>
    </Sidebar>
  );
}
