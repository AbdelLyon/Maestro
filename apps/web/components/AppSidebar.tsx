"use client";

import { NavDocuments } from "@/components/NavDocuments";
import { NavSecondary } from "@/components/NavSecondary";
import { NavUser } from "@/components/NavUser";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  Icons,
} from "@maestro/ui";

import { NavMain } from "./NavMain";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: <Icons.LayoutDashboardIcon />,
    },
    {
      title: "Lifecycle",
      url: "#",
      icon: <Icons.ListIcon />,
    },
    {
      title: "Analytics",
      url: "#",
      icon: <Icons.ChartBarIcon />,
    },
    {
      title: "Projects",
      url: "#",
      icon: <Icons.FolderIcon />,
    },
    {
      title: "Team",
      url: "#",
      icon: <Icons.UsersIcon />,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: <Icons.CameraIcon />,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: <Icons.FileTextIcon />,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: <Icons.FileTextIcon />,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: <Icons.Settings2Icon />,
    },
    {
      title: "Get Help",
      url: "#",
      icon: <Icons.CircleHelpIcon />,
    },
    {
      title: "Search",
      url: "#",
      icon: <Icons.SearchIcon />,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: <Icons.DatabaseIcon />,
    },
    {
      name: "Reports",
      url: "#",
      icon: <Icons.FileChartColumnIcon />,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: <Icons.FileIcon />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <Icons.CommandIcon className="size-5!" />
                <span className="text-base font-semibold">Bati.fr</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
