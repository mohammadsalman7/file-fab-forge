import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ToolCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}

export const ToolCard = ({ title, description, icon, children, className }: ToolCardProps) => {
  return (
    <Card className={cn(
      "bg-gradient-glass backdrop-blur-sm border-border/50 shadow-glass transition-all duration-300",
      "hover:shadow-glow hover:border-primary/30 hover:-translate-y-1",
      className
    )}>
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            {icon}
          </div>
          <div>
            <CardTitle className="text-xl">{title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};