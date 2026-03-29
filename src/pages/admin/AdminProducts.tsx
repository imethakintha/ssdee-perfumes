import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { supabase } from "@/lib/supabase"; 
import { toast } from "sonner";

interface Size { size: string; price: number; }
interface ScentNote { note: string; desc: string; }

interface Product {
  id: string;
  name: string;
  price: number;
  scent_notes: string;
  category: string;
  description: string;
  image_url?: string;
  sizes?: Size[];
  detailed_notes?: ScentNote[];
}

interface Category {
  id: string;
  name: string;
}

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({ 
    name: "", 
    price: "", 
    scent_notes: "", 
    category: "", 
    description: "",
    sizes: [] as Size[],
    detailed_notes: [] as ScentNote[]
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const [prodRes, catRes] = await Promise.all([
      supabase.from('products').select('*'),
      supabase.from('categories').select('*').order('name', { ascending: true })
    ]);

    if (prodRes.error) toast.error("Products could not be retrieved");
    else setProducts(prodRes.data || []);

    if (catRes.error) toast.error("Categories could not be retrieved");
    else setCategories(catRes.data || []);

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `perfumes/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const save = async () => {
    if (!form.name || !form.price || !form.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    setUploading(true);
    try {
      let imageUrl = editing?.image_url || "";
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const productData = {
        name: form.name,
        price: Number(form.price),
        scent_notes: form.scent_notes,
        category: form.category,
        description: form.description,
        image_url: imageUrl,
        sizes: form.sizes,
        detailed_notes: form.detailed_notes
      };

      if (editing) {
        const { error } = await supabase.from('products').update(productData).eq('id', editing.id);
        if (error) throw error;
        toast.success("Product updated successfully");
      } else {
        const { error } = await supabase.from('products').insert([productData]);
        if (error) throw error;
        toast.success("Product added successfully");
      }

      setDialogOpen(false);
      fetchData();
    } catch (error: any) {
      toast.error("An error occurred: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", price: "", scent_notes: "", category: "", description: "", sizes: [], detailed_notes: [] });
    setImageFile(null);
    setDialogOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ 
      name: p.name, 
      price: String(p.price), 
      scent_notes: p.scent_notes, 
      category: p.category, 
      description: p.description,
      sizes: p.sizes || [],
      detailed_notes: p.detailed_notes || []
    });
    setImageFile(null);
    setDialogOpen(true);
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) toast.error("Delete error");
    else {
      setProducts(products.filter((p) => p.id !== id));
      toast.success("Product deleted successfully");
    }
  };

  // --- Dynamic Array Handlers ---
  const addSize = () => setForm({ ...form, sizes: [...form.sizes, { size: "", price: 0 }] });
  const updateSize = (index: number, field: keyof Size, value: any) => {
    const newSizes = [...form.sizes];
    newSizes[index] = { ...newSizes[index], [field]: value };
    setForm({ ...form, sizes: newSizes });
  };
  const removeSize = (index: number) => setForm({ ...form, sizes: form.sizes.filter((_, i) => i !== index) });

  const addNote = () => setForm({ ...form, detailed_notes: [...form.detailed_notes, { note: "", desc: "" }] });
  const updateNote = (index: number, field: keyof ScentNote, value: any) => {
    const newNotes = [...form.detailed_notes];
    newNotes[index] = { ...newNotes[index], [field]: value };
    setForm({ ...form, detailed_notes: newNotes });
  };
  const removeNote = (index: number) => setForm({ ...form, detailed_notes: form.detailed_notes.filter((_, i) => i !== index) });


  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl text-gold-gradient">Products</h1>
        <Button onClick={openAdd} className="bg-gold-gradient text-primary-foreground hover:opacity-90 text-xs tracking-widest uppercase">
          <Plus size={16} className="mr-2" /> Add Product
        </Button>
      </div>

      <div className="relative w-full max-w-xs mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-secondary border-border" />
      </div>

      <div className="border border-border rounded-sm overflow-hidden">
        {loading ? <p className="p-4 text-muted-foreground text-center">Loading...</p> :
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">Name</TableHead>
                <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">Category</TableHead>
                <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">Starting Price</TableHead>
                <TableHead className="text-muted-foreground text-right text-xs uppercase tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id} className="border-border">
                  <TableCell className="text-foreground font-medium">{p.name}</TableCell>
                  <TableCell className="text-muted-foreground">{p.category}</TableCell>
                  <TableCell className="text-primary">Rs {p.price.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(p)} className="text-muted-foreground hover:text-primary">
                      <Pencil size={16} />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                          <Trash2 size={16} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-card border-border">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-foreground">Delete {p.name}?</AlertDialogTitle>
                          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="border-border text-foreground">Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => remove(p.id)} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        }
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border sm:max-w-[500px] max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="px-6 py-4 border-b border-border">
            <DialogTitle className="font-display text-xl text-gold-gradient">
              {editing ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>
          
          {/* Scrollable Area for long forms */}
          <div className="overflow-y-auto px-6 py-4 space-y-6">
            
            {/* Basic Info Section */}
            <div className="space-y-4">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground tracking-widest uppercase">Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-secondary border-border" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground tracking-widest uppercase">Starting Price (Rs)</Label>
                  <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="bg-secondary border-border" />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground tracking-widest uppercase">Category</Label>
                  <Select value={form.category} onValueChange={(val) => setForm({ ...form, category: val })}>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground tracking-widest uppercase">Short Scent Profile (List)</Label>
                <Input placeholder="e.g. Woody, Spicy, Sweet" value={form.scent_notes} onChange={(e) => setForm({ ...form, scent_notes: e.target.value })} className="bg-secondary border-border" />
              </div>
              
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground tracking-widest uppercase">Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-secondary border-border h-24" />
              </div>
            </div>

            {/* Sizes & Prices Section */}
            <div className="space-y-3 p-4 border border-primary/20 bg-primary/5 rounded-xl">
              <div className="flex justify-between items-center">
                <Label className="text-xs text-primary tracking-widest uppercase font-bold">Available Sizes & Prices</Label>
                <Button type="button" variant="outline" size="sm" onClick={addSize} className="h-7 text-[10px] border-primary/30 text-primary hover:bg-primary/20">
                  <Plus size={12} className="mr-1"/> Add Size
                </Button>
              </div>
              {form.sizes.length === 0 && <p className="text-[10px] text-muted-foreground italic">No sizes added yet. Customer will only see the starting price.</p>}
              {form.sizes.map((s, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <Input placeholder="e.g. 50ml" value={s.size} onChange={(e) => updateSize(i, 'size', e.target.value)} className="bg-secondary h-9 text-xs flex-1"/>
                  <Input type="number" placeholder="Price (Rs)" value={s.price || ""} onChange={(e) => updateSize(i, 'price', Number(e.target.value))} className="bg-secondary h-9 text-xs flex-1"/>
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeSize(i)} className="text-destructive h-9 w-9 hover:bg-destructive/20 rounded-md">
                    <X size={14}/>
                  </Button>
                </div>
              ))}
            </div>

            {/* Detailed Scent Notes Section */}
            <div className="space-y-3 p-4 border border-primary/20 bg-primary/5 rounded-xl">
              <div className="flex justify-between items-center">
                <Label className="text-xs text-primary tracking-widest uppercase font-bold">Detailed Scent Notes</Label>
                <Button type="button" variant="outline" size="sm" onClick={addNote} className="h-7 text-[10px] border-primary/30 text-primary hover:bg-primary/20">
                  <Plus size={12} className="mr-1"/> Add Note
                </Button>
              </div>
              {form.detailed_notes.length === 0 && <p className="text-[10px] text-muted-foreground italic">No detailed notes added.</p>}
              {form.detailed_notes.map((n, i) => (
                <div key={i} className="flex flex-col gap-2 relative p-3 border border-border/50 rounded-lg bg-background">
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeNote(i)} className="absolute top-1 right-1 text-destructive h-6 w-6 hover:bg-transparent">
                    <X size={14}/>
                  </Button>
                  <div className="pr-6">
                    <Label className="text-[10px] text-muted-foreground uppercase">Note Name</Label>
                    <Input placeholder="e.g. Top Note: Bergamot" value={n.note} onChange={(e) => updateNote(i, 'note', e.target.value)} className="bg-secondary h-8 text-xs mb-2"/>
                    <Label className="text-[10px] text-muted-foreground uppercase">Description (Optional)</Label>
                    <Input placeholder="Fresh and citrusy..." value={n.desc} onChange={(e) => updateNote(i, 'desc', e.target.value)} className="bg-secondary h-8 text-xs"/>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-1 pb-4">
              <Label className="text-xs text-muted-foreground tracking-widest uppercase">Product Image</Label>
              <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="bg-secondary border-border text-xs" />
            </div>

          </div>

          <div className="px-6 py-4 border-t border-border bg-card">
            <Button onClick={save} disabled={uploading} className="w-full bg-gold-gradient text-primary-foreground hover:opacity-90 tracking-widest uppercase text-xs py-5 shadow-lg">
              {uploading ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
              {editing ? "Update Product" : "Save New Product"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;