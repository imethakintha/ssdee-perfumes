import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase"; //
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
}

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      toast.error("Data could not be retrieved");
    } else {
      setCategories(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const add = async () => {
    if (!newName.trim()) return;
    
    const { data, error } = await supabase
      .from('categories')
      .insert([{ name: newName.trim() }])
      .select();

    if (error) {
      toast.error("Could not add category");
    } else {
      setCategories([...categories, data[0]]);
      setNewName("");
      toast.success("Category added successfully");
    }
  };

  const saveEdit = async () => {
    if (!editingId || !editName.trim()) return;

    const { error } = await supabase
      .from('categories')
      .update({ name: editName.trim() })
      .eq('id', editingId);

    if (error) {
      toast.error("Could not update category");
    } else {
      setCategories(categories.map((c) => c.id === editingId ? { ...c, name: editName } : c));
      setEditingId(null);
      toast.success("Category updated successfully");
    }
  };

  const remove = async (id: string) => {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error("Could not delete category");
    } else {
      setCategories(categories.filter((c) => c.id !== id));
      toast.success("Category deleted successfully");
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl text-gold-gradient mb-6">Categories</h1>

      <div className="flex gap-2 mb-6 max-w-md">
        <Input
          placeholder="New category name..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          className="bg-secondary border-border"
        />
        <Button onClick={add} className="bg-gold-gradient text-primary-foreground hover:opacity-90">
          <Plus size={16} />
        </Button>
      </div>

      <div className="space-y-2 max-w-md">
        {loading ? <p className="text-muted-foreground">Loading...</p> : 
          categories.map((c) => (
            <div key={c.id} className="flex items-center gap-2 border border-border rounded-sm p-3">
              {editingId === c.id ? (
                <>
                  <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="bg-secondary border-border flex-1" autoFocus />
                  <Button variant="ghost" size="icon" onClick={saveEdit} className="text-primary"><Check size={16} /></Button>
                  <Button variant="ghost" size="icon" onClick={() => setEditingId(null)} className="text-muted-foreground"><X size={16} /></Button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-foreground text-sm">{c.name}</span>
                  <Button variant="ghost" size="icon" onClick={() => { setEditingId(c.id); setEditName(c.name); }} className="text-muted-foreground hover:text-primary"><Pencil size={14} /></Button>
                  <Button variant="ghost" size="icon" onClick={() => remove(c.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={14} /></Button>
                </>
              )}
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default AdminCategories;