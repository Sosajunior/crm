"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ActionModal } from "@/components/ui/action-modal"
import { FormSection } from "@/components/ui/form-section"
import { StyledTabs, StyledTabsList, StyledTabsTrigger, TabsContent } from "@/components/ui/tabs-styled"
import {
  User,
  Bell,
  Shield,
  Palette,
  Mail,
  Phone,
  Clock,
  DollarSign,
  Save,
  Download,
  Upload,
  Trash2,
} from "lucide-react"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (settings: any) => void
}

export function SettingsModal({ isOpen, onClose, onSave }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState("profile")

  const [settings, setSettings] = useState({
    // Profile Settings
    clinicName: "Consultório Dra. Maylis Guitton",
    doctorName: "Dra. Maylis Guitton",
    email: "contato@dramayguitton.com.br",
    phone: "(11) 3456-7890",
    address: "Rua das Flores, 123 - São Paulo, SP",
    cro: "CRO-SP 12345",
    specialty: "Odontologia Geral",

    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    whatsappNotifications: true,
    appointmentReminders: true,
    paymentReminders: true,
    marketingEmails: false,
    reminderTime: "24", // hours before

    // Appearance Settings
    theme: "light",
    language: "pt-BR",
    dateFormat: "dd/MM/yyyy",
    timeFormat: "24h",
    currency: "BRL",

    // Business Settings
    workingHours: {
      monday: { start: "08:00", end: "18:00", enabled: true },
      tuesday: { start: "08:00", end: "18:00", enabled: true },
      wednesday: { start: "08:00", end: "18:00", enabled: true },
      thursday: { start: "08:00", end: "18:00", enabled: true },
      friday: { start: "08:00", end: "17:00", enabled: true },
      saturday: { start: "08:00", end: "12:00", enabled: true },
      sunday: { start: "08:00", end: "12:00", enabled: false },
    },
    appointmentDuration: "30",
    bufferTime: "15",
    maxAdvanceBooking: "60", // days

    // Financial Settings
    defaultProcedurePrices: {
      consultation: "100",
      cleaning: "150",
      filling: "280",
      rootCanal: "850",
      extraction: "200",
    },
    taxRate: "0",
    paymentMethods: {
      cash: true,
      card: true,
      pix: true,
      installments: true,
    },

    // Security Settings
    sessionTimeout: "60", // minutes
    requirePasswordChange: false,
    twoFactorAuth: false,
    dataRetention: "7", // years
  })

  const updateSetting = (path: string, value: any) => {
    setSettings((prev) => {
      const keys = path.split(".")
      const newSettings = { ...prev }
      let current = newSettings

      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] }
        current = current[keys[i]]
      }

      current[keys[keys.length - 1]] = value
      return newSettings
    })
  }

  const handleSave = () => {
    onSave(settings)
    onClose()
  }

  const handleExportData = () => {
    // Simulate data export
    const dataToExport = {
      patients: 150,
      appointments: 1200,
      procedures: 890,
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "crm-data-export.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <ActionModal
      isOpen={isOpen}
      onClose={onClose}
      title="Configurações do Sistema"
      size="xl"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Save className="w-4 h-4 mr-2" />
            Salvar Configurações
          </Button>
        </>
      }
    >
      <div className="max-h-[70vh] overflow-hidden">
        <StyledTabs value={activeTab} onValueChange={setActiveTab}>
          <StyledTabsList className="grid w-full grid-cols-5" tabStyle="pills">
            <StyledTabsTrigger value="profile" tabStyle="pills" icon={<User className="h-4 w-4" />}>
              Perfil
            </StyledTabsTrigger>
            <StyledTabsTrigger value="notifications" tabStyle="pills" icon={<Bell className="h-4 w-4" />}>
              Notificações
            </StyledTabsTrigger>
            <StyledTabsTrigger value="appearance" tabStyle="pills" icon={<Palette className="h-4 w-4" />}>
              Aparência
            </StyledTabsTrigger>
            <StyledTabsTrigger value="business" tabStyle="pills" icon={<Clock className="h-4 w-4" />}>
              Negócio
            </StyledTabsTrigger>
            <StyledTabsTrigger value="security" tabStyle="pills" icon={<Shield className="h-4 w-4" />}>
              Segurança
            </StyledTabsTrigger>
          </StyledTabsList>

          <div className="mt-6 overflow-y-auto max-h-[50vh]">
            <TabsContent value="profile" className="space-y-6">
              <FormSection title="Informações do Consultório" description="Dados básicos da clínica">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="clinicName">Nome do Consultório</Label>
                    <Input
                      id="clinicName"
                      value={settings.clinicName}
                      onChange={(e) => updateSetting("clinicName", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="doctorName">Nome do Profissional</Label>
                    <Input
                      id="doctorName"
                      value={settings.doctorName}
                      onChange={(e) => updateSetting("doctorName", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        id="email"
                        type="email"
                        value={settings.email}
                        onChange={(e) => updateSetting("email", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <div className="relative mt-1">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        id="phone"
                        value={settings.phone}
                        onChange={(e) => updateSetting("phone", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Endereço</Label>
                    <Input
                      id="address"
                      value={settings.address}
                      onChange={(e) => updateSetting("address", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cro">CRO</Label>
                    <Input
                      id="cro"
                      value={settings.cro}
                      onChange={(e) => updateSetting("cro", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="specialty">Especialidade</Label>
                    <Input
                      id="specialty"
                      value={settings.specialty}
                      onChange={(e) => updateSetting("specialty", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </FormSection>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <FormSection title="Preferências de Notificação" description="Configure como deseja receber notificações">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Notificações por Email</Label>
                      <p className="text-sm text-slate-500">Receber notificações importantes por email</p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Notificações por SMS</Label>
                      <p className="text-sm text-slate-500">Receber lembretes por SMS</p>
                    </div>
                    <Switch
                      checked={settings.smsNotifications}
                      onCheckedChange={(checked) => updateSetting("smsNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Notificações por WhatsApp</Label>
                      <p className="text-sm text-slate-500">Receber notificações via WhatsApp</p>
                    </div>
                    <Switch
                      checked={settings.whatsappNotifications}
                      onCheckedChange={(checked) => updateSetting("whatsappNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Lembretes de Consulta</Label>
                      <p className="text-sm text-slate-500">Enviar lembretes automáticos aos pacientes</p>
                    </div>
                    <Switch
                      checked={settings.appointmentReminders}
                      onCheckedChange={(checked) => updateSetting("appointmentReminders", checked)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="reminderTime">Tempo de Antecedência do Lembrete</Label>
                    <Select
                      value={settings.reminderTime}
                      onValueChange={(value) => updateSetting("reminderTime", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
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

            <TabsContent value="appearance" className="space-y-6">
              <FormSection title="Personalização da Interface" description="Configure a aparência do sistema">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="theme">Tema</Label>
                    <Select value={settings.theme} onValueChange={(value) => updateSetting("theme", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Claro</SelectItem>
                        <SelectItem value="dark">Escuro</SelectItem>
                        <SelectItem value="auto">Automático</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="language">Idioma</Label>
                    <Select value={settings.language} onValueChange={(value) => updateSetting("language", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                        <SelectItem value="en-US">English (US)</SelectItem>
                        <SelectItem value="es-ES">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="dateFormat">Formato de Data</Label>
                    <Select value={settings.dateFormat} onValueChange={(value) => updateSetting("dateFormat", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dd/MM/yyyy">DD/MM/AAAA</SelectItem>
                        <SelectItem value="MM/dd/yyyy">MM/DD/AAAA</SelectItem>
                        <SelectItem value="yyyy-MM-dd">AAAA-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="timeFormat">Formato de Hora</Label>
                    <Select value={settings.timeFormat} onValueChange={(value) => updateSetting("timeFormat", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24h">24 horas</SelectItem>
                        <SelectItem value="12h">12 horas (AM/PM)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </FormSection>
            </TabsContent>

            <TabsContent value="business" className="space-y-6">
              <FormSection title="Configurações de Negócio" description="Horários de funcionamento e preços">
                <div className="space-y-6">
                  <div>
                    <Label className="text-base font-medium">Horários de Funcionamento</Label>
                    <div className="mt-3 space-y-3">
                      {Object.entries(settings.workingHours).map(([day, hours]) => (
                        <div key={day} className="flex items-center gap-4">
                          <div className="w-20">
                            <Switch
                              checked={hours.enabled}
                              onCheckedChange={(checked) => updateSetting(`workingHours.${day}.enabled`, checked)}
                            />
                          </div>
                          <div className="w-24 text-sm font-medium capitalize">
                            {day === "monday" && "Segunda"}
                            {day === "tuesday" && "Terça"}
                            {day === "wednesday" && "Quarta"}
                            {day === "thursday" && "Quinta"}
                            {day === "friday" && "Sexta"}
                            {day === "saturday" && "Sábado"}
                            {day === "sunday" && "Domingo"}
                          </div>
                          <Input
                            type="time"
                            value={hours.start}
                            onChange={(e) => updateSetting(`workingHours.${day}.start`, e.target.value)}
                            disabled={!hours.enabled}
                            className="w-32"
                          />
                          <span className="text-slate-500">até</span>
                          <Input
                            type="time"
                            value={hours.end}
                            onChange={(e) => updateSetting(`workingHours.${day}.end`, e.target.value)}
                            disabled={!hours.enabled}
                            className="w-32"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="appointmentDuration">Duração Padrão da Consulta (min)</Label>
                      <Input
                        id="appointmentDuration"
                        type="number"
                        value={settings.appointmentDuration}
                        onChange={(e) => updateSetting("appointmentDuration", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bufferTime">Tempo de Intervalo (min)</Label>
                      <Input
                        id="bufferTime"
                        type="number"
                        value={settings.bufferTime}
                        onChange={(e) => updateSetting("bufferTime", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxAdvanceBooking">Agendamento Máximo (dias)</Label>
                      <Input
                        id="maxAdvanceBooking"
                        type="number"
                        value={settings.maxAdvanceBooking}
                        onChange={(e) => updateSetting("maxAdvanceBooking", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </FormSection>

              <FormSection title="Preços Padrão dos Procedimentos" description="Configure os valores padrão">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="consultation">Consulta</Label>
                    <div className="relative mt-1">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        id="consultation"
                        type="number"
                        value={settings.defaultProcedurePrices.consultation}
                        onChange={(e) => updateSetting("defaultProcedurePrices.consultation", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cleaning">Limpeza</Label>
                    <div className="relative mt-1">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        id="cleaning"
                        type="number"
                        value={settings.defaultProcedurePrices.cleaning}
                        onChange={(e) => updateSetting("defaultProcedurePrices.cleaning", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="filling">Restauração</Label>
                    <div className="relative mt-1">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        id="filling"
                        type="number"
                        value={settings.defaultProcedurePrices.filling}
                        onChange={(e) => updateSetting("defaultProcedurePrices.filling", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="rootCanal">Canal</Label>
                    <div className="relative mt-1">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        id="rootCanal"
                        type="number"
                        value={settings.defaultProcedurePrices.rootCanal}
                        onChange={(e) => updateSetting("defaultProcedurePrices.rootCanal", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </FormSection>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <FormSection title="Segurança e Privacidade" description="Configure opções de segurança">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="sessionTimeout">Timeout da Sessão (minutos)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={settings.sessionTimeout}
                      onChange={(e) => updateSetting("sessionTimeout", e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Autenticação de Dois Fatores</Label>
                      <p className="text-sm text-slate-500">Adicionar camada extra de segurança</p>
                    </div>
                    <Switch
                      checked={settings.twoFactorAuth}
                      onCheckedChange={(checked) => updateSetting("twoFactorAuth", checked)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="dataRetention">Retenção de Dados (anos)</Label>
                    <Select
                      value={settings.dataRetention}
                      onValueChange={(value) => updateSetting("dataRetention", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 ano</SelectItem>
                        <SelectItem value="3">3 anos</SelectItem>
                        <SelectItem value="5">5 anos</SelectItem>
                        <SelectItem value="7">7 anos</SelectItem>
                        <SelectItem value="10">10 anos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </FormSection>

              <FormSection title="Backup e Dados" description="Gerenciar dados do sistema">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <Label>Exportar Dados</Label>
                      <p className="text-sm text-slate-500">Baixar backup completo dos dados</p>
                    </div>
                    <Button variant="outline" onClick={handleExportData}>
                      <Download className="w-4 h-4 mr-2" />
                      Exportar
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <Label>Importar Dados</Label>
                      <p className="text-sm text-slate-500">Restaurar dados de backup</p>
                    </div>
                    <Button variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Importar
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                    <div>
                      <Label className="text-red-800">Limpar Todos os Dados</Label>
                      <p className="text-sm text-red-600">Ação irreversível - remover todos os dados</p>
                    </div>
                    <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Limpar
                    </Button>
                  </div>
                </div>
              </FormSection>
            </TabsContent>
          </div>
        </StyledTabs>
      </div>
    </ActionModal>
  )
}
