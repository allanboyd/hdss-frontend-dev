'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  MapPin,
  Building2,
  MoreHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card/Card';
import { Badge } from '@/components/ui/Badge/Badge';
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
import { villageService, siteService } from '@/lib/site-management';
import { Village, CreateVillageForm, Site } from '@/types/site-management';
import { toast } from 'sonner';

interface VillagesTabProps {
  searchQuery: string;
}

export function VillagesTab({ searchQuery }: VillagesTabProps) {
  const [villages, setVillages] = useState<Village[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedVillage, setSelectedVillage] = useState<Village | null>(null);
  const [formData, setFormData] = useState<CreateVillageForm>({
    site_id: 0,
    name: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [villagesData, sitesData] = await Promise.all([
        villageService.getAll(),
        siteService.getAll(),
      ]);
      setVillages(villagesData);
      setSites(sitesData);
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
    if (!formData.name.trim() || !formData.site_id) {
      toast.error('Please fill in all required fields (Village Name and Site)');
      return;
    }

    try {
      await villageService.create(formData);
      toast.success('Village created successfully');
      setIsAddDialogOpen(false);
      setFormData({ site_id: 0, name: '' });
      loadData();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to create village';
      toast.error(`Error creating village: ${errorMessage}`);
      console.error('Error creating village:', error);
    }
  };

  const handleEdit = async () => {
    if (!selectedVillage) return;

    if (!formData.name.trim() || !formData.site_id) {
      toast.error('Please fill in all required fields (Village Name and Site)');
      return;
    }

    try {
      await villageService.update(selectedVillage.village_id, formData);
      toast.success('Village updated successfully');
      setIsEditDialogOpen(false);
      setSelectedVillage(null);
      setFormData({ site_id: 0, name: '' });
      loadData();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to update village';
      toast.error(`Error updating village: ${errorMessage}`);
      console.error('Error updating village:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedVillage) return;

    try {
      await villageService.delete(selectedVillage.village_id);
      toast.success('Village deleted successfully');
      setIsDeleteDialogOpen(false);
      setSelectedVillage(null);
      loadData();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to delete village';

      // Check for specific error types
      if (
        errorMessage.includes('foreign key') ||
        errorMessage.includes('constraint')
      ) {
        toast.error(
          'Cannot delete village: It is being used by other records (structures, dwelling units, etc.)'
        );
      } else if (
        errorMessage.includes('permission') ||
        errorMessage.includes('unauthorized')
      ) {
        toast.error(
          "Permission denied: You don't have access to delete this village"
        );
      } else {
        toast.error(`Error deleting village: ${errorMessage}`);
      }

      console.error('Error deleting village:', error);
    }
  };

  const openEditDialog = (village: Village) => {
    setSelectedVillage(village);
    setFormData({
      site_id: village.site_id,
      name: village.name,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (village: Village) => {
    setSelectedVillage(village);
    setIsDeleteDialogOpen(true);
  };

  const filteredVillages = villages.filter(
    village =>
      village.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      village.site?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      village.site?.country?.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className='flex items-center justify-center py-8'>
        <div className='text-gray-500'>Loading villages...</div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-xl font-semibold text-gray-900'>Villages</h2>
          <p className='text-gray-600'>Manage villages within research sites</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className='bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white'>
              <Plus className='w-4 h-4 mr-2' />
              Add Village
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Village</DialogTitle>
              <DialogDescription>
                Create a new village within a research site.
              </DialogDescription>
            </DialogHeader>
            <div className='space-y-4'>
              <div>
                <Label htmlFor='site'>Site</Label>
                <Select
                  value={formData.site_id.toString()}
                  onValueChange={value =>
                    setFormData({ ...formData, site_id: parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select a site' />
                  </SelectTrigger>
                  <SelectContent>
                    {sites.map(site => (
                      <SelectItem
                        key={site.site_id}
                        value={site.site_id.toString()}
                      >
                        {site.name} ({site.country?.name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor='name'>Village Name</Label>
                <Input
                  id='name'
                  value={formData.name}
                  onChange={e =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder='Enter village name'
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
                  Add Village
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Villages ({filteredVillages.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Village</TableHead>
                <TableHead>Site</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVillages.map(village => (
                <TableRow key={village.village_id}>
                  <TableCell>
                    <div className='flex items-center space-x-2'>
                      <MapPin className='w-4 h-4 text-gray-400' />
                      <span className='font-medium'>{village.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center space-x-2'>
                      <Building2 className='w-4 h-4 text-gray-400' />
                      <span>{village.site?.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant='secondary'>
                      {village.site?.country?.name}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(village.created_at).toLocaleDateString()}
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
                          onClick={() => openEditDialog(village)}
                        >
                          <Edit className='w-4 h-4 mr-2' />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => openDeleteDialog(village)}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Village</DialogTitle>
            <DialogDescription>Update village information.</DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div>
              <Label htmlFor='edit-site'>Site</Label>
              <Select
                value={formData.site_id.toString()}
                onValueChange={value =>
                  setFormData({ ...formData, site_id: parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select a site' />
                </SelectTrigger>
                <SelectContent>
                  {sites.map(site => (
                    <SelectItem
                      key={site.site_id}
                      value={site.site_id.toString()}
                    >
                      {site.name} ({site.country?.name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor='edit-name'>Village Name</Label>
              <Input
                id='edit-name'
                value={formData.name}
                onChange={e =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder='Enter village name'
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
                Update Village
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
              This will permanently delete the village &quot;
              {selectedVillage?.name}&quot;. This action cannot be undone.
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
