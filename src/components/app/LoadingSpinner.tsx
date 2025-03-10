
interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner = ({ message = "กำลังโหลด..." }: LoadingSpinnerProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
