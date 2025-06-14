
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="text-center p-8 max-w-md">
        <div className="text-9xl font-bold text-pink-300 mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Страница не найдена</h1>
        <p className="text-gray-600 mb-8">
          К сожалению, запрашиваемая страница не существует или была перемещена.
        </p>
        <div className="space-y-3">
          <Link to="/">
            <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
              <Home className="w-4 h-4 mr-2" />
              На главную страницу
            </Button>
          </Link>
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
