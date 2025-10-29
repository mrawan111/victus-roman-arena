import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, Award, Users, Target } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Shield,
      title: "Strength",
      description: "Built with uncompromising quality and durability, inspired by ancient warriors."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Premium equipment trusted by professional fighters and champions worldwide."
    },
    {
      icon: Users,
      title: "Community",
      description: "Supporting martial artists at every level of their journey to greatness."
    },
    {
      icon: Target,
      title: "Precision",
      description: "Engineered with attention to detail for optimal performance and protection."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 gradient-roman">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
              The Legacy of
              <span className="block text-gold">Victus</span>
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Born from the spirit of ancient Roman gladiators, Victus embodies strength, honor, and victory in every piece of equipment we craft.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Victus was founded on a singular vision: to create martial arts equipment that embodies the strength and resilience of ancient warriors. Just as Roman gladiators entered the arena with confidence in their equipment, modern fighters deserve gear they can trust completely.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Our name, "Victus," meaning "conquered" or "sustained" in Latin, represents our commitment to helping athletes overcome challenges and sustain their passion for martial arts. Every product we design undergoes rigorous testing and refinement to ensure it meets the highest standards of quality and performance.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                From professional MMA fighters to dedicated beginners, Victus serves martial artists across all disciplines. We believe that with the right equipment, every athlete can unlock their potential and write their own victory story.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-marble">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-primary mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="text-center p-8 rounded-lg bg-background shadow-elegant hover:shadow-gold transition-all duration-300">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-2xl text-primary mb-3">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center p-12 rounded-lg bg-gradient-to-br from-marble to-marble-dark shadow-elegant">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">
              Join Our Legion
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Experience the difference that professional-grade equipment makes in your training.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="/shop"
                className="inline-flex items-center justify-center px-8 py-3 rounded-lg gradient-roman text-white font-semibold hover:opacity-90 transition-opacity"
              >
                Shop Equipment
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-3 rounded-lg border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
