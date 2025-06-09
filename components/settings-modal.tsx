"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ActionModal } from "@/components/ui/action-modal";
import { FormSection } from "@/components/ui/form-section";
import { StyledTabs, StyledTabsList, StyledTabsTrigger, TabsContent } from "@/components/ui/tabs-styled";
import { User, Bell, Shield, Palette, Mail, Phone, Clock, DollarSign, Save, Download, Upload, Trash2, LogOut } from "lucide-react";
import { useRouter } from 'next/navigation';

// Reutilizando interface de app/page.tsx ou types/index.ts
export interface ClinicSettings {
    clinicName?: string;
    doctorName?: string;
    email?: string;
    phone?: string;
    address?: string;
    cro?: string;
    specialty?: string;
    emailNotifications?: boolean;
    smsNotifications?: boolean;
    whatsappNotifications?: boolean;
    appointmentReminders?: boolean;
    reminderTime?: string;
    theme?: string;
    language?: string;
    dateFormat?: string;
    timeFormat?: string;
    currency?: string;
    workingHours?: Record<string, { start: string; end: string; enabled: boolean }>;
    appointmentDuration?: string;
    bufferTime?: string;
    maxAdvanceBooking?: string;
    // Removido defaultProcedurePrices pois não está no schema de clinic_settings,
    // isso viria de procedure_catalog ou seria uma funcionalidade separada
    taxRate?: string;
    paymentMethods?: Record<string, boolean>;
    sessionTimeout?: string;
    dataRetention?: string;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: ClinicSettings) => Promise<void>; // Atualizado para ser async
  initialSettings: ClinicSettings | null; // Recebe as configurações carregadas
}

const defaultSettings: ClinicSettings = {
    clinicName: "", doctorName: "", email: "", phone: "", address: "", cro: "", specialty: "",
    emailNotifications: true, smsNotifications: false, whatsappNotifications: true, appointmentReminders: true,
    reminderTime: "24", theme: "light", language: "pt-BR", dateFormat: "dd/MM/yyyy", timeFormat: "24h", currency: "BRL",
    workingHours: {
      monday: { start: "08:00", end: "18:00", enabled: true },
      tuesday: { start: "08:00", end: "18:00", enabled: true },
      wednesday: { start: "08:00", end: "18:00", enabled: true },
      thursday: { start: "08:00", end: "18:00", enabled: true },
      friday: { start: "08:00", end: "17:00", enabled: true },
      saturday: { start: "08:00", end: "12:00", enabled: false },
      sunday: { start: "08:00", end: "12:00", enabled: false },
    },
    appointmentDuration: "30", bufferTime: "15", maxAdvanceBooking: "60",
    taxRate: "0", paymentMethods: { cash: true, card: true, pix: true, installments: true },
    sessionTimeout: "60", dataRetention: "7",
};


