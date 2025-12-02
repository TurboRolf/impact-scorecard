import Navigation from "@/components/Navigation";

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen = ({ message = "Loading..." }: LoadingScreenProps) => {
  return (
    <div className="min-h-screen bg-gradient-subtle pb-20 md:pb-8">
      <Navigation />
      <div className="max-w-6xl mx-auto pt-20 px-4 pb-8">
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
