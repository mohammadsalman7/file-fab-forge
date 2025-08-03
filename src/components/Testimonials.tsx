import { Star } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export const Testimonials = ({ testimonials }: TestimonialsProps) => {
  return (
    <div className="bg-gradient-glass backdrop-blur-sm border-border/50 rounded-2xl p-8 shadow-glass">
      <h2 className="text-2xl font-bold mb-6 text-center">What Our Users Say</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-background/50 p-6 rounded-lg border border-border/30">
            <div className="flex items-center mb-3">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground mb-4 italic">
              "{testimonial.content}"
            </p>
            <div>
              <p className="font-semibold text-sm">{testimonial.name}</p>
              <p className="text-xs text-muted-foreground">{testimonial.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};