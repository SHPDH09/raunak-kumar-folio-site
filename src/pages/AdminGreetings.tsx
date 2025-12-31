import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Home, Gift, Copy, Trash2, Eye, Plus, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

interface Greeting {
  id: string;
  code: string;
  recipient_name: string;
  sender_name: string | null;
  date_of_birth: string | null;
  phone: string | null;
  email: string | null;
  greeting_type: string;
  custom_message: string | null;
  created_at: string;
  expires_at: string;
  views_count: number;
}

const greetingTypes = [
  { value: 'birthday', label: '🎂 Birthday' },
  { value: 'new_year', label: '🎆 New Year' },
  { value: 'anniversary', label: '💕 Anniversary' },
  { value: 'congratulations', label: '🎉 Congratulations' },
  { value: 'thank_you', label: '🙏 Thank You' },
  { value: 'happiness', label: '☀️ Happiness' },
  { value: 'get_well', label: '💐 Get Well Soon' },
  { value: 'wedding', label: '💒 Wedding' },
];

const generateCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const AdminGreetings = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [greetings, setGreetings] = useState<Greeting[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    recipient_name: '',
    sender_name: '',
    date_of_birth: '',
    phone: '',
    email: '',
    greeting_type: 'birthday',
    custom_message: '',
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (!roles) {
        toast({
          title: "Access Denied",
          description: "You need admin privileges to access this page.",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      setIsAdmin(true);
      fetchGreetings();
    } catch (error) {
      navigate('/auth');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGreetings = async () => {
    const { data, error } = await supabase
      .from('greetings')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setGreetings(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.recipient_name.trim()) {
      toast({
        title: "Name Required",
        description: "Recipient name is mandatory.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const code = generateCode();

      const { error } = await supabase
        .from('greetings')
        .insert({
          code,
          recipient_name: formData.recipient_name.trim(),
          sender_name: formData.sender_name.trim() || null,
          date_of_birth: formData.date_of_birth || null,
          phone: formData.phone.trim() || null,
          email: formData.email.trim() || null,
          greeting_type: formData.greeting_type as any,
          custom_message: formData.custom_message.trim() || null,
          created_by: user.id,
        });

      if (error) throw error;

      toast({
        title: "Greeting Created!",
        description: `Code: ${code} - Share this with the recipient.`,
      });

      setFormData({
        recipient_name: '',
        sender_name: '',
        date_of_birth: '',
        phone: '',
        email: '',
        greeting_type: 'birthday',
        custom_message: '',
      });
      setShowForm(false);
      fetchGreetings();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create greeting.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: `Code ${code} copied to clipboard.`,
    });
  };

  const copyLink = (code: string) => {
    const link = `${window.location.origin}/greeting/${code}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link Copied!",
      description: "Share this link with the recipient.",
    });
  };

  const deleteGreeting = async (id: string) => {
    const { error } = await supabase
      .from('greetings')
      .delete()
      .eq('id', id);

    if (!error) {
      toast({ title: "Deleted", description: "Greeting has been deleted." });
      fetchGreetings();
    }
  };

  const isExpired = (expiresAt: string) => new Date(expiresAt) < new Date();

  if (isLoading) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen hero-gradient p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-gradient">Greeting Generator</h1>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Plus className="h-4 w-4" />
            {showForm ? 'Cancel' : 'New Greeting'}
          </Button>
        </div>

        {/* Create Form */}
        {showForm && (
          <Card className="bg-card/80 backdrop-blur-xl border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-primary" />
                Create New Greeting
              </CardTitle>
              <CardDescription>Fill in the details to generate a unique greeting code</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="recipient_name">Recipient Name *</Label>
                  <Input
                    id="recipient_name"
                    placeholder="Enter recipient's name"
                    value={formData.recipient_name}
                    onChange={(e) => setFormData({ ...formData, recipient_name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sender_name">Sender Name</Label>
                  <Input
                    id="sender_name"
                    placeholder="Your name (optional)"
                    value={formData.sender_name}
                    onChange={(e) => setFormData({ ...formData, sender_name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="greeting_type">Greeting Type</Label>
                  <Select
                    value={formData.greeting_type}
                    onValueChange={(value) => setFormData({ ...formData, greeting_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {greetingTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date_of_birth">Date of Birth</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="recipient@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="custom_message">Custom Message</Label>
                  <Textarea
                    id="custom_message"
                    placeholder="Add a personal message (optional)"
                    value={formData.custom_message}
                    onChange={(e) => setFormData({ ...formData, custom_message: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="md:col-span-2">
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-accent"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Generating...' : 'Generate Greeting Code'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Greetings List */}
        <Card className="bg-card/80 backdrop-blur-xl border-primary/30">
          <CardHeader>
            <CardTitle>Generated Greetings ({greetings.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {greetings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Gift className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No greetings created yet. Click "New Greeting" to get started!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Recipient</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {greetings.map((greeting) => (
                      <TableRow key={greeting.id}>
                        <TableCell>
                          <code className="bg-muted px-2 py-1 rounded font-mono text-sm">
                            {greeting.code}
                          </code>
                        </TableCell>
                        <TableCell className="font-medium">{greeting.recipient_name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {greetingTypes.find(t => t.value === greeting.greeting_type)?.label || greeting.greeting_type}
                          </Badge>
                        </TableCell>
                        <TableCell>{greeting.views_count || 0}</TableCell>
                        <TableCell>
                          {isExpired(greeting.expires_at) ? (
                            <Badge variant="destructive">Expired</Badge>
                          ) : (
                            <Badge variant="default" className="bg-green-600">Active</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(new Date(greeting.created_at), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => copyCode(greeting.code)}
                              title="Copy code"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => copyLink(greeting.code)}
                              title="Copy link"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteGreeting(greeting.id)}
                              className="text-destructive hover:text-destructive"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminGreetings;
