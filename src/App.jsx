import { RouterProvider } from 'react-router-dom';

// project imports
import router from 'routes';
import ThemeCustomization from 'themes';

import ScrollTop from 'components/ScrollTop';
import { Toaster } from 'react-hot-toast';

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

export default function App() {
  return (
    <ThemeCustomization>
      <ScrollTop>
        <Toaster/>
        <RouterProvider router={router} />
      </ScrollTop>
    </ThemeCustomization>
  );
}
