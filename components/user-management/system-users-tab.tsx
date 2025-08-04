"use client"

import { useState, useEffect } from "react"
import { 
  Plus, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  User,
  Mail,
  Phone,
  Shield,
  RefreshCw,
  Copy,
  Check
} from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { userProfileService, roleService, siteUserService } from "@/lib/user-management"
import { siteService } from "@/lib/site-management"
import { UserProfile, CreateUserProfileForm, Role, CreateSiteUserForm } from "@/types/user-management"
import { Site } from "@/types/site-management"

interface SystemUsersTabProps {
  searchQuery: string
}

export function SystemUsersTab({ searchQuery }: SystemUsersTabProps) {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
  const [passwordCopied, setPasswordCopied] = useState(false)
  const [formData, setFormData] = useState<CreateUserProfileForm>({
    username: '',
    email: '',
    full_name: '',
    phone_number: '',
    role_id: 0,
    site_id: undefined,
    status: 'active',
    password: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [usersData, rolesData, sitesData] = await Promise.all([
        userProfileService.getAll(),
        roleService.getAll(),
        siteService.getAll()
      ])
      setUsers(usersData)
      setRoles(rolesData)
      setSites(sitesData)
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to load data'
      toast.error(`Error loading data: ${errorMessage}`)
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    if (!formData.email.trim() || !formData.full_name.trim() || !formData.role_id || !formData.password.trim()) {
      toast.error("Please fill in all required fields (Email, Full Name, Role, and Password)")
      return
    }

    try {
      // Create the user profile first
      const newUser = await userProfileService.create(formData)
      
      // If a site is assigned, create a site_user record
      if (formData.site_id) {
        const siteUserData: CreateSiteUserForm = {
          site_id: formData.site_id,
          role_id: formData.role_id,
          user_profile_id: newUser.user_id,
          status: 'active'
        }
        
        try {
          await siteUserService.create(siteUserData)
          toast.success("User created successfully and assigned to site")
        } catch (siteUserError: any) {
          // If site_user creation fails, still show success for user creation but warn about site assignment
          console.error("Error creating site user record:", siteUserError)
          toast.success("User created successfully, but site assignment failed")
        }
      } else {
        toast.success("User created successfully")
      }
      
      setIsAddDialogOpen(false)
      setFormData({
        username: '',
        email: '',
        full_name: '',
        phone_number: '',
        role_id: 0,
        site_id: undefined,
        status: 'active',
        password: ''
      })
      setPasswordCopied(false)
      loadData()
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to create user'
      toast.error(`Error creating user: ${errorMessage}`)
      console.error("Error creating user:", error)
    }
  }

  const handleEdit = async () => {
    if (!selectedUser) return
    
    if (!formData.email.trim() || !formData.full_name.trim() || !formData.role_id) {
      toast.error("Please fill in all required fields (Email, Full Name, and Role)")
      return
    }

    try {
      await userProfileService.update(selectedUser.user_id, formData)
      toast.success("User updated successfully")
      setIsEditDialogOpen(false)
      setSelectedUser(null)
      setFormData({
        username: '',
        email: '',
        full_name: '',
        phone_number: '',
        role_id: 0,
        site_id: undefined,
        status: 'active',
        password: ''
      })
      setPasswordCopied(false)
      loadData()
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to update user'
      toast.error(`Error updating user: ${errorMessage}`)
      console.error("Error updating user:", error)
    }
  }

  const handleDelete = async () => {
    if (!selectedUser) return
    
    try {
      await userProfileService.delete(selectedUser.user_id)
      toast.success("User deleted successfully")
      setIsDeleteDialogOpen(false)
      setSelectedUser(null)
      loadData()
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to delete user'
      
      // Check for specific error types
      if (errorMessage.includes('foreign key') || errorMessage.includes('constraint')) {
        toast.error("Cannot delete user: It is being used by other records")
      } else if (errorMessage.includes('permission') || errorMessage.includes('unauthorized')) {
        toast.error("Permission denied: You don't have access to delete this user")
      } else {
        toast.error(`Error deleting user: ${errorMessage}`)
      }
      
      console.error("Error deleting user:", error)
    }
  }

  const openEditDialog = (user: UserProfile) => {
    setSelectedUser(user)
    setFormData({
      username: user.username || '',
      email: user.email,
      full_name: user.full_name,
      phone_number: user.phone_number || '',
      role_id: user.role_id,
      site_id: user.site_id,
      status: user.status,
      password: '' // Don't populate password for security
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (user: UserProfile) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default'
      case 'inactive': return 'secondary'
      case 'suspended': return 'destructive'
      default: return 'secondary'
    }
  }

  const generatePassword = () => {
    const length = 12
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
    let password = ""
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    setFormData({ ...formData, password })
    setPasswordCopied(false)
  }

  const copyPassword = async () => {
    if (formData.password) {
      try {
        await navigator.clipboard.writeText(formData.password)
        setPasswordCopied(true)
        toast.success("Password copied to clipboard")
        setTimeout(() => setPasswordCopied(false), 2000)
      } catch (error) {
        toast.error("Failed to copy password")
      }
    }
  }

  const filteredUsers = users.filter(user =>
    user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.username && user.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
    user.role?.role_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Loading users...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">System Users</h2>
          <p className="text-gray-600">Manage user profiles and permissions</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user profile with authentication.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Enter username (optional)"
                />
              </div>
              <div>
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <Label htmlFor="role">Role *</Label>
                <Select
                  value={formData.role_id.toString()}
                  onValueChange={(value) => setFormData({ ...formData, role_id: parseInt(value) })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.role_id} value={role.role_id.toString()}>
                        {role.role_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="site">Site</Label>
                <Select
                  value={formData.site_id?.toString() || 'none'}
                  onValueChange={(value) => setFormData({ ...formData, site_id: value === 'none' ? undefined : parseInt(value) })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a site (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No site assigned</SelectItem>
                    {sites.map((site) => (
                      <SelectItem key={site.site_id} value={site.site_id.toString()}>
                        {site.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="password">Password *</Label>
                <div className="flex gap-2">
                  <Input
                    id="password"
                    type={formData.password && formData.password.length > 0 ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter password or generate one"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generatePassword}
                    className="shrink-0"
                    title="Generate secure password"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                  {formData.password && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={copyPassword}
                      className="shrink-0"
                      title="Copy password to clipboard"
                    >
                      {passwordCopied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  )}
                </div>
                {formData.password && (
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-500">
                      Password strength: {formData.password.length >= 8 ? 'Strong' : 'Weak'}
                    </p>
                    <p className="text-xs text-gray-500">
                      Length: {formData.password.length} characters
                    </p>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleAdd}
                  className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white"
                >
                  Add User
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>System Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Site</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.user_id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <div>
                        <span className="font-medium">{user.full_name}</span>
                        {user.username && (
                          <p className="text-sm text-gray-500">@{user.username}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <span className="text-sm">{user.email}</span>
                      </div>
                      {user.phone_number && (
                        <div className="flex items-center space-x-1">
                          <Phone className="w-3 h-3 text-gray-400" />
                          <span className="text-sm">{user.phone_number}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Shield className="w-3 h-3 text-gray-400" />
                      <Badge variant="secondary">{user.role?.role_name}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {user.site?.name || 'No site assigned'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(user.status)}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => openEditDialog(user)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => openDeleteDialog(user)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user profile information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-full_name">Full Name *</Label>
              <Input
                id="edit-full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Enter full name"
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Email *</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email address"
              />
            </div>
            <div>
              <Label htmlFor="edit-username">Username</Label>
              <Input
                id="edit-username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Enter username (optional)"
              />
            </div>
            <div>
              <Label htmlFor="edit-phone_number">Phone Number</Label>
              <Input
                id="edit-phone_number"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <Label htmlFor="edit-role">Role *</Label>
              <Select
                value={formData.role_id.toString()}
                onValueChange={(value) => setFormData({ ...formData, role_id: parseInt(value) })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.role_id} value={role.role_id.toString()}>
                      {role.role_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-site">Site</Label>
                              <Select
                  value={formData.site_id?.toString() || 'none'}
                  onValueChange={(value) => setFormData({ ...formData, site_id: value === 'none' ? undefined : parseInt(value) })}
                >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a site (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No site assigned</SelectItem>
                  {sites.map((site) => (
                    <SelectItem key={site.site_id} value={site.site_id.toString()}>
                      {site.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleEdit}
                className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white"
              >
                Update User
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the user "{selectedUser?.full_name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 