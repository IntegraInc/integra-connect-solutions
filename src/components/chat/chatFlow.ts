export type ServiceType = "SITE" | "INTEGRACAO" | "SENIOR" | "CUSTOMIZACAO";

export type SeniorModule =
 | "Mercado"
 | "Suprimentos"
 | "Finanças"
 | "Qualidade"
 | "Gestão da Manutenção";

export type IntegrationType =
 | "API REST"
 | "SOAP"
 | "Webservice"
 | "Banco de Dados";
export type Urgency = "Urgente" | "Normal" | "Flexível";

export interface PreSurveyData {
 serviceType?: ServiceType;

 // Site
 siteGoal?: string;
 sitePages?: "1 página" | "Múltiplas páginas";
 hasDomain?: "Sim" | "Não";
 deadline?: string;

 // Integração
 systemsToIntegrate?: string;
 integrationType?: IntegrationType;
 direction?: "Unidirecional" | "Bidirecional";
 hasDocs?: "Sim" | "Não";

 // Senior ERP
 seniorModules?: SeniorModule[];
 seniorDemand?: "Implantação" | "Ajustes" | "Suporte evolutivo";

 // Customizações
 customTypes?: Array<
  "Relatórios" | "Telas SGI" | "Regras de negócio" | "Webservices"
 >;
 businessRulesDefined?: "Sim" | "Não";

 // Geral
 companySize?: "Pequena" | "Média" | "Grande";
 urgency?: Urgency;

 // Contato
 name?: string;
 company?: string;
 email?: string;
 phone?: string;

 // Final
 finalNotes?: string;
}

export function serviceLabel(t?: ServiceType) {
 if (!t) return "(não informado)";
 const map: Record<ServiceType, string> = {
  SITE: "Site personalizado",
  INTEGRACAO: "Integração entre sistemas",
  SENIOR: "Consultoria / implantação ERP Senior",
  CUSTOMIZACAO: "Customizações no ERP Senior",
 };
 return map[t];
}

export function buildWhatsappSummary(data: PreSurveyData) {
 const lines: string[] = [];

 lines.push("NOVO PRÉ-LEVANTAMENTO – Integra Tech");
 lines.push("");
 lines.push(`Tipo de serviço: ${serviceLabel(data.serviceType)}`);

 // Blocos por tipo
 if (data.serviceType === "SITE") {
  lines.push("");
  lines.push("SITE");
  if (data.siteGoal) lines.push(`- Objetivo: ${data.siteGoal}`);
  if (data.sitePages) lines.push(`- Estrutura: ${data.sitePages}`);
  if (data.hasDomain) lines.push(`- Já possui domínio: ${data.hasDomain}`);
  if (data.deadline) lines.push(`- Prazo desejado: ${data.deadline}`);
 }

 if (data.serviceType === "INTEGRACAO") {
  lines.push("");
  lines.push("INTEGRAÇÃO");
  if (data.systemsToIntegrate)
   lines.push(`- Sistemas: ${data.systemsToIntegrate}`);
  if (data.integrationType) lines.push(`- Tipo: ${data.integrationType}`);
  if (data.direction) lines.push(`- Direção: ${data.direction}`);
  if (data.hasDocs) lines.push(`- Documentação disponível: ${data.hasDocs}`);
 }

 if (data.serviceType === "SENIOR") {
  lines.push("");
  lines.push("ERP SENIOR");
  if (data.seniorDemand) lines.push(`- Demanda: ${data.seniorDemand}`);
  if (data.seniorModules?.length)
   lines.push(`- Módulos: ${data.seniorModules.join(", ")}`);
 }

 if (data.serviceType === "CUSTOMIZACAO") {
  lines.push("");
  lines.push("CUSTOMIZAÇÕES SENIOR");
  if (data.customTypes?.length)
   lines.push(`- Tipos: ${data.customTypes.join(", ")}`);
  if (data.businessRulesDefined)
   lines.push(`- Regras de negócio definidas: ${data.businessRulesDefined}`);
 }

 // Geral
 lines.push("");
 lines.push("GERAL");
 if (data.companySize) lines.push(`- Porte: ${data.companySize}`);
 if (data.urgency) lines.push(`- Urgência: ${data.urgency}`);

 // Contato
 lines.push("");
 lines.push("CONTATO");
 lines.push(`- Nome: ${data.name || "(não informado)"}`);
 lines.push(`- Empresa: ${data.company || "(não informado)"}`);
 lines.push(`- E-mail: ${data.email || "(não informado)"}`);
 lines.push(`- Telefone: ${data.phone || "(não informado)"}`);

 // Observações finais
 if (data.finalNotes?.trim()) {
  lines.push("");
  lines.push("OBSERVAÇÕES FINAIS");
  lines.push(data.finalNotes.trim());
 }

 lines.push("");
 lines.push("Enviado via chat do site.");

 return lines.join("\n");
}
