import { Bell, Eye, AlertTriangle, CheckCircle, Lock, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const notifications = [
  {
    id: 1,
    type: "warning",
    title: "Kwale hasn't synched in 6 days",
    time: "2 hours ago",
    icon: Clock,
    color: "text-orange-500",
  },
  {
    id: 2,
    type: "alert",
    title: "New access request from Henry",
    time: "3 hours ago",
    icon: AlertTriangle,
    color: "text-red-500",
  },
  {
    id: 3,
    type: "success",
    title: "Study data exported successfully",
    time: "5 hours ago",
    icon: CheckCircle,
    color: "text-green-500",
  },
  {
    id: 4,
    type: "info",
    title: "Data set shared with Nkirote",
    time: "6 hours ago",
    icon: Lock,
    color: "text-blue-500",
  },
  {
    id: 5,
    type: "warning",
    title: "Nairobi hasn't synched in 6 days",
    time: "2 hours ago",
    icon: Clock,
    color: "text-orange-500",
  },
  {
    id: 6,
    type: "success",
    title: "New research site added: Mathare",
    time: "8 hours ago",
    icon: CheckCircle,
    color: "text-green-500",
  },
  {
    id: 7,
    type: "alert",
    title: "System maintenance scheduled for tomorrow",
    time: "1 day ago",
    icon: AlertTriangle,
    color: "text-red-500",
  }
]

export function NotificationsPanel() {
  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Bell className="w-5 h-5 text-orange-600" />
            <span className="hidden sm:inline">Notifications</span>
            <span className="sm:hidden">Alerts</span>
          </CardTitle>
          <Badge variant="warning" className="ml-2">
            {notifications.length} New
          </Badge>
        </div>
        <div className="flex gap-1 sm:gap-2 text-xs mt-3 overflow-x-auto">
          <span className="px-2 sm:px-3 py-1 bg-orange-100 text-orange-700 rounded-full font-medium whitespace-nowrap">All</span>
          <span className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-600 rounded-full whitespace-nowrap">Access</span>
          <span className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-600 rounded-full whitespace-nowrap">Research</span>
          <span className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-600 rounded-full whitespace-nowrap">Data</span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1">
          {notifications.map((notification) => (
            <div key={notification.id} className="flex items-start gap-3 p-3 sm:p-4 hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0">
              <div className={`p-1.5 sm:p-2 rounded-full ${notification.color.replace('text-', 'bg-').replace('-500', '-100')}`}>
                <notification.icon className={`w-3 h-3 sm:w-4 sm:h-4 ${notification.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-900 leading-tight">{notification.title}</p>
                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
              </div>
              <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 p-1 sm:p-2">
                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </div>
          ))}
        </div>
        <div className="p-3 sm:p-4 border-t border-gray-100">
          <Button variant="outline" className="w-full text-orange-600 border-orange-200 hover:bg-orange-50 text-xs sm:text-sm">
            View All Notifications
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
