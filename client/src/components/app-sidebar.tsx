// Landlord Portal Sidebar Navigation - Reorganized for better UX
import { Home, Building2, Users, Calendar, CalendarDays, FileText, BarChart3, Phone, Settings, ImagePlus, Plug, FlaskConical, GraduationCap, Shield, Webhook, Sliders, Clock, Package, Blocks, MessageSquare, ChevronRight, TrendingUp } from "lucide-react"
import { Link, useLocation } from "wouter"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { TermFlowLogo } from "@/components/TermFlowLogo"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

// Core navigation items (always visible)
const coreItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Properties", url: "/properties", icon: Building2 },
  { title: "Leads", url: "/leads", icon: Users },
  { title: "Viewings", url: "/viewings", icon: Calendar },
  { title: "Contracts", url: "/contracts", icon: FileText },
  { title: "Contract Templates", url: "/contract-templates", icon: FileText },
  { title: "Tenancy Calendar", url: "/calendar", icon: CalendarDays },
]

// Grouped navigation items (collapsible)
const groupedItems = [
  {
    title: "Analytics",
    icon: BarChart3,
    items: [
      { title: "Analytics Dashboard", url: "/analytics", icon: BarChart3 },
      { title: "Strategy Analytics", url: "/analytics/strategies", icon: TrendingUp },
      { title: "Template Analytics", url: "/analytics/templates", icon: FileText },
      { title: "AI Call Logs", url: "/call-logs", icon: Phone },
      { title: "Student Profiles", url: "/student-profiles", icon: GraduationCap },
    ]
  },
  {
    title: "Automation",
    icon: Package,
    items: [
      { title: "Clearing Mode", url: "/clearing-mode", icon: Clock },
      { title: "Operator Bundle", url: "/operator-bundle", icon: Package },
      { title: "WhatsApp Templates", url: "/whatsapp-templates", icon: MessageSquare },
    ]
  },
  {
    title: "Integrations",
    icon: Blocks,
    items: [
      { title: "Integrations", url: "/integrations", icon: Blocks },
      { title: "Connect", url: "/connect", icon: Plug },
      { title: "Media Import", url: "/media-import", icon: ImagePlus },
      { title: "Webhook Events", url: "/webhook-events", icon: Webhook },
      { title: "Test Webhooks", url: "/test-webhooks", icon: FlaskConical },
    ]
  },
  {
    title: "Settings",
    icon: Settings,
    items: [
      { title: "Settings", url: "/settings", icon: Settings },
      { title: "Feature Flags", url: "/feature-flags", icon: Sliders },
      { title: "Security & Privacy", url: "/security-privacy", icon: Shield },
    ]
  },
]

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <TermFlowLogo size={32} />
          <div>
            <div className="text-sm font-extrabold text-sidebar-foreground">TermFlow</div>
            <div className="text-xs text-sidebar-foreground/60">PBSA Automation</div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Core</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {coreItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild data-active={location === item.url}>
                    <Link href={item.url} data-testid={`link-${item.title.toLowerCase()}`}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {groupedItems.map((group) => (
          <Collapsible key={group.title} defaultOpen={false} className="group/collapsible">
            <SidebarGroup>
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger className="hover-elevate active-elevate-2">
                  <group.icon className="mr-2" />
                  {group.title}
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild data-active={location === item.url}>
                          <Link href={item.url} data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                            <item.icon />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}
