import { Switch, Route, useLocation , Redirect} from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { HelmetProvider } from "react-helmet-async";
import { AppSidebar } from "@/components/app-sidebar";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useEffect, lazy, Suspense, memo, useMemo, useState } from "react";
import { SkipLink } from "@/components/SkipLink";

// Loading fallback component
const PageLoader = () => (
  <div className="h-screen flex items-center justify-center">
    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading page"/>
  </div>
);

// ========================================
// CRITICAL ROUTES - Load immediately for initial bundle
// ========================================
const Landing = lazy(() => import("@/pages/landing"));
const Dashboard = lazy(() => import("@/pages/dashboard"));
const NotFound = lazy(() => import("@/pages/not-found"));

// Auth pages - white-labeled custom authentication
const Login = lazy(() => import("@/pages/login"));
const Signup = lazy(() => import("@/pages/signup"));
const ForgotPassword = lazy(() => import("@/pages/forgot-password"));
const ResetPassword = lazy(() => import("@/pages/reset-password"));
const VerifyEmail = lazy(() => import("@/pages/verify-email"));

// ========================================
// PRIMARY ROUTES - Load soon after critical
// ========================================
const Pricing = lazy(() => import("@/pages/pricing"));
const Demo = lazy(() => import("@/pages/demo"));
const BookDemo = lazy(() => import("@/pages/book-demo"));
const HowItWorks = lazy(() => import("@/pages/how-it-works"));
const Contact = lazy(() => import("@/pages/Contact"));
const Properties = lazy(() => import("@/pages/properties"));
const Leads = lazy(() => import("@/pages/leads"));

// Onboarding - Load separately as needed
const OnboardingNew = lazy(() => import("@/pages/OnboardingNew"));
const OnboardingSuccess = lazy(() => import("@/pages/OnboardingSuccess"));
const StaffAccess = lazy(() => import("@/pages/StaffAccess"));

// ========================================
// SECONDARY ROUTES - Individual lazy loading for better performance
// ========================================

// Legal pages
const Privacy = lazy(() => import("@/pages/legal/Privacy"));
const Terms = lazy(() => import("@/pages/legal/Terms"));
const GDPR = lazy(() => import("@/pages/legal/GDPR"));
const Cookies = lazy(() => import("@/pages/legal/Cookies"));
const DPA = lazy(() => import("@/pages/legal/DPA"));
const AUP = lazy(() => import("@/pages/legal/AUP"));

// Location pages
const LondonLocation = lazy(() => import("@/pages/LondonLocation"));
const ManchesterLocation = lazy(() => import("@/pages/ManchesterLocation"));
const BristolLocation = lazy(() => import("@/pages/BristolLocation"));
const EdinburghLocation = lazy(() => import("@/pages/EdinburghLocation"));
const NewcastleLocation = lazy(() => import("@/pages/NewcastleLocation"));
const BirminghamLocation = lazy(() => import("@/pages/BirminghamLocation"));
const LeedsLocation = lazy(() => import("@/pages/LeedsLocation"));
const GlasgowLocation = lazy(() => import("@/pages/GlasgowLocation"));
const SheffieldLocation = lazy(() => import("@/pages/SheffieldLocation"));
const LiverpoolLocation = lazy(() => import("@/pages/LiverpoolLocation"));

// Playbooks pages
const PlaybooksHub = lazy(() => import("@/pages/playbooks/PlaybooksHub"));
const TenantOnboardingAutomation = lazy(() => import("@/pages/playbooks/TenantOnboardingAutomation"));
const IDDocumentCollection = lazy(() => import("@/pages/playbooks/IDDocumentCollection"));
const MaintenanceTriageAutomation = lazy(() => import("@/pages/playbooks/MaintenanceTriageAutomation"));
const ArrearsNudgingAutomation = lazy(() => import("@/pages/playbooks/ArrearsNudgingAutomation"));
const InspectionSchedulingAutomation = lazy(() => import("@/pages/playbooks/InspectionSchedulingAutomation"));
const RoomAllocationOptimization = lazy(() => import("@/pages/playbooks/RoomAllocationOptimization"));

