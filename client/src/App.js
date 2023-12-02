// ************** THIS IS YOUR APP'S ENTRY POINT. CHANGE THIS FILE AS NEEDED. **************
// ************** DEFINE YOUR REACT COMPONENTS in ./components directory **************
import Banner from "./components/banner/banner.js"
import { LocationContextProvider } from "./components/locationContext.js";
import SideBarNav from './components/sideBarNav.js';

function App() {
  return (
    <LocationContextProvider>
      <Banner />
      <SideBarNav />
    </LocationContextProvider>
  )
}

export default App;