import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Mail, Trash2, Eye, EyeOff, Loader2, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const PortfolioContactSubmissionsAdmin = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSubmissions((data as ContactSubmission[]) || []);
    } catch (error) {
      console.error("Error loading submissions:", error);
      toast.error("Failed to load contact submissions");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string, isRead: boolean) => {
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .update({ is_read: !isRead })
        .eq("id", id);

      if (error) throw error;
      toast.success(isRead ? "Marked as unread" : "Marked as read");
      loadSubmissions();
    } catch (error) {
      console.error("Error updating submission:", error);
      toast.error("Failed to update");
    }
  };

  const deleteSubmission = async (id: string) => {
    if (!confirm("Are you sure you want to delete this submission?")) return;

    try {
      const { error } = await supabase
        .from("contact_submissions")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Submission deleted");
      setSelectedSubmission(null);
      loadSubmissions();
    } catch (error) {
      console.error("Error deleting submission:", error);
      toast.error("Failed to delete");
    }
  };

  const openSubmission = async (submission: ContactSubmission) => {
    setSelectedSubmission(submission);
    if (!submission.is_read) {
      await markAsRead(submission.id, false);
    }
  };

  const unreadCount = submissions.filter((s) => !s.is_read).length;

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Contact Submissions
                {unreadCount > 0 && (
                  <Badge variant="destructive">{unreadCount} new</Badge>
                )}
              </CardTitle>
              <CardDescription>
                Messages from Get In Touch form
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={loadSubmissions}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {submissions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No contact submissions yet
            </div>
          ) : (
            <div className="space-y-3">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors hover:bg-accent ${
                    !submission.is_read ? "bg-primary/5 border-primary/30" : "bg-muted/30"
                  }`}
                  onClick={() => openSubmission(submission)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold truncate">{submission.name}</h4>
                        {!submission.is_read && (
                          <Badge variant="default" className="text-xs">New</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {submission.email}
                      </p>
                      <p className="text-sm font-medium mt-1 truncate">
                        {submission.subject}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                        {submission.message}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-muted-foreground">
                        {new Date(submission.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(submission.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Contact Message</DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">From</p>
                  <p className="font-medium">{selectedSubmission.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <a 
                    href={`mailto:${selectedSubmission.email}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {selectedSubmission.email}
                  </a>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">Subject</p>
                  <p className="font-medium">{selectedSubmission.subject}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">Received</p>
                  <p className="font-medium">
                    {new Date(selectedSubmission.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <p className="text-muted-foreground mb-2">Message</p>
                <div className="bg-muted/50 p-4 rounded-lg whitespace-pre-wrap">
                  {selectedSubmission.message}
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => markAsRead(selectedSubmission.id, selectedSubmission.is_read)}
                >
                  {selectedSubmission.is_read ? (
                    <>
                      <EyeOff className="w-4 h-4 mr-2" />
                      Mark as Unread
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      Mark as Read
                    </>
                  )}
                </Button>
                <div className="flex gap-2">
                  <Button asChild>
                    <a href={`mailto:${selectedSubmission.email}?subject=Re: ${selectedSubmission.subject}`}>
                      <Mail className="w-4 h-4 mr-2" />
                      Reply
                    </a>
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => deleteSubmission(selectedSubmission.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PortfolioContactSubmissionsAdmin;
