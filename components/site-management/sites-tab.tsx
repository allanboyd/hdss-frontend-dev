"use client"

import { useState, useEffect } from "react"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Building2,
  MapPin,
  Calendar,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { siteService, countryService } from "@/lib/site-management"
import { Site, CreateSiteForm, Country } from "@/types/site-management"
import { toast } from "sonner"

interface SitesTabProps {
  searchQuery: string
}

export function SitesTab({ searchQuery }: SitesTabProps) {
  const [sites, setSites] = useState<Site[]>([])
  const [countries, setCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedSite, setSelectedSite] = useState<Site | null>(null)
  const [formData, setFormData] = useState<CreateSiteForm>({
    country_id: 0,
    name: "",
    description: "",
    location_name: "",
    latitude: undefined,
    longitude: undefined,
    address: "",
    start_date: "",
    end_date: ""
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [sitesData, countriesData] = await Promise.all([
        siteService.getAll(),
        countryService.getAll()
      ])
      setSites(sitesData)
      setCountries(countriesData)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load data'
      toast.error(`Error loading data: ${errorMessage}`)
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    if (!formData.name.trim() || !formData.country_id) {
      toast.error("Please fill in all required fields (Site Name and Country)")
      return
    }

    try {
      await siteService.create(formData)
      toast.success("Site created successfully")
      setIsAddDialogOpen(false)
      setFormData({
        country_id: 0,
        name: '',
        description: '',
        location_name: '',
        latitude: undefined,
        longitude: undefined,
        address: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: ''
      })
      loadData()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create site'
      toast.error(`Error creating site: ${errorMessage}`)
      console.error("Error creating site:", error)
    }
  }

  const handleEdit = async () => {
    if (!selectedSite) return
    
    if (!formData.name.trim() || !formData.country_id) {
      toast.error("Please fill in all required fields (Site Name and Country)")
      return
    }

    try {
      await siteService.update(selectedSite.site_id, formData)
      toast.success("Site updated successfully")
      setIsEditDialogOpen(false)
      setSelectedSite(null)
      setFormData({
        country_id: 0,
        name: '',
        description: '',
        location_name: '',
        latitude: undefined,
        longitude: undefined,
        address: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: ''
      })
      loadData()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update site'
      toast.error(`Error updating site: ${errorMessage}`)
      console.error("Error updating site:", error)
    }
  }

  const handleDelete = async () => {
    if (!selectedSite) return
    
    try {
      await siteService.delete(selectedSite.site_id)
      toast.success("Site deleted successfully")
      setIsDeleteDialogOpen(false)
      setSelectedSite(null)
      loadData()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete site'
      
      // Check for specific error types
      if (errorMessage.includes('foreign key') || errorMessage.includes('constraint')) {
        toast.error("Cannot delete site: It is being used by other records (villages, structures, etc.)")
      } else if (errorMessage.includes('permission') || errorMessage.includes('unauthorized')) {
        toast.error("Permission denied: You don't have access to delete this site")
      } else {
        toast.error(`Error deleting site: ${errorMessage}`)
      }
      
      console.error("Error deleting site:", error)
    }
  }

  const openEditDialog = (site: Site) => {
    setSelectedSite(site)
    setFormData({
      country_id: site.country_id,
      name: site.name,
      description: site.description || "",
      location_name: site.location_name || "",
      latitude: site.latitude,
      longitude: site.longitude,
      address: site.address || "",
      start_date: site.start_date,
      end_date: site.end_date || ""
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (site: Site) => {
    setSelectedSite(site)
    setIsDeleteDialogOpen(true)
  }

  const filteredSites = sites.filter(site =>
    site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    site.country?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    site.location_name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Loading sites...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Sites</h2>
          <p className="text-gray-600">Manage research sites and their locations</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Site
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Site</DialogTitle>
              <DialogDescription>
                Create a new research site with location details.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="country">Country</Label>
                <Select
                  value={formData.country_id.toString()}
                  onValueChange={(value) => setFormData({ ...formData, country_id: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.country_id} value={country.country_id.toString()}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="name">Site Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter site name"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter site description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location_name">Location Name</Label>
                  <Input
                    id="location_name"
                    value={formData.location_name}
                    onChange={(e) => setFormData({ ...formData, location_name: e.target.value })}
                    placeholder="e.g., Nairobi, Kampala"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Enter address"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    value={formData.latitude || ""}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value ? parseFloat(e.target.value) : undefined })}
                    placeholder="e.g., -1.2921"
                  />
                </div>
                <div>
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    value={formData.longitude || ""}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value ? parseFloat(e.target.value) : undefined })}
                    placeholder="e.g., 36.8219"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="end_date">End Date (Optional)</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
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
                  Add Site
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sites ({filteredSites.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Site</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSites.map((site) => (
                <TableRow key={site.site_id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <div>
                        <span className="font-medium">{site.name}</span>
                        {site.description && (
                          <p className="text-sm text-gray-500">{site.description}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{site.country?.name}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span className="text-sm">{site.location_name || "N/A"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span className="text-sm">
                        {new Date(site.start_date).toLocaleDateString()}
                        {site.end_date && ` - ${new Date(site.end_date).toLocaleDateString()}`}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(site.created_at).toLocaleDateString()}
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
                        <DropdownMenuItem onClick={() => openEditDialog(site)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => openDeleteDialog(site)}
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Site</DialogTitle>
            <DialogDescription>
              Update site information and location details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-country">Country</Label>
              <Select
                value={formData.country_id.toString()}
                onValueChange={(value) => setFormData({ ...formData, country_id: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.country_id} value={country.country_id.toString()}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-name">Site Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter site name"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter site description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-location_name">Location Name</Label>
                <Input
                  id="edit-location_name"
                  value={formData.location_name}
                  onChange={(e) => setFormData({ ...formData, location_name: e.target.value })}
                  placeholder="e.g., Nairobi, Kampala"
                />
              </div>
              <div>
                <Label htmlFor="edit-address">Address</Label>
                <Input
                  id="edit-address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter address"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-latitude">Latitude</Label>
                <Input
                  id="edit-latitude"
                  type="number"
                  step="any"
                  value={formData.latitude || ""}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value ? parseFloat(e.target.value) : undefined })}
                  placeholder="e.g., -1.2921"
                />
              </div>
              <div>
                <Label htmlFor="edit-longitude">Longitude</Label>
                <Input
                  id="edit-longitude"
                  type="number"
                  step="any"
                  value={formData.longitude || ""}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value ? parseFloat(e.target.value) : undefined })}
                  placeholder="e.g., 36.8219"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-start_date">Start Date</Label>
                <Input
                  id="edit-start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-end_date">End Date (Optional)</Label>
                <Input
                  id="edit-end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
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
                Update Site
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
              This will permanently delete the site &quot;{selectedSite?.name}&quot;. This action cannot be undone.
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