"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ActionModal } from "@/components/ui/action-modal"
import { FormSection } from "@/components/ui/form-section"
import { DatePicker } from "@/components/ui/date-picker"
import { User, Mail, Phone, MapPin, Save } from "lucide-react"

interface NewPatientModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (patientData: any) => void
}

export function NewPatientModal({ isOpen, onClose, onSave }: NewPatientModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    birthDate: undefined as Date | undefined,
    address: "",
    city: "",
    zipCode: "",
    emergencyContact: "",
    emergencyPhone: "",
    medicalHistory: "",
    allergies: "",
    medications: "",
    insuranceProvider: "",
    insuranceNumber: "",
    preferredContact: "phone",
    notes: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Telefone é obrigatório"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData)
      onClose()
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        birthDate: undefined,
        address: "",
        city: "",
        zipCode: "",
        emergencyContact: "",
        emergencyPhone: "",
        medicalHistory: "",
        allergies: "",
        medications: "",
        insuranceProvider: "",
        insuranceNumber: "",
        preferredContact: "phone",
        notes: "",
      })
      setErrors({})
    }
  }

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <ActionModal
      isOpen={isOpen}
      onClose={onClose}
      title="Cadastrar Novo Paciente"
      size="xl"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Save className="w-4 h-4 mr-2" />
            Salvar Paciente
          </Button>
        </>
      }
    >
      <div className="space-y-6 max-h-[70vh] overflow-y-auto">
        {/* Personal Information */}
        <FormSection title="Informações Pessoais" description="Dados básicos do paciente">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                Nome Completo *
              </Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  id="name"
                  placeholder="Digite o nome completo"
                  value={formData.name}
                  onChange={(e) => updateFormData("name", e.target.value)}
                  className={`pl-10 ${errors.name ? "border-red-500" : ""}`}
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="birthDate" className="text-sm font-medium text-slate-700">
                Data de Nascimento
              </Label>
              <DatePicker
                date={formData.birthDate}
                onDateChange={(date) => updateFormData("birthDate", date)}
                placeholder="Selecionar data de nascimento"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email *
              </Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="email@exemplo.com"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm font-medium text-slate-700">
                Telefone *
              </Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  id="phone"
                  placeholder="(11) 99999-9999"
                  value={formData.phone}
                  onChange={(e) => updateFormData("phone", e.target.value)}
                  className={`pl-10 ${errors.phone ? "border-red-500" : ""}`}
                />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
          </div>
        </FormSection>

        {/* Address Information */}
        <FormSection title="Endereço" description="Informações de localização">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="address" className="text-sm font-medium text-slate-700">
                Endereço
              </Label>
              <div className="relative mt-1">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  id="address"
                  placeholder="Rua, número, complemento"
                  value={formData.address}
                  onChange={(e) => updateFormData("address", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="zipCode" className="text-sm font-medium text-slate-700">
                CEP
              </Label>
              <Input
                id="zipCode"
                placeholder="00000-000"
                value={formData.zipCode}
                onChange={(e) => updateFormData("zipCode", e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="city" className="text-sm font-medium text-slate-700">
                Cidade
              </Label>
              <Input
                id="city"
                placeholder="Nome da cidade"
                value={formData.city}
                onChange={(e) => updateFormData("city", e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </FormSection>

        {/* Emergency Contact */}
        <FormSection title="Contato de Emergência" description="Pessoa para contatar em caso de emergência">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="emergencyContact" className="text-sm font-medium text-slate-700">
                Nome do Contato
              </Label>
              <Input
                id="emergencyContact"
                placeholder="Nome completo"
                value={formData.emergencyContact}
                onChange={(e) => updateFormData("emergencyContact", e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="emergencyPhone" className="text-sm font-medium text-slate-700">
                Telefone de Emergência
              </Label>
              <Input
                id="emergencyPhone"
                placeholder="(11) 99999-9999"
                value={formData.emergencyPhone}
                onChange={(e) => updateFormData("emergencyPhone", e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </FormSection>

        {/* Medical Information */}
        <FormSection title="Informações Médicas" description="Histórico médico e alergias">
          <div className="space-y-4">
            <div>
              <Label htmlFor="medicalHistory" className="text-sm font-medium text-slate-700">
                Histórico Médico
              </Label>
              <Textarea
                id="medicalHistory"
                placeholder="Descreva condições médicas relevantes, cirurgias anteriores, etc."
                value={formData.medicalHistory}
                onChange={(e) => updateFormData("medicalHistory", e.target.value)}
                className="mt-1 resize-none"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="allergies" className="text-sm font-medium text-slate-700">
                  Alergias
                </Label>
                <Textarea
                  id="allergies"
                  placeholder="Liste alergias conhecidas"
                  value={formData.allergies}
                  onChange={(e) => updateFormData("allergies", e.target.value)}
                  className="mt-1 resize-none"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="medications" className="text-sm font-medium text-slate-700">
                  Medicamentos em Uso
                </Label>
                <Textarea
                  id="medications"
                  placeholder="Liste medicamentos atuais"
                  value={formData.medications}
                  onChange={(e) => updateFormData("medications", e.target.value)}
                  className="mt-1 resize-none"
                  rows={2}
                />
              </div>
            </div>
          </div>
        </FormSection>

        {/* Insurance Information */}
        <FormSection title="Convênio" description="Informações do plano de saúde">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="insuranceProvider" className="text-sm font-medium text-slate-700">
                Operadora do Convênio
              </Label>
              <Select
                value={formData.insuranceProvider}
                onValueChange={(value) => updateFormData("insuranceProvider", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecionar operadora" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="particular">Particular</SelectItem>
                  <SelectItem value="unimed">Unimed</SelectItem>
                  <SelectItem value="bradesco">Bradesco Saúde</SelectItem>
                  <SelectItem value="amil">Amil</SelectItem>
                  <SelectItem value="sulamerica">SulAmérica</SelectItem>
                  <SelectItem value="outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="insuranceNumber" className="text-sm font-medium text-slate-700">
                Número da Carteirinha
              </Label>
              <Input
                id="insuranceNumber"
                placeholder="Número do convênio"
                value={formData.insuranceNumber}
                onChange={(e) => updateFormData("insuranceNumber", e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </FormSection>

        {/* Preferences and Notes */}
        <FormSection title="Preferências e Observações" description="Configurações de contato e notas adicionais">
          <div className="space-y-4">
            <div>
              <Label htmlFor="preferredContact" className="text-sm font-medium text-slate-700">
                Forma Preferida de Contato
              </Label>
              <Select
                value={formData.preferredContact}
                onValueChange={(value) => updateFormData("preferredContact", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="phone">Telefone</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes" className="text-sm font-medium text-slate-700">
                Observações Gerais
              </Label>
              <Textarea
                id="notes"
                placeholder="Adicione observações importantes sobre o paciente..."
                value={formData.notes}
                onChange={(e) => updateFormData("notes", e.target.value)}
                className="mt-1 resize-none"
                rows={3}
              />
            </div>
          </div>
        </FormSection>
      </div>
    </ActionModal>
  )
}