// Sectors pages
const UniversityOperators = lazy(() => import("@/pages/sectors/UniversityOperators"));
const PBSAREITs = lazy(() => import("@/pages/sectors/PBSAREITs"));
const BoutiqueStudentHouses = lazy(() => import("@/pages/sectors/BoutiqueStudentHouses"));
const BuildToRentCrossover = lazy(() => import("@/pages/sectors/BuildToRentCrossover"));
const CRMHeavyTeams = lazy(() => import("@/pages/sectors/CRMHeavyTeams"));
const InternationalIntakes = lazy(() => import("@/pages/sectors/InternationalIntakes"));

// Solutions pages
const Solutions = lazy(() => import("@/pages/solutions/Solutions"));
const StudentOnboarding = lazy(() => import("@/pages/solutions/StudentOnboarding"));
const MaintenanceTriage = lazy(() => import("@/pages/solutions/MaintenanceTriage"));
const RentArrearsNudges = lazy(() => import("@/pages/solutions/RentArrearsNudges"));
const RebookingAutomation = lazy(() => import("@/pages/solutions/RebookingAutomation"));

// Integrations pages
const IntegrationsOverview = lazy(() => import("@/pages/integrations/Integrations"));
const StarRez = lazy(() => import("@/pages/integrations/StarRez"));
const Yardi = lazy(() => import("@/pages/integrations/Yardi"));
const Kinetic = lazy(() => import("@/pages/integrations/Kinetic"));
const Fixflo = lazy(() => import("@/pages/integrations/Fixflo"));

// Dashboard pages
const Viewings = lazy(() => import("@/pages/viewings"));
const Contracts = lazy(() => import("@/pages/contracts"));
const Analytics = lazy(() => import("@/pages/analytics"));
const CallLogs = lazy(() => import("@/pages/call-logs"));
const Calendar = lazy(() => import("@/pages/calendar"));
const Settings = lazy(() => import("@/pages/settings"));
const StudentProfiles = lazy(() => import("@/pages/student-profiles"));

// Content pages
const Blog = lazy(() => import("@/pages/Blog"));
const BlogPost = lazy(() => import("@/pages/BlogPost"));
const CaseStudies = lazy(() => import("@/pages/CaseStudies"));
const CaseStudy = lazy(() => import("@/pages/CaseStudy"));
const KnowledgeBase = lazy(() => import("@/pages/KnowledgeBase"));
const KnowledgeBaseArticle = lazy(() => import("@/pages/KnowledgeBaseArticle"));
const Author = lazy(() => import("@/pages/Author"));

// Service pages
const AIViewingBooking = lazy(() => import("@/pages/services/ai-viewing-booking"));
const DigitalContracts = lazy(() => import("@/pages/services/digital-contracts"));
const StudentLettingsSoftware = lazy(() => import("@/pages/student-lettings-software"));
const PBSAManagementPlatform = lazy(() => import("@/pages/pbsa-management-platform"));
const AutomatedTenantOnboarding = lazy(() => import("@/pages/automated-tenant-onboarding"));
const UKStudentAccommodationSoftware = lazy(() => import("@/pages/uk-student-accommodation-software"));

// Individual lazy-loaded pages (less frequently accessed)
const DemoConfirmation = lazy(() => import("@/pages/DemoConfirmation"));
const FloorPlan = lazy(() => import("@/pages/floor-plan"));
const CreateProperty = lazy(() => import("@/pages/create-property"));
const ContractPreview = lazy(() => import("@/pages/ContractPreview"));
const ContractTemplates = lazy(() => import("@/pages/dashboard/ContractTemplates"));
const EditContractTemplate = lazy(() => import("@/pages/dashboard/EditContractTemplate"));
const MediaImport = lazy(() => import("@/pages/MediaImport"));
const Connect = lazy(() => import("@/pages/connect"));
const FeatureFlags = lazy(() => import("@/pages/feature-flags"));
const TestWebhooks = lazy(() => import("@/pages/test-webhooks"));
const SecurityPrivacy = lazy(() => import("@/pages/security-privacy"));
const WebhookEvents = lazy(() => import("@/pages/webhook-events"));
const ClearingMode = lazy(() => import("@/pages/clearing-mode"));
const OperatorBundle = lazy(() => import("@/pages/operator-bundle"));
const RoomAnalytics = lazy(() => import("@/pages/room-analytics"));
const EmailEvents = lazy(() => import("@/pages/email-events"));
const LeadForm = lazy(() => import("@/pages/lead-form"));
const StrategyAnalytics = lazy(() => import("@/pages/StrategyAnalytics"));
const TemplateAnalytics = lazy(() => import("@/pages/TemplateAnalytics"));
const Integrations = lazy(() => import("@/pages/integrations"));
const WhatsappTemplates = lazy(() => import("@/pages/whatsapp-templates"));
const MoveInChecklist = lazy(() => import("@/pages/move-in-checklist"));
const ContractTemplateTest = lazy(() => import("@/pages/contract-template-test"));
const RightToRent = lazy(() => import("@/pages/right-to-rent"));
const Onboarding = lazy(() => import("@/pages/Onboarding"));

