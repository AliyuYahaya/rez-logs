'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { MaintenanceRequestForm } from '@/components/forms/MaintenanceRequestForm';
import { useAuth } from '@/context/AuthContext';
import { getMaintenanceRequests, type MaintenanceRequest } from '@/lib/firestore';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function MaintenancePage() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    if (!user) return;
    try {
      const allRequests = await getMaintenanceRequests();
      const userRequests = allRequests.filter(req => req.userId === user.uid);
      setRequests(userRequests);
    } catch (error) {
      console.error('Error fetching maintenance requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [user]);

  const handleSuccess = () => {
    setShowForm(false);
    fetchRequests();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Maintenance Requests</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Request
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>New Maintenance Request</CardTitle>
          </CardHeader>
          <CardContent>
            <MaintenanceRequestForm
              userId={user?.uid || ''}
              onSuccess={handleSuccess}
              onCancel={() => setShowForm(false)}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Your Maintenance Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading requests...</p>
          ) : requests.length === 0 ? (
            <p className="text-muted-foreground">No maintenance requests found.</p>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{request.title}</p>
                    <p className="text-sm text-muted-foreground">{request.description}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        request.status === 'completed' ? 'default' :
                        request.status === 'in_progress' ? 'secondary' :
                        'outline'
                      }>
                        {request.status}
                      </Badge>
                      <Badge variant={
                        request.priority === 'high' ? 'destructive' :
                        request.priority === 'medium' ? 'secondary' :
                        'outline'
                      }>
                        {request.priority} priority
                      </Badge>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {format(request.createdAt, 'MMM d, yyyy')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 