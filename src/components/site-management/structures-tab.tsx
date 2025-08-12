'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Home,
  MapPin,
  Building2,
  MoreHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card/Card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table/Table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog/Dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu/DropdownMenu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/AlertDialog/AlertDialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select/Select';
import { Label } from '@/components/ui/Label/Label';
import { Textarea } from '@/components/ui/Textarea/Textarea';
import { structureService, villageService } from '@/lib/site-management';
import {
  Structure,
  CreateStructureForm,
  Village,
} from '@/types/site-management';
import { toast } from 'sonner';

interface StructuresTabProps {
  searchQuery: string;
}

export function StructuresTab({ searchQuery }: StructuresTabProps) {
  const [structures, setStructures] = useState<Structure[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStructure, setSelectedStructure] = useState<Structure | null>(
    null
  );
  const [formData, setFormData] = useState<CreateStructureForm>({
    village_id: 0,
    structure_code: '',
    structure_name: '',
    address_description: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [structuresData, villagesData] = await Promise.all([
        structureService.getAll(),
        villageService.getAll(),
      ]);
      setStructures(structuresData);
      setVillages(villagesData);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to load data';
      toast.error(`Error loading data: ${errorMessage}`);
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!formData.structure_code.trim() || !formData.village_id) {
      toast.error(
        'Please fill in all required fields (Structure Code and Village)'
      );
      return;
    }

    try {
      await structureService.create(formData);
      toast.success('Structure created successfully');
      setIsAddDialogOpen(false);
      setFormData({
        village_id: 0,
        structure_code: '',
        structure_name: '',
        address_description: '',
      });
      loadData();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to create structure';
      toast.error(`Error creating structure: ${errorMessage}`);
      console.error('Error creating structure:', error);
    }
  };

  const handleEdit = async () => {
    if (!selectedStructure) return;

    if (!formData.structure_code.trim() || !formData.village_id) {
      toast.error(
        'Please fill in all required fields (Structure Code and Village)'
      );
      return;
    }

    try {
      await structureService.update(selectedStructure.structure_id, formData);
      toast.success('Structure updated successfully');
      setIsEditDialogOpen(false);
      setSelectedStructure(null);
      setFormData({
        village_id: 0,
        structure_code: '',
        structure_name: '',
        address_description: '',
      });
      loadData();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to update structure';
      toast.error(`Error updating structure: ${errorMessage}`);
      console.error('Error updating structure:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedStructure) return;

    try {
      await structureService.delete(selectedStructure.structure_id);
      toast.success('Structure deleted successfully');
      setIsDeleteDialogOpen(false);
      setSelectedStructure(null);
      loadData();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to delete structure';

      // Check for specific error types
      if (
        errorMessage.includes('foreign key') ||
        errorMessage.includes('constraint')
      ) {
        toast.error(
          'Cannot delete structure: It is being used by other records (dwelling units, etc.)'
        );
      } else if (
        errorMessage.includes('permission') ||
        errorMessage.includes('unauthorized')
      ) {
        toast.error(
          "Permission denied: You don't have access to delete this structure"
        );
      } else {
        toast.error(`Error deleting structure: ${errorMessage}`);
      }

      console.error('Error deleting structure:', error);
    }
  };

  const openEditDialog = (structure: Structure) => {
    setSelectedStructure(structure);
    setFormData({
      village_id: structure.village_id,
      structure_code: structure.structure_code,
      structure_name: structure.structure_name || '',
      address_description: structure.address_description || '',
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (structure: Structure) => {
    setSelectedStructure(structure);
    setIsDeleteDialogOpen(true);
  };

  const filteredStructures = structures.filter(
    structure =>
      structure.structure_code
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      structure.structure_name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      structure.village?.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      structure.village?.site?.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className='flex items-center justify-center py-8'>
        <div className='text-gray-500'>Loading structures...</div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-xl font-semibold text-gray-900'>Structures</h2>
          <p className='text-gray-600'>
            Manage buildings and structures within villages
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className='bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white'>
              <Plus className='w-4 h-4 mr-2' />
              Add Structure
            </Button>
          </DialogTrigger>
          <DialogContent className='max-w-2xl'>
            <DialogHeader>
              <DialogTitle>Add New Structure</DialogTitle>
              <DialogDescription>
                Create a new building or structure within a village.
              </DialogDescription>
            </DialogHeader>
            <div className='space-y-4'>
              <div>
                <Label htmlFor='village'>Village</Label>
                <Select
                  value={formData.village_id.toString()}
                  onValueChange={value =>
                    setFormData({ ...formData, village_id: parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select a village' />
                  </SelectTrigger>
                  <SelectContent>
                    {villages.map(village => (
                      <SelectItem
                        key={village.village_id}
                        value={village.village_id.toString()}
                      >
                        {village.name} - {village.site?.name} (
                        {village.site?.country?.name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='structure_code'>Structure Code</Label>
                  <Input
                    id='structure_code'
                    value={formData.structure_code}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        structure_code: e.target.value,
                      })
                    }
                    placeholder='e.g., STR001'
                  />
                </div>
                <div>
                  <Label htmlFor='structure_name'>Structure Name</Label>
                  <Input
                    id='structure_name'
                    value={formData.structure_name}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        structure_name: e.target.value,
                      })
                    }
                    placeholder='e.g., Building A'
                  />
                </div>
              </div>
              <div>
                <Label htmlFor='address_description'>Address Description</Label>
                <Textarea
                  id='address_description'
                  value={formData.address_description}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      address_description: e.target.value,
                    })
                  }
                  placeholder='Enter detailed address or location description'
                />
              </div>
            </div>
            <DialogFooter>
              <div className='flex justify-end gap-2'>
                <Button
                  variant='outline'
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAdd}
                  className='bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white'
                >
                  Add Structure
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Structures ({filteredStructures.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Structure</TableHead>
                <TableHead>Village</TableHead>
                <TableHead>Site</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStructures.map(structure => (
                <TableRow key={structure.structure_id}>
                  <TableCell>
                    <div className='flex items-center space-x-2'>
                      <Home className='w-4 h-4 text-gray-400' />
                      <div>
                        <span className='font-medium'>
                          {structure.structure_code}
                        </span>
                        {structure.structure_name && (
                          <p className='text-sm text-gray-500'>
                            {structure.structure_name}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center space-x-2'>
                      <MapPin className='w-4 h-4 text-gray-400' />
                      <span>{structure.village?.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center space-x-2'>
                      <Building2 className='w-4 h-4 text-gray-400' />
                      <span>{structure.village?.site?.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className='text-sm text-gray-600'>
                      {structure.address_description || 'N/A'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(structure.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className='text-right'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='sm'>
                          <MoreHorizontal className='w-4 h-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => openEditDialog(structure)}
                        >
                          <Edit className='w-4 h-4 mr-2' />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => openDeleteDialog(structure)}
                          className='text-red-600'
                        >
                          <Trash2 className='w-4 h-4 mr-2' />
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
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Edit Structure</DialogTitle>
            <DialogDescription>
              Update structure information and location details.
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div>
              <Label htmlFor='edit-village'>Village</Label>
              <Select
                value={formData.village_id.toString()}
                onValueChange={value =>
                  setFormData({ ...formData, village_id: parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select a village' />
                </SelectTrigger>
                <SelectContent>
                  {villages.map(village => (
                    <SelectItem
                      key={village.village_id}
                      value={village.village_id.toString()}
                    >
                      {village.name} - {village.site?.name} (
                      {village.site?.country?.name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='edit-structure_code'>Structure Code</Label>
                <Input
                  id='edit-structure_code'
                  value={formData.structure_code}
                  onChange={e =>
                    setFormData({ ...formData, structure_code: e.target.value })
                  }
                  placeholder='e.g., STR001'
                />
              </div>
              <div>
                <Label htmlFor='edit-structure_name'>Structure Name</Label>
                <Input
                  id='edit-structure_name'
                  value={formData.structure_name}
                  onChange={e =>
                    setFormData({ ...formData, structure_name: e.target.value })
                  }
                  placeholder='e.g., Building A'
                />
              </div>
            </div>
            <div>
              <Label htmlFor='edit-address_description'>
                Address Description
              </Label>
              <Textarea
                id='edit-address_description'
                value={formData.address_description}
                onChange={e =>
                  setFormData({
                    ...formData,
                    address_description: e.target.value,
                  })
                }
                placeholder='Enter detailed address or location description'
              />
            </div>
          </div>
          <DialogFooter>
            <div className='flex justify-end gap-2'>
              <Button
                variant='outline'
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleEdit}
                className='bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white'
              >
                Update Structure
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the structure &quot;
              {selectedStructure?.structure_code}&quot;. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className='bg-red-600 hover:bg-red-700'
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
