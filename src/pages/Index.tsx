import { Globe, Link2, Settings, FileCode, MessageCircle, Mail, Phone, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SuccessCasesSection from "@/components/sections/SuccessCasesSection";

const WHATSAPP_NUMBER = "5541995915693";
const WHATSAPP_MESSAGE = encodeURIComponent("Olá! Gostaria de solicitar um orçamento.");
const EMAIL = "suporteintegrainc@gmail.com";

const Index = () => {
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;
  const emailLink = `mailto:${EMAIL}`;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface-elevated/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">IT</span>
            </div>
            <span className="font-semibold text-foreground">Integra Tech</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#servicos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Serviços</a>
            <a href="#processo" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Como Trabalhamos</a>
            <a href="#contato" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contato</a>
          </nav>
          <Button variant="hero" size="sm" asChild>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              Fale Conosco
            </a>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 bg-gradient-to-b from-secondary/50 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-fade-up tracking-tight">
              Integra Tech
              <span className="block text-primary mt-2">Consultoria Especializada</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-4 animate-fade-up-delay-1 font-medium">
              Sites, integrações e consultoria em ERP Senior
            </p>
            <p className="text-lg text-muted-foreground mb-10 animate-fade-up-delay-2 max-w-2xl mx-auto">
              Criamos sites personalizados, desenvolvemos integrações com qualquer sistema e realizamos consultoria, implantação e customizações no ERP Senior.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up-delay-3">
              <Button variant="hero" size="xl" asChild>
                <a href={emailLink}>
                  <Mail className="w-5 h-5" />
                  Solicitar Orçamento
                </a>
              </Button>
              <Button variant="whatsapp" size="xl" asChild>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5" />
                  Falar no WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicos" className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Nossos Serviços</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Soluções completas para transformar e otimizar os processos da sua empresa
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {/* Service 1 */}
            <div className="group p-8 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Globe className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Sites Personalizados</h3>
              <p className="text-muted-foreground leading-relaxed">
                Desenvolvimento de sites modernos, rápidos e responsivos para empresas que buscam presença digital profissional.
              </p>
            </div>

            {/* Service 2 */}
            <div className="group p-8 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Link2 className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Integrações com Qualquer Sistema</h3>
              <p className="text-muted-foreground leading-relaxed">
                Integração entre sistemas utilizando APIs, Webservices, SOAP e REST, automatizando processos e eliminando retrabalho.
              </p>
            </div>

            {/* Service 3 */}
            <div className="group p-8 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Settings className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Consultoria e Implantação ERP Senior</h3>
              <p className="text-muted-foreground mb-4">
                Atuação especializada nos módulos:
              </p>
              <ul className="space-y-2">
                {["Mercado", "Suprimentos", "Finanças", "Qualidade", "Gestão da Manutenção"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Service 4 */}
            <div className="group p-8 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <FileCode className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Customizações no ERP Senior</h3>
              <p className="text-muted-foreground mb-4">
                Desenvolvimento sob medida:
              </p>
              <ul className="space-y-2">
                {["Relatórios personalizados", "Telas SGI", "Regras de negócio", "Criação de webservices"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="processo" className="py-20 md:py-28 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Como Trabalhamos</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Um processo claro e objetivo para entregar resultados
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { step: "01", title: "Entendimento", desc: "Entendimento da necessidade" },
              { step: "02", title: "Análise", desc: "Análise técnica detalhada" },
              { step: "03", title: "Proposta", desc: "Proposta objetiva e clara" },
              { step: "04", title: "Execução", desc: "Execução por etapas" },
            ].map((item, index) => (
              <div key={item.step} className="text-center relative">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
                {index < 3 && (
                  <ArrowRight className="hidden lg:block absolute top-8 -right-4 w-8 h-8 text-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      <SuccessCasesSection />


      {/* CTA Section */}
      <section id="contato" className="py-20 md:py-28 bg-primary">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Fale com um Especialista
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-10">
              Entre em contato para entender como podemos ajudar sua empresa com soluções sob medida.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="xl" asChild>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5" />
                  (41) 9 9591-5693
                </a>
              </Button>
              <Button variant="outline" size="xl" className="border-primary-foreground/30  hover:bg-primary-foreground/10 hover:text-primary-foreground" asChild>
                <a href={emailLink}>
                  <Mail className="w-5 h-5" />
                  {EMAIL}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-foreground flex items-center justify-center">
                    <span className="text-foreground font-bold text-sm">IT</span>
                  </div>
                  <span className="font-semibold text-background">Integra Tech – Consultoria Especializada</span>
                </div>
                <p className="text-background/60 text-sm">
                  Atendimento remoto para todo o Brasil
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-6 text-background/80 text-sm">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-background transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  (41) 9 9591-5693
                </a>
                <a
                  href={emailLink}
                  className="flex items-center gap-2  hover:text-background transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  {EMAIL}
                </a>
              </div>
            </div>
            <div className="border-t border-background/10 mt-8 pt-8 text-center">
              <p className="text-background/40 text-sm">
                © {new Date().getFullYear()} Integra Tech. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
