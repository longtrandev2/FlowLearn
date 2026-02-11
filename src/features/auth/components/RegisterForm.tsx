import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Lock, Eye, EyeOff, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export const RegisterForm = () => {
  return (
  <Card className="bg-transparent drop-shadow-2xl border-2 border-solid border-[rpga(255,255,255.2)] text-white backdrop-blur-[20px] shadow-[0_0_10px_rgba(0,0,0,0.2)]">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center ">
          Register
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 flex flex-col text-center">
        {/* Username */}
            <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <div className="relative">
            <Input id="name" placeholder="Enter your name"
            className="placeholder:text-white"
             />
            <User className="absolute right-2 top-1/2 -translate-y-1/2" />
          </div>
        </div>
        {/*  Email */}
        <div className="space-y-2">
          <Label htmlFor="Email">Email</Label>
          <div className="relative">
            <Input id="email" placeholder="Enter your email"
            className="placeholder:text-white"
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
              // type={showPassword ? "text" : "password"}
              className="placeholder:text-white outline-none focus-visible:outline-purple-500"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              // onClick={() => setShowPassword(!showPassword)}
              className="absolute top-0 right-0 h-full"
            >
             
            </Button>
          </div>
        </div>
        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm password</Label>
          <div className="relative">
            <Input
              id="confirm-password"
              placeholder="Confirm your password"
              // type={showPassword ? "text" : "password"}
              className="placeholder:text-white outline-none focus-visible:outline-purple-500"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              // onClick={() => setShowPassword(!showPassword)}
              className="absolute top-0 right-0 h-full"
            >
             
            </Button>
          </div>
        </div>
        {/* Button */}
        <Button className="w-full  rounded-4xl bg-white text-black hover:bg-purple-400">Register</Button>
        {/* Footer */}
        <div className="self-center">Already have an account? <Link to="/login" replace className="font-bold">Login</Link></div>
    
      </CardContent>
    </Card>
  );
};
