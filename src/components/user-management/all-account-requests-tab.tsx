'use client';

import { useState, useEffect } from 'react';
import {
  Check,
  X,
  MoreHorizontal,
  UserPlus,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card/Card';
import { Button } from '@/components/ui/Button/Button';
import { Badge } from '@/components/ui/Badge/Badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog/Dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu/DropdownMenu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table/Table';
import { userAccountRequestService } from '@/lib/user-management';
import {
  UserAccountRequest,
  UpdateUserAccountRequestForm,
} from '@/types/user-management';

interface AllAccountRequestsTabProps {
  searchQuery: string;
}

export function AllAccountRequestsTab({
  searchQuery,
}: AllAccountRequestsTabProps) {
  const [requests, setRequests] = useState<UserAccountRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] =
    useState<UserAccountRequest | null>(null);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | null>(
    null
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const requestsData = await userAccountRequestService.getAll();
      setRequests(requestsData);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to load data';
      toast.error(`Error loading data: ${errorMessage}`);
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async () => {
    if (!selectedRequest || !reviewAction) return;

    try {
      const updateData: UpdateUserAccountRequestForm = {
        status: reviewAction === 'approve' ? 'approved' : 'rejected',
        reviewed_by: 1, // TODO: Get current user ID from auth context
      };

      await userAccountRequestService.update(
        selectedRequest.request_id,
        updateData
      );

      const actionText = reviewAction === 'approve' ? 'approved' : 'rejected';
      toast.success(`Request ${actionText} successfully`);

      setIsReviewDialogOpen(false);
      setSelectedRequest(null);
      setReviewAction(null);
      loadData();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to review request';
      toast.error(`Error reviewing request: ${errorMessage}`);
      console.error('Error reviewing request:', error);
    }
  };

  const openReviewDialog = (
    request: UserAccountRequest,
    action: 'approve' | 'reject'
  ) => {
    setSelectedRequest(request);
    setReviewAction(action);
    setIsReviewDialogOpen(true);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'approved':
        return 'default';
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return Clock;
      case 'approved':
        return CheckCircle;
      case 'rejected':
        return XCircle;
      default:
        return Clock;
    }
  };

  const filteredRequests = requests.filter(
    request =>
      request.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.requested_role?.role_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      request.requested_site?.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className='flex items-center justify-center py-8'>
        <div className='text-gray-500'>Loading account requests...</div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-xl font-semibold text-gray-900'>
            All Account Requests
          </h2>
          <p className='text-gray-600'>
            Review and manage all user account requests
          </p>
        </div>
      </div>

      {/* Data Table */}
      <div className='table-container'>
        <div className='px-6 py-4 border-b border-gray-200'>
          <h3 className='text-lg font-semibold text-gray-900'>
            Account Requests ({filteredRequests.length})
          </h3>
        </div>
        <div className='p-0'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Requester</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Requested Role</TableHead>
                <TableHead>Requested Site</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Requested</TableHead>
                <TableHead>Reviewed</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map(request => {
                const StatusIcon = getStatusIcon(request.status);
                return (
                  <TableRow key={request.request_id}>
                    <TableCell>
                      <div className='flex items-center space-x-2'>
                        <UserPlus className='w-4 h-4 text-gray-400' />
                        <span className='font-medium'>{request.full_name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='space-y-1'>
                        <div className='flex items-center space-x-1'>
                          <Mail className='w-3 h-3 text-gray-400' />
                          <span className='text-sm'>{request.email}</span>
                        </div>
                        {request.phone_number && (
                          <div className='flex items-center space-x-1'>
                            <Phone className='w-3 h-3 text-gray-400' />
                            <span className='text-sm'>
                              {request.phone_number}
                            </span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className='text-sm text-gray-600'>
                        {request.requested_role?.role_name || 'Not specified'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className='text-sm text-gray-600'>
                        {request.requested_site?.name || 'Not specified'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center space-x-1'>
                        <StatusIcon className='w-3 h-3 text-gray-400' />
                        <Badge variant={getStatusBadgeVariant(request.status)}>
                          {request.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(request.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {request.reviewed_at ? (
                        <div className='space-y-1'>
                          <span className='text-sm'>
                            {new Date(request.reviewed_at).toLocaleDateString()}
                          </span>
                          {request.reviewer && (
                            <p className='text-xs text-gray-500'>
                              by {request.reviewer.full_name}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className='text-sm text-gray-400'>
                          Not reviewed
                        </span>
                      )}
                    </TableCell>
                    <TableCell className='text-right'>
                      {request.status === 'pending' ? (
                        <div className='flex items-center justify-end space-x-1'>
                          <Button
                            size='sm'
                            onClick={() => openReviewDialog(request, 'approve')}
                            className='bg-green-600 hover:bg-green-700 text-white'
                          >
                            <Check className='w-3 h-3 mr-1' />
                            Approve
                          </Button>
                          <Button
                            size='sm'
                            onClick={() => openReviewDialog(request, 'reject')}
                            variant='destructive'
                          >
                            <X className='w-3 h-3 mr-1' />
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant='ghost' size='sm'>
                              <MoreHorizontal className='w-4 h-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <UserPlus className='w-4 h-4 mr-2' />
                              View Details
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewAction === 'approve'
                ? 'Approve Request'
                : 'Reject Request'}
            </DialogTitle>
            <DialogDescription>
              {reviewAction === 'approve'
                ? 'Are you sure you want to approve this account request? The user will be notified and can proceed with account creation.'
                : 'Are you sure you want to reject this account request? The user will be notified of the rejection.'}
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className='space-y-4'>
              <div className='p-4 bg-gray-50 rounded-lg'>
                <h4 className='font-medium mb-2'>Request Details</h4>
                <div className='space-y-2 text-sm'>
                  <div>
                    <strong>Name:</strong> {selectedRequest.full_name}
                  </div>
                  <div>
                    <strong>Email:</strong> {selectedRequest.email}
                  </div>
                  {selectedRequest.phone_number && (
                    <div>
                      <strong>Phone:</strong> {selectedRequest.phone_number}
                    </div>
                  )}
                  <div>
                    <strong>Requested Role:</strong>{' '}
                    {selectedRequest.requested_role?.role_name ||
                      'Not specified'}
                  </div>
                  <div>
                    <strong>Requested Site:</strong>{' '}
                    {selectedRequest.requested_site?.name || 'Not specified'}
                  </div>
                  {selectedRequest.reason && (
                    <div>
                      <strong>Reason:</strong> {selectedRequest.reason}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <div className='flex justify-end gap-2'>
              <Button
                variant='outline'
                onClick={() => setIsReviewDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleReview}
                className={
                  reviewAction === 'approve'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }
              >
                {reviewAction === 'approve' ? (
                  <>
                    <Check className='w-4 h-4 mr-2' />
                    Approve Request
                  </>
                ) : (
                  <>
                    <X className='w-4 h-4 mr-2' />
                    Reject Request
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
