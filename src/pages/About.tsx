import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, Award, Users, Target } from "lucide-react";
import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation();

  const values = [
    { icon: Shield, key: "strength" },
    { icon: Award, key: "excellence" },
    { icon: Users, key: "community" },
    { icon: Target, key: "precision" },
  ];

  const storyParagraphs = [
    t("about.story.paragraph1"),
    t("about.story.paragraph2"),
    t("about.story.paragraph3"),
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="py-12 sm:py-16 md:py-20 gradient-roman">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-display font-bold text-white mb-4 sm:mb-6">
              {t("about.hero.title")}
              <span className="block text-gold">{t("about.hero.highlight")}</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed px-4">
              {t("about.hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              {storyParagraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-4 sm:mb-6 last:mb-0 sm:last:mb-0"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-marble">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-primary mb-3 sm:mb-4">
              {t("about.values.title")}
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              {t("about.values.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="text-center p-8 rounded-lg bg-background shadow-elegant hover:shadow-gold transition-all duration-300">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-2xl text-primary mb-3">
                    {t(`about.values.items.${value.key}.title`)}
                  </h3>
                  <p className="text-muted-foreground">
                    {t(`about.values.items.${value.key}.description`)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center p-6 sm:p-8 md:p-12 rounded-lg bg-gradient-to-br from-marble to-marble-dark shadow-elegant">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-primary mb-3 sm:mb-4">
              {t("about.cta.title")}
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">
              {t("about.cta.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center">
              <a
                href="/shop"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg gradient-roman text-white font-semibold hover:opacity-90 transition-opacity text-sm sm:text-base"
              >
                {t("about.cta.shop")}
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-primary-foreground transition-colors text-sm sm:text-base"
              >
                {t("about.cta.contact")}
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
