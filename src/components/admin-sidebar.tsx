import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, FolderKanban, Wrench, Sparkles, Briefcase,
  GraduationCap, Mail, Settings, User, Image as ImageIcon, MessageSquareQuote,
  BookOpen,
} from "lucide-react";
import { useFirestoreDoc } from "@/hooks/useFirestore";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const { data: settings } = useFirestoreDoc<any>("settings", "site_settings");
  const { data: bio } = useFirestoreDoc<any>("about", "personal_bio", {
    fullName: "Indrajit Ghosh",
    email: "indrajitghosh449@gmail.com",
  });

  const displayName = bio?.fullName || settings?.fullName || "Indrajit Ghosh";
  const displayEmail = settings?.contactEmail || settings?.email || bio?.email || "indrajitghosh449@gmail.com";

  const isFreelancer = settings?.freelancerMode === true;

  const contentItems = [
    { title: "Dashboard", url: "/admin", icon: LayoutDashboard, exact: true },
    { title: "Projects", url: "/admin/projects", icon: FolderKanban },
    { title: "Blog Posts", url: "/admin/blogs", icon: BookOpen },
    ...(isFreelancer ? [{ title: "Services", url: "/admin/services", icon: Wrench }] : []),
    { title: "Testimonials", url: "/admin/testimonials", icon: MessageSquareQuote },
    { title: "Skills", url: "/admin/skills", icon: Sparkles },
    { title: "Experience", url: "/admin/experience", icon: Briefcase },
    { title: "Credentials", url: "/admin/credentials", icon: GraduationCap },
    { title: "About / Bio", url: "/admin/about", icon: User },
    { title: "Media Library", url: "/admin/media", icon: ImageIcon },
  ];

  const systemItems = [
    { title: "Messages", url: "/admin/messages", icon: Mail },
    { title: "Site Settings", url: "/admin/settings", icon: Settings },
  ];

  const isActive = (url: string, exact?: boolean) =>
    exact ? pathname === url : pathname === url || pathname.startsWith(url + "/");

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-border/50">
        <Link to="/admin" className="flex items-center gap-2 px-2 py-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center font-display font-bold text-white text-sm shrink-0">
            IG
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-display font-semibold text-sm">Portfolio CMS</span>
              <span className="text-[10px] text-muted-foreground">Admin Console</span>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Content</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {contentItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url, item.exact)} tooltip={item.title}>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50">
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold shrink-0 overflow-hidden">
            {bio?.avatarUrl || bio?.avatarBase64 ? (
              <img src={bio.avatarUrl || bio.avatarBase64} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              (displayName || "IG")
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()
            )}
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight min-w-0">
              <span className="text-xs font-medium truncate">{displayName}</span>
              <span className="text-[10px] text-muted-foreground truncate">{displayEmail}</span>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
