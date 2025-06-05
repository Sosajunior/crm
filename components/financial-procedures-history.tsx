"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker" // Assuming this is a styled component
import {
  Search,
  Download,
  TrendingUp,
  DollarSign,
  Calendar,
  User,
  CheckCircle,
  Clock,
  AlertCircle,
  Info, // Added for neutral status
} from "lucide-react"

interface ProcedureRecord {
  id: string
  date: string
  patientName: string
  procedureName: string
  category: string
  status: "completed" | "pending" | "cancelled"
  value: number
  cost: number
  profit: number
  margin: number // Assuming this is a percentage, e.g., 70 for 70%
  paymentMethod: string
  paymentStatus: "paid" | "pending" | "overdue"
  notes?: string
}

interface FinancialProceduresHistoryProps {
  period: string // This prop seems unused in the current component logic, but kept as per original
}

export function FinancialProceduresHistory({ period }: FinancialProceduresHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("all")
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()

  const proceduresHistory: ProcedureRecord[] = [
    {
      id: "1",
      date: "2024-01-20",
      patientName: "Maria Silva",
      procedureName: "Limpeza Dental",
      category: "Preventivo",
      status: "completed",
      value: 150,
      cost: 45,
      profit: 105,
      margin: 70,
      paymentMethod: "Cartão",
      paymentStatus: "paid",
      notes: "Procedimento realizado com sucesso",
    },
    {
      id: "2",
      date: "2024-01-19",
      patientName: "João Santos",
      procedureName: "Restauração",
      category: "Restaurador",
      status: "completed",
      value: 280,
      cost: 95,
      profit: 185,
      margin: 66.1,
      paymentMethod: "PIX",
      paymentStatus: "paid",
    },
    {
      id: "3",
      date: "2024-01-18",
      patientName: "Ana Costa",
      procedureName: "Tratamento de Canal",
      category: "Endodontia",
      status: "completed",
      value: 850,
      cost: 280,
      profit: 570,
      margin: 67.1,
      paymentMethod: "Dinheiro",
      paymentStatus: "paid",
    },
    {
      id: "4",
      date: "2024-01-17",
      patientName: "Carlos Lima",
      procedureName: "Extração",
      category: "Cirurgia",
      status: "completed",
      value: 200,
      cost: 60,
      profit: 140,
      margin: 70,
      paymentMethod: "Cartão",
      paymentStatus: "pending",
    },
    {
      id: "5",
      date: "2024-01-16",
      patientName: "Lucia Oliveira",
      procedureName: "Clareamento",
      category: "Estético",
      status: "pending",
      value: 450,
      cost: 120,
      profit: 330,
      margin: 73.3,
      paymentMethod: "Cartão",
      paymentStatus: "pending",
    },
    {
      id: "6",
      date: "2024-01-15",
      patientName: "Pedro Alves",
      procedureName: "Consulta Inicial",
      category: "Diagnóstico",
      status: "completed",
      value: 100,
      cost: 25,
      profit: 75,
      margin: 75,
      paymentMethod: "PIX",
      paymentStatus: "paid",
    },
    {
      id: "7",
      date: "2024-01-14",
      patientName: "Fernanda Santos",
      procedureName: "Prótese Parcial",
      category: "Protético",
      status: "cancelled",
      value: 1200,
      cost: 400,
      profit: 800,
      margin: 66.7,
      paymentMethod: "Cartão",
      paymentStatus: "overdue",
    },
  ]

  const badgeBaseStyle = "text-xs font-medium px-2 py-0.5 rounded-full border"

  const getStatusBadgeStyle = (status: ProcedureRecord["status"]): string => {
    switch (status) {
      case "completed":
        return `${badgeBaseStyle} border-green-300 bg-green-50 text-[#77C293]`
      case "pending":
        return `${badgeBaseStyle} border-yellow-400 bg-yellow-50 text-yellow-700`
      case "cancelled":
        return `${badgeBaseStyle} border-red-300 bg-red-50 text-[#C27777]`
      default:
        return `${badgeBaseStyle} border-slate-300 bg-slate-100 text-slate-600`
    }
  }

  const getPaymentBadgeStyle = (status: ProcedureRecord["paymentStatus"]): string => {
    switch (status) {
      case "paid":
        return `${badgeBaseStyle} border-green-300 bg-green-50 text-[#77C293]`
      case "pending":
        return `${badgeBaseStyle} border-yellow-400 bg-yellow-50 text-yellow-700`
      case "overdue":
        return `${badgeBaseStyle} border-red-300 bg-red-50 text-[#C27777]`
      default:
        return `${badgeBaseStyle} border-slate-300 bg-slate-100 text-slate-600`
    }
  }

  const getStatusIcon = (status: ProcedureRecord["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-3.5 h-3.5 text-[#77C293]" />
      case "pending":
        return <Clock className="w-3.5 h-3.5 text-yellow-700" />
      case "cancelled":
        return <AlertCircle className="w-3.5 h-3.5 text-[#C27777]" />
      default:
        return <Info className="w-3.5 h-3.5 text-slate-600" />
    }
  }

  const filteredProcedures = proceduresHistory.filter((procedure) => {
    const procedureDate = new Date(procedure.date);
    const matchesDate =
      (!startDate || procedureDate >= startDate) &&
      (!endDate || procedureDate <= endDate);

    const matchesSearch =
      procedure.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      procedure.procedureName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      procedure.category.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory === "all" || procedure.category === selectedCategory
    const matchesStatus = selectedStatus === "all" || procedure.status === selectedStatus
    const matchesPaymentStatus = selectedPaymentStatus === "all" || procedure.paymentStatus === selectedPaymentStatus

    return matchesDate && matchesSearch && matchesCategory && matchesStatus && matchesPaymentStatus
  })

  const completedProcedures = filteredProcedures.filter((p) => p.status === "completed")
  const totalRevenue = completedProcedures.reduce((sum, p) => sum + p.value, 0)
  const totalCosts = completedProcedures.reduce((sum, p) => sum + p.cost, 0)
  const totalProfit = completedProcedures.reduce((sum, p) => sum + p.profit, 0)
  const averageMargin =
    completedProcedures.length > 0
      ? completedProcedures.reduce((sum, p) => sum + p.margin, 0) / completedProcedures.length
      : 0

  const handleExport = () => {
    console.log("Exporting procedures history...", {
      searchTerm,
      selectedCategory,
      selectedStatus,
      selectedPaymentStatus,
      startDate,
      endDate,
      data: filteredProcedures,
    })
    alert("Relatório exportado com sucesso! (Verifique o console para os dados)")
  }
  
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedStatus("all");
    setSelectedPaymentStatus("all");
    setStartDate(undefined);
    setEndDate(undefined);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-slate-200 shadow-sm bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 mb-0.5">Receita Total</p>
                <p className="text-xl font-bold text-[#77C293]">
                  R$ {totalRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-2.5 bg-slate-100 rounded-full">
                <DollarSign className="w-5 h-5 text-slate-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 mb-0.5">Lucro Total</p>
                <p className="text-xl font-bold text-[#77C293]">
                  R$ {totalProfit.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-2.5 bg-slate-100 rounded-full">
                <TrendingUp className="w-5 h-5 text-slate-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 mb-0.5">Margem Média</p>
                <p className="text-xl font-bold text-slate-700">{averageMargin.toFixed(1)}%</p>
              </div>
              <div className="p-2.5 bg-slate-100 rounded-full">
                 {/* Consider a specific icon for margin if available, or keep TrendingUp */}
                <TrendingUp className="w-5 h-5 text-slate-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 mb-0.5">Procedimentos</p>
                <p className="text-xl font-bold text-slate-700">{completedProcedures.length} <span className="text-sm font-normal">concluídos</span></p>
              </div>
              <div className="p-2.5 bg-slate-100 rounded-full">
                <CheckCircle className="w-5 h-5 text-slate-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border border-slate-200 shadow-sm bg-white">
        <CardHeader className="bg-slate-50 border-b border-slate-200 py-4 px-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <CardTitle className="text-lg font-semibold text-slate-800">Histórico de Procedimentos</CardTitle>
            <div className="flex items-center gap-2">
                <Button onClick={clearFilters} variant="outline" size="sm" className="border-slate-300 text-slate-600 hover:bg-slate-100">
                    Limpar Filtros
                </Button>
                <Button onClick={handleExport} variant="outline" size="sm" className="border-slate-300 text-slate-600 hover:bg-slate-100">
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Exportar
                </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="relative lg:col-span-2">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Buscar paciente, procedimento, categoria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 text-sm h-9 border-slate-300 focus:border-slate-400"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="text-sm h-9 border-slate-300 data-[placeholder]:text-slate-400 focus:border-slate-400">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200">
                <SelectItem value="all" className="text-sm">Todas Categorias</SelectItem>
                {Array.from(new Set(proceduresHistory.map(p => p.category))).sort().map(cat => (
                  <SelectItem key={cat} value={cat} className="text-sm">{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="text-sm h-9 border-slate-300 data-[placeholder]:text-slate-400 focus:border-slate-400">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200">
                <SelectItem value="all" className="text-sm">Todos Status</SelectItem>
                <SelectItem value="completed" className="text-sm">Concluído</SelectItem>
                <SelectItem value="pending" className="text-sm">Pendente</SelectItem>
                <SelectItem value="cancelled" className="text-sm">Cancelado</SelectItem>
              </SelectContent>
            </Select>
            
            <DatePicker 
              date={startDate} 
              onDateChange={setStartDate} 
              placeholder="Data Inicial"
              className="h-9 border-slate-300 text-sm"
            />
            <DatePicker 
              date={endDate} 
              onDateChange={setEndDate} 
              placeholder="Data Final"
              className="h-9 border-slate-300 text-sm"
            />

            {/* Hidden on smaller screens, payment status might be less frequently filtered by */}
             <div className="hidden lg:block">
                <Select value={selectedPaymentStatus} onValueChange={setSelectedPaymentStatus}>
                <SelectTrigger className="text-sm h-9 border-slate-300 data-[placeholder]:text-slate-400 focus:border-slate-400">
                    <SelectValue placeholder="Pagamento" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200">
                    <SelectItem value="all" className="text-sm">Status Pag.</SelectItem>
                    <SelectItem value="paid" className="text-sm">Pago</SelectItem>
                    <SelectItem value="pending" className="text-sm">Pendente</SelectItem>
                    <SelectItem value="overdue" className="text-sm">Em Atraso</SelectItem>
                </SelectContent>
                </Select>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Procedures Table */}
      <Card className="border border-slate-200 shadow-sm bg-white overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left p-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Data</th>
                  <th className="text-left p-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Paciente</th>
                  <th className="text-left p-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Procedimento</th>
                  <th className="text-left p-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Categoria</th>
                  <th className="text-left p-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-right p-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Valor</th>
                  <th className="text-right p-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Custo</th>
                  <th className="text-right p-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Lucro</th>
                  <th className="text-left p-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Pagamento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProcedures.map((procedure) => (
                  <tr key={procedure.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3 px-4 text-sm text-slate-600 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        {new Date(procedure.date).toLocaleDateString("pt-BR")}
                      </div>
                    </td>
                    <td className="p-3 px-4 text-sm text-slate-600 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="font-medium text-slate-700">{procedure.patientName}</span>
                      </div>
                    </td>
                    <td className="p-3 px-4 text-sm text-slate-600 max-w-xs"> {/* max-w for notes */}
                      <span className="font-medium text-slate-700 block">{procedure.procedureName}</span>
                      {procedure.notes && <p className="text-xs text-slate-500 mt-0.5 truncate" title={procedure.notes}>{procedure.notes}</p>}
                    </td>
                    <td className="p-3 px-4 text-sm text-slate-600 whitespace-nowrap">
                      <Badge className="border border-slate-300 bg-slate-100 text-slate-600 text-xs font-normal px-1.5 py-0.5">
                        {procedure.category}
                      </Badge>
                    </td>
                    <td className="p-3 px-4 text-sm text-slate-600 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {getStatusIcon(procedure.status)}
                        <Badge className={getStatusBadgeStyle(procedure.status)}>
                          {procedure.status === "completed" && "Concluído"}
                          {procedure.status === "pending" && "Pendente"}
                          {procedure.status === "cancelled" && "Cancelado"}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-3 px-4 text-sm text-slate-700 text-right font-medium whitespace-nowrap">
                      R$ {procedure.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 px-4 text-sm text-[#C27777] text-right font-medium whitespace-nowrap">
                      R$ {procedure.cost.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 px-4 text-sm text-[#77C293] text-right font-medium whitespace-nowrap">
                      R$ {procedure.profit.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 px-4 text-sm text-slate-600 whitespace-nowrap">
                      <div className="flex flex-col items-start">
                        <Badge className={getPaymentBadgeStyle(procedure.paymentStatus)}>
                          {procedure.paymentStatus === "paid" && "Pago"}
                          {procedure.paymentStatus === "pending" && "Pendente"}
                          {procedure.paymentStatus === "overdue" && "Em Atraso"}
                        </Badge>
                        <span className="text-xs text-slate-500 mt-0.5">{procedure.paymentMethod}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProcedures.length === 0 && (
            <div className="text-center py-10">
              <Search className="w-10 h-10 mx-auto mb-3 text-slate-300" /> {/* Changed icon for "not found" */}
              <h3 className="text-lg font-medium text-slate-700 mb-1">Nenhum procedimento encontrado</h3>
              <p className="text-sm text-slate-500">Tente ajustar os filtros ou termos de busca.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}