export function SettingsModal({ isOpen, onClose, onSave, initialSettings }: SettingsModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [settings, setSettings] = useState<ClinicSettings>(initialSettings || defaultSettings);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen && initialSettings) {
        // Fundir initialSettings com defaultSettings para garantir que todos os campos existam
        setSettings(prev => ({ ...defaultSettings, ...initialSettings, ...prev }));
    } else if (isOpen && !initialSettings) {
        setSettings(defaultSettings); // Se não houver initialSettings, usa o default
    }
  }, [isOpen, initialSettings]);


  const updateSetting = (path: string, value: any) => {
    setSettings((prev) => {
      const keys = path.split(".");
      const newSettings = { ...prev };
      let current: any = newSettings;

      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...(current[keys[i]] || {}) }; // Garante que o objeto aninhado exista
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
  };

  const handleSaveClick = async () => {
    setIsSaving(true);
    try {
        await onSave(settings);
        // onClose(); // O onSave em app/page.tsx já fecha o modal
    } catch (error) {
        console.error("Falha ao salvar configurações no modal:", error);
        // Poderia mostrar um toast de erro aqui
    } finally {
        setIsSaving(false);
    }
  };

  const handleExportData = () => {
    const dataToExport = {
      // Simular busca de dados reais ou usar um snapshot das configurações atuais
      settings: settings,
      // Adicionar outros dados se necessário
      patientsCount: 150, // Exemplo, viria de uma API
      appointmentsCount: 1200, // Exemplo
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `crm-settings-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null; // Para evitar renderizar com settings vazios antes do effect

  const handleLogout = () => {
    // Remove o token do localStorage
    localStorage.removeItem('token');
    // Remove o cookie (se aplicável)
    document.cookie = 'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    // Redireciona para a página de login
    router.push('/login');
    // Fecha o modal
    onClose();
  };

  return (
    <ActionModal
      isOpen={isOpen}
      onClose={onClose}
      title="Configurações do Sistema"
      size="xl"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>Cancelar</Button>
          <Button variant="destructive" onClick={handleLogout} className="ml-auto mr-2">
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
          <Button onClick={handleSaveClick} className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Salvando..." : "Salvar Configurações"}
          </Button>
        </>
      }
    >
      <div className="max-h-[70vh] overflow-hidden"> {/* Container pai do scroll */}
        <StyledTabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
          <StyledTabsList className="grid w-full grid-cols-3 sm:grid-cols-5 shrink-0 px-1 pt-1">
            <StyledTabsTrigger value="profile" tabStyle="pills" icon={<User />}>Perfil</StyledTabsTrigger>
            <StyledTabsTrigger value="notifications" tabStyle="pills" icon={<Bell />}>Notificações</StyledTabsTrigger>
            <StyledTabsTrigger value="business" tabStyle="pills" icon={<Clock />}>Negócio</StyledTabsTrigger>
            <StyledTabsTrigger value="security" tabStyle="pills" icon={<Shield />}>Segurança</StyledTabsTrigger>
          </StyledTabsList>

          <div className="mt-4 flex-1 overflow-y-auto px-1 pb-1"> {/* Conteúdo com scroll */}
            <TabsContent value="profile" className="mt-0 space-y-6">
              <FormSection title="Informações do Consultório" description="Dados básicos da clínica">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="clinicName">Nome do Consultório</Label>
                    <Input id="clinicName" value={settings.clinicName || ""} onChange={(e) => updateSetting("clinicName", e.target.value)} className="mt-1" disabled={isSaving}/>
                  </div>
                  <div>
                    <Label htmlFor="doctorName">Nome do Profissional Principal</Label>
                    <Input id="doctorName" value={settings.doctorName || ""} onChange={(e) => updateSetting("doctorName", e.target.value)} className="mt-1" disabled={isSaving}/>
                  </div>
                  <div>
                    <Label htmlFor="email">Email de Contato</Label>
                    <Input id="email" type="email" value={settings.email || ""} onChange={(e) => updateSetting("email", e.target.value)} className="mt-1" disabled={isSaving}/>
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefone Principal</Label>
                    <Input id="phone" value={settings.phone || ""} onChange={(e) => updateSetting("phone", e.target.value)} className="mt-1" disabled={isSaving}/>
                  </div>
                   <div className="md:col-span-2">
                    <Label htmlFor="address">Endereço</Label>
                    <Input id="address" value={settings.address || ""} onChange={(e) => updateSetting("address", e.target.value)} className="mt-1" disabled={isSaving}/>
                  </div>
                  <div>
                    <Label htmlFor="cro">CRO</Label>
                    <Input id="cro" value={settings.cro || ""} onChange={(e) => updateSetting("cro", e.target.value)} className="mt-1" disabled={isSaving}/>
                  </div>
                  <div>
                    <Label htmlFor="specialty">Especialidade Principal</Label>
                    <Input id="specialty" value={settings.specialty || ""} onChange={(e) => updateSetting("specialty", e.target.value)} className="mt-1" disabled={isSaving}/>
                  </div>
                </div>
              </FormSection>
            </TabsContent>

            <TabsContent value="notifications" className="mt-0 space-y-6">
               <FormSection title="Preferências de Notificação">
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-md border p-3">
                    <div><Label>Notificações por Email</Label><p className="text-xs text-muted-foreground">Receber via email.</p></div>
                    <Switch checked={settings.emailNotifications} onCheckedChange={(val) => updateSetting("emailNotifications", val)} disabled={isSaving}/>
                  </div>
                  <div className="flex items-center justify-between rounded-md border p-3">
                    <div><Label>Notificações por SMS</Label><p className="text-xs text-muted-foreground">Receber via SMS.</p></div>
                    <Switch checked={settings.smsNotifications} onCheckedChange={(val) => updateSetting("smsNotifications", val)} disabled={isSaving}/>
                  </div>
                  <div className="flex items-center justify-between rounded-md border p-3">
                     <div><Label>Notificações por WhatsApp</Label><p className="text-xs text-muted-foreground">Receber via WhatsApp.</p></div>
                    <Switch checked={settings.whatsappNotifications} onCheckedChange={(val) => updateSetting("whatsappNotifications", val)} disabled={isSaving}/>
                  </div>
                  <div className="flex items-center justify-between rounded-md border p-3">
                    <div><Label>Lembretes de Consulta</Label><p className="text-xs text-muted-foreground">Enviar aos pacientes.</p></div>
                    <Switch checked={settings.appointmentReminders} onCheckedChange={(val) => updateSetting("appointmentReminders", val)} disabled={isSaving}/>
                  </div>
                  <div>
                    <Label htmlFor="reminderTime">Antecedência do Lembrete</Label>
                    <Select value={settings.reminderTime || "24"} onValueChange={(val) => updateSetting("reminderTime", val)} disabled={isSaving}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 hora antes</SelectItem>
                        <SelectItem value="2">2 horas antes</SelectItem>
                        <SelectItem value="24">1 dia antes</SelectItem>
                        <SelectItem value="48">2 dias antes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </FormSection>
            </TabsContent>

            <TabsContent value="appearance" className="mt-0 space-y-6">
              <FormSection title="Personalização da Interface">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="theme">Tema</Label>
                        <Select value={settings.theme || "light"} onValueChange={(value) => updateSetting("theme", value)} disabled={isSaving}>
                        <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="light">Claro</SelectItem>
                            <SelectItem value="dark">Escuro</SelectItem>
                            <SelectItem value="system">Automático do Sistema</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="language">Idioma</Label>
                        <Select value={settings.language || "pt-BR"} onValueChange={(value) => updateSetting("language", value)} disabled={isSaving}>
                        <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                            <SelectItem value="en-US">Inglês (US)</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="dateFormat">Formato de Data</Label>
                        <Select value={settings.dateFormat || "dd/MM/yyyy"} onValueChange={(value) => updateSetting("dateFormat", value)} disabled={isSaving}>
                        <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="dd/MM/yyyy">DD/MM/AAAA</SelectItem>
                            <SelectItem value="MM/dd/yyyy">MM/DD/AAAA</SelectItem>
                            <SelectItem value="yyyy-MM-dd">AAAA-MM-DD</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="timeFormat">Formato de Hora</Label>
                        <Select value={settings.timeFormat || "24h"} onValueChange={(value) => updateSetting("timeFormat", value)} disabled={isSaving}>
                        <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="HH:mm">24 horas (HH:mm)</SelectItem> {/* Ajustado para valor do DB */}
                            <SelectItem value="h:mm a">12 horas (AM/PM)</SelectItem> {/* Ajustado */}
                        </SelectContent>
                        </Select>
                    </div>
                </div>
              </FormSection>
            </TabsContent>

            <TabsContent value="business" className="mt-0 space-y-6">
                <FormSection title="Horários de Funcionamento">
                    <div className="space-y-2">
                    {settings.workingHours && Object.entries(settings.workingHours).map(([day, hours]) => (
                        <div key={day} className="flex items-center gap-2 md:gap-3 p-2 border rounded-md">
                        <Switch checked={hours.enabled} onCheckedChange={(checked) => updateSetting(`workingHours.${day}.enabled`, checked)} disabled={isSaving} id={`workHours-${day}-enabled`}/>
                        <Label htmlFor={`workHours-${day}-enabled`} className="w-20 text-sm capitalize shrink-0">
                            {day.substring(0,3)}
                        </Label>
                        <Input type="time" value={hours.start} onChange={(e) => updateSetting(`workingHours.${day}.start`, e.target.value)} disabled={!hours.enabled || isSaving} className="h-8"/>
                        <span className="text-muted-foreground text-sm">até</span>
                        <Input type="time" value={hours.end} onChange={(e) => updateSetting(`workingHours.${day}.end`, e.target.value)} disabled={!hours.enabled || isSaving} className="h-8"/>
                        </div>
                    ))}
                    </div>
                </FormSection>
                <FormSection title="Configurações de Agendamento">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div><Label htmlFor="appointmentDuration">Duração Padrão (min)</Label><Input id="appointmentDuration" type="number" value={settings.appointmentDuration || ""} onChange={(e) => updateSetting("appointmentDuration", e.target.value)} className="mt-1" disabled={isSaving}/></div>
                        <div><Label htmlFor="bufferTime">Intervalo entre Consultas (min)</Label><Input id="bufferTime" type="number" value={settings.bufferTime || ""} onChange={(e) => updateSetting("bufferTime", e.target.value)} className="mt-1" disabled={isSaving}/></div>
                        <div><Label htmlFor="maxAdvanceBooking">Agendamento Antecipado Máx. (dias)</Label><Input id="maxAdvanceBooking" type="number" value={settings.maxAdvanceBooking || ""} onChange={(e) => updateSetting("maxAdvanceBooking", e.target.value)} className="mt-1" disabled={isSaving}/></div>
                    </div>
                </FormSection>
            </TabsContent>

            <TabsContent value="security" className="mt-0 space-y-6">
              <FormSection title="Segurança da Conta">
                <div><Label htmlFor="sessionTimeout">Timeout da Sessão (minutos)</Label><Input id="sessionTimeout" type="number" value={settings.sessionTimeout || ""} onChange={(e) => updateSetting("sessionTimeout", e.target.value)} className="mt-1" disabled={isSaving}/></div>
                {/* Opções de 2FA e mudança de senha iriam aqui */}
              </FormSection>
              <FormSection title="Backup e Gerenciamento de Dados">
                <div className="space-y-3">
                  <Button variant="outline" onClick={handleExportData} className="w-full justify-start" disabled={isSaving}><Download className="mr-2 h-4 w-4"/>Exportar Dados</Button>
                  <Button variant="outline" className="w-full justify-start" disabled={isSaving}><Upload className="mr-2 h-4 w-4"/>Importar Dados (Upload)</Button>
                </div>
              </FormSection>
            </TabsContent>
          </div>
        </StyledTabs>
      </div>
    </ActionModal>
  );
}