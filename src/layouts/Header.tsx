import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Bell, Search } from 'lucide-react'

export const Header = () => {
  return (
    <div className='mt-5 flex justify-between px-5'>
        {/* Header */}
            <div className='flex px-1 space-x-0.5 flex-col'>
                <div className='font-medium text-[26px]'>Hello Long</div>
                <div className='text-gray-400'>Let's learn something new today!</div>
            </div>
        {/* Footer */}
        <div className='space-x-4 flex'>
          <div className='relative'>
            <Input placeholder='Search from course'size={40}/>
            <Search size={20} className='absolute right-2 top-5 -translate-y-1/2'/>
          </div>
          <Button variant='outline' size='icon' >
           <Bell className='w-5! h-5!'/>
          </Button>
  <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32">
        <DropdownMenuGroup>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive">Log out</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
        </div>
    </div>
  )
}
