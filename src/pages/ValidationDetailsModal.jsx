import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const ValidationDetailsModal = ({ assetId, open, onClose }) => {
  const [comment, setComment] = useState('');
  const [selectedTab, setSelectedTab] = useState('checklist');

  const { data: asset } = useQuery({
    queryKey: ['asset', assetId],
    queryFn: () => api.get(`/assets/${assetId}/validation`)
  });

  const addComment = useMutation({
    mutationFn: (comment) => api.post(`/assets/${assetId}/comments`, { comment }),
    onSuccess: () => {
      setComment('');
      // Refresh comments
    }
  });

  const updateChecklist = useMutation({
    mutationFn: (checklistItem) => 
      api.patch(`/assets/${assetId}/checklist/${checklistItem.id}`, checklistItem)
  });

  const checklist = [
    {
      id: 'ownership',
      title: 'Ownership Verification',
      items: [
        { id: 'docs', label: 'All ownership documents provided' },
        { id: 'auth', label: 'Documents properly authorized' },
        { id: 'sign', label: 'Required signatures present' }
      ]
    },
    {
      id: 'quality',
      title: 'Quality Assessment',
      items: [
        { id: 'cert', label: 'Quality certificates verified' },
        { id: 'specs', label: 'Specifications match documentation' },
        { id: 'photos', label: 'Photo documentation complete' }
      ]
    },
    {
      id: 'compliance',
      title: 'Compliance Check',
      items: [
        { id: 'kyc', label: 'KYC requirements met' },
        { id: 'aml', label: 'AML checks completed' },
        { id: 'reg', label: 'Regulatory compliance verified' }
      ]
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Asset Validation Details</DialogTitle>
        </DialogHeader>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="checklist">Validation Checklist</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="checklist">
            <ScrollArea className="h-[50vh]">
              <div className="space-y-6 p-4">
                {checklist.map((section) => (
                  <Card key={section.id} className="p-4">
                    <h3 className="font-semibold mb-4">{section.title}</h3>
                    <div className="space-y-4">
                      {section.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={asset?.checklist?.[item.id] || false}
                              onChange={(e) => updateChecklist.mutate({
                                id: item.id,
                                checked: e.target.checked
                              })}
                              className="h-4 w-4 rounded border-gray-300"
                            />
                            <span>{item.label}</span>
                          </div>
                          <Badge>
                            {asset?.checklist?.[item.id] ? 'Completed' : 'Pending'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="comments">
            <ScrollArea className="h-[40vh]">
              <div className="space-y-4 p-4">
                {asset?.comments?.map((comment, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{comment.user}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(comment.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <Badge>{comment.type}</Badge>
                    </div>
                    <p className="mt-2">{comment.text}</p>
                  </Card>
                ))}
              </div>
            </ScrollArea>

            <div className="mt-4 space-y-4">
              <Textarea
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="h-24"
              />
              <div className="flex justify-end">
                <Button 
                  onClick={() => addComment.mutate(comment)}
                  disabled={!comment.trim()}
                >
                  Add Comment
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="documents">
            <ScrollArea className="h-[50vh]">
              <div className="space-y-4 p-4">
                {asset?.documents?.map((doc, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-gray-500">{doc.type}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Preview
                        </Button>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <div className="mt-4 flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            onClick={() => {
              // Submit validation
            }}
          >
            Complete Validation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ValidationDetailsModal;