import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type CaseItem = {
    name: string;
    segment: string;
    delivered: string[];
    result: string;
};

const CASES: CaseItem[] = [
    {
        name: "Livrarias Plenitude",
        segment: "Varejo",
        delivered: [
            "Consultoria em ERP Senior",
            "Criação de portal de compras integrado ao ERP",
        ],
        result:
            "Maior controle operacional, padronização de processos e redução de retrabalho no dia a dia.",
    },
    {
        name: "Grupo Arion",
        segment: "Serviços de tecnologia",
        delivered: [
            "Consultoria em ERP Senior",
            "Customização de relatórios",
            "Automações de processos internos",
        ],
        result:
            "Mais tempo ganho para focar no core business, com processos internos mais eficientes e integrados.",
    },
    {
        name: "Regimar Agropecuária",
        segment: "Agronegócio",
        delivered: [
            "Consultoria em ERP Senior",
            "Atuamatizações bancários com importações de extratos financeiros",
            "Customizações em relatórios gerenciais",
        ],
        result:
            "As automações reduziram o tempo gasto em tarefas manuais, aumentando a eficiência operacional e a precisão dos dados financeiros.",
    },
    {
        name: "Brasão do Pampa",
        segment: "Indústria / Comércio",
        delivered: [
            "Criação de aplicativo mobile para coleta de dados de clientes",

        ],
        result:
            "Melhorou 100% o contato com o cliente para criação de eventos de leadings.",
    },
    {
        name: "Frago Agropecuária",
        segment: "Agronegócio",
        delivered: [
            "Consultoria em implantação e ajustes de módulos do ERP Senior",
            "Customizações específicas para regras do negócio",
            "Suporte técnico contínuo",
        ],
        result:
            "Processos mais eficientes, maior aderência do ERP ao negócio e ganho operacional no uso do sistema.",
    },
];

export default function SuccessCasesSection() {
    return (
        <section id="cases" className="py-16">
            <div className="mx-auto w-full max-w-6xl px-4">
                <div className="mb-8 flex flex-col gap-2">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        Cases de Sucesso
                    </h2>
                    <p className="text-muted-foreground">
                        Resultados reais em projetos de tecnologia, integrações e ERP Senior.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    {CASES.map((item) => (
                        <Card key={item.name} className="h-full">
                            <CardHeader className="space-y-2">
                                <div className="flex items-start justify-between gap-3">
                                    <CardTitle className="text-lg">{item.name}</CardTitle>
                                    <Badge variant="secondary" className="whitespace-nowrap">
                                        {item.segment}
                                    </Badge>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <div>
                                    <p className="mb-2 text-sm font-medium">Solução entregue</p>
                                    <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                                        {item.delivered.map((d) => (
                                            <li key={d}>{d}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="rounded-lg border bg-muted/30 p-3">
                                    <p className="mb-1 text-sm font-medium">Resultado</p>
                                    <p className="text-sm text-muted-foreground">{item.result}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="mt-8 rounded-xl border bg-muted/20 p-5">
                    <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
                        <div>
                            <p className="text-base font-semibold">Quer ser o próximo case?</p>
                            <p className="text-sm text-muted-foreground">
                                Fale com a Integra Tech e entenda como podemos ajudar com soluções
                                sob medida.
                            </p>
                        </div>

                        <a
                            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition hover:opacity-90"
                            href="https://wa.me/5541995915693"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Falar no WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
