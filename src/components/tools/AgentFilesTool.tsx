import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Folder, FileText, FolderOpen, Plus, Check, CheckCircle2, Circle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface ProjectSection {
  title: string;
  tasks: ProjectTask[];
  completed?: boolean;
}

interface ProjectTask {
  id: string;
  title: string;
  completed: boolean;
}

export default function AgentFilesTool() {
  const [sections, setSections] = useState<ProjectSection[]>([
    {
      title: "Research Phase",
      tasks: [
        { id: "1", title: "Gather current market size and growth data", completed: true },
        { id: "2", title: "Analyze customer segments and demographics", completed: true },
        { id: "3", title: "Research competitive landscape and key players", completed: false },
        { id: "4", title: "Identify emerging trends and innovations", completed: false },
        { id: "5", title: "Collect pricing and revenue data", completed: false },
      ]
    },
    {
      title: "Data Analysis", 
      tasks: [
        { id: "6", title: "Process and clean collected data", completed: false },
        { id: "7", title: "Create customer segmentation analysis", completed: false },
        { id: "8", title: "Analyze competitive positioning", completed: false },
        { id: "9", title: "Calculate market opportunities", completed: false },
        { id: "10", title: "Generate trend forecasts", completed: false },
      ]
    },
    {
      title: "Dashboard Development",
      tasks: [
        { id: "11", title: "Design responsive HTML structure", completed: false },
        { id: "12", title: "Create interactive visualizations", completed: false },
        { id: "13", title: "Implement filtering and drill-down capabilities", completed: false },
        { id: "14", title: "Add export functionality", completed: false },
        { id: "15", title: "Test responsiveness and performance", completed: false },
      ]
    },
    {
      title: "Final Deliverables",
      tasks: [
        { id: "16", title: "Complete dashboard with all visualizations", completed: false },
        { id: "17", title: "Executive summary with key findings", completed: false },
        { id: "18", title: "Actionable recommendations document", completed: false },
        { id: "19", title: "Data sources and methodology report", completed: false },
      ]
    }
  ]);

  const toggleTask = (taskId: string) => {
    setSections(sections.map(section => ({
      ...section,
      tasks: section.tasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    })));
  };

  const getSectionProgress = (section: ProjectSection) => {
    const completedTasks = section.tasks.filter(task => task.completed).length;
    return `${completedTasks}/${section.tasks.length}`;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Cat Toy Industry Market Research Dashboard</h2>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">MD</span>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground">
          7/21/2025, 2:30:55 PM
        </div>
      </div>

      {/* Project Sections */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {sections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
            className="space-y-3"
          >
            {/* Section Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-foreground">{section.title}</h3>
              <span className="text-sm text-muted-foreground">{getSectionProgress(section)}</span>
            </div>

            {/* Tasks */}
            <div className="space-y-2">
              {section.tasks.map((task, taskIndex) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (sectionIndex * 0.1) + (taskIndex * 0.05) }}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => toggleTask(task.id)}
                >
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
                    className="w-4 h-4"
                  />
                  <span className={`text-sm flex-1 ${
                    task.completed 
                      ? 'text-muted-foreground line-through' 
                      : 'text-foreground'
                  }`}>
                    {task.title}
                  </span>
                  {task.completed && (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>1/5</span>
          <div className="flex items-center gap-2">
            <div className="w-20 h-1 bg-muted rounded-full overflow-hidden">
              <div className="w-1/5 h-full bg-primary"></div>
            </div>
            <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
            <span>Jump to Latest</span>
          </div>
        </div>
      </div>
    </div>
  );
}