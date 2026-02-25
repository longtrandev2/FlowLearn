import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Lock, Eye, EyeOff, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");   
  const [password, setPassword] = useState("");
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = async () => {
      await login(email, password); 
      
      console.log("Login success, navigating...");
    
      navigate("/", { replace: true }); 
  };

  

  return (
  <Card className="bg-transparent drop-shadow-2xl border-2 border-solid border-[rpga(255,255,255.2)] text-white backdrop-blur-[20px] shadow-[0_0_10px_rgba(0,0,0,0.2)]">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center ">
          Login
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 flex flex-col text-center">
        {/*  Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Input id="email" placeholder="Enter your email"
            className="placeholder:text-white"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
             />
            <Mail className="absolute right-2 top-1/2 -translate-y-1/2" />
          </div>
        </div>
        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="Password"
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              className="placeholder:text-white outline-none focus-visible:outline-purple-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-0 right-0 h-full"
            >
              {showPassword ? (
                <EyeOff className="w-6 h-6" />
              ) : (
                <Eye className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>
        {/* Remember - Forgot */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-1.5">
            <Checkbox
              id="remember"
              className="border-white/50 data-[state=checked]:bg-white data-[state=checked]:text-purple-900"
            />
            <Label htmlFor="remmeber">Remember me</Label>
         
          </div>
             <Link
              to="/forgot"
              className="font-semibold hover:underline"
            >
              Forgot password?
            </Link>
        </div>
        {/* Button */}
        <Button className="w-full  rounded-4xl bg-white text-black hover:bg-purple-400" 
        onClick={() => 
          {handleLogin()
          console.log("login");
          
          }
          }
        >
          Login</Button>
        {/* Footer */}
        <div className="self-center">Don't have an account? <Link to="/register" replace className="font-bold">Register</Link></div>
    
      </CardContent>
    </Card>
  );
};
