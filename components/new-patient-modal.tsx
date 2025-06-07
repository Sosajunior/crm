// components/new-patient-modal.tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ActionModal } from "@/components/ui/action-modal"
import { FormSection } from "@/components/ui/form-section"
import { DatePicker } from "@/components/ui/date-picker"
import { User, Mail, Phone, MapPin, Save } from "lucide-react"
import type { CreatePatientPayload } from "@/app/page"; // <<<<< IMPORTADO DE app/page.tsx

// Remova a definição local de CreatePatientPayload se ela existir aqui

interface NewPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (patientData: CreatePatientPayload) => Promise<void>;
}

export function NewPatientModal({ isOpen, onClose, onSave }: NewPatientModalProps) {
  const [formData, setFormData] = useState<CreatePatientPayload>({
    name: "",
    email: "",
    phone: "",
    birthDate: null,
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
  });
  const [birthDateObj, setBirthDateObj] = useState<Date | undefined>(undefined);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
        setFormData({
            name: "", email: "", phone: "", birthDate: null, address: "", city: "",
            zipCode: "", emergencyContact: "", emergencyPhone: "", medicalHistory: "",
            allergies: "", medications: "", insuranceProvider: "", insuranceNumber: "",
            preferredContact: "phone", notes: "",
        });
        setBirthDateObj(undefined);
        setErrors({});
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Nome é obrigatório";
    if (!formData.email.trim()) newErrors.email = "Email é obrigatório";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email inválido";
    if (!formData.phone.trim()) newErrors.phone = "Telefone é obrigatório";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveClick = async () => {
    if (validateForm()) {
      setIsSaving(true);
      const payload: CreatePatientPayload = {
          ...formData,
          birthDate: birthDateObj ? birthDateObj.toISOString().split('T')[0] : null,
      };
      try {
        await onSave(payload);
        // onClose é geralmente chamado pelo componente pai após o sucesso
      } catch (error) {
        console.error("Falha ao salvar paciente no modal (NewPatientModal):", error);
        // O feedback de erro (toast) já é tratado no componente pai (page.tsx ou schedule-management.tsx)
      } finally {
        setIsSaving(false);
      }
    }
  };

  const updateField = (field: keyof CreatePatientPayload, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    setBirthDateObj(date);
  };

  return (
    <ActionModal
      isOpen={isOpen}
      onClose={onClose}
      title="Cadastrar Novo Paciente"
      size="xl"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button onClick={handleSaveClick} className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Salvando..." : "Salvar Paciente"}
          </Button>
        </>
      }
    >
      <div className="space-y-6 max-h-[70vh] overflow-y-auto p-1">
        {/* ... (Restante do JSX do formulário permanece o mesmo) ... */}
        <FormSection title="Informações Pessoais" description="Dados básicos do paciente">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name-modal">Nome Completo *</Label> {/* ID único para o modal */}
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input id="name-modal" placeholder="Digite o nome completo" value={formData.name} onChange={(e) => updateField("name", e.target.value)} className={`pl-10 ${errors.name ? "border-destructive" : ""}`} disabled={isSaving}/>
              </div>
              {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <Label htmlFor="birthDate-modal">Data de Nascimento</Label>
              <DatePicker date={birthDateObj} onDateChange={handleDateChange} placeholder="Selecionar data" className="mt-1 w-full" disabled={isSaving} />
            </div>
            <div>
              <Label htmlFor="email-modal">Email *</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input id="email-modal" type="email" placeholder="email@exemplo.com" value={formData.email} onChange={(e) => updateField("email", e.target.value)} className={`pl-10 ${errors.email ? "border-destructive" : ""}`} disabled={isSaving}/>
              </div>
              {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <Label htmlFor="phone-modal">Telefone *</Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input id="phone-modal" placeholder="(XX) XXXXX-XXXX" value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} className={`pl-10 ${errors.phone ? "border-destructive" : ""}`} disabled={isSaving}/>
              </div>
              {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone}</p>}
            </div>
          </div>
        </FormSection>

        <FormSection title="Endereço" description="Informações de localização">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="address-modal">Endereço</Label>
              <Input id="address-modal" placeholder="Rua, número, complemento" value={formData.address} onChange={(e) => updateField("address", e.target.value)} className="mt-1" disabled={isSaving}/>
            </div>
            <div>
              <Label htmlFor="zipCode-modal">CEP</Label>
              <Input id="zipCode-modal" placeholder="00000-000" value={formData.zipCode} onChange={(e) => updateField("zipCode", e.target.value)} className="mt-1" disabled={isSaving}/>
            </div>
            <div className="md:col-span-1">
              <Label htmlFor="city-modal">Cidade</Label>
              <Input id="city-modal" placeholder="Nome da cidade" value={formData.city} onChange={(e) => updateField("city", e.target.value)} className="mt-1" disabled={isSaving}/>
            </div>
          </div>
        </FormSection>

         <FormSection title="Contato de Emergência">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="emergencyContact-modal">Nome do Contato</Label>
              <Input id="emergencyContact-modal" placeholder="Nome completo" value={formData.emergencyContact} onChange={(e) => updateField("emergencyContact", e.target.value)} className="mt-1" disabled={isSaving}/>
            </div>
            <div>
              <Label htmlFor="emergencyPhone-modal">Telefone de Emergência</Label>
              <Input id="emergencyPhone-modal" placeholder="(XX) XXXXX-XXXX" value={formData.emergencyPhone} onChange={(e) => updateField("emergencyPhone", e.target.value)} className="mt-1" disabled={isSaving}/>
            </div>
          </div>
        </FormSection>

        <FormSection title="Informações Médicas">
            <div>
              <Label htmlFor="medicalHistory-modal">Histórico Médico Relevante</Label>
              <Textarea id="medicalHistory-modal" placeholder="Descreva condições pré-existentes, cirurgias, etc." value={formData.medicalHistory} onChange={(e) => updateField("medicalHistory", e.target.value)} className="mt-1" rows={3} disabled={isSaving}/>
            </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="allergies-modal">Alergias</Label>
              <Input id="allergies-modal" placeholder="Ex: Penicilina, Látex" value={formData.allergies} onChange={(e) => updateField("allergies", e.target.value)} className="mt-1" disabled={isSaving}/>
            </div>
            <div>
              <Label htmlFor="medications-modal">Medicamentos em Uso</Label>
              <Input id="medications-modal" placeholder="Ex: Losartana, AAS" value={formData.medications} onChange={(e) => updateField("medications", e.target.value)} className="mt-1" disabled={isSaving}/>
            </div>
          </div>
        </FormSection>

        <FormSection title="Convênio">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <Label htmlFor="insuranceProvider-modal">Operadora do Convênio</Label>
                 <Input id="insuranceProvider-modal" placeholder="Nome da operadora" value={formData.insuranceProvider} onChange={(e) => updateField("insuranceProvider", e.target.value)} className="mt-1" disabled={isSaving}/>
            </div>
            <div>
                <Label htmlFor="insuranceNumber-modal">Número da Carteirinha</Label>
                <Input id="insuranceNumber-modal" placeholder="Número do convênio" value={formData.insuranceNumber} onChange={(e) => updateField("insuranceNumber", e.target.value)} className="mt-1" disabled={isSaving}/>
            </div>
           </div>
        </FormSection>

        <FormSection title="Preferências e Observações">
            <div>
                <Label htmlFor="preferredContact-modal">Forma Preferida de Contato</Label>
                <Select value={formData.preferredContact} onValueChange={(value) => updateField("preferredContact", value)} disabled={isSaving}>
                    <SelectTrigger className="mt-1" id="preferredContact-modal-trigger"><SelectValue /></SelectTrigger> {/* Adicionado ID ao trigger também */}
                    <SelectContent>
                        <SelectItem value="phone">Telefone</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="notes-modal">Observações Gerais</Label>
                <Textarea id="notes-modal" placeholder="Adicione observações importantes sobre o paciente..." value={formData.notes} onChange={(e) => updateField("notes", e.target.value)} className="mt-1" rows={3} disabled={isSaving}/>
            </div>
        </FormSection>
      </div>
    </ActionModal>
  );
}