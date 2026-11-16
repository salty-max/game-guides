import { BrowserRouter, Navigate, Route } from "react-router";
import { Layout } from "./components/Layout";
import { Pages } from "./components/Pages";
import { ChecklistPage } from "./pages/ChecklistPage";
import { DashboardPage } from "./pages/DashboardPage";
import { GuidePage } from "./pages/GuidePage";
import { SourcesPage } from "./pages/SourcesPage";
import { useGlobalEffects } from "./useThemeEffects";
import { useProgress } from "./store/progress";
import { useSync } from "./sync/engine";
import { useLaunches } from "./useLaunches";

function Home() {
  const chapter = useProgress((s) => s.data.chapter);
  return <Navigate to={`/guide/${chapter}`} replace />;
}

/** What needs the router but draws nothing. */
function Launches() {
  useLaunches();
  return null;
}

// One element for the life of the app, so a move redraws only the page it shows (Pages).
const routes = (
  <>
    <Route path="/" element={<Home />} />
    <Route path="/guide/:chapter?/:entry?" element={<GuidePage />} />
    <Route path="/checklist/:category?/:chapter?" element={<ChecklistPage />} />
    <Route path="/dashboard/:section?" element={<DashboardPage />} />
    <Route path="/sources" element={<SourcesPage />} />
    <Route path="*" element={<Home />} />
  </>
);

export function App() {
  useGlobalEffects();
  useSync();
  return (
    <BrowserRouter>
      <Launches />
      <Layout>
        <Pages>{routes}</Pages>
      </Layout>
    </BrowserRouter>
  );
}
