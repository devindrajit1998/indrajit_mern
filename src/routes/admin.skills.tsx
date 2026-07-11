import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Plus, Save, Trash2, GripVertical } from "lucide-react";
import { skills as mockSkills, techStack as mockTechStack } from "@/lib/portfolio-data";
import { Badge } from "@/components/ui/badge";
import { useFirestoreCollection, useFirestoreDoc } from "@/hooks/useFirestore";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/skills")({
  component: AdminSkills,
});

function AdminSkills() {
  const { list: skills, addOrUpdateItem, deleteItem } = useFirestoreCollection("skills", mockSkills);
  const { data: skillsDoc, updateDocData } = useFirestoreDoc("skills", "portfolio_skills", {
    techStack: mockTechStack
  });

  const [techChips, setTechChips] = useState<string[]>(mockTechStack);
  const [newChip, setNewChip] = useState("");
  const [loading, setLoading] = useState(false);
  const [localSkills, setLocalSkills] = useState<any[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (skillsDoc?.techStack) {
      setTechChips(skillsDoc.techStack);
    }
  }, [skillsDoc]);

  useEffect(() => {
    if (skills && localSkills.length === 0) {
      const sorted = [...skills]
        .filter((s: any) => s.id !== "portfolio_skills" && s.name)
        .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
      setLocalSkills(sorted);
    }
  }, [skills]);

  function handleAddChip() {
    if (newChip.trim() && !techChips.includes(newChip.trim())) {
      setTechChips([...techChips, newChip.trim()]);
      setNewChip("");
    }
  }

  function handleRemoveChip(chip: string) {
    setTechChips(techChips.filter(c => c !== chip));
  }

  async function handleSaveAll() {
    setLoading(true);
    try {
      // Save tech stack chips doc
      await updateDocData({ techStack: techChips });

      // Save skill slider/proficiencies with order
      for (let index = 0; index < localSkills.length; index++) {
        const skill = localSkills[index];
        const id = skill.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        await addOrUpdateItem(id, { name: skill.name, value: skill.value, order: index });
      }

      toast.success("Skills and tech stack saved successfully");
    } catch (err) {
      toast.error("Failed to save skills settings");
    } finally {
      setLoading(false);
    }
  }

  function handleDragStart(e: React.DragEvent, index: number) {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  function handleDrop(e: React.DragEvent, targetIndex: number) {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const list = [...localSkills];
    const draggedItem = list[draggedIndex];
    list.splice(draggedIndex, 1);
    list.splice(targetIndex, 0, draggedItem);

    setLocalSkills(list);
    setDraggedIndex(null);
  }

  function updateLocalSkillValue(name: string, val: number) {
    setLocalSkills(prev => prev.map(s => s.name === name ? { ...s, value: val } : s));
  }

  function updateLocalSkillName(oldName: string, newName: string) {
    setLocalSkills(prev => prev.map(s => s.name === oldName ? { ...s, name: newName } : s));
  }

  async function handleDeleteSkill(name: string) {
    try {
      const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      await deleteItem(id);
      setLocalSkills(prev => prev.filter(s => s.name !== name));
      toast.success("Skill deleted");
    } catch (err) {
      toast.error("Failed to delete skill");
    }
  }

  function handleAddSkill() {
    const defaultName = `New Skill ${localSkills.length + 1}`;
    setLocalSkills([...localSkills, { name: defaultName, value: 50 }]);
  }

  return (
    <div>
      <PageHeader
        title="Skills & Tech Stack"
        description="Update proficiency levels and the tech stack chip list."
        actions={<Button size="sm" className="gap-2" onClick={handleSaveAll} disabled={loading}><Save className="w-4 h-4" /> Save changes</Button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Proficiency</CardTitle>
              <CardDescription>Skill bars displayed on the About page.</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="gap-1" onClick={handleAddSkill}><Plus className="w-4 h-4" /> Add</Button>
          </CardHeader>
          <CardContent className="space-y-5">
            {localSkills.map((s, i) => (
              <div 
                key={i} 
                draggable
                onDragStart={(e) => handleDragStart(e, i)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, i)}
                className={`space-y-2 p-3 rounded-lg border border-border/40 bg-zinc-950/20 hover:border-brand-purple/30 transition-all ${draggedIndex === i ? "opacity-40" : ""}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-1">
                    <div className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-white transition-colors">
                      <GripVertical className="w-4 h-4" />
                    </div>
                    <Input
                      value={s.name}
                      onChange={(e) => updateLocalSkillName(s.name, e.target.value)}
                      className="h-8 max-w-[220px]"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-10 text-right">{s.value}%</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive h-8 w-8"
                      onClick={() => handleDeleteSkill(s.name)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
                <Slider
                  value={[s.value]}
                  max={100}
                  step={5}
                  onValueChange={(val) => updateLocalSkillValue(s.name, val[0] || 0)}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tech Stack Chips</CardTitle>
            <CardDescription>Comma-separated technologies shown on the homepage strip.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {techChips.map((t) => (
                <Badge key={t} variant="secondary" className="gap-1 py-1 px-2">
                  {t}
                  <button className="ml-1 text-muted-foreground hover:text-destructive" onClick={() => handleRemoveChip(t)}>×</button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add a technology (e.g. GraphQL)"
                className="h-9"
                value={newChip}
                onChange={(e) => setNewChip(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddChip()}
              />
              <Button size="sm" className="gap-1" onClick={handleAddChip}><Plus className="w-4 h-4" /> Add</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

