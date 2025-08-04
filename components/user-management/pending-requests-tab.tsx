"use client"

import { useState, useEffect } from "react"
import { 
  Check, 
  X, 
  UserPlus,
  Mail,
  Phone,
  Clock,
  AlertCircle,
  Copy,
  RefreshCw,
  Eye,
  EyeOff
} from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { userAccountRequestService } from "@/lib/user-management"
import { UserAccountRequest, UpdateUserAccountRequestForm } from "@/types/user-management"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { emailService } from "@/lib/email-service"

interface PendingRequestsTabProps {
  searchQuery: string
}

export function PendingRequestsTab({ searchQuery }: PendingRequestsTabProps) {
  const [requests, setRequests] = useState<UserAccountRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<UserAccountRequest | null>(null)
  
  // Approval modal states
  const [generatedPassword, setGeneratedPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [passwordCopied, setPasswordCopied] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const requestsData = await userAccountRequestService.getByStatus('pending')
      setRequests(requestsData)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load data'
      toast.error(`Error loading data: ${errorMessage}`)
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const generatePassword = () => {
    const length = 12
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
    let password = ""
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    setGeneratedPassword(password)
    setPasswordCopied(false)
  }

  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(generatedPassword)
      setPasswordCopied(true)
      toast.success("Password copied to clipboard")
      setTimeout(() => setPasswordCopied(false), 2000)
    } catch {
      toast.error("Failed to copy password")
    }
  }

  const sendWelcomeEmail = async (email: string, fullName: string, password: string) => {
    try {
      const success = await emailService.sendWelcomeEmail(email, fullName, password)
      
      if (success) {
        setEmailSent(true)
        toast.success("Welcome email sent successfully")
      } else {
        toast.error("Failed to send welcome email")
      }
      
      return success
    } catch (error) {
      console.error('Error sending email:', error)
      toast.error("Failed to send welcome email")
      return false
    }
  }

  const handleApproval = async () => {
    if (!selectedRequest || !generatedPassword.trim()) {
      toast.error("Please enter or generate a password")
      return
    }

    setIsProcessing(true)
    
    try {
      // Step 1: Create auth user
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: selectedRequest.email,
        password: generatedPassword,
        email_confirm: true,
        user_metadata: {
          full_name: selectedRequest.full_name,
          phone_number: selectedRequest.phone_number
        }
      })

      if (authError) {
        throw new Error(`Auth user creation failed: ${authError.message}`)
      }

      if (!authData.user) {
        throw new Error("Auth user creation failed: No user data returned")
      }

      // Step 2: Create user profile
      const roleId = selectedRequest.requested_role_id || 1 // Default to first role if none specified
      const siteId = selectedRequest.requested_site_id || null

      const { data: profileData, error: profileError } = await supabaseAdmin
        .from('user_profile')
        .insert({
          auth_user_id: authData.user.id,
          email: selectedRequest.email,
          full_name: selectedRequest.full_name,
          phone_number: selectedRequest.phone_number,
          role_id: roleId,
          site_id: siteId,
          status: 'active'
        })
        .select()
        .single()

      if (profileError) {
        // Rollback: Delete the auth user if profile creation fails
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
        throw new Error(`User profile creation failed: ${profileError.message}`)
      }

      // Step 3: Create site_user record if site is specified
      if (siteId) {
        const { error: siteUserError } = await supabaseAdmin
          .from('site_user')
          .insert({
            site_id: siteId,
            role_id: roleId,
            user_profile_id: profileData.user_id,
            status: 'active'
          })

        if (siteUserError) {
          // Rollback: Delete profile and auth user
          await supabaseAdmin.from('user_profile').delete().eq('user_id', profileData.user_id)
          await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
          throw new Error(`Site user creation failed: ${siteUserError.message}`)
        }
      }

      // Step 4: Update account request status
      const { error: updateError } = await supabaseAdmin
        .from('user_account_request')
        .update({
          status: 'approved',
          reviewed_by: 1, // TODO: Get current user ID from auth context
          reviewed_at: new Date().toISOString()
        })
        .eq('request_id', selectedRequest.request_id)

      if (updateError) {
        // Rollback: Delete all created records
        if (siteId) {
          await supabaseAdmin.from('site_user').delete().eq('user_profile_id', profileData.user_id)
        }
        await supabaseAdmin.from('user_profile').delete().eq('user_id', profileData.user_id)
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
        throw new Error(`Request status update failed: ${updateError.message}`)
      }

      // Step 5: Send welcome email
      const emailSent = await sendWelcomeEmail(
        selectedRequest.email,
        selectedRequest.full_name,
        generatedPassword
      )

      if (!emailSent) {
        toast.warning("User created successfully but email could not be sent")
      }

      toast.success("User account created successfully!")
      setIsApprovalDialogOpen(false)
      setSelectedRequest(null)
      setGeneratedPassword('')
      setShowPassword(false)
      setPasswordCopied(false)
      setEmailSent(false)
      loadData()

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create user account'
      console.error("Error creating user account:", error)
      toast.error(`Failed to create user account: ${errorMessage}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRejection = async () => {
    if (!selectedRequest) return

    try {
      // Update request status first
      const updateData: UpdateUserAccountRequestForm = {
        status: 'rejected',
        reviewed_by: 1 // TODO: Get current user ID from auth context
      }

      await userAccountRequestService.update(selectedRequest.request_id, updateData)
      
      // Send rejection email
      const emailSent = await emailService.sendRejectionEmail(
        selectedRequest.email,
        selectedRequest.full_name
      )

      if (emailSent) {
        toast.success("Request rejected and notification email sent")
      } else {
        toast.warning("Request rejected but email notification failed")
      }
      
      setIsReviewDialogOpen(false)
      setSelectedRequest(null)
      loadData()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to reject request'
      toast.error(`Error rejecting request: ${errorMessage}`)
      console.error("Error rejecting request:", error)
    }
  }

  const openReviewDialog = (request: UserAccountRequest, action: 'approve' | 'reject') => {
    setSelectedRequest(request)
    
    if (action === 'approve') {
      setIsApprovalDialogOpen(true)
      // Don't auto-generate password - let admin input or generate manually
    } else {
      setIsReviewDialogOpen(true)
    }
  }

  const filteredRequests = requests.filter(request =>
    request.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.requested_role?.role_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.requested_site?.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Loading pending requests...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Pending Requests</h2>
          <p className="text-gray-600">Review and approve pending account requests</p>
        </div>
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-orange-500" />
          <span className="text-sm text-gray-600">
            {filteredRequests.length} request{filteredRequests.length !== 1 ? 's' : ''} pending review
          </span>
        </div>
      </div>

      {/* Empty State */}
      {filteredRequests.length === 0 && !loading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Clock className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Requests</h3>
            <p className="text-gray-600 text-center max-w-md">
              All account requests have been reviewed. New requests will appear here when submitted.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Data Table */}
      {filteredRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Account Requests ({filteredRequests.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Requester</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Requested Role</TableHead>
                  <TableHead>Requested Site</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.request_id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <UserPlus className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{request.full_name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <span className="text-sm">{request.email}</span>
                        </div>
                        {request.phone_number && (
                          <div className="flex items-center space-x-1">
                            <Phone className="w-3 h-3 text-gray-400" />
                            <span className="text-sm">{request.phone_number}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {request.requested_role?.role_name || 'Not specified'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {request.requested_site?.name || 'Not specified'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600 max-w-xs truncate block">
                        {request.reason || 'No reason provided'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <span className="text-sm">{new Date(request.created_at).toLocaleDateString()}</span>
                        <p className="text-xs text-gray-500">
                          {Math.floor((Date.now() - new Date(request.created_at).getTime()) / (1000 * 60 * 60 * 24))} days ago
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <Button
                          size="sm"
                          onClick={() => openReviewDialog(request, 'approve')}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Check className="w-3 h-3 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => openReviewDialog(request, 'reject')}
                          variant="destructive"
                        >
                          <X className="w-3 h-3 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Approval Dialog */}
      <Dialog open={isApprovalDialogOpen} onOpenChange={setIsApprovalDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Check className="w-5 h-5 text-green-600" />
              <span>Approve Account Request</span>
            </DialogTitle>
            <DialogDescription>
              Create user account and send welcome email with login credentials
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-6">
              {/* Request Details */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-3">Request Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><strong>Name:</strong> {selectedRequest.full_name}</div>
                  <div><strong>Email:</strong> {selectedRequest.email}</div>
                  {selectedRequest.phone_number && (
                    <div><strong>Phone:</strong> {selectedRequest.phone_number}</div>
                  )}
                  <div><strong>Requested Role:</strong> {selectedRequest.requested_role?.role_name || 'Default Role'}</div>
                  <div><strong>Requested Site:</strong> {selectedRequest.requested_site?.name || 'No site assigned'}</div>
                  <div><strong>Requested:</strong> {new Date(selectedRequest.created_at).toLocaleString()}</div>
                </div>
              </div>

                             {/* Password Input */}
               <div className="space-y-4">
                 <div>
                   <Label htmlFor="password">Account Password</Label>
                   <div className="flex space-x-2 mt-1">
                     <div className="relative flex-1">
                       <Input
                         id="password"
                         type={showPassword ? "text" : "password"}
                         value={generatedPassword}
                         onChange={(e) => {
                           setGeneratedPassword(e.target.value)
                           setPasswordCopied(false)
                         }}
                         placeholder="Enter or generate a password"
                         className="pr-20"
                       />
                       <Button
                         type="button"
                         variant="ghost"
                         size="sm"
                         className="absolute right-0 top-0 h-full px-3"
                         onClick={() => setShowPassword(!showPassword)}
                       >
                         {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                       </Button>
                     </div>
                     <Button
                       type="button"
                       variant="outline"
                       size="sm"
                       onClick={generatePassword}
                       className="whitespace-nowrap"
                     >
                       <RefreshCw className="w-4 h-4 mr-1" />
                       Generate
                     </Button>
                     <Button
                       type="button"
                       variant="outline"
                       size="sm"
                       onClick={copyPassword}
                       className="whitespace-nowrap"
                       disabled={!generatedPassword.trim()}
                     >
                       {passwordCopied ? (
                         <>
                           <Check className="w-4 h-4 mr-1" />
                           Copied
                         </>
                       ) : (
                         <>
                           <Copy className="w-4 h-4 mr-1" />
                           Copy
                         </>
                       )}
                     </Button>
                   </div>
                   <p className="text-xs text-gray-500 mt-1">
                     Password strength: {generatedPassword.length >= 12 ? 'Strong' : generatedPassword.length >= 8 ? 'Medium' : 'Weak'} ({generatedPassword.length} characters)
                   </p>
                 </div>

                {/* Email Notification */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-900">Email Notification</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    A welcome email will be sent to <strong>{selectedRequest.email}</strong> with the login credentials.
                  </p>
                  {emailSent && (
                    <div className="flex items-center space-x-2 mt-2 text-green-600">
                      <Check className="w-4 h-4" />
                      <span className="text-sm">Email sent successfully</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsApprovalDialogOpen(false)
                  setSelectedRequest(null)
                  setGeneratedPassword('')
                  setShowPassword(false)
                  setPasswordCopied(false)
                  setEmailSent(false)
                }}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleApproval}
                disabled={isProcessing || !generatedPassword.trim()}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Create Account & Send Email
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <X className="w-5 h-5 text-red-600" />
              <span>Reject Request</span>
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to reject this account request? The user will be notified of the rejection.
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Request Details</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Name:</strong> {selectedRequest.full_name}</div>
                  <div><strong>Email:</strong> {selectedRequest.email}</div>
                  {selectedRequest.phone_number && (
                    <div><strong>Phone:</strong> {selectedRequest.phone_number}</div>
                  )}
                  <div><strong>Requested Role:</strong> {selectedRequest.requested_role?.role_name || 'Not specified'}</div>
                  <div><strong>Requested Site:</strong> {selectedRequest.requested_site?.name || 'Not specified'}</div>
                  {selectedRequest.reason && (
                    <div><strong>Reason:</strong> {selectedRequest.reason}</div>
                  )}
                  <div><strong>Requested:</strong> {new Date(selectedRequest.created_at).toLocaleString()}</div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleRejection}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <X className="w-4 h-4 mr-2" />
                Reject Request
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 