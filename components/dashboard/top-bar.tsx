"use client"

import { Search, Mail, Bell, Settings } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function TopBar() {
  return (
    <header className="bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search"
            className="pl-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-gray-300 transition-colors duration-200 rounded-r-none"
          />
        </div>

        {/* Right: Utility Icons */}
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" className="w-10 h-10 p-0 rounded-full bg-gray-100 hover:bg-gray-200">
            <Mail className="w-5 h-5 text-gray-600" />
          </Button>
          
          <Button variant="ghost" size="sm" className="w-10 h-10 p-0 rounded-full bg-gray-100 hover:bg-gray-200 relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <Badge className="absolute -top-1 -right-1 w-3 h-3 p-0 bg-teal-400 border-2 border-white" />
          </Button>
          
          <Button variant="ghost" size="sm" className="w-10 h-10 p-0 rounded-full bg-gray-100 hover:bg-gray-200">
            <Settings className="w-5 h-5 text-gray-600" />
          </Button>
        </div>
      </div>
    </header>
  )
} 