// Resource pages - Very low priority
const ROICalculatorPage = lazy(() => import("@/pages/ROICalculatorPage"));
const PBSAGuide = lazy(() => import("@/pages/PBSAGuide"));
const Glossary = lazy(() => import("@/pages/Glossary"));
const PersonaPBSAOperators = lazy(() => import("@/pages/PersonaPBSAOperators"));
const PersonaOnSiteManagers = lazy(() => import("@/pages/PersonaOnSiteManagers"));
const PersonaCentralOperations = lazy(() => import("@/pages/PersonaCentralOperations"));
const WhyTermFlow = lazy(() => import("@/pages/WhyTermFlow"));
const StudentDataPrivacy = lazy(() => import("@/pages/StudentDataPrivacy"));
const SecurityHub = lazy(() => import("@/pages/security-hub"));
const Outcomes = lazy(() => import("@/pages/Outcomes"));
const StartHere = lazy(() => import("@/pages/StartHere"));
const VendorDueDiligence = lazy(() => import("@/pages/VendorDueDiligence"));
const ServiceAreas = lazy(() => import("@/pages/ServiceAreas"));
const SalesDeck = lazy(() => import("@/pages/SalesDeck"));
const FounderStory = lazy(() => import("@/pages/founder-story"));
const Customers = lazy(() => import("@/pages/Customers"));
const AIVsManualWorkflows = lazy(() => import("@/pages/comparisons/AIVsManualWorkflows"));
const RPAVsAPIIntegration = lazy(() => import("@/pages/comparisons/RPAVsAPIIntegration"));
const ZapierVsMaken8n = lazy(() => import("@/pages/comparisons/ZapierVsMaken8n"));
const TermFlowVsConcurrent = lazy(() => import("@/pages/comparisons/TermFlowVsConcurrent"));
const TermFlowVsKinetic = lazy(() => import("@/pages/comparisons/TermFlowVsKinetic"));
const TermFlowVsStarRez = lazy(() => import("@/pages/comparisons/TermFlowVsStarRez"));
const TermFlowVsYardi = lazy(() => import("@/pages/comparisons/TermFlowVsYardi"));
const ComparisonsIndex = lazy(() => import("@/pages/comparisons/ComparisonsIndex"));
const PBSAMetricsGuide = lazy(() => import("@/pages/resources/PBSAMetricsGuide"));
const PBSACalendar2025 = lazy(() => import("@/pages/resources/PBSACalendar2025"));
const UniversitiesIndex = lazy(() => import("@/pages/UniversitiesIndex"));
const AutomationIdeasLibrary = lazy(() => import("@/pages/AutomationIdeasLibrary"));
const ExecutiveSummary = lazy(() => import("@/pages/one-pagers/ExecutiveSummary"));
const TechnicalOverview = lazy(() => import("@/pages/one-pagers/TechnicalOverview"));
const ProcurementPack = lazy(() => import("@/pages/one-pagers/ProcurementPack"));

