import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Header, TTSForm } from '@/components';
import { speechService } from '@/services';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function App() {
  const isConfigured = speechService.isConfigured();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen relative overflow-hidden">
        {/* Background decorations */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />
        </div>

        {/* Main content */}
        <main className="relative z-10 container mx-auto px-4 py-8 md:py-16 max-w-3xl">
          <Header />
          
          {isConfigured ? (
            <TTSForm />
          ) : (
            <div className="glass rounded-2xl p-8 text-center">
              <h2 className="text-xl font-semibold text-white mb-4">
                Configuration Required
              </h2>
              <p className="text-white/60 mb-4">
                To use Echo Bird, please set up your Azure Speech Service credentials.
              </p>
              <div className="bg-black/30 rounded-lg p-4 text-left text-sm text-white/80 font-mono">
                <p className="mb-2"># Create a .env file with:</p>
                <p className="text-cyan-400">VITE_AZURE_SPEECH_KEY=your_key_here</p>
                <p className="text-cyan-400">VITE_AZURE_SPEECH_REGION=eastus</p>
              </div>
            </div>
          )}

          {/* Footer */}
          <footer className="mt-16 text-center text-white/30 text-sm">
            <p>
              Built with React, TypeScript & Azure Cognitive Services
            </p>
            <p className="mt-1">
              © 2026 Echo Bird
            </p>
          </footer>
        </main>
      </div>
    </QueryClientProvider>
  );
}

export default App;
