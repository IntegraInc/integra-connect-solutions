import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { X, MessageCircle, Trash2, Send } from "lucide-react";
import {
    buildWhatsappSummary,
    type IntegrationType,
    type PreSurveyData,
    type SeniorModule,
    type ServiceType,
} from "./chatFlow";

type Role = "user" | "assistant";

interface Message {
    id: string;
    role: Role;
    content: string;
    createdAt: number;
}

const STORAGE_MESSAGES = "integrainc_chat_messages_v2";
const STORAGE_DATA = "integrainc_chat_data_v1";
const STORAGE_STEP = "integrainc_chat_step_v1";

const WHATSAPP_PHONE_E164 = "5541995915693";

function openWhatsapp(text: string) {
    const url = `https://wa.me/${WHATSAPP_PHONE_E164}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
}

function isMessage(value: unknown): value is Message {
    if (typeof value !== "object" || value === null) return false;
    const v = value as Record<string, unknown>;
    return (
        typeof v.id === "string" &&
        (v.role === "user" || v.role === "assistant") &&
        typeof v.content === "string" &&
        typeof v.createdAt === "number"
    );
}

function loadMessages(): Message[] {
    try {
        const raw = localStorage.getItem(STORAGE_MESSAGES);
        if (!raw) return [];
        const parsed: unknown = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed.filter(isMessage);
    } catch (err) {
        console.warn("[ChatWidget] loadMessages:", err);
        return [];
    }
}

function loadData(): PreSurveyData {
    try {
        const raw = localStorage.getItem(STORAGE_DATA);
        if (!raw) return {};
        const parsed: unknown = JSON.parse(raw);
        if (typeof parsed !== "object" || parsed === null) return {};
        return parsed as PreSurveyData;
    } catch (err) {
        console.warn("[ChatWidget] loadData:", err);
        return {};
    }
}

function loadStep(): number {
    try {
        const raw = localStorage.getItem(STORAGE_STEP);
        const n = raw ? Number(raw) : 0;
        return Number.isFinite(n) ? n : 0;
    } catch (err) {
        console.warn("[ChatWidget] loadStep:", err);
        return 0;
    }
}

function nowId() {
    return crypto.randomUUID();
}

export default function ChatWidget() {
    const [open, setOpen] = useState(false);

    const [data, setData] = useState<PreSurveyData>(() => loadData());
    const [step, setStep] = useState<number>(() => loadStep());
    const [messages, setMessages] = useState<Message[]>(() => {
        const saved = loadMessages();
        if (saved.length) return saved;

        // Mensagem inicial (se não houver histórico)
        return [
            {
                id: "init",
                role: "assistant",
                content:
                    "Olá! Sou o atendimento da Integra Tech.\nVamos fazer um pré-levantamento rápido. Primeiro: qual serviço você precisa?",
                createdAt: Date.now(),
            },
        ];
    });

    const bottomRef = useRef<HTMLDivElement>(null);

    // Persistência
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_MESSAGES, JSON.stringify(messages));
        } catch (err) {
            console.warn("[ChatWidget] persist messages:", err);
        }
    }, [messages]);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_DATA, JSON.stringify(data));
        } catch (err) {
            console.warn("[ChatWidget] persist data:", err);
        }
    }, [data]);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_STEP, String(step));
        } catch (err) {
            console.warn("[ChatWidget] persist step:", err);
        }
    }, [step]);

    useEffect(() => {
        if (!open) return;
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, open, step]);

    function push(role: Role, content: string) {
        setMessages((prev) => [
            ...prev,
            { id: nowId(), role, content, createdAt: Date.now() },
        ]);
    }

    function resetAll() {
        setData({});
        setStep(0);
        setMessages([
            {
                id: "init",
                role: "assistant",
                content:
                    "Olá! Sou o atendimento da Integra Tech.\nVamos fazer um pré-levantamento rápido. Primeiro: qual serviço você precisa?",
                createdAt: Date.now(),
            },
        ]);
    }

    // Helpers de fluxo
    function chooseService(t: ServiceType) {
        setData((d) => ({ ...d, serviceType: t }));
        push("user", serviceText(t));

        // Pergunta seguinte por tipo
        if (t === "SITE") {
            push("assistant", "Perfeito. Qual o objetivo do site? (ex: institucional, captação de leads, apresentação de serviços)");
            setStep(1);
            return;
        }
        if (t === "INTEGRACAO") {
            push("assistant", "Perfeito. Quais sistemas precisam ser integrados? (ex: Senior + sistema X, banco Y, API Z)");
            setStep(10);
            return;
        }
        if (t === "SENIOR") {
            push("assistant", "Entendi. Sua demanda é implantação, ajustes ou suporte evolutivo?");
            setStep(20);
            return;
        }
        // CUSTOMIZACAO
        push(
            "assistant",
            "Entendi. Qual tipo de customização você precisa? (Relatórios, Telas SGI, Regras de negócio, Webservices)"
        );
        setStep(30);
    }

    function serviceText(t: ServiceType) {
        const map: Record<ServiceType, string> = {
            SITE: "Site personalizado",
            INTEGRACAO: "Integração entre sistemas",
            SENIOR: "Consultoria / implantação ERP Senior",
            CUSTOMIZACAO: "Customizações no ERP Senior",
        };
        return map[t];
    }

    const [freeText, setFreeText] = useState(""); // usado em etapas de texto curto/final

    function submitShortText(field: keyof PreSurveyData, labelToShow: string) {
        const v = freeText.trim();
        if (!v) return;
        setData((d) => ({ ...d, [field]: v }));
        push("user", v);
        setFreeText("");
        nextAfterShortText(field, labelToShow);
    }

    function nextAfterShortText(field: keyof PreSurveyData, _label: string) {
        // SITE flow
        if (field === "siteGoal") {
            push("assistant", "Você quer 1 página ou múltiplas páginas?");
            setStep(2);
            return;
        }
        if (field === "deadline") {
            goGeneralBlock();
            return;
        }

        // INTEGRAÇÃO flow
        if (field === "systemsToIntegrate") {
            push("assistant", "Qual o tipo de integração?");
            setStep(11);
            return;
        }

        // Contato / Final
        if (field === "name") {
            push("assistant", "Qual o nome da empresa? (se não quiser, pode escrever 'não informar')");
            setStep(51);
            return;
        }
        if (field === "company") {
            push("assistant", "Seu e-mail para contato? (opcional)");
            setStep(52);
            return;
        }
        if (field === "email") {
            push("assistant", "Seu telefone/WhatsApp? (opcional)");
            setStep(53);
            return;
        }
        if (field === "phone") {
            push("assistant", "Agora pode escrever considerações finais / detalhes extras (opcional).");
            setStep(60);
            return;
        }
        if (field === "finalNotes") {
            push("assistant", "Perfeito. Pré-levantamento concluído. Você pode enviar para o WhatsApp agora.");
            setStep(99);
        }
    }

    function goGeneralBlock() {
        push("assistant", "Qual o porte da empresa?");
        setStep(40);
    }

    function finalizeToContact() {
        push("assistant", "Para fechar: qual seu nome? (opcional)");
        setStep(50);
    }

    const canSendWhatsapp = useMemo(() => !!data.serviceType, [data.serviceType]);

    function sendToWhatsapp() {
        const text = buildWhatsappSummary(data);
        openWhatsapp(text);
    }

    // UI por etapa
    const content = (() => {
        // 0 - escolher serviço
        if (step === 0) {
            return (
                <div className="space-y-2">
                    <Button className="w-full" variant="outline" onClick={() => chooseService("SITE")}>
                        Site personalizado
                    </Button>
                    <Button className="w-full" variant="outline" onClick={() => chooseService("INTEGRACAO")}>
                        Integração entre sistemas
                    </Button>
                    <Button className="w-full" variant="outline" onClick={() => chooseService("SENIOR")}>
                        Consultoria / implantação ERP Senior
                    </Button>
                    <Button className="w-full" variant="outline" onClick={() => chooseService("CUSTOMIZACAO")}>
                        Customizações no ERP Senior
                    </Button>
                </div>
            );
        }

        // SITE: 1 objetivo (texto)
        if (step === 1) {
            return (
                <ShortText
                    value={freeText}
                    setValue={setFreeText}
                    placeholder="Ex: institucional para apresentar serviços e gerar leads"
                    onSubmit={() => submitShortText("siteGoal", "Objetivo")}
                />
            );
        }

        // SITE: 2 páginas
        if (step === 2) {
            return (
                <div className="space-y-2">
                    <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => {
                            setData((d) => ({ ...d, sitePages: "1 página" }));
                            push("user", "1 página");
                            push("assistant", "Você já possui domínio?");
                            setStep(3);
                        }}
                    >
                        1 página
                    </Button>
                    <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => {
                            setData((d) => ({ ...d, sitePages: "Múltiplas páginas" }));
                            push("user", "Múltiplas páginas");
                            push("assistant", "Você já possui domínio?");
                            setStep(3);
                        }}
                    >
                        Múltiplas páginas
                    </Button>
                </div>
            );
        }

        // SITE: 3 domínio
        if (step === 3) {
            return (
                <div className="space-y-2">
                    <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => {
                            setData((d) => ({ ...d, hasDomain: "Sim" }));
                            push("user", "Sim");
                            push("assistant", "Qual o prazo desejado?");
                            setStep(4);
                        }}
                    >
                        Sim
                    </Button>
                    <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => {
                            setData((d) => ({ ...d, hasDomain: "Não" }));
                            push("user", "Não");
                            push("assistant", "Qual o prazo desejado?");
                            setStep(4);
                        }}
                    >
                        Não
                    </Button>
                </div>
            );
        }

        // SITE: 4 prazo (texto)
        if (step === 4) {
            return (
                <ShortText
                    value={freeText}
                    setValue={setFreeText}
                    placeholder="Ex: 10 dias, ainda essa semana, janeiro, etc."
                    onSubmit={() => submitShortText("deadline", "Prazo")}
                />
            );
        }

        // INTEGRAÇÃO: 10 sistemas (texto)
        if (step === 10) {
            return (
                <ShortText
                    value={freeText}
                    setValue={setFreeText}
                    placeholder="Ex: Senior ERP + sistema legado X + API do parceiro Y"
                    onSubmit={() => submitShortText("systemsToIntegrate", "Sistemas")}
                />
            );
        }

        // INTEGRAÇÃO: 11 tipo integração
        if (step === 11) {
            const options: IntegrationType[] = ["API REST", "SOAP", "Webservice", "Banco de Dados"];
            return (
                <div className="space-y-2">
                    {options.map((opt) => (
                        <Button
                            key={opt}
                            className="w-full"
                            variant="outline"
                            onClick={() => {
                                setData((d) => ({ ...d, integrationType: opt }));
                                push("user", opt);
                                push("assistant", "A integração é unidirecional ou bidirecional?");
                                setStep(12);
                            }}
                        >
                            {opt}
                        </Button>
                    ))}
                </div>
            );
        }

        // INTEGRAÇÃO: 12 direção
        if (step === 12) {
            return (
                <div className="space-y-2">
                    <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => {
                            setData((d) => ({ ...d, direction: "Unidirecional" }));
                            push("user", "Unidirecional");
                            push("assistant", "Existe documentação disponível?");
                            setStep(13);
                        }}
                    >
                        Unidirecional
                    </Button>
                    <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => {
                            setData((d) => ({ ...d, direction: "Bidirecional" }));
                            push("user", "Bidirecional");
                            push("assistant", "Existe documentação disponível?");
                            setStep(13);
                        }}
                    >
                        Bidirecional
                    </Button>
                </div>
            );
        }

        // INTEGRAÇÃO: 13 docs
        if (step === 13) {
            return (
                <div className="space-y-2">
                    <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => {
                            setData((d) => ({ ...d, hasDocs: "Sim" }));
                            push("user", "Sim");
                            goGeneralBlock();
                        }}
                    >
                        Sim
                    </Button>
                    <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => {
                            setData((d) => ({ ...d, hasDocs: "Não" }));
                            push("user", "Não");
                            goGeneralBlock();
                        }}
                    >
                        Não
                    </Button>
                </div>
            );
        }

        // SENIOR: 20 demanda
        if (step === 20) {
            return (
                <div className="space-y-2">
                    {(["Implantação", "Ajustes", "Suporte evolutivo"] as const).map((opt) => (
                        <Button
                            key={opt}
                            className="w-full"
                            variant="outline"
                            onClick={() => {
                                setData((d) => ({ ...d, seniorDemand: opt }));
                                push("user", opt);
                                push("assistant", "Quais módulos do Senior estão envolvidos?");
                                setStep(21);
                            }}
                        >
                            {opt}
                        </Button>
                    ))}
                </div>
            );
        }

        // SENIOR: 21 módulos (multi)
        if (step === 21) {
            const modules: SeniorModule[] = [
                "Mercado",
                "Suprimentos",
                "Finanças",
                "Qualidade",
                "Gestão da Manutenção",
            ];

            const selected = new Set(data.seniorModules ?? []);

            return (
                <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">
                        Selecione 1 ou mais e depois clique em “Continuar”.
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                        {modules.map((m) => {
                            const active = selected.has(m);
                            return (
                                <Button
                                    key={m}
                                    variant={active ? "default" : "outline"}
                                    className="w-full justify-start"
                                    onClick={() => {
                                        const next = new Set(selected);
                                        if (next.has(m)) next.delete(m);
                                        else next.add(m);
                                        setData((d) => ({ ...d, seniorModules: Array.from(next) }));
                                    }}
                                >
                                    {m}
                                </Button>
                            );
                        })}
                    </div>

                    <Button
                        className="w-full"
                        onClick={() => {
                            push("user", `Módulos: ${(data.seniorModules ?? []).join(", ") || "(não informado)"}`);
                            goGeneralBlock();
                        }}
                    >
                        Continuar
                    </Button>
                </div>
            );
        }

        // CUSTOM: 30 tipos (multi)
        if (step === 30) {
            const options = ["Relatórios", "Telas SGI", "Regras de negócio", "Webservices"] as const;
            const selected = new Set(data.customTypes ?? []);

            return (
                <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">
                        Selecione 1 ou mais e depois clique em “Continuar”.
                    </div>

                    {options.map((opt) => {
                        const active = selected.has(opt);
                        return (
                            <Button
                                key={opt}
                                className="w-full justify-start"
                                variant={active ? "default" : "outline"}
                                onClick={() => {
                                    const next = new Set(selected);
                                    if (next.has(opt)) next.delete(opt);
                                    else next.add(opt);
                                    setData((d) => ({ ...d, customTypes: Array.from(next) }));
                                }}
                            >
                                {opt}
                            </Button>
                        );
                    })}

                    <Button
                        className="w-full"
                        onClick={() => {
                            push("user", `Customizações: ${(data.customTypes ?? []).join(", ") || "(não informado)"}`);
                            push("assistant", "As regras de negócio já estão definidas?");
                            setStep(31);
                        }}
                    >
                        Continuar
                    </Button>
                </div>
            );
        }

        // CUSTOM: 31 regras definidas
        if (step === 31) {
            return (
                <div className="space-y-2">
                    <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => {
                            setData((d) => ({ ...d, businessRulesDefined: "Sim" }));
                            push("user", "Sim");
                            goGeneralBlock();
                        }}
                    >
                        Sim
                    </Button>
                    <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => {
                            setData((d) => ({ ...d, businessRulesDefined: "Não" }));
                            push("user", "Não");
                            goGeneralBlock();
                        }}
                    >
                        Não
                    </Button>
                </div>
            );
        }

        // GERAL: 40 porte
        if (step === 40) {
            return (
                <div className="space-y-2">
                    {(["Pequena", "Média", "Grande"] as const).map((opt) => (
                        <Button
                            key={opt}
                            className="w-full"
                            variant="outline"
                            onClick={() => {
                                setData((d) => ({ ...d, companySize: opt }));
                                push("user", `Porte: ${opt}`);
                                push("assistant", "Qual a urgência?");
                                setStep(41);
                            }}
                        >
                            {opt}
                        </Button>
                    ))}
                </div>
            );
        }

        // GERAL: 41 urgência
        if (step === 41) {
            return (
                <div className="space-y-2">
                    {(["Urgente", "Normal", "Flexível"] as const).map((opt) => (
                        <Button
                            key={opt}
                            className="w-full"
                            variant="outline"
                            onClick={() => {
                                setData((d) => ({ ...d, urgency: opt }));
                                push("user", `Urgência: ${opt}`);
                                finalizeToContact();
                            }}
                        >
                            {opt}
                        </Button>
                    ))}
                </div>
            );
        }

        // CONTATO: 50 nome
        if (step === 50) {
            return (
                <ShortText
                    value={freeText}
                    setValue={setFreeText}
                    placeholder="Ex: João"
                    onSubmit={() => submitShortText("name", "Nome")}
                    optionalHint="(opcional — se não quiser, escreva: não informar)"
                />
            );
        }

        // CONTATO: 51 empresa
        if (step === 51) {
            return (
                <ShortText
                    value={freeText}
                    setValue={setFreeText}
                    placeholder="Ex: Metalúrgica XYZ"
                    onSubmit={() => submitShortText("company", "Empresa")}
                    optionalHint="(opcional — se não quiser, escreva: não informar)"
                />
            );
        }

        // CONTATO: 52 email
        if (step === 52) {
            return (
                <ShortText
                    value={freeText}
                    setValue={setFreeText}
                    placeholder="Ex: joao@empresa.com"
                    onSubmit={() => submitShortText("email", "Email")}
                    optionalHint="(opcional — se não quiser, escreva: não informar)"
                />
            );
        }

        // CONTATO: 53 phone
        if (step === 53) {
            return (
                <ShortText
                    value={freeText}
                    setValue={setFreeText}
                    placeholder="Ex: (41) 9XXXX-XXXX"
                    onSubmit={() => submitShortText("phone", "Telefone")}
                    optionalHint="(opcional — se não quiser, escreva: não informar)"
                />
            );
        }

        // FINAL: 60 observações finais (livre)
        if (step === 60) {
            return (
                <div className="space-y-2">
                    <Textarea
                        value={freeText}
                        onChange={(e) => setFreeText(e.target.value)}
                        placeholder="Escreva considerações finais, detalhes técnicos, exemplos, links, etc. (opcional)"
                        rows={4}
                    />
                    <div className="flex gap-2">
                        <Button
                            className="flex-1"
                            variant="outline"
                            onClick={() => {
                                push("user", "(sem observações finais)");
                                push("assistant", "Perfeito. Pré-levantamento concluído. Você pode enviar para o WhatsApp agora.");
                                setStep(99);
                            }}
                        >
                            Pular
                        </Button>
                        <Button
                            className="flex-1"
                            onClick={() => {
                                const v = freeText.trim();
                                if (!v) return;
                                setData((d) => ({ ...d, finalNotes: v }));
                                push("user", v);
                                setFreeText("");
                                push("assistant", "Perfeito. Pré-levantamento concluído. Você pode enviar para o WhatsApp agora.");
                                setStep(99);
                            }}
                        >
                            Concluir
                        </Button>
                    </div>
                </div>
            );
        }

        // DONE: 99 enviar whatsapp
        if (step === 99) {
            return (
                <div className="space-y-2">
                    <Button className="w-full" onClick={sendToWhatsapp} disabled={!canSendWhatsapp}>
                        Enviar para WhatsApp
                    </Button>
                    <Button className="w-full" variant="outline" onClick={resetAll}>
                        Reiniciar
                    </Button>
                </div>
            );
        }

        return null;
    })();

    return (
        <>
            {/* Botão flutuante */}
            <Button
                onClick={() => setOpen(true)}
                className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
                aria-label="Abrir chat"
            >
                <MessageCircle />
            </Button>

            {/* Janela do chat */}
            {open && (
                <div className="fixed bottom-24 right-6 w-[360px] max-w-[90vw] h-[560px] bg-background border rounded-xl shadow-xl z-50 flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b">
                        <div>
                            <p className="font-semibold">Integra Tech</p>
                            <span className="text-xs text-muted-foreground">
                                Pré-levantamento guiado
                            </span>
                        </div>

                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={sendToWhatsapp}
                                disabled={!canSendWhatsapp}
                                aria-label="Enviar para WhatsApp"
                                title="Enviar para WhatsApp"
                            >
                                <Send className="h-4 w-4" />
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={resetAll}
                                aria-label="Reiniciar"
                                title="Reiniciar"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setOpen(false)}
                                aria-label="Fechar chat"
                                title="Fechar"
                            >
                                <X />
                            </Button>
                        </div>
                    </div>

                    {/* Mensagens */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`max-w-[85%] whitespace-pre-wrap rounded-lg px-3 py-2 ${msg.role === "user"
                                    ? "ml-auto bg-primary text-primary-foreground"
                                    : "bg-muted"
                                    }`}
                            >
                                {msg.content}
                            </div>
                        ))}
                        <div ref={bottomRef} />
                    </div>

                    {/* Área guiada */}
                    <div className="p-3 border-t bg-background">
                        {content}
                    </div>
                </div>
            )}
        </>
    );
}

function ShortText(props: {
    value: string;
    setValue: (v: string) => void;
    placeholder: string;
    onSubmit: () => void;
    optionalHint?: string;
}) {
    return (
        <div className="space-y-2">
            {props.optionalHint && (
                <div className="text-xs text-muted-foreground">{props.optionalHint}</div>
            )}
            <Input
                value={props.value}
                onChange={(e) => props.setValue(e.target.value)}
                placeholder={props.placeholder}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        props.onSubmit();
                    }
                }}
            />
            <Button className="w-full" onClick={props.onSubmit}>
                Continuar
            </Button>
        </div>
    );
}
