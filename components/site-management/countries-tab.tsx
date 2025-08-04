"use client"

import { useState, useEffect } from "react"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Globe,
  MoreHorizontal
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { countryService } from "@/lib/site-management"
import { Country, CreateCountryForm } from "@/types/site-management"
import { toast } from "sonner"

interface CountriesTabProps {
  searchQuery: string
}

export function CountriesTab({ searchQuery }: CountriesTabProps) {
  const [countries, setCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [formData, setFormData] = useState<CreateCountryForm>({
    name: "",
    code: "",
    status: true
  })

  useEffect(() => {
    loadCountries()
  }, [])

  const loadCountries = async () => {
    try {
      setLoading(true)
      const data = await countryService.getAll()
      setCountries(data)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load countries'
      toast.error(`Error loading countries: ${errorMessage}`)
      console.error("Error loading countries:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    if (!formData.name.trim() || !formData.code.trim()) {
      toast.error("Please fill in all required fields (Country Name and Code)")
      return
    }

    try {
      await countryService.create(formData)
      toast.success("Country created successfully")
      setIsAddDialogOpen(false)
      setFormData({ name: '', code: '', status: true })
      loadCountries()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create country'
      toast.error(`Error creating country: ${errorMessage}`)
      console.error("Error creating country:", error)
    }
  }

  const handleEdit = async () => {
    if (!selectedCountry) return
    
    if (!formData.name.trim() || !formData.code.trim()) {
      toast.error("Please fill in all required fields (Country Name and Code)")
      return
    }

    try {
      await countryService.update(selectedCountry.country_id, formData)
      toast.success("Country updated successfully")
      setIsEditDialogOpen(false)
      setSelectedCountry(null)
      setFormData({ name: '', code: '', status: true })
      loadCountries()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update country'
      toast.error(`Error updating country: ${errorMessage}`)
      console.error("Error updating country:", error)
    }
  }

  const handleDelete = async () => {
    if (!selectedCountry) return
    
    try {
      await countryService.delete(selectedCountry.country_id)
      toast.success("Country deleted successfully")
      setIsDeleteDialogOpen(false)
      setSelectedCountry(null)
      loadCountries()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete country'
      
      // Check for specific error types
      if (errorMessage.includes('foreign key') || errorMessage.includes('constraint')) {
        toast.error("Cannot delete country: It is being used by other records (sites, villages, etc.)")
      } else if (errorMessage.includes('permission') || errorMessage.includes('unauthorized')) {
        toast.error("Permission denied: You don't have access to delete this country")
      } else {
        toast.error(`Error deleting country: ${errorMessage}`)
      }
      
      console.error("Error deleting country:", error)
    }
  }

  const openEditDialog = (country: Country) => {
    setSelectedCountry(country)
    setFormData({
      name: country.name,
      code: country.code,
      status: country.status
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (country: Country) => {
    setSelectedCountry(country)
    setIsDeleteDialogOpen(true)
  }

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Loading countries...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Countries</h2>
          <p className="text-gray-600">Manage research countries and their status</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Country
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Country</DialogTitle>
              <DialogDescription>
                Create a new country for research site management.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Country Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter country name"
                />
              </div>
              <div>
                <Label htmlFor="code">Country Code</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g., KE, UG"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="status"
                  checked={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                />
                <Label htmlFor="status">Active Status</Label>
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
                  Add Country
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Countries ({filteredCountries.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Country</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCountries.map((country) => (
                <TableRow key={country.country_id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{country.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{country.code}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={country.status ? "success" : "secondary"}>
                      {country.status ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(country.created_at).toLocaleDateString()}
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
                        <DropdownMenuItem onClick={() => openEditDialog(country)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => openDeleteDialog(country)}
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
            <DialogTitle>Edit Country</DialogTitle>
            <DialogDescription>
              Update country information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Country Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter country name"
              />
            </div>
            <div>
              <Label htmlFor="edit-code">Country Code</Label>
              <Input
                id="edit-code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g., KE, UG"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-status"
                checked={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
              />
              <Label htmlFor="edit-status">Active Status</Label>
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
                Update Country
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
              This will permanently delete the country &quot;{selectedCountry?.name}&quot;. This action cannot be undone.
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