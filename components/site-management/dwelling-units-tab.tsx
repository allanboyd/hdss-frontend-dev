"use client"

import { useState, useEffect } from "react"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users,
  Home,
  MapPin,
  Building2,
  MoreHorizontal
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { dwellingUnitService, structureService } from "@/lib/site-management"
import { DwellingUnit, CreateDwellingUnitForm, Structure } from "@/types/site-management"
import { toast } from "sonner"

interface DwellingUnitsTabProps {
  searchQuery: string
}

export function DwellingUnitsTab({ searchQuery }: DwellingUnitsTabProps) {
  const [dwellingUnits, setDwellingUnits] = useState<DwellingUnit[]>([])
  const [structures, setStructures] = useState<Structure[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedDwellingUnit, setSelectedDwellingUnit] = useState<DwellingUnit | null>(null)
  const [formData, setFormData] = useState<CreateDwellingUnitForm>({
    structure_id: 0,
    unit_code: "",
    unit_type: "",
    occupancy_status: "",
    description: ""
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [dwellingUnitsData, structuresData] = await Promise.all([
        dwellingUnitService.getAll(),
        structureService.getAll()
      ])
      setDwellingUnits(dwellingUnitsData)
      setStructures(structuresData)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load data'
      toast.error(`Error loading data: ${errorMessage}`)
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    if (!formData.unit_code.trim() || !formData.structure_id || !formData.unit_type.trim() || !formData.occupancy_status.trim()) {
      toast.error("Please fill in all required fields (Unit Code, Structure, Unit Type, and Occupancy Status)")
      return
    }

    try {
      await dwellingUnitService.create(formData)
      toast.success("Dwelling unit created successfully")
      setIsAddDialogOpen(false)
      setFormData({
        structure_id: 0,
        unit_code: "",
        unit_type: "",
        occupancy_status: "",
        description: ""
      })
      loadData()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create dwelling unit'
      toast.error(`Error creating dwelling unit: ${errorMessage}`)
      console.error("Error creating dwelling unit:", error)
    }
  }

  const handleEdit = async () => {
    if (!selectedDwellingUnit) return
    
    if (!formData.unit_code.trim() || !formData.structure_id || !formData.unit_type.trim() || !formData.occupancy_status.trim()) {
      toast.error("Please fill in all required fields (Unit Code, Structure, Unit Type, and Occupancy Status)")
      return
    }

    try {
      await dwellingUnitService.update(selectedDwellingUnit.dwelling_unit_id, formData)
      toast.success("Dwelling unit updated successfully")
      setIsEditDialogOpen(false)
      setSelectedDwellingUnit(null)
      setFormData({
        structure_id: 0,
        unit_code: "",
        unit_type: "",
        occupancy_status: "",
        description: ""
      })
      loadData()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update dwelling unit'
      toast.error(`Error updating dwelling unit: ${errorMessage}`)
      console.error("Error updating dwelling unit:", error)
    }
  }

  const handleDelete = async () => {
    if (!selectedDwellingUnit) return
    
    try {
      await dwellingUnitService.delete(selectedDwellingUnit.dwelling_unit_id)
      toast.success("Dwelling unit deleted successfully")
      setIsDeleteDialogOpen(false)
      setSelectedDwellingUnit(null)
      loadData()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete dwelling unit'
      
      // Check for specific error types
      if (errorMessage.includes('foreign key') || errorMessage.includes('constraint')) {
        toast.error("Cannot delete dwelling unit: It is being used by other records")
      } else if (errorMessage.includes('permission') || errorMessage.includes('unauthorized')) {
        toast.error("Permission denied: You don't have access to delete this dwelling unit")
      } else {
        toast.error(`Error deleting dwelling unit: ${errorMessage}`)
      }
      
      console.error("Error deleting dwelling unit:", error)
    }
  }

  const openEditDialog = (dwellingUnit: DwellingUnit) => {
    setSelectedDwellingUnit(dwellingUnit)
    setFormData({
      structure_id: dwellingUnit.structure_id,
      unit_code: dwellingUnit.unit_code,
      unit_type: dwellingUnit.unit_type,
      occupancy_status: dwellingUnit.occupancy_status,
      description: dwellingUnit.description || ''
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (dwellingUnit: DwellingUnit) => {
    setSelectedDwellingUnit(dwellingUnit)
    setIsDeleteDialogOpen(true)
  }

  const filteredDwellingUnits = dwellingUnits.filter(unit =>
    unit.unit_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    unit.unit_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    unit.structure?.structure_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    unit.structure?.village?.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Loading dwelling units...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Dwelling Units</h2>
          <p className="text-gray-600">Manage individual dwelling units within structures</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Dwelling Unit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Dwelling Unit</DialogTitle>
              <DialogDescription>
                Create a new dwelling unit within a structure.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="structure">Structure</Label>
                <Select
                  value={formData.structure_id.toString()}
                  onValueChange={(value) => setFormData({ ...formData, structure_id: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a structure" />
                  </SelectTrigger>
                  <SelectContent>
                    {structures.map((structure) => (
                      <SelectItem key={structure.structure_id} value={structure.structure_id.toString()}>
                        {structure.structure_code} - {structure.village?.name} ({structure.village?.site?.name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="unit_code">Unit Code</Label>
                  <Input
                    id="unit_code"
                    value={formData.unit_code}
                    onChange={(e) => setFormData({ ...formData, unit_code: e.target.value })}
                    placeholder="e.g., UNIT001"
                  />
                </div>
                <div>
                  <Label htmlFor="unit_code">Unit Code</Label>
                  <Input
                    id="unit_code"
                    value={formData.unit_code}
                    onChange={(e) => setFormData({ ...formData, unit_code: e.target.value })}
                    placeholder="e.g., APT1A"
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
                  Add Dwelling Unit
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Dwelling Units ({filteredDwellingUnits.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Unit</TableHead>
                <TableHead>Structure</TableHead>
                <TableHead>Village</TableHead>
                <TableHead>Site</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDwellingUnits.map((unit) => (
                <TableRow key={unit.dwelling_unit_id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <div>
                        <span className="font-medium">{unit.unit_code}</span>
                        <p className="text-sm text-gray-500">{unit.unit_type}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Home className="w-4 h-4 text-gray-400" />
                      <span>{unit.structure?.structure_code}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{unit.structure?.village?.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <span>{unit.structure?.village?.site?.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(unit.created_at).toLocaleDateString()}
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
                        <DropdownMenuItem onClick={() => openEditDialog(unit)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => openDeleteDialog(unit)}
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
            <DialogTitle>Edit Dwelling Unit</DialogTitle>
            <DialogDescription>
              Update dwelling unit information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-structure">Structure</Label>
              <Select
                value={formData.structure_id.toString()}
                onValueChange={(value) => setFormData({ ...formData, structure_id: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a structure" />
                </SelectTrigger>
                <SelectContent>
                  {structures.map((structure) => (
                    <SelectItem key={structure.structure_id} value={structure.structure_id.toString()}>
                      {structure.structure_code} - {structure.village?.name} ({structure.village?.site?.name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-unit_code">Unit Code</Label>
                <Input
                  id="edit-unit_code"
                  value={formData.unit_code}
                  onChange={(e) => setFormData({ ...formData, unit_code: e.target.value })}
                  placeholder="e.g., UNIT001"
                />
              </div>
              <div>
                <Label htmlFor="edit-unit_type">Unit Type</Label>
                <Input
                  id="edit-unit_type"
                  value={formData.unit_type}
                  onChange={(e) => setFormData({ ...formData, unit_type: e.target.value })}
                  placeholder="e.g., Apartment, House"
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
                Update Dwelling Unit
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
              This will permanently delete the dwelling unit &quot;{selectedDwellingUnit?.unit_code}&quot;. This action cannot be undone.
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