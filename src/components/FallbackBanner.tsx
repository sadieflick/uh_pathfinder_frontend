import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FallbackBannerProps {
  show: boolean;
}

/**
 * Banner to inform users when the app is running with fallback data
 * (i.e., backend is unavailable)
 */
export const FallbackBanner: React.FC<FallbackBannerProps> = ({ show }) => {
  if (!show) return null;

  return (
    <Alert className="mb-4 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
      <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
      <AlertDescription className="text-amber-800 dark:text-amber-200">
        <strong>Demo Mode:</strong> Showing sample data. Full database features will be available in the live presentation.
      </AlertDescription>
    </Alert>
  );
};
