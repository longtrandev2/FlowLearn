import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Bell, Search } from 'lucide-react';
import { mockUser } from '@/features/overview/data/mockData';

export const Header = () => {
  return (
    <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 bg-white/80 backdrop-blur-sm shrink-0">
      {/* Greeting */}
      <div className="flex flex-col">
        <h1 className="font-semibold text-lg text-slate-800">
          Hello, {mockUser.name} 👋
        </h1>
        <p className="text-xs text-slate-400">{mockUser.greeting}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <Input
            placeholder="Search courses..."
            className="w-56 h-9 pl-9 text-sm rounded-xl border-slate-200 focus:border-ocean-400 focus:ring-ocean-200 transition-all duration-200"
          />
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-xl border-slate-200 hover:bg-ocean-50 hover:border-ocean-200 transition-all duration-200"
        >
          <Bell className="w-4 h-4 text-slate-500" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-9 w-9"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                <AvatarFallback className="bg-ocean-100 text-ocean-700 text-xs font-semibold">
                  {mockUser.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-36" align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive">
                Log out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
