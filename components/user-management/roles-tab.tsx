"use client"

import { useState, useEffect } from "react"
import { 
  Plus, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  Shield
} from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { roleService } from "@/lib/user-management"
import { Role, CreateRoleForm } from "@/types/user-management"

interface RolesTabProps {
  searchQuery: string
}

export function RolesTab({ searchQuery }: RolesTabProps) {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [formData, setFormData] = useState<CreateRoleForm>({
    role_name: '',
    description: '',
    is_default: false,
    is_system: false
  })

  useEffect(() => {
    loadRoles()
  }, [])

  const loadRoles = async () => {
    try {
      setLoading(true)
      const data = await roleService.getAll()
      setRoles(data)
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to load roles'
      toast.error(`Error loading roles: ${errorMessage}`)
      console.error("Error loading roles:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    if (!formData.role_name.trim()) {
      toast.error("Please fill in the role name")
      return
    }

    try {
      await roleService.create(formData)
      toast.success("Role created successfully")
      setIsAddDialogOpen(false)
      setFormData({ role_name: '', description: '', is_default: false, is_system: false })
      loadRoles()
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to create role'
      toast.error(`Error creating role: ${errorMessage}`)
      console.error("Error creating role:", error)
    }
  }

  const handleEdit = async () => {
    if (!selectedRole) return
    
    if (!formData.role_name.trim()) {
      toast.error("Please fill in the role name")
      return
    }

    try {
      await roleService.update(selectedRole.role_id, formData)
      toast.success("Role updated successfully")
      setIsEditDialogOpen(false)
      setSelectedRole(null)
      setFormData({ role_name: '', description: '', is_default: false, is_system: false })
      loadRoles()
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to update role'
      toast.error(`Error updating role: ${errorMessage}`)
      console.error("Error updating role:", error)
    }
  }

  const handleDelete = async () => {
    if (!selectedRole) return
    
    try {
      await roleService.delete(selectedRole.role_id)
      toast.success("Role deleted successfully")
      setIsDeleteDialogOpen(false)
      setSelectedRole(null)
      loadRoles()
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to delete role'
      
      // Check for specific error types
      if (errorMessage.includes('foreign key') || errorMessage.includes('constraint')) {
        toast.error("Cannot delete role: It is being used by users or other records")
      } else if (errorMessage.includes('permission') || errorMessage.includes('unauthorized')) {
        toast.error("Permission denied: You don't have access to delete this role")
      } else {
        toast.error(`Error deleting role: ${errorMessage}`)
      }
      
      console.error("Error deleting role:", error)
    }
  }

  const openEditDialog = (role: Role) => {
    setSelectedRole(role)
    setFormData({
      role_name: role.role_name,
      description: role.description || '',
      is_default: role.is_default,
      is_system: role.is_system
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (role: Role) => {
    setSelectedRole(role)
    setIsDeleteDialogOpen(true)
  }

  const filteredRoles = roles.filter(role =>
    role.role_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (role.description && role.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Loading roles...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Roles</h2>
          <p className="text-gray-600">Manage system roles and permissions</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Role
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Role</DialogTitle>
              <DialogDescription>
                Create a new system role with specific permissions.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="role_name">Role Name</Label>
                <Input
                  id="role_name"
                  value={formData.role_name}
                  onChange={(e) => setFormData({ ...formData, role_name: e.target.value })}
                  placeholder="e.g., Site Manager"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the role's responsibilities and permissions"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Default Role</Label>
                  <RadioGroup
                    value={formData.is_default ? "true" : "false"}
                    onValueChange={(value) => setFormData({ ...formData, is_default: value === "true" })}
                    className="mt-2 flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true" id="default-true" />
                      <Label htmlFor="default-true" className="text-sm">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="false" id="default-false" />
                      <Label htmlFor="default-false" className="text-sm">No</Label>
                    </div>
                  </RadioGroup>
                </div>
                              <div>
                <Label>System Role</Label>
                <RadioGroup
                  value={formData.is_system ? "true" : "false"}
                  onValueChange={(value) => setFormData({ ...formData, is_system: value === "true" })}
                  className="mt-2 flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id="system-true" />
                    <Label htmlFor="system-true" className="text-sm">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id="system-false" />
                    <Label htmlFor="system-false" className="text-sm">No</Label>
                  </div>
                </RadioGroup>
              </div>
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
                  Add Role
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Roles ({filteredRoles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Default</TableHead>
                                  <TableHead>System</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoles.map((role) => (
                <TableRow key={role.role_id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{role.role_name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-600">
                      {role.description || 'No description'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={role.is_default ? "default" : "secondary"}>
                      {role.is_default ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={role.is_system ? "default" : "secondary"}>
                      {role.is_system ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(role.created_at).toLocaleDateString()}
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
                        <DropdownMenuItem onClick={() => openEditDialog(role)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => openDeleteDialog(role)}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>
              Update role information and permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-role_name">Role Name</Label>
              <Input
                id="edit-role_name"
                value={formData.role_name}
                onChange={(e) => setFormData({ ...formData, role_name: e.target.value })}
                placeholder="e.g., Site Manager"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the role's responsibilities and permissions"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
                              <div>
                  <Label>Default Role</Label>
                  <RadioGroup
                    value={formData.is_default ? "true" : "false"}
                    onValueChange={(value) => setFormData({ ...formData, is_default: value === "true" })}
                    className="mt-2 flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true" id="edit-default-true" />
                      <Label htmlFor="edit-default-true" className="text-sm">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="false" id="edit-default-false" />
                      <Label htmlFor="edit-default-false" className="text-sm">No</Label>
                    </div>
                  </RadioGroup>
                </div>
                              <div>
                  <Label>System Role</Label>
                  <RadioGroup
                    value={formData.is_system ? "true" : "false"}
                    onValueChange={(value) => setFormData({ ...formData, is_system: value === "true" })}
                    className="mt-2 flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true" id="edit-system-true" />
                      <Label htmlFor="edit-system-true" className="text-sm">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="false" id="edit-system-false" />
                      <Label htmlFor="edit-system-false" className="text-sm">No</Label>
                    </div>
                  </RadioGroup>
                </div>
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
                Update Role
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
              This will permanently delete the role "{selectedRole?.role_name}". This action cannot be undone.
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