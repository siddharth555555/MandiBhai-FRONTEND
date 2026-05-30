import { StoreProvider } from './context/StoreContext';
import AppContent from './AppContent';

export default function App() {
    return (
        <StoreProvider>
            <AppContent />
        </StoreProvider>
    );
}