// ========================================
// ROUTE PREFETCHING - Improve perceived performance
// ========================================
const prefetchRoute = (importFunc: () => Promise<any>) => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      importFunc().catch(() => {});
    }, { timeout: 2000 });
  } else {
    setTimeout(() => {
      importFunc().catch(() => {});
    }, 2000);
  }
};

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [location, setLocation] = useLocation();

  // Check onboarding status for authenticated users
  const { data: onboardingStatus, isLoading: onboardingLoading } = useQuery<{ completed: boolean }>({
    queryKey: ["/api/onboarding/status"],
    enabled: isAuthenticated,
  });

  // Redirect to onboarding if not completed (but not if already on onboarding pages)
  useEffect(() => {
    // Skip onboarding for test users (strict domain matching)
    // SECURITY: Only exact domain matches to prevent accidental bypass
    const isTestUser = user?.email && /@(test\.com|example\.com|termflow\.test)$/i.test(user.email);
    
    if (
      isAuthenticated &&
      !onboardingLoading &&
      onboardingStatus &&
      !onboardingStatus.completed &&
      !isTestUser && // Allow test users to bypass onboarding
      location !== "/onboarding" &&
      location !== "/onboarding-new"
    ) {
      setLocation("/onboarding-new");
    }
  }, [isAuthenticated, onboardingLoading, onboardingStatus, location, setLocation, user]);

  // Show loading state
  if (isLoading) {
    return <PageLoader />;
  }

  // Public routes for unauthenticated users
  if (!isAuthenticated) {
    return (
      <Suspense fallback={<PageLoader />}>
        <main id="main-content">
          <Switch>
            {/* Critical routes */}
            <Route path="/" component={Landing} />
            
            {/* Auth routes - white-labeled custom authentication */}
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <Route path="/forgot-password" component={ForgotPassword} />
            <Route path="/reset-password" component={ResetPassword} />
            <Route path="/verify-email" component={VerifyEmail} />
            
            <Route path="/pricing" component={Pricing} />
            <Route path="/how-it-works" component={HowItWorks} />
            <Route path="/demo" component={Demo} />
            <Route path="/demo/whatsapp" component={Demo} />
            <Route path="/book-demo" component={BookDemo} />
            <Route path="/book-demo/confirmation" component={DemoConfirmation} />
            <Route path="/contact" component={Contact} />
            
            {/* Legal routes */}
            <Route path="/legal/privacy" component={Privacy} />
            <Route path="/legal/terms" component={Terms} />
            <Route path="/legal/gdpr" component={GDPR} />
            <Route path="/legal/cookies" component={Cookies} />
            <Route path="/legal/dpa" component={DPA} />
            <Route path="/legal/aup" component={AUP} />
            
            {/* Solutions routes */}
            <Route path="/solutions"><Redirect to="/" /></Route>
            <Route path="/solutions/student-onboarding"><Redirect to="/" /></Route>
            <Route path="/solutions/maintenance-triage"><Redirect to="/" /></Route>
            <Route path="/solutions/rent-arrears-nudges"><Redirect to="/" /></Route>
            <Route path="/solutions/rebooking-automation"><Redirect to="/" /></Route>
            
            {/* Playbooks routes */}
            <Route path="/playbooks"><Redirect to="/" /></Route>
            <Route path="/playbooks/tenant-onboarding-automation"><Redirect to="/" /></Route>
            <Route path="/playbooks/id-document-collection"><Redirect to="/" /></Route>
            <Route path="/playbooks/maintenance-triage-automation"><Redirect to="/" /></Route>
            <Route path="/playbooks/arrears-nudging-automation"><Redirect to="/" /></Route>
            <Route path="/playbooks/inspection-scheduling-automation"><Redirect to="/" /></Route>
            <Route path="/playbooks/room-allocation-optimization"><Redirect to="/" /></Route>
            
            {/* Sectors routes */}
            <Route path="/sectors/university-operators"><Redirect to="/" /></Route>
            <Route path="/sectors/pbsa-reits"><Redirect to="/" /></Route>
            <Route path="/sectors/boutique-student-houses"><Redirect to="/" /></Route>
            <Route path="/sectors/build-to-rent-crossover"><Redirect to="/" /></Route>
            <Route path="/sectors/crm-heavy-teams"><Redirect to="/" /></Route>
            <Route path="/sectors/international-intakes"><Redirect to="/" /></Route>
            
            {/* Integrations routes */}
            <Route path="/integrations"><Redirect to="/" /></Route>
            <Route path="/integrations/starrez"><Redirect to="/" /></Route>
            <Route path="/integrations/yardi"><Redirect to="/" /></Route>
            <Route path="/integrations/kinetic"><Redirect to="/" /></Route>
            <Route path="/integrations/fixflo"><Redirect to="/" /></Route>
            
            {/* Location pages */}
            <Route path="/london-student-accommodation-automation"><Redirect to="/" /></Route>
            <Route path="/manchester-student-accommodation-automation"><Redirect to="/" /></Route>
            <Route path="/bristol-student-accommodation-automation"><Redirect to="/" /></Route>
            <Route path="/edinburgh-student-accommodation-automation"><Redirect to="/" /></Route>
            <Route path="/newcastle-student-accommodation-automation"><Redirect to="/" /></Route>
            <Route path="/birmingham-student-accommodation-automation"><Redirect to="/" /></Route>
            <Route path="/leeds-student-accommodation-automation"><Redirect to="/" /></Route>
            <Route path="/glasgow-student-accommodation-automation"><Redirect to="/" /></Route>
            <Route path="/sheffield-student-accommodation-automation"><Redirect to="/" /></Route>
            <Route path="/liverpool-student-accommodation-automation"><Redirect to="/" /></Route>
            
            {/* Content pages */}
            <Route path="/blog"><Redirect to="/" /></Route>
            <Route path="/blog/:slug"><Redirect to="/" /></Route>
            <Route path="/case-studies"><Redirect to="/" /></Route>
            <Route path="/case-studies/:slug"><Redirect to="/" /></Route>
            <Route path="/knowledge-base"><Redirect to="/" /></Route>
            <Route path="/knowledge-base/:slug"><Redirect to="/" /></Route>
            <Route path="/author/:slug"><Redirect to="/" /></Route>
            
            {/* Service pages */}
            <Route path="/ai-viewing-booking"><Redirect to="/" /></Route>
            <Route path="/services/ai-viewing-booking"><Redirect to="/" /></Route>
            <Route path="/digital-contracts"><Redirect to="/" /></Route>
            <Route path="/services/digital-contracts"><Redirect to="/" /></Route>
            <Route path="/student-lettings-software"><Redirect to="/" /></Route>
            <Route path="/pbsa-management-platform"><Redirect to="/" /></Route>
            <Route path="/automated-tenant-onboarding"><Redirect to="/" /></Route>
            <Route path="/uk-student-accommodation-software"><Redirect to="/" /></Route>
            
            {/* Individual routes - less frequently accessed */}
            <Route path="/roi-calculator"><Redirect to="/" /></Route>
            <Route path="/customers"><Redirect to="/" /></Route>
            <Route path="/form" component={LeadForm} />
            <Route path="/rtr/:token" component={RightToRent} />
            
            {/* Resource pages - lowest priority */}
            <Route path="/resources/pbsa-automation-guide-2025"><Redirect to="/" /></Route>
            <Route path="/resources/glossary"><Redirect to="/" /></Route>
            <Route path="/resources/sales-deck"><Redirect to="/" /></Route>
            <Route path="/resources/pbsa-metrics-guide"><Redirect to="/" /></Route>
            <Route path="/resources/pbsa-calendar-2025"><Redirect to="/" /></Route>
            <Route path="/personas/pbsa-operators"><Redirect to="/" /></Route>
            <Route path="/personas/on-site-managers"><Redirect to="/" /></Route>
            <Route path="/personas/central-operations"><Redirect to="/" /></Route>
            <Route path="/why-termflow"><Redirect to="/" /></Route>
            <Route path="/founder-story"><Redirect to="/" /></Route>
            <Route path="/security/student-data-privacy" component={StudentDataPrivacy} />
            <Route path="/security" component={SecurityHub} />
            <Route path="/outcomes"><Redirect to="/" /></Route>
            <Route path="/start-here"><Redirect to="/" /></Route>
            <Route path="/procurement/due-diligence"><Redirect to="/" /></Route>
            <Route path="/service-areas"><Redirect to="/" /></Route>
            <Route path="/comparisons"><Redirect to="/" /></Route>
            <Route path="/comparisons/ai-vs-manual-workflows"><Redirect to="/" /></Route>
            <Route path="/comparisons/rpa-vs-api-integration"><Redirect to="/" /></Route>
            <Route path="/comparisons/zapier-vs-make-vs-n8n"><Redirect to="/" /></Route>
            <Route path="/comparisons/termflow-vs-concurrent"><Redirect to="/" /></Route>
            <Route path="/comparisons/termflow-vs-kinetic"><Redirect to="/" /></Route>
            <Route path="/comparisons/termflow-vs-starrez"><Redirect to="/" /></Route>
            <Route path="/comparisons/termflow-vs-yardi"><Redirect to="/" /></Route>
            <Route path="/one-pagers/executive-summary"><Redirect to="/" /></Route>
            <Route path="/one-pagers/technical-overview"><Redirect to="/" /></Route>
            <Route path="/one-pagers/procurement-pack"><Redirect to="/" /></Route>
            <Route path="/automation-ideas"><Redirect to="/" /></Route>
            <Route path="/universities"><Redirect to="/" /></Route>
            
            {/* Staff access route - no authentication required, uses token */}
            <Route path="/staff-access/:token" component={StaffAccess} />
            
            <Route component={Landing} />
          </Switch>
        </main>
      </Suspense>
    );
  }

  // Show onboarding without sidebar if not completed (or success page)
  if (isAuthenticated && (location === "/onboarding" || location === "/onboarding-new" || location === "/onboarding-success")) {
    return (
      <Suspense fallback={<PageLoader />}>
        <main id="main-content">
          <Switch>
          <Route path="/onboarding-success" component={OnboardingSuccess} />
          <Route path="/onboarding-new" component={OnboardingNew} />
          <Route path="/onboarding">
            {() => {
              setLocation("/onboarding-new");
              return null;
            }}
          </Route>
        </Switch>
        </main>
      </Suspense>
    );
  }

  // Authenticated landlord portal
  const style = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between gap-4 p-4 border-b">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <div className="flex items-center gap-4">
              {user?.profileImageUrl && (
                <img 
                  src={user.profileImageUrl} 
                  alt={user.firstName || 'User'} 
                  className="h-8 w-8 rounded-full object-cover"
                  data-testid="img-user-avatar"
                />
              )}
              <span className="text-sm font-medium" data-testid="text-user-name">
                {user?.firstName} {user?.lastName}
              </span>
              <Button variant="outline" size="sm" asChild data-testid="button-logout">
                <a href="/api/logout">
                  <LogOut className="h-4 w-4 mr-2" />
                  Log Out
                </a>
              </Button>
            </div>
          </header>
          <main id="main-content" className="flex-1 overflow-auto">
            <Suspense fallback={<PageLoader />}>
              <Switch>
                {/* Critical dashboard routes */}
                <Route path="/" component={Dashboard} />
                <Route path="/properties" component={Properties} />
                <Route path="/leads" component={Leads} />
                <Route path="/properties/new" component={CreateProperty} />
                <Route path="/properties/:id/floor-plan" component={FloorPlan} />
                <Route path="/properties/:propertyId/room-analytics" component={RoomAnalytics} />
                <Route path="/leads/:leadId/contract" component={ContractPreview} />
                
                {/* Dashboard pages */}
                <Route path="/viewings" component={Viewings} />
                <Route path="/contracts" component={Contracts} />
                <Route path="/analytics" component={Analytics} />
                <Route path="/call-logs" component={CallLogs} />
                <Route path="/calendar" component={Calendar} />
                <Route path="/settings" component={Settings} />
                <Route path="/billing" component={Settings} />
                <Route path="/student-profiles"><Redirect to="/" /></Route>
                
                {/* Individual dashboard pages */}
                <Route path="/contract-templates" component={ContractTemplates} />
                <Route path="/contract-templates/:id/edit" component={EditContractTemplate} />
                <Route path="/analytics/strategies" component={StrategyAnalytics} />
                <Route path="/analytics/templates" component={TemplateAnalytics} />
                <Route path="/clearing-mode"><Redirect to="/" /></Route>
                <Route path="/operator-bundle"><Redirect to="/" /></Route>
                <Route path="/pricing" component={Pricing} />
                <Route path="/connect" component={Connect} />
                <Route path="/media-import" component={MediaImport} />
                <Route path="/feature-flags" component={FeatureFlags} />
                <Route path="/test-webhooks" component={TestWebhooks} />
                <Route path="/security-privacy" component={SecurityPrivacy} />
                <Route path="/webhook-events" component={WebhookEvents} />
                <Route path="/email-events" component={EmailEvents} />
                <Route path="/integrations"><Redirect to="/" /></Route>
                <Route path="/whatsapp-templates" component={WhatsappTemplates} />
                <Route path="/contract-template-test" component={ContractTemplateTest} />
                <Route path="/move-in-checklist"><Redirect to="/" /></Route>
                
                {/* Content pages */}
                <Route path="/blog"><Redirect to="/" /></Route>
                <Route path="/blog/:slug"><Redirect to="/" /></Route>
                <Route path="/author/:slug"><Redirect to="/" /></Route>
                <Route path="/knowledge-base"><Redirect to="/" /></Route>
                <Route path="/knowledge-base/:slug"><Redirect to="/" /></Route>
                <Route path="/case-studies"><Redirect to="/" /></Route>
                <Route path="/case-studies/:slug"><Redirect to="/" /></Route>
                <Route path="/how-it-works" component={HowItWorks} />
                
                {/* Solutions pages */}
                <Route path="/solutions"><Redirect to="/" /></Route>
                <Route path="/solutions/student-onboarding"><Redirect to="/" /></Route>
                <Route path="/solutions/maintenance-triage"><Redirect to="/" /></Route>
                <Route path="/solutions/rent-arrears-nudges"><Redirect to="/" /></Route>
                <Route path="/solutions/rebooking-automation"><Redirect to="/" /></Route>
                
                {/* Integrations pages */}
                <Route path="/integrations"><Redirect to="/" /></Route>
                <Route path="/integrations/starrez"><Redirect to="/" /></Route>
                <Route path="/integrations/yardi"><Redirect to="/" /></Route>
                <Route path="/integrations/kinetic"><Redirect to="/" /></Route>
                <Route path="/integrations/fixflo"><Redirect to="/" /></Route>
                
                {/* Playbooks pages */}
                <Route path="/playbooks"><Redirect to="/" /></Route>
                <Route path="/playbooks/tenant-onboarding-automation"><Redirect to="/" /></Route>
                <Route path="/playbooks/id-document-collection"><Redirect to="/" /></Route>
                <Route path="/playbooks/maintenance-triage-automation"><Redirect to="/" /></Route>
                <Route path="/playbooks/arrears-nudging-automation"><Redirect to="/" /></Route>
                <Route path="/playbooks/inspection-scheduling-automation"><Redirect to="/" /></Route>
                <Route path="/playbooks/room-allocation-optimization"><Redirect to="/" /></Route>
                
                {/* Legal pages */}
                <Route path="/legal/privacy" component={Privacy} />
                <Route path="/legal/terms" component={Terms} />
                <Route path="/legal/gdpr" component={GDPR} />
                <Route path="/legal/cookies" component={Cookies} />
                <Route path="/legal/dpa" component={DPA} />
                <Route path="/legal/aup" component={AUP} />
                
                {/* Resource pages */}
                <Route path="/customers"><Redirect to="/" /></Route>
                <Route path="/resources/glossary"><Redirect to="/" /></Route>
                <Route path="/resources/pbsa-automation-guide-2025"><Redirect to="/" /></Route>
                <Route path="/resources/sales-deck"><Redirect to="/" /></Route>
                <Route path="/resources/pbsa-metrics-guide"><Redirect to="/" /></Route>
                <Route path="/resources/pbsa-calendar-2025"><Redirect to="/" /></Route>
                <Route path="/automation-ideas"><Redirect to="/" /></Route>
                
                <Route component={NotFound} />
              </Switch>
            </Suspense>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function App() {
  // TODO: Replace with your actual Google Analytics 4 Measurement ID
  // Get it from: https://analytics.google.com/analytics/web/
  const GA4_MEASUREMENT_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID || "G-XXXXXXXXXX";
  
  // State to control when to load each widget (deferred for performance)
  const [ChatWidget, setChatWidget] = useState<React.ComponentType | null>(null);
  const [CookieConsent, setCookieConsent] = useState<React.ComponentType | null>(null);
  const [GoogleAnalytics, setGoogleAnalytics] = useState<React.ComponentType<{ measurementId: string }> | null>(null);

  // Defer ChatWidget - load after 1.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      import("@/components/ChatWidget").then((module) => {
        setChatWidget(() => module.ChatWidget);
      }).catch(() => {
        // Silently fail if widget cannot be loaded
      });
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Defer CookieConsent - load when browser is idle or after 1 second
  useEffect(() => {
    const loadCookieConsent = () => {
      import("@/components/CookieConsent").then((module) => {
        setCookieConsent(() => module.CookieConsent);
      }).catch(() => {
        // Silently fail if widget cannot be loaded
      });
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(loadCookieConsent, { timeout: 1000 });
    } else {
      setTimeout(loadCookieConsent, 1000);
    }
  }, []);

  // Defer GoogleAnalytics - load after 2.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      import("@/components/GoogleAnalytics").then((module) => {
        setGoogleAnalytics(() => module.GoogleAnalytics);
      }).catch(() => {
        // Silently fail if analytics cannot be loaded
      });
    }, 2500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <SkipLink />
          {GoogleAnalytics && <GoogleAnalytics measurementId={GA4_MEASUREMENT_ID} />}
          <Toaster />
          <Router />
          {ChatWidget && <ChatWidget />}
          {CookieConsent && <CookieConsent />}
